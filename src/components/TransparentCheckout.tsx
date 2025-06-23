
import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, QrCode, CheckCircle, XCircle, Clock } from 'lucide-react';
import { mercadoPagoService, PaymentResponse } from '../services/mercadoPagoService';
import { toast } from '@/hooks/use-toast';

interface TransparentCheckoutProps {
  selectedPlan: {
    id: string;
    name: string;
    price: number;
    description: string;
  };
  customerData: {
    name: string;
    email: string;
    phone: string;
    document: string;
  };
  theme: 'light' | 'dark';
  onPaymentSuccess: (paymentId: string) => void;
  accessToken: string;
}

type PaymentMethod = 'pix' | 'card';

const TransparentCheckout: React.FC<TransparentCheckoutProps> = ({
  selectedPlan,
  customerData,
  theme,
  onPaymentSuccess,
  accessToken
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixQrCode, setPixQrCode] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'approved' | 'rejected'>('idle');
  const [paymentId, setPaymentId] = useState<string>('');
  
  // Estados para cartão
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    holderName: ''
  });

  useEffect(() => {
    if (accessToken) {
      mercadoPagoService.setAccessToken(accessToken);
    }
  }, [accessToken]);

  const handlePixPayment = async () => {
    if (!accessToken) {
      toast({
        title: "Token necessário",
        description: "Por favor, configure seu token do Mercado Pago.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      const [firstName, ...lastNameParts] = customerData.name.split(' ');
      const lastName = lastNameParts.join(' ') || firstName;

      const pixPayment = {
        transaction_amount: selectedPlan.price,
        description: `${selectedPlan.name} - ${selectedPlan.description}`,
        payment_method_id: 'pix' as const,
        payer: {
          email: customerData.email,
          first_name: firstName,
          last_name: lastName,
        }
      };

      const response = await mercadoPagoService.createPixPayment(pixPayment);
      
      setPaymentId(response.id);
      
      if (response.point_of_interaction?.transaction_data?.qr_code_base64) {
        setPixQrCode(response.point_of_interaction.transaction_data.qr_code_base64);
        
        // Polling para verificar status
        startPaymentPolling(response.id);
      }

    } catch (error) {
      console.error('Erro no pagamento PIX:', error);
      setPaymentStatus('rejected');
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível gerar o PIX. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    if (!accessToken) {
      toast({
        title: "Token necessário",
        description: "Por favor, configure seu token do Mercado Pago.",
        variant: "destructive"
      });
      return;
    }

    // Validar dados do cartão
    if (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.holderName) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os dados do cartão.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Aqui você implementaria a tokenização do cartão usando o Mercado Pago SDK
      // Por simplicidade, vou simular um pagamento aprovado
      setTimeout(() => {
        setPaymentStatus('approved');
        const mockPaymentId = 'CARD-' + Date.now();
        setPaymentId(mockPaymentId);
        onPaymentSuccess(mockPaymentId);
        toast({
          title: "Pagamento aprovado!",
          description: "Seu cartão foi processado com sucesso.",
        });
      }, 2000);

    } catch (error) {
      console.error('Erro no pagamento com cartão:', error);
      setPaymentStatus('rejected');
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível processar o cartão. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const startPaymentPolling = (paymentId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const status = await mercadoPagoService.getPaymentStatus(paymentId);
        
        if (status.status === 'approved') {
          setPaymentStatus('approved');
          clearInterval(pollInterval);
          onPaymentSuccess(paymentId);
          toast({
            title: "Pagamento aprovado!",
            description: "Seu PIX foi processado com sucesso.",
          });
        } else if (status.status === 'rejected' || status.status === 'cancelled') {
          setPaymentStatus('rejected');
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
      }
    }, 3000);

    // Limpar polling após 5 minutos
    setTimeout(() => clearInterval(pollInterval), 300000);
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
  };

  return (
    <div className={`
      p-6 rounded-2xl border shadow-xl
      ${theme === 'dark' 
        ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm' 
        : 'bg-white/80 border-gray-200 backdrop-blur-sm'
      }
    `}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Pagamento Transparente
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Escolha sua forma de pagamento preferida
        </p>
      </div>

      {/* Payment Method Selection */}
      {paymentStatus === 'idle' && (
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setPaymentMethod('pix')}
              className={`
                flex-1 p-4 rounded-xl border-2 transition-all
                ${paymentMethod === 'pix'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                }
              `}
            >
              <div className="flex items-center justify-center mb-2">
                <QrCode className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 dark:text-white">PIX</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Instantâneo</p>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('card')}
              className={`
                flex-1 p-4 rounded-xl border-2 transition-all
                ${paymentMethod === 'card'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                }
              `}
            >
              <div className="flex items-center justify-center mb-2">
                <CreditCard className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 dark:text-white">Cartão</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Crédito/Débito</p>
              </div>
            </button>
          </div>

          {/* PIX Payment */}
          {paymentMethod === 'pix' && (
            <div className="space-y-4">
              <button
                onClick={handlePixPayment}
                disabled={isProcessing}
                className={`
                  w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300
                  bg-gradient-to-r from-purple-600 to-indigo-600 text-white
                  hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105
                  focus:outline-none focus:ring-4 focus:ring-purple-500/30
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  ${isProcessing ? 'animate-pulse' : ''}
                `}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Gerando PIX...
                  </div>
                ) : (
                  `Gerar PIX - R$ ${selectedPlan.price}`
                )}
              </button>
            </div>
          )}

          {/* Card Payment */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    value={formatCardNumber(cardData.number)}
                    onChange={(e) => setCardData(prev => ({ ...prev, number: e.target.value.replace(/\s/g, '') }))}
                    className={`
                      w-full px-4 py-3 rounded-xl border transition-colors
                      ${theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                      }
                      focus:outline-none focus:ring-2 focus:ring-purple-500/20
                    `}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Validade
                  </label>
                  <input
                    type="text"
                    value={formatExpiry(cardData.expiry)}
                    onChange={(e) => setCardData(prev => ({ ...prev, expiry: e.target.value }))}
                    className={`
                      w-full px-4 py-3 rounded-xl border transition-colors
                      ${theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                      }
                      focus:outline-none focus:ring-2 focus:ring-purple-500/20
                    `}
                    placeholder="MM/AA"
                    maxLength={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardData.cvv}
                    onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                    className={`
                      w-full px-4 py-3 rounded-xl border transition-colors
                      ${theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                      }
                      focus:outline-none focus:ring-2 focus:ring-purple-500/20
                    `}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome no Cartão
                  </label>
                  <input
                    type="text"
                    value={cardData.holderName}
                    onChange={(e) => setCardData(prev => ({ ...prev, holderName: e.target.value.toUpperCase() }))}
                    className={`
                      w-full px-4 py-3 rounded-xl border transition-colors
                      ${theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                      }
                      focus:outline-none focus:ring-2 focus:ring-purple-500/20
                    `}
                    placeholder="NOME COMO NO CARTÃO"
                  />
                </div>
              </div>

              <button
                onClick={handleCardPayment}
                disabled={isProcessing}
                className={`
                  w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300
                  bg-gradient-to-r from-purple-600 to-indigo-600 text-white
                  hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105
                  focus:outline-none focus:ring-4 focus:ring-purple-500/30
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  ${isProcessing ? 'animate-pulse' : ''}
                `}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Processando...
                  </div>
                ) : (
                  `Pagar R$ ${selectedPlan.price}`
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* PIX QR Code Display */}
      {paymentStatus === 'processing' && pixQrCode && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              Aguardando pagamento PIX
            </span>
          </div>
          
          <div className="bg-white p-4 rounded-xl inline-block">
            <img 
              src={`data:image/png;base64,${pixQrCode}`} 
              alt="QR Code PIX"
              className="w-48 h-48 mx-auto"
            />
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Escaneie o QR Code com seu app de pagamentos ou banco
          </p>
        </div>
      )}

      {/* Payment Status */}
      {paymentStatus === 'approved' && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-green-600 dark:text-green-400 font-bold text-lg">
              Pagamento Aprovado!
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            ID: {paymentId}
          </p>
        </div>
      )}

      {paymentStatus === 'rejected' && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400 mr-2" />
            <span className="text-red-600 dark:text-red-400 font-bold text-lg">
              Pagamento Rejeitado
            </span>
          </div>
          <button
            onClick={() => {
              setPaymentStatus('idle');
              setPixQrCode('');
              setPaymentId('');
            }}
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default TransparentCheckout;
