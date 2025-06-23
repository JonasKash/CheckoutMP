
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
  private baseUrl = 'https://api.mercadopago.com/v1';
  // Usando as credenciais de teste fornecidas
  private accessToken = 'APP_USR-7375924962821708-062220-ed6219793d03da4b29bdd1545b0b8b8e-315320666';
  public readonly publicKey = 'APP_USR-8e95c420-3260-4568-8b96-74ba6863d463';

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  async createPixPayment(paymentData: PixPayment): Promise<PaymentResponse> {
    console.log('Criando pagamento PIX:', paymentData);
    
    const response = await fetch(`${this.baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
        'X-Idempotency-Key': Date.now().toString(),
      },
      body: JSON.stringify(paymentData),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro na API:', errorData);
      throw new Error(`Erro ao criar pagamento PIX: ${response.status}`);
    }

    const result = await response.json();
    console.log('Resposta do Mercado Pago:', result);
    return result;
  }

  async createCardPayment(paymentData: MercadoPagoPayment): Promise<PaymentResponse> {
    console.log('Criando pagamento com cartão:', paymentData);
    
    const response = await fetch(`${this.baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
        'X-Idempotency-Key': Date.now().toString(),
      },
      body: JSON.stringify(paymentData),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro na API:', errorData);
      throw new Error(`Erro ao processar pagamento com cartão: ${response.status}`);
    }

    const result = await response.json();
    console.log('Resposta do Mercado Pago:', result);
    return result;
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao consultar status do pagamento');
    }

    return response.json();
  }
}

export const mercadoPagoService = new MercadoPagoService();
