import { ConfigInterface } from "@crm/shared/interfaces/config.interface";

/** Конфигурационные переменные */
export const environment: ConfigInterface = {
  production: false,
  secret: process.env['SECRET'] || 'd2103dfe7288ccb50a4a7af9ff90ec52',
  db: process.env['DB'] || 'mongodb://localhost:27017/crm',
  expiresIn: Number(process.env['EXPIRES_IN']) || 2592000
};
