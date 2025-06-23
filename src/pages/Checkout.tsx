
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Sparkles, Zap, Crown, ShoppingCart } from 'lucide-react';
import PlanCard from '../components/PlanCard';
import CheckoutForm from '../components/CheckoutForm';
import PaymentStatus from '../components/PaymentStatus';
import { toast } from '@/hooks/use-toast';

interface CheckoutProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  features: string[];
  popular?: boolean;
  icon: 'star' | 'zap' | 'crown';
  gradient: string;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  document: string;
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

const Checkout: React.FC<CheckoutProps> = ({ theme, setTheme }) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [currentStep, setCurrentStep] = useState<'plans' | 'checkout' | 'payment'>('plans');
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'approved' | 'rejected' | 'pending'>('processing');
  const [paymentId, setPaymentId] = useState<string>('');

  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfeito para começar',
      price: 49,
      originalPrice: 79,
      features: [
        'Até 1.000 análises de dados por mês',
        'Dashboard básico',
        'Relatórios em PDF',
        'Suporte por email',
        'Integração com 3 plataformas'
      ],
      icon: 'star',
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'Ideal para profissionais',
      price: 99,
      originalPrice: 149,
      features: [
        'Até 10.000 análises por mês',
        'Dashboard avançado com IA',
        'Relatórios personalizados',
        'Suporte prioritário 24/7',
        'Integração ilimitada',
        'API personalizada',
        'Alertas em tempo real'
      ],
      popular: true,
      icon: 'zap',
      gradient: 'bg-gradient-to-r from-purple-600 to-indigo-600'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Para grandes empresas',
      price: 199,
      originalPrice: 299,
      features: [
        'Análises ilimitadas',
        'Dashboard white-label',
        'Relatórios avançados com IA',
        'Gerente de conta dedicado',
        'Integrações customizadas',
        'SLA garantido',
        'Treinamento da equipe',
        'Consultoria estratégica'
      ],
      icon: 'crown',
      gradient: 'bg-gradient-to-r from-yellow-500 to-orange-600'
    }
  ];

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleContinueToCheckout = () => {
    if (!selectedPlan) {
      toast({
        title: "Selecione um plano",
        description: "Por favor, escolha um plano para continuar.",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep('checkout');
  };

  const handlePayment = async (customerData: CustomerData) => {
    console.log('Iniciando processo de pagamento...', { customerData, selectedPlan });
    
    setCurrentStep('payment');
    setPaymentStatus('processing');

    try {
      // Simulação de API do Mercado Pago
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: selectedPlanData,
          customer: customerData
        })
      });

      if (!response.ok) {
        throw new Error('Erro na API');
      }

      const data = await response.json();
      
      // Simular redirecionamento para o Mercado Pago
      if (data.init_point) {
        // Abrir em uma nova aba
        window.open(data.init_point, '_blank');
        
        // Simular aprovação após alguns segundos (para demonstração)
        setTimeout(() => {
          setPaymentStatus('approved');
          setPaymentId(data.id || 'MP-' + Date.now());
          
          toast({
            title: "Pagamento aprovado!",
            description: "Seu plano foi ativado com sucesso.",
          });
        }, 3000);
      }

    } catch (error) {
      console.error('Erro no pagamento:', error);
      setPaymentStatus('rejected');
      
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível processar o pagamento. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleRetryPayment = () => {
    setCurrentStep('checkout');
  };

  return (
    <div className="min-h-screen gradient-bg transition-all duration-300">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10"></div>
        
        <header className="relative z-10 px-4 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  CommercialAI Pro
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {currentStep === 'plans' && 'Escolha seu plano'}
                  {currentStep === 'checkout' && 'Finalizar compra'}
                  {currentStep === 'payment' && 'Processando pagamento'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Progress Steps */}
              <div className="hidden md:flex items-center space-x-4">
                <div className={`flex items-center ${
                  currentStep === 'plans' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep === 'plans' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium">Planos</span>
                </div>

                <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>

                <div className={`flex items-center ${
                  currentStep === 'checkout' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep === 'checkout' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium">Checkout</span>
                </div>

                <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>

                <div className={`flex items-center ${
                  currentStep === 'payment' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep === 'payment' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    3
                  </div>
                  <span className="ml-2 text-sm font-medium">Pagamento</span>
                </div>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className={`
                  p-2 rounded-xl transition-colors
                  ${theme === 'dark' 
                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                  }
                  border border-gray-200 dark:border-gray-700
                `}
                aria-label="Alternar tema"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {currentStep === 'plans' && (
            <div className="animate-fade-in">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Escolha o Plano Ideal
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                    Para Seu Negócio
                  </span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Potencialize suas vendas com inteligência artificial avançada. 
                  Escolha o plano que melhor se adapta às suas necessidades.
                </p>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    selectedPlan={selectedPlan}
                    onSelectPlan={handlePlanSelect}
                    theme={theme}
                  />
                ))}
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <button
                  onClick={handleContinueToCheckout}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center mx-auto"
                >
                  <ShoppingCart className="w-6 h-6 mr-3" />
                  Continuar para Checkout
                </button>
              </div>
            </div>
          )}

          {currentStep === 'checkout' && selectedPlanData && (
            <div className="animate-fade-in">
              <div className="max-w-4xl mx-auto">
                <CheckoutForm
                  selectedPlan={selectedPlanData}
                  onPayment={handlePayment}
                  theme={theme}
                />
              </div>
            </div>
          )}

          {currentStep === 'payment' && (
            <div className="animate-fade-in">
              <div className="max-w-2xl mx-auto">
                <PaymentStatus
                  status={paymentStatus}
                  paymentId={paymentId}
                  theme={theme}
                  onRetry={handleRetryPayment}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            © 2024 CommercialAI Pro. Todos os direitos reservados.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
              Termos de Serviço
            </a>
            <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
              Política de Privacidade
            </a>
            <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
              Suporte
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
