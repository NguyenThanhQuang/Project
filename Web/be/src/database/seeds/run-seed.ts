// import { faker } from '@faker-js/faker/locale/vi';
// import { ConflictException } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../../app.module';
// import { CompaniesService } from '../../companies/companies.service';
// import { CreateCompanyDto } from '../../companies/dto/create-company.dto';
// import { CreateVehicleDto } from '../../vehicles/dto/create-vehicle.dto';
// import { VehiclesService } from '../../vehicles/vehicles.service';

// type Company = any;

// function generateSeatMap(
//   rows: number,
//   cols: number,
//   aisleAfterCol?: number,
// ): { rows: number; cols: number; layout: (string | null)[][] } {
//   const simplifiedLayout: (string | null)[][] = [];
//   let seatNum = 1;
//   for (let r = 0; r < rows; r++) {
//     const rowArr: (string | null)[] = [];
//     for (let c = 0; c < cols; c++) {
//       if (cols === 4 && c === 2 && aisleAfterCol === 2) {
//         rowArr.push(null);
//       } else {
//         rowArr.push(`G${seatNum++}`);
//       }
//     }
//     simplifiedLayout.push(rowArr);
//   }

//   return {
//     rows,
//     cols: aisleAfterCol ? cols + 1 : cols,
//     layout: simplifiedLayout,
//   };
// }

// async function bootstrap() {
//   const appContext = await NestFactory.createApplicationContext(AppModule);
//   const companiesService = appContext.get(CompaniesService);
//   const vehiclesService = appContext.get(VehiclesService);

//   console.log('Seeding database...');

//   console.log('Clearing old data...');
//   await vehiclesService.deleteAll();
//   await companiesService.deleteAll();
//   console.log('Old data cleared.');

//   const companyData: CreateCompanyDto[] = [
//     {
//       name: 'Phương Trang',
//       code: 'FUTA',
//       address: '123 Lê Hồng Phong, Q5, TP.HCM',
//       phone: '19006067',
//       email: 'contact@futa.vn',
//       description: 'Nhà xe Phương Trang uy tín, chất lượng.',
//     },
//     {
//       name: 'Thành Bưởi',
//       code: 'THANHBUOI',
//       address: '266 Lê Hồng Phong, Q5, TP.HCM',
//       phone: '19006079',
//       email: 'hotro@thanhbuoi.com.vn',
//       description: 'Nhà xe Thành Bưởi chuyên tuyến Sài Gòn - Đà Lạt.',
//     },
//     {
//       name: 'Hoàng Long',
//       code: 'HOANGLONG',
//       address: 'Bến xe Miền Đông, TP.HCM',
//       phone: '19006786',
//       email: 'info@hoanglongasia.com',
//       description: 'Nhà xe Hoàng Long tuyến Bắc Nam.',
//     },
//     {
//       name: 'Kumho Samco',
//       code: 'KUMHO',
//       address: 'Bến xe Miền Đông, TP.HCM',
//       phone: '19006098',
//       email: 'booking@kumhosamco.com.vn',
//       description: 'Liên doanh vận tải hành khách Việt - Hàn.',
//     },
//     {
//       name: 'Mai Linh Express',
//       code: 'MAILINH',
//       address: 'Bến xe Miền Tây, TP.HCM',
//       phone: '02839393939',
//       email: 'express@mailinh.vn',
//       description: 'Mai Linh vận chuyển hành khách các tỉnh.',
//     },
//   ];

//   const createdCompanies: Company[] = [];

//   for (const data of companyData) {
//     try {
//       const company = await companiesService.create(data);
//       createdCompanies.push(company);
//       console.log(`Created company: ${company.name}`);
//     } catch (error) {
//       if (error instanceof ConflictException) {
//         console.warn(
//           `Company already exists or conflict: ${data.name} / ${data.code} - ${error.message}. Fetching existing.`,
//         );

//         let existingCompany: Company | null | undefined =
//           await companiesService.findOneByCode(data.code);

//         if (!existingCompany) {
//           const allCompanies = await companiesService.findAll();
//           const companyFoundByName = allCompanies.find(
//             (c) => c.name === data.name,
//           );

//           if (
//             companyFoundByName &&
//             typeof companyFoundByName._id !== 'undefined'
//           ) {
//             existingCompany = await companiesService.findOne(
//               companyFoundByName._id,
//             );
//           }
//         }

//         if (existingCompany) {
//           createdCompanies.push(existingCompany);
//         } else {
//           console.warn(
//             `Could not retrieve existing company for ${data.name} / ${data.code} after conflict.`,
//           );
//         }
//       } else {
//         console.error(
//           `Failed to create company ${data.name}: ${error.message}`,
//         );
//       }
//     }
//   }

//   if (createdCompanies.length > 0) {
//     const vehicleTypes = [
//       {
//         type: 'Giường nằm 40 chỗ',
//         totalSeats: 40,
//         seatMapGenerator: () => generateSeatMap(10, 2, 0),
//       },
//       {
//         type: 'Ghế ngồi 29 chỗ',
//         totalSeats: 29,
//         seatMapGenerator: () => generateSeatMap(8, 2, 1),
//       },
//       {
//         type: 'Limousine 9 chỗ',
//         totalSeats: 9,
//         seatMapGenerator: () => generateSeatMap(3, 2, 1),
//       },
//       {
//         type: 'Giường nằm 34 chỗ (WC)',
//         totalSeats: 34,
//         seatMapGenerator: () => generateSeatMap(9, 2, 0),
//       },
//       {
//         type: 'Ghế ngồi 45 chỗ',
//         totalSeats: 45,
//         seatMapGenerator: () => generateSeatMap(12, 2, 1),
//       },
//     ];

//     for (const company of createdCompanies) {
//       const numVehiclesToCreate = faker.number.int({ min: 1, max: 2 });
//       const shuffledVehicleTypes = faker.helpers.shuffle(vehicleTypes);

//       for (let i = 0; i < numVehiclesToCreate; i++) {
//         const vt = shuffledVehicleTypes[i % shuffledVehicleTypes.length];
//         const vehicleData: CreateVehicleDto = {
//           companyId: company._id,
//           type: `${vt.type} - ${company.code}`,
//           description: `Xe ${vt.type} hiện đại, tiện nghi của nhà xe ${company.name}.`,
//           totalSeats: vt.totalSeats,
//           seatMap: vt.seatMapGenerator(),
//         };
//         try {
//           const vehicle = await vehiclesService.create(vehicleData);
//           console.log(`Created vehicle: ${vehicle.type} for ${company.name}`);
//         } catch (error) {
//           if (error instanceof ConflictException) {
//             console.warn(
//               `Vehicle type already exists for this company: ${vehicleData.type} - ${error.message}`,
//             );
//           } else {
//             console.error(
//               `Failed to create vehicle ${vehicleData.type} for ${company.name}: ${error.message}`,
//             );
//           }
//         }
//       }
//     }
//   } else {
//     console.log('No companies found or created, skipping vehicle seeding.');
//   }

//   console.log('Seeding completed!');
//   await appContext.close();
// }

// bootstrap().catch((err) => {
//   console.error('Error during seeding:', err);
//   process.exit(1);
// });
