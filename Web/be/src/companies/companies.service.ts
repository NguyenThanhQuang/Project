import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
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

    const newCompany = new this.companyModel({
      ...createCompanyDto,
      code: createCompanyDto.code.toUpperCase(),
    });
    return newCompany.save();
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

  async remove(id: string): Promise<CompanyDocument> {
    const company = await this.findOne(id);

    await company.deleteOne();
    return company;
  }

  async deleteAll(): Promise<any> {
    return this.companyModel.deleteMany({}).exec();
  }
}
