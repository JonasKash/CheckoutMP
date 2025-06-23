
// Tipos para o Mercado Pago
export interface MercadoPagoPayment {
  transaction_amount: number;
  description: string;
  payment_method_id: string;
  payer: {
    email: string;
    first_name: string;
    last_name: string;
    identification: {
      type: string;
      number: string;
    };
  };
  token?: string;
}

export interface PixPayment {
  transaction_amount: number;
  description: string;
  payment_method_id: 'pix';
  payer: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface PaymentResponse {
  id: string;
  status: string;
  status_detail: string;
  point_of_interaction?: {
    transaction_data?: {
      qr_code_base64?: string;
      qr_code?: string;
    };
  };
}

class MercadoPagoService {
  // Usando as credenciais de teste fornecidas - ambiente sandbox
  private accessToken = 'TEST-7375924962821708-062220-ed6219793d03da4b29bdd1545b0b8b8e-315320666';
  public readonly publicKey = 'TEST-8e95c420-3260-4568-8b96-74ba6863d463';
  private baseUrl = 'https://api.mercadopago.com/v1';

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  async createPixPayment(paymentData: PixPayment): Promise<PaymentResponse> {
    console.log('Criando pagamento PIX:', paymentData);
    
    try {
      // Simular resposta do Mercado Pago para demonstração
      // Em produção, você precisaria de um proxy server para evitar CORS
      const mockResponse: PaymentResponse = {
        id: 'PIX-' + Date.now(),
        status: 'pending',
        status_detail: 'pending_waiting_payment',
        point_of_interaction: {
          transaction_data: {
            qr_code_base64: this.generateMockQRCode(),
            qr_code: '00020126580014br.gov.bcb.pix0136' + Date.now() + '52040000530398654' + paymentData.transaction_amount.toFixed(2).replace('.', '') + '5802BR5925Loja Teste6014Rio de Janeiro62070503***6304'
          }
        }
      };

      console.log('Resposta simulada do Mercado Pago:', mockResponse);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return mockResponse;

    } catch (error) {
      console.error('Erro na API do Mercado Pago:', error);
      throw new Error('Erro ao gerar PIX. Verifique suas credenciais.');
    }
  }

  async createCardPayment(paymentData: MercadoPagoPayment): Promise<PaymentResponse> {
    console.log('Criando pagamento com cartão:', paymentData);
    
    try {
      // Simular resposta do Mercado Pago para demonstração
      const mockResponse: PaymentResponse = {
        id: 'CARD-' + Date.now(),
        status: 'approved',
        status_detail: 'accredited'
      };

      console.log('Resposta simulada do Mercado Pago:', mockResponse);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return mockResponse;

    } catch (error) {
      console.error('Erro na API do Mercado Pago:', error);
      throw new Error('Erro ao processar pagamento com cartão.');
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    console.log('Consultando status do pagamento:', paymentId);
    
    try {
      // Simular aprovação do PIX após alguns segundos
      const isPixPayment = paymentId.startsWith('PIX-');
      const timestamp = parseInt(paymentId.split('-')[1]);
      const elapsedTime = Date.now() - timestamp;
      
      // Simular aprovação após 10 segundos para PIX
      if (isPixPayment && elapsedTime > 10000) {
        return {
          id: paymentId,
          status: 'approved',
          status_detail: 'accredited'
        };
      }
      
      return {
        id: paymentId,
        status: 'pending',
        status_detail: 'pending_waiting_payment'
      };

    } catch (error) {
      console.error('Erro ao consultar status:', error);
      throw new Error('Erro ao consultar status do pagamento');
    }
  }

  private generateMockQRCode(): string {
    // QR Code base64 de exemplo para demonstração
    return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  }
}

export const mercadoPagoService = new MercadoPagoService();
