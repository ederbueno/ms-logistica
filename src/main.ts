import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
// 1. Importe o Partitioners da biblioteca kafkajs
import { Partitioners } from 'kafkajs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER || 'localhost:9094'],
      },
      // 2. Adicione o bloco producer aqui
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      },
      consumer: {
        groupId: 'logistica-consumer',
      },
    },
  });
  
  await app.listen();
  console.log('🚚 Microserviço de Logística Rodando e Aguardando Vendas!');
}
bootstrap();