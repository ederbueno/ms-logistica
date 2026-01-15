import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE', // O nome que usamos no @Inject do Service
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'logistica-client',
            brokers: [process.env.KAFKA_BROKER || 'localhost:29092'],
            retry: {
              initialRetryTime: 300,
              retries: 10
            }
          },
          consumer: {
            groupId: 'logistica-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
