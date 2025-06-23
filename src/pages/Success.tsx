
import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Download, Mail, Star, Sparkles } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface SuccessProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const Success: React.FC<SuccessProps> = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isAnimating, setIsAnimating] = useState(false);

  const paymentId = searchParams.get('payment_id');
  const planName = searchParams.get('plan') || 'Professional';
  const customerEmail = searchParams.get('email') || '';

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setIsAnimating(true), 100);
  }, []);

  const features = [
    'Acesso completo à plataforma',
    'Dashboard personalizado',
    'Relatórios avançados com IA',
    'Suporte prioritário 24/7',
    'API personalizada',
    'Integração ilimitada'
  ];

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className={`
          bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center border
          ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
          ${isAnimating ? 'animate-fade-in' : 'opacity-0'}
        `}>
          
          {/* Success Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            {/* Sparkles Animation */}
            <div className="absolute -top-2 -right-2 animate-pulse">
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="absolute -bottom-2 -left-2 animate-pulse delay-300">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          
          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pagamento Aprovado!
          </h1>
          
          <div className="mb-8">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              Bem-vindo ao <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">CommercialAI Pro</span>
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Seu plano <span className="font-semibold">{planName}</span> foi ativado com sucesso!
            </p>
          </div>

          {/* Payment Details */}
          {paymentId && (
            <div className={`
              p-4 rounded-xl mb-8 border
              ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}
            `}>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                ID do Pagamento
              </div>
              <div className="font-mono text-gray-900 dark:text-white">
                {paymentId}
              </div>
            </div>
          )}

          {/* Features Unlocked */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              Recursos Desbloqueados
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => window.open('/dashboard', '_self')}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              Acessar Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>

            <div className="flex space-x-4">
              <button
                onClick={() => window.open('/download-receipt', '_blank')}
                className={`
                  flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 border flex items-center justify-center
                  ${theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                  }
                `}
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Recibo
              </button>

              <button
                onClick={() => window.open(`mailto:${customerEmail}?subject=Bem-vindo ao CommercialAI Pro`, '_blank')}
                className={`
                  flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 border flex items-center justify-center
                  ${theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                  }
                `}
              >
                <Mail className="w-4 h-4 mr-2" />
                Confirmar Email
              </button>
            </div>
          </div>

          {/* Next Steps */}
          <div className={`
            mt-8 p-4 rounded-xl border-2 border-dashed text-left
            ${theme === 'dark' ? 'border-purple-500/30 bg-purple-900/10' : 'border-purple-300 bg-purple-50'}
          `}>
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
              Próximos Passos:
            </h4>
            <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
              <li>• Você receberá um email de confirmação em breve</li>
              <li>• Acesse o dashboard para configurar sua conta</li>
              <li>• Explore os recursos e comece a usar a IA</li>
              <li>• Entre em contato conosco se precisar de ajuda</li>
            </ul>
          </div>

          {/* Support */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Precisa de ajuda?{' '}
              <a 
                href="mailto:suporte@commercialai.pro" 
                className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
              >
                Entre em contato com nosso suporte
              </a>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © 2024 CommercialAI Pro. Processamento seguro via Mercado Pago.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
