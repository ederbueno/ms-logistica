import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async processarLogistica(dadosVenda: any) {
    const { vendaId, cep, itens, clienteId } = dadosVenda;

    console.log(`🚚 Recebido: Processando logística para a Venda [${vendaId}]`);

    // Simulação de falha: CEP "00000" dispara a SAGA REVERSA
    if (cep === '00000') {
      console.error(`❌ FALHA NA LOGÍSTICA: CEP ${cep} não atendido.`);
      
      // 🔙 DISPARA A SAGA REVERSA (O Estoque precisa ouvir isso para devolver os itens)
      this.kafkaClient.emit('logistica_falhou', {
        vendaId: vendaId,
        itens: itens, 
        motivo: 'AREA_NAO_ATENDIDA'
      });

      // 📢 AVISA O VENDAS (Para cancelar o pedido no banco de vendas também)
      this.kafkaClient.emit('venda_cancelada', {
        vendaId: vendaId,
        motivo: 'FALHA_NA_LOGISTICA_CEP_INVALIDO'
      });
      
      return;
    }

    // ✅ FLUXO DE SUCESSO
    console.log(`✅ SUCESSO: Logística aprovada para Venda [${vendaId}]!`);
    
    // Opcional: Avisar que a venda foi concluída com sucesso total
    this.kafkaClient.emit('venda_concluida', {
      vendaId: vendaId,
      status: 'PRONTO_PARA_ENVIO',
      itens: itens,
    clienteId: clienteId
    });
  }
}