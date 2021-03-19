import 'dotenv/config';
import './security/passport';
import app from './app';
import { createConnection } from 'typeorm';

import { DB_ENTITIES, DB_MIGRATIONS, DB_SUBSCRIBERS, DIR_ENTITIES, DIR_MIGRATIONS, PORT } from './configs/baseConfig';
import { AWS_RDS_HOST, AWS_RDS_INIT_DB, AWS_RDS_PASSWORD, AWS_RDS_USERNAME } from './configs/awsConfig';

createConnection({
  type: 'postgres',
  host: AWS_RDS_HOST,
  port: 5432,
  username: AWS_RDS_USERNAME,
  password: AWS_RDS_PASSWORD,
  database: AWS_RDS_INIT_DB,
  synchronize: true,
  dropSchema: true,
  logging: true,
  entities: [DB_ENTITIES],
  migrations: [DB_MIGRATIONS],
  subscribers: [DB_SUBSCRIBERS],
  cli: {
    entitiesDir: DIR_ENTITIES,
    migrationsDir: DIR_MIGRATIONS,
    subscribersDir: DB_SUBSCRIBERS,
  },
})
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
