
import React, { useState } from 'react';
import { CreditCard, Lock, User, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CheckoutFormProps {
  selectedPlan: {
    id: string;
    name: string;
    price: number;
    description: string;
  };
  onPayment: (customerData: CustomerData) => void;
  theme: 'light' | 'dark';
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

const CheckoutForm: React.FC<CheckoutFormProps> = ({ selectedPlan, onPayment, theme }) => {
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    document: '',
    address: {
      street: '',
      number: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setCustomerData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setCustomerData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const formatDocument = (doc: string) => {
    // Remove tudo que não é número
    const numbers = doc.replace(/\D/g, '');
    
    // Aplica máscara de CPF (XXX.XXX.XXX-XX)
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    
    return numbers;
  };

  const formatPhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatZipCode = (zipCode: string) => {
    const numbers = zipCode.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const validateForm = () => {
    const requiredFields = [
      'name', 'email', 'phone', 'document',
      'address.street', 'address.number', 'address.city', 'address.state', 'address.zipCode'
    ];

    for (const field of requiredFields) {
      if (field.startsWith('address.')) {
        const addressField = field.split('.')[1];
        if (!customerData.address[addressField as keyof typeof customerData.address]) {
          return false;
        }
      } else {
        if (!customerData[field as keyof CustomerData]) {
          return false;
        }
      }
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerData.email)) {
      return false;
    }

    // Validar CPF (11 dígitos)
    const documentNumbers = customerData.document.replace(/\D/g, '');
    if (documentNumbers.length !== 11) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erro nos dados",
        description: "Por favor, preencha todos os campos corretamente.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      await onPayment(customerData);
    } catch (error) {
      console.error('Erro no pagamento:', error);
      toast({
        title: "Erro no pagamento",
        description: "Ocorreu um erro ao processar o pagamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`
      p-8 rounded-2xl border shadow-xl
      ${theme === 'dark' 
        ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm' 
        : 'bg-white/80 border-gray-200 backdrop-blur-sm'
      }
    `}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full mr-4">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Finalizar Compra
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Complete seus dados para ativar o {selectedPlan.name}
            </p>
          </div>
        </div>

        {/* Plan Summary */}
        <div className={`
          p-4 rounded-xl border-2 border-dashed
          ${theme === 'dark' ? 'border-purple-500/30 bg-purple-900/10' : 'border-purple-300 bg-purple-50'}
        `}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {selectedPlan.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {selectedPlan.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                R$ {selectedPlan.price}
              </div>
              <div className="text-sm text-gray-500">por mês</div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Pessoais */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Dados Pessoais
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                value={customerData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`
                  w-full px-4 py-3 rounded-xl border transition-colors
                  ${theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-purple-500/20
                `}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CPF *
              </label>
              <input
                type="text"
                value={formatDocument(customerData.document)}
                onChange={(e) => handleInputChange('document', e.target.value)}
                className={`
                  w-full px-4 py-3 rounded-xl border transition-colors
                  ${theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-purple-500/20
                `}
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
            </div>
          </div>
        </div>

        {/* Contato */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Contato
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                E-mail *
              </label>
              <input
                type="email"
                value={customerData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`
                  w-full px-4 py-3 rounded-xl border transition-colors
                  ${theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-purple-500/20
                `}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telefone *
              </label>
              <input
                type="tel"
                value={formatPhone(customerData.phone)}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`
                  w-full px-4 py-3 rounded-xl border transition-colors
                  ${theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-purple-500/20
                `}
                placeholder="(11) 99999-9999"
                maxLength={15}
                required
              />
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Endereço
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rua *
                </label>
                <input
                  type="text"
                  value={customerData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  className={`
                    w-full px-4 py-3 rounded-xl border transition-colors
                    ${theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                    }
                    focus:outline-none focus:ring-2 focus:ring-purple-500/20
                  `}
                  placeholder="Nome da rua"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Número *
                </label>
                <input
                  type="text"
                  value={customerData.address.number}
                  onChange={(e) => handleInputChange('address.number', e.target.value)}
                  className={`
                    w-full px-4 py-3 rounded-xl border transition-colors
                    ${theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                    }
                    focus:outline-none focus:ring-2 focus:ring-purple-500/20
                  `}
                  placeholder="123"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={customerData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  className={`
                    w-full px-4 py-3 rounded-xl border transition-colors
                    ${theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                    }
                    focus:outline-none focus:ring-2 focus:ring-purple-500/20
                  `}
                  placeholder="Sua cidade"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado *
                </label>
                <select
                  value={customerData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  className={`
                    w-full px-4 py-3 rounded-xl border transition-colors
                    ${theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                    }
                    focus:outline-none focus:ring-2 focus:ring-purple-500/20
                  `}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="RS">Rio Grande do Sul</option>
                  {/* Adicione outros estados conforme necessário */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CEP *
                </label>
                <input
                  type="text"
                  value={formatZipCode(customerData.address.zipCode)}
                  onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                  className={`
                    w-full px-4 py-3 rounded-xl border transition-colors
                    ${theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                    }
                    focus:outline-none focus:ring-2 focus:ring-purple-500/20
                  `}
                  placeholder="00000-000"
                  maxLength={9}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className={`
          p-4 rounded-xl flex items-center
          ${theme === 'dark' ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200'}
        `}>
          <Lock className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-green-800 dark:text-green-300">
              Seus dados estão seguros
            </p>
            <p className="text-green-700 dark:text-green-400">
              Utilizamos criptografia SSL e processamento seguro via Mercado Pago
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
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
              Processando pagamento...
            </div>
          ) : (
            `Pagar R$ ${selectedPlan.price}/mês`
          )}
        </button>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Ao continuar, você concorda com nossos{' '}
          <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
            Termos de Serviço
          </a>{' '}
          e{' '}
          <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
            Política de Privacidade
          </a>
        </p>
      </form>
    </div>
  );
};

export default CheckoutForm;
