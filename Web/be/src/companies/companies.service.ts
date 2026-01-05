import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument, CompanyStatus } from './schemas/company.schema';
import { Driver, DriverDocument, DriverStatus } from '../drivers/schema/driver.schema';
import { Vehicle, VehicleDocument, VehicleStatus } from '../vehicles/schemas/vehicle.schema';
import { Trip, TripDocument, TripStatus } from '../trips/schemas/trip.schema';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(Driver.name) private driverModel: Model<DriverDocument>,
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<CompanyDocument> {
    const existingCompanyByName = await this.companyModel
      .findOne({ name: createCompanyDto.name })
      .exec();
    if (existingCompanyByName) {
      throw new ConflictException(
        `Nhà xe với tên "${createCompanyDto.name}" đã tồn tại.`,
      );
    }
    const existingCompanyByCode = await this.companyModel
      .findOne({ code: createCompanyDto.code.toUpperCase() })
      .exec();
    if (existingCompanyByCode) {
      throw new ConflictException(
        `Nhà xe với mã "${createCompanyDto.code.toUpperCase()}" đã tồn tại.`,
      );
    }

    const { adminName, adminEmail, adminPhone, ...companyData } =
      createCompanyDto;

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // Bước 1: Tạo Company
      const newCompany = new this.companyModel({
        ...companyData,
        code: createCompanyDto.code.toUpperCase(),
      });
      const savedCompanyArray = await newCompany.save({ session });
      const savedCompany = savedCompanyArray;

      // Bước 2: Tạo hoặc Thăng cấp tài khoản Admin
      const { user: adminAccount, isNew } =
        await this.usersService.createOrPromoteCompanyAdmin({
          name: adminName,
          email: adminEmail,
          phone: adminPhone,
          companyId: savedCompany._id,
        });

      // Bước 3: Gửi email tương ứng
      if (isNew) {
        // "sanity check", nếu isNew là true, adminAccount.accountActivationToken PHẢI tồn tại.
        if (!adminAccount.accountActivationToken) {
          throw new InternalServerErrorException(
            'Lỗi hệ thống: Không thể tạo token kích hoạt cho tài khoản quản trị.',
          );
        }

        await this.mailService.sendCompanyAdminActivationEmail(
          adminAccount.email,
          adminAccount.name,
          adminAccount.accountActivationToken,
        );
      } else {
        await this.mailService.sendCompanyAdminPromotionEmail(
          adminAccount.email,
          adminAccount.name,
          savedCompany.name,
        );
      }
      await session.commitTransaction();
      return savedCompany;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async findAll(): Promise<CompanyDocument[]> {
    return this.companyModel.find().exec();
  }

  async findOne(id: string | Types.ObjectId): Promise<CompanyDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID nhà xe không hợp lệ');
    }
    const company = await this.companyModel.findById(id).exec();
    if (!company) {
      throw new NotFoundException(
        `Không tìm thấy nhà xe với ID "${id.toString()}"`,
      );
    }
    return company;
  }

  async findOneByCode(code: string): Promise<CompanyDocument | null> {
    return this.companyModel.findOne({ code: code.toUpperCase() }).exec();
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanyDocument> {
    const existingCompany = await this.findOne(id);

    if (
      updateCompanyDto.name &&
      updateCompanyDto.name !== existingCompany.name
    ) {
      const companyByName = await this.companyModel
        .findOne({ name: updateCompanyDto.name, _id: { $ne: id } })
        .exec();
      if (companyByName) {
        throw new ConflictException(
          `Nhà xe với tên "${updateCompanyDto.name}" đã tồn tại.`,
        );
      }
    }
    if (
      updateCompanyDto.code &&
      updateCompanyDto.code.toUpperCase() !== existingCompany.code
    ) {
      const companyByCode = await this.companyModel
        .findOne({
          code: updateCompanyDto.code.toUpperCase(),
          _id: { $ne: id },
        })
        .exec();
      if (companyByCode) {
        throw new ConflictException(
          `Nhà xe với mã "${updateCompanyDto.code.toUpperCase()}" đã tồn tại.`,
        );
      }
    }

    Object.assign(existingCompany, updateCompanyDto);
    if (updateCompanyDto.code)
      existingCompany.code = updateCompanyDto.code.toUpperCase();

    return existingCompany.save();
  }

  async findAllWithStats(): Promise<any[]> {
    return this.companyModel.aggregate([
      {
        $lookup: {
          from: 'trips',
          localField: '_id',
          foreignField: 'companyId',
          as: 'trips',
        },
      },
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'companyId',
          pipeline: [{ $match: { status: 'confirmed' } }],
          as: 'bookings',
        },
      },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'companyId',
          as: 'reviews',
        },
      },
      {
        $project: {
          name: 1,
          code: 1,
          logoUrl: 1,
          email: 1,
          phone: 1,
          address: 1,
          createdAt: 1,
          status: 1,
          totalTrips: { $size: '$trips' },
          totalRevenue: { $sum: '$bookings.totalAmount' },
          averageRating: { $avg: '$reviews.rating' },
        },
      },
    ]);
  }

  /**
   * Lấy tất cả tài xế thuộc nhà xe
   */
  async getCompanyDrivers(
    companyId: string | Types.ObjectId,
    options?: {
      status?: DriverStatus;
      withVehicle?: boolean;
      page?: number;
      limit?: number;
      search?: string;
    },
  ): Promise<{
    drivers: DriverDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const companyObjectId =
      typeof companyId === 'string' ? new Types.ObjectId(companyId) : companyId;

    await this.findOne(companyObjectId);

    const query: any = {
      companyId: companyObjectId,
    };

    if (options?.status) {
      query.status = options.status;
    }

    // Tìm kiếm theo tên, email, điện thoại, bằng lái
    if (options?.search) {
      const searchRegex = new RegExp(options.search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { license: searchRegex },
      ];
    }

    const page = options?.page ? Math.max(1, options.page) : 1;
    const limit = options?.limit ? Math.max(1, options.limit) : 10;
    const skip = (page - 1) * limit;

    // Tổng số tài xế
    const total = await this.driverModel.countDocuments(query);

    // Truy vấn tài xế
    let queryBuilder = this.driverModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Nếu cần populate vehicle
    if (options?.withVehicle) {
      queryBuilder = queryBuilder.populate('vehicleId', 'vehicleNumber type status');
    }

    const drivers = await queryBuilder.exec();

    return {
      drivers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Kiểm tra tài xế có đang lái xe trong chuyến đi sắp tới không
   */
  private async hasUpcomingTrips(
    driverId: Types.ObjectId,
  ): Promise<boolean> {
    const upcomingTripsCount = await this.tripModel
      .countDocuments({
        driverId,
        status: { $in: [TripStatus.SCHEDULED, TripStatus.DEPARTED] },
      })
      .exec();

    return upcomingTripsCount > 0;
  }

  /**
   * Đồng bộ mối quan hệ driver-vehicle hai chiều
   */
  private async syncDriverVehicleRelationship(
    driverId: Types.ObjectId,
    oldVehicleId?: Types.ObjectId,
    newVehicleId?: Types.ObjectId,
  ): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // Gỡ driverId khỏi vehicle cũ
      if (oldVehicleId) {
        await this.vehicleModel.findByIdAndUpdate(
          oldVehicleId,
          { $unset: { driverId: 1 } },
          { session },
        );
      }

      // Thêm driverId vào vehicle mới
      if (newVehicleId) {
        await this.vehicleModel.findByIdAndUpdate(
          newVehicleId,
          { driverId },
          { session },
        );
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Gán phương tiện cho tài xế
   */
  async assignVehicleToDriver(
    companyId: string | Types.ObjectId,
    driverId: string | Types.ObjectId,
    vehicleId: string | Types.ObjectId,
  ): Promise<DriverDocument> {
    const companyObjectId =
      typeof companyId === 'string' ? new Types.ObjectId(companyId) : companyId;
    const driverObjectId =
      typeof driverId === 'string' ? new Types.ObjectId(driverId) : driverId;
    const vehicleObjectId =
      typeof vehicleId === 'string' ? new Types.ObjectId(vehicleId) : vehicleId;

    // Kiểm tra tồn tại của company, driver, vehicle
    await this.findOne(companyObjectId);

    const driver = await this.driverModel.findById(driverObjectId);
    if (!driver) {
      throw new NotFoundException('Không tìm thấy tài xế.');
    }

    // Kiểm tra tài xế thuộc nhà xe này
    if (driver.companyId.toString() !== companyObjectId.toString()) {
      throw new ForbiddenException('Tài xế không thuộc nhà xe này.');
    }

    // Kiểm tra tài xế có đang có lịch trình sắp tới không
    const hasUpcomingTrips = await this.hasUpcomingTrips(driverObjectId);
    if (hasUpcomingTrips) {
      throw new BadRequestException(
        'Không thể thay đổi phương tiện khi tài xế có chuyến đi sắp tới hoặc đang chạy.',
      );
    }

    const vehicle = await this.vehicleModel.findById(vehicleObjectId);
    if (!vehicle) {
      throw new NotFoundException('Không tìm thấy phương tiện.');
    }

    // Kiểm tra phương tiện thuộc nhà xe này
    if (vehicle.companyId.toString() !== companyObjectId.toString()) {
      throw new ForbiddenException('Phương tiện không thuộc nhà xe này.');
    }

    // Kiểm tra phương tiện có đang hoạt động không
    if (vehicle.status !== VehicleStatus.ACTIVE) {
      throw new BadRequestException('Phương tiện không trong trạng thái hoạt động.');
    }

    // Kiểm tra tài xế đang hoạt động
    if (driver.status !== DriverStatus.ACTIVE) {
      throw new BadRequestException('Tài xế không trong trạng thái hoạt động.');
    }

    // Kiểm tra phương tiện đã được gán cho tài xế khác chưa
    const existingDriverWithVehicle = await this.driverModel.findOne({
      companyId: companyObjectId,
      vehicleId: vehicleObjectId,
      _id: { $ne: driverObjectId },
    });

    if (existingDriverWithVehicle) {
      throw new ConflictException('Phương tiện này đã được gán cho tài xế khác.');
    }

    // Lấy vehicleId cũ (nếu có)
    const oldVehicleId = driver.vehicleId;

    // Cập nhật vehicleId cho driver
    driver.vehicleId = vehicleObjectId;
    await driver.save();

    // Đồng bộ relationship
    await this.syncDriverVehicleRelationship(
      driverObjectId,
      oldVehicleId,
      vehicleObjectId,
    );

    return driver.populate('vehicleId', 'vehicleNumber type status');
  }

  /**
   * Cập nhật phương tiện cho tài xế (chuyển sang phương tiện khác)
   */
  async updateDriverVehicle(
    companyId: string | Types.ObjectId,
    driverId: string | Types.ObjectId,
    newVehicleId: string | Types.ObjectId,
  ): Promise<DriverDocument> {
    const companyObjectId =
      typeof companyId === 'string' ? new Types.ObjectId(companyId) : companyId;
    const driverObjectId =
      typeof driverId === 'string' ? new Types.ObjectId(driverId) : driverId;
    const newVehicleObjectId =
      typeof newVehicleId === 'string' ? new Types.ObjectId(newVehicleId) : newVehicleId;

    // Kiểm tra tồn tại
    await this.findOne(companyObjectId);

    const driver = await this.driverModel.findById(driverObjectId);
    if (!driver) {
      throw new NotFoundException('Không tìm thấy tài xế.');
    }

    // Kiểm tra tài xế thuộc nhà xe này
    if (driver.companyId.toString() !== companyObjectId.toString()) {
      throw new ForbiddenException('Tài xế không thuộc nhà xe này.');
    }

    // Kiểm tra tài xế có đang có lịch trình sắp tới không
    const hasUpcomingTrips = await this.hasUpcomingTrips(driverObjectId);
    if (hasUpcomingTrips) {
      throw new BadRequestException(
        'Không thể thay đổi phương tiện khi tài xế có chuyến đi sắp tới hoặc đang chạy.',
      );
    }

    // Kiểm tra phương tiện mới
    const newVehicle = await this.vehicleModel.findById(newVehicleObjectId);
    if (!newVehicle) {
      throw new NotFoundException('Không tìm thấy phương tiện mới.');
    }

    // Kiểm tra phương tiện mới thuộc nhà xe này
    if (newVehicle.companyId.toString() !== companyObjectId.toString()) {
      throw new ForbiddenException('Phương tiện mới không thuộc nhà xe này.');
    }

    // Kiểm tra phương tiện mới có đang hoạt động không
    if (newVehicle.status !== VehicleStatus.ACTIVE) {
      throw new BadRequestException('Phương tiện mới không trong trạng thái hoạt động.');
    }

    // Kiểm tra tài xế đang hoạt động
    if (driver.status !== DriverStatus.ACTIVE) {
      throw new BadRequestException('Tài xế không trong trạng thái hoạt động.');
    }

    // Kiểm tra phương tiện mới đã được gán cho tài xế khác chưa
    const existingDriverWithNewVehicle = await this.driverModel.findOne({
      companyId: companyObjectId,
      vehicleId: newVehicleObjectId,
      _id: { $ne: driverObjectId },
    });

    if (existingDriverWithNewVehicle) {
      throw new ConflictException('Phương tiện mới đã được gán cho tài xế khác.');
    }

    // Lấy vehicleId cũ
    const oldVehicleId = driver.vehicleId;

    // Cập nhật vehicleId mới
    driver.vehicleId = newVehicleObjectId;
    await driver.save();

    // Đồng bộ relationship
    await this.syncDriverVehicleRelationship(
      driverObjectId,
      oldVehicleId,
      newVehicleObjectId,
    );

    return driver.populate('vehicleId', 'vehicleNumber type status');
  }

  /**
   * Gỡ bỏ phương tiện khỏi tài xế
   */
  async removeVehicleFromDriver(
    companyId: string | Types.ObjectId,
    driverId: string | Types.ObjectId,
  ): Promise<DriverDocument> {
    const companyObjectId =
      typeof companyId === 'string' ? new Types.ObjectId(companyId) : companyId;
    const driverObjectId =
      typeof driverId === 'string' ? new Types.ObjectId(driverId) : driverId;

    // Kiểm tra tồn tại
    await this.findOne(companyObjectId);

    const driver = await this.driverModel.findById(driverObjectId);
    if (!driver) {
      throw new NotFoundException('Không tìm thấy tài xế.');
    }

    // Kiểm tra tài xế thuộc nhà xe này
    if (driver.companyId.toString() !== companyObjectId.toString()) {
      throw new ForbiddenException('Tài xế không thuộc nhà xe này.');
    }

    // Kiểm tra tài xế có đang có lịch trình sắp tới không
    const hasUpcomingTrips = await this.hasUpcomingTrips(driverObjectId);
    if (hasUpcomingTrips && driver.vehicleId) {
      throw new BadRequestException(
        'Không thể gỡ bỏ phương tiện khi tài xế có chuyến đi sắp tới hoặc đang chạy.',
      );
    }

    // Lấy vehicleId cũ
    const oldVehicleId = driver.vehicleId;

    // Gỡ bỏ vehicleId
    driver.vehicleId = undefined;
    await driver.save();

    // Đồng bộ relationship
    await this.syncDriverVehicleRelationship(
      driverObjectId,
      oldVehicleId,
      undefined,
    );

    return driver;
  }

  /**
   * Lấy danh sách tài xế chưa được gán phương tiện
   */
  async getUnassignedDrivers(
    companyId: string | Types.ObjectId,
  ): Promise<DriverDocument[]> {
    const companyObjectId =
      typeof companyId === 'string' ? new Types.ObjectId(companyId) : companyId;

    await this.findOne(companyObjectId);

    return this.driverModel
      .find({
        companyId: companyObjectId,
        $or: [
          { vehicleId: { $exists: false } },
          { vehicleId: null },
        ],
        status: DriverStatus.ACTIVE,
      })
      .select('name email phone license status avatarUrl')
      .sort({ name: 1 })
      .exec();
  }

  /**
   * Lấy danh sách phương tiện có thể gán
   */
  async getAvailableVehicles(
    companyId: string | Types.ObjectId,
    excludeCurrentDriverId?: string | Types.ObjectId,
  ): Promise<VehicleDocument[]> {
    const companyObjectId =
      typeof companyId === 'string' ? new Types.ObjectId(companyId) : companyId;

    await this.findOne(companyObjectId);

    // Tìm các phương tiện đang được gán cho tài xế khác
    const assignedDrivers = await this.driverModel
      .find({
        companyId: companyObjectId,
        vehicleId: { $exists: true, $ne: null },
      })
      .select('vehicleId')
      .lean()
      .exec();

    // Sử dụng filter để loại bỏ các giá trị undefined/null
    const assignedVehicleIds = assignedDrivers
      .map(d => d.vehicleId?.toString())
      .filter((id): id is string => id !== undefined && id !== null);

    // Nếu có excludeCurrentDriverId, loại bỏ vehicleId mà driver hiện tại đang sử dụng
    if (excludeCurrentDriverId) {
      const currentDriver = await this.driverModel
        .findById(excludeCurrentDriverId)
        .lean()
        .exec();
      
      if (currentDriver?.vehicleId) {
        const currentVehicleId = currentDriver.vehicleId.toString();
        // Loại bỏ vehicleId hiện tại khỏi danh sách assigned
        const index = assignedVehicleIds.indexOf(currentVehicleId);
        if (index > -1) {
          assignedVehicleIds.splice(index, 1);
        }
      }
    }

    // Tìm phương tiện chưa được gán hoặc đang được gán nhưng có thể thay đổi
    const query: any = {
      companyId: companyObjectId,
      status: VehicleStatus.ACTIVE,
    };

    if (assignedVehicleIds.length > 0) {
      query._id = { $nin: assignedVehicleIds.map(id => new Types.ObjectId(id)) };
    }

    return this.vehicleModel
      .find(query)
      .select('vehicleNumber type totalSeats status floors seatRows seatColumns')
      .sort({ vehicleNumber: 1 })
      .exec();
  }

  /**
   * Lấy thống kê của nhà xe
   */
  async getCompanyStats(
    companyId: string | Types.ObjectId,
  ): Promise<{
    totalDrivers: number;
    totalActiveDrivers: number;
    totalVehicles: number;
    totalActiveVehicles: number;
    totalUpcomingTrips: number;
    totalCompletedTrips: number;
    assignedDriversCount: number;
    unassignedDriversCount: number;
  }> {
    const companyObjectId =
      typeof companyId === 'string' ? new Types.ObjectId(companyId) : companyId;

    await this.findOne(companyObjectId);

    const [
      totalDrivers,
      totalActiveDrivers,
      totalVehicles,
      totalActiveVehicles,
      totalUpcomingTrips,
      totalCompletedTrips,
      assignedDriversCount,
      unassignedDriversCount,
    ] = await Promise.all([
      // Tổng số tài xế
      this.driverModel.countDocuments({ companyId: companyObjectId }),
      // Tài xế đang hoạt động
      this.driverModel.countDocuments({
        companyId: companyObjectId,
        status: DriverStatus.ACTIVE,
      }),
      // Tổng số phương tiện
      this.vehicleModel.countDocuments({ companyId: companyObjectId }),
      // Phương tiện đang hoạt động
      this.vehicleModel.countDocuments({
        companyId: companyObjectId,
        status: VehicleStatus.ACTIVE,
      }),
      // Chuyến đi sắp tới
      this.tripModel.countDocuments({
        companyId: companyObjectId,
        status: { $in: [TripStatus.SCHEDULED, TripStatus.DEPARTED] },
      }),
      // Chuyến đi đã hoàn thành
      this.tripModel.countDocuments({
        companyId: companyObjectId,
        status: TripStatus.ARRIVED,
      }),
      // Tài xế đã được gán phương tiện
      this.driverModel.countDocuments({
        companyId: companyObjectId,
        vehicleId: { $exists: true, $ne: null },
      }),
      // Tài xế chưa được gán phương tiện
      this.driverModel.countDocuments({
        companyId: companyObjectId,
        $or: [
          { vehicleId: { $exists: false } },
          { vehicleId: null },
        ],
      }),
    ]);

    return {
      totalDrivers,
      totalActiveDrivers,
      totalVehicles,
      totalActiveVehicles,
      totalUpcomingTrips,
      totalCompletedTrips,
      assignedDriversCount,
      unassignedDriversCount,
    };
  }

  async remove(id: string): Promise<CompanyDocument> {
    const company = await this.findOne(id);

    // Kiểm tra xem nhà xe có tài xế, phương tiện, chuyến đi không
    const [driversCount, vehiclesCount, tripsCount] = await Promise.all([
      this.driverModel.countDocuments({ companyId: company._id }),
      this.vehicleModel.countDocuments({ companyId: company._id }),
      this.tripModel.countDocuments({ companyId: company._id }),
    ]);

    if (driversCount > 0 || vehiclesCount > 0 || tripsCount > 0) {
      throw new ConflictException(
        'Không thể xóa nhà xe khi còn tài xế, phương tiện hoặc chuyến đi.',
      );
    }

    await company.deleteOne();
    return company;
  }

  async deleteAll(): Promise<any> {
    return this.companyModel.deleteMany({}).exec();
  }

  /**
   * Cập nhật trạng thái nhà xe
   */
  async updateStatus(
    id: string | Types.ObjectId,
    status: CompanyStatus,
  ): Promise<CompanyDocument> {
    const company = await this.findOne(id);
    
    company.status = status;
    return company.save();
  }
}