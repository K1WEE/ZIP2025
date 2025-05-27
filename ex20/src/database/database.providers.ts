import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async (configService: ConfigService) => {
            const dataSource = new DataSource({
                type: configService.get<string>('DB_TYPE') as any,
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_DATABASE'),
                entities: [
                    __dirname + '/../**/*.entity{.ts,.js}',
                ],
                synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
            });
            return dataSource.initialize();
        },
        inject: [ConfigService], // inject ConfigService
    },
];