import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { CompaniesRepository } from './companies.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyDocument } from './schemas/company.schema';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly companiesRepository: CompaniesRepository,
    @InjectConnection() private readonly connection: Connection,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<CompanyDocument> {
    const existingCompanyByName = await this.companiesRepository.findOne({
      name: createCompanyDto.name,
    });
    if (existingCompanyByName) {
      throw new ConflictException(
        `Nhà xe với tên "${createCompanyDto.name}" đã tồn tại.`,
      );
    }
    const existingCompanyByCode = await this.companiesRepository.findOne({
      code: createCompanyDto.code.toUpperCase(),
    });
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
      const savedCompany = await this.companiesRepository.create(
        {
          ...companyData,
          code: createCompanyDto.code.toUpperCase(),
        },
        session,
      );

      const { user: adminAccount, isNew } =
        await this.usersService.createOrPromoteCompanyAdmin({
          name: adminName,
          email: adminEmail,
          phone: adminPhone,
          companyId: savedCompany._id,
        });

      if (isNew) {
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
    return this.companiesRepository.findAll();
  }

  async findOne(id: string | Types.ObjectId): Promise<CompanyDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID nhà xe không hợp lệ');
    }
    const company = await this.companiesRepository.findById(id);
    if (!company) {
      throw new NotFoundException(
        `Không tìm thấy nhà xe với ID "${id.toString()}"`,
      );
    }
    return company;
  }

  async findOneByCode(code: string): Promise<CompanyDocument | null> {
    return this.companiesRepository.findOne({ code: code.toUpperCase() });
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
      const companyByName = await this.companiesRepository.findOne({
        name: updateCompanyDto.name,
        _id: { $ne: id },
      });
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
      const companyByCode = await this.companiesRepository.findOne({
        code: updateCompanyDto.code.toUpperCase(),
        _id: { $ne: id },
      });
      if (companyByCode) {
        throw new ConflictException(
          `Nhà xe với mã "${updateCompanyDto.code.toUpperCase()}" đã tồn tại.`,
        );
      }
    }

    Object.assign(existingCompany, updateCompanyDto);
    if (updateCompanyDto.code)
      existingCompany.code = updateCompanyDto.code.toUpperCase();

    return this.companiesRepository.save(existingCompany);
  }

  async findAllWithStats(): Promise<any[]> {
    return this.companiesRepository.getCompanyStats();
  }

  async remove(id: string): Promise<CompanyDocument> {
    const company = await this.findOne(id);
    await this.companiesRepository.delete(id);
    return company;
  }

  async deleteAll(): Promise<any> {
    return this.companiesRepository.deleteAll();
  }
}
