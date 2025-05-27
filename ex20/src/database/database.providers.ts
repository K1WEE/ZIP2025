import { DataSource } from 'typeorm';

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'mysql',
                host: 'sql12.freesqldatabase.com',
                port: 3306,
                username: 'sql12781544',
                password: 'xCAFX8F9sI',
                database: 'sql12781544',
                entities: [
                    __dirname + '/../**/*.entity{.ts,.js}',
                ],
                synchronize: true,
            });

            return dataSource.initialize();
        },
    },
];
