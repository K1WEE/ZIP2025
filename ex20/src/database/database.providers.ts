import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async (configService: ConfigService) => {
            const dataSource = new DataSource({
                type: process.env.DB_TYPE as any,
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                entities: [
                    __dirname + '/../**/*.entity{.ts,.js}',
                ],
                synchronize: process.env.DB_SYNCHRONIZE === 'true',
            });
            return dataSource.initialize();
        },
        inject: [ConfigService], // inject ConfigService
    },
];