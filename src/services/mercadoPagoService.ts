
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
  private accessToken = ''; // Será definido dinamicamente

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  async createPixPayment(paymentData: PixPayment): Promise<PaymentResponse> {
    const response = await fetch(`${this.baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar pagamento PIX');
    }

    return response.json();
  }

  async createCardPayment(paymentData: MercadoPagoPayment): Promise<PaymentResponse> {
    const response = await fetch(`${this.baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error('Erro ao processar pagamento com cartão');
    }

    return response.json();
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
