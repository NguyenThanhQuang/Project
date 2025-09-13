import {
  ConflictException,
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
import { Company, CompanyDocument } from './schemas/company.schema';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
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

  async remove(id: string): Promise<CompanyDocument> {
    const company = await this.findOne(id);

    await company.deleteOne();
    return company;
  }

  async deleteAll(): Promise<any> {
    return this.companyModel.deleteMany({}).exec();
  }
}
