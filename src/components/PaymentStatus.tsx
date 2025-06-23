
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface PaymentStatusProps {
  status: 'processing' | 'approved' | 'rejected' | 'pending';
  paymentId?: string;
  theme: 'light' | 'dark';
  onRetry?: () => void;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ 
  status, 
  paymentId, 
  theme, 
  onRetry 
}) => {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (status === 'processing') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status]);

  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          icon: Clock,
          title: 'Processando Pagamento',
          description: 'Aguarde enquanto confirmamos seu pagamento...',
          color: 'blue',
          bgColor: theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50',
          borderColor: 'border-blue-200 dark:border-blue-500/30',
          iconColor: 'text-blue-600 dark:text-blue-400',
          titleColor: 'text-blue-900 dark:text-blue-100'
        };
      case 'approved':
        return {
          icon: CheckCircle,
          title: 'Pagamento Aprovado!',
          description: 'Seu plano foi ativado com sucesso. Bem-vindo ao CommercialAI Pro!',
          color: 'green',
          bgColor: theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50',
          borderColor: 'border-green-200 dark:border-green-500/30',
          iconColor: 'text-green-600 dark:text-green-400',
          titleColor: 'text-green-900 dark:text-green-100'
        };
      case 'rejected':
        return {
          icon: XCircle,
          title: 'Pagamento Rejeitado',
          description: 'Não foi possível processar seu pagamento. Verifique os dados e tente novamente.',
          color: 'red',
          bgColor: theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50',
          borderColor: 'border-red-200 dark:border-red-500/30',
          iconColor: 'text-red-600 dark:text-red-400',
          titleColor: 'text-red-900 dark:text-red-100'
        };
      case 'pending':
        return {
          icon: AlertCircle,
          title: 'Pagamento Pendente',
          description: 'Aguardamos a confirmação do seu pagamento. Isso pode levar alguns minutos.',
          color: 'yellow',
          bgColor: theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-50',
          borderColor: 'border-yellow-200 dark:border-yellow-500/30',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          titleColor: 'text-yellow-900 dark:text-yellow-100'
        };
      default:
        return {
          icon: Clock,
          title: 'Processando...',
          description: 'Aguarde...',
          color: 'gray',
          bgColor: theme === 'dark' ? 'bg-gray-900/20' : 'bg-gray-50',
          borderColor: 'border-gray-200 dark:border-gray-500/30',
          iconColor: 'text-gray-600 dark:text-gray-400',
          titleColor: 'text-gray-900 dark:text-gray-100'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className={`
      p-8 rounded-2xl border-2 text-center transition-all duration-500
      ${config.bgColor} ${config.borderColor}
    `}>
      {/* Icon with animation */}
      <div className={`
        inline-flex p-4 rounded-full mb-6
        ${status === 'processing' ? 'animate-pulse' : ''}
        ${status === 'approved' ? 'animate-bounce' : ''}
      `}>
        <IconComponent className={`w-12 h-12 ${config.iconColor}`} />
      </div>

      {/* Title */}
      <h2 className={`text-2xl font-bold mb-4 ${config.titleColor}`}>
        {config.title}
      </h2>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
        {config.description}
      </p>

      {/* Payment ID */}
      {paymentId && (
        <div className={`
          text-sm p-3 rounded-lg mb-6
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white/50'}
        `}>
          <span className="text-gray-500 dark:text-gray-400">ID do Pagamento: </span>
          <span className="font-mono text-gray-900 dark:text-white">{paymentId}</span>
        </div>
      )}

      {/* Processing countdown */}
      {status === 'processing' && countdown > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-center mb-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Verificando em {countdown}s...
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${((30 - countdown) / 30) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {status === 'approved' && (
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105"
          >
            Acessar Dashboard
          </button>
        )}

        {status === 'rejected' && onRetry && (
          <button
            onClick={onRetry}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
          >
            Tentar Novamente
          </button>
        )}

        {(status === 'pending' || status === 'processing') && (
          <button
            onClick={() => window.location.reload()}
            className={`
              w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105
              ${theme === 'dark' 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
              }
              border border-gray-300 dark:border-gray-600
            `}
          >
            Atualizar Status
          </button>
        )}
      </div>

      {/* Help text */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
        Precisa de ajuda?{' '}
        <a 
          href="mailto:suporte@commercialai.pro" 
          className="text-purple-600 dark:text-purple-400 hover:underline"
        >
          Entre em contato
        </a>
      </p>
    </div>
  );
};

export default PaymentStatus;
