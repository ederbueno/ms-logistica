import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

@EventPattern('estoque_confirmado')
async handleEstoque(@Payload() data: any) {
  const payload = data.value || data;
  await this.appService.processarLogistica(payload); // Só repassa
}
}