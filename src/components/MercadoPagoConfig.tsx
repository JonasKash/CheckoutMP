
import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Check } from 'lucide-react';

interface MercadoPagoConfigProps {
  theme: 'light' | 'dark';
  onTokenSet: (token: string) => void;
}

const MercadoPagoConfig: React.FC<MercadoPagoConfigProps> = ({ theme, onTokenSet }) => {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  // Credenciais de teste pré-configuradas
  const testAccessToken = 'APP_USR-7375924962821708-062220-ed6219793d03da4b29bdd1545b0b8b8e-315320666';
  const testPublicKey = 'APP_USR-8e95c420-3260-4568-8b96-74ba6863d463';

  useEffect(() => {
    const savedToken = localStorage.getItem('mp_token');
    if (savedToken) {
      setToken(savedToken);
      setIsConfigured(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSet(token.trim());
      localStorage.setItem('mp_token', token.trim());
      setIsConfigured(true);
    }
  };

  const useTestCredentials = () => {
    setToken(testAccessToken);
    onTokenSet(testAccessToken);
    localStorage.setItem('mp_token', testAccessToken);
    setIsConfigured(true);
  };

  if (isConfigured) {
    return (
      <div className={`
        p-4 rounded-2xl border shadow-xl mb-6
        ${theme === 'dark' 
          ? 'bg-green-800/20 border-green-700/50 backdrop-blur-sm' 
          : 'bg-green-50/80 border-green-200 backdrop-blur-sm'
        }
      `}>
        <div className="flex items-center">
          <Check className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
          <div>
            <h4 className="font-semibold text-green-800 dark:text-green-300">
              Mercado Pago Configurado
            </h4>
            <p className="text-sm text-green-700 dark:text-green-400">
              Checkout transparente ativo e pronto para uso
            </p>
          </div>
          <button
            onClick={() => {
              setIsConfigured(false);
              setToken('');
              localStorage.removeItem('mp_token');
            }}
            className="ml-auto text-sm text-green-600 dark:text-green-400 hover:underline"
          >
            Reconfigurar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      p-6 rounded-2xl border shadow-xl mb-6
      ${theme === 'dark' 
        ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm' 
        : 'bg-white/80 border-gray-200 backdrop-blur-sm'
      }
    `}>
      <div className="flex items-center mb-4">
        <Key className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Configuração Mercado Pago
        </h3>
      </div>

      {/* Botão para usar credenciais de teste */}
      <div className={`
        p-4 rounded-xl mb-4 border-2 border-dashed
        ${theme === 'dark' ? 'border-blue-500/30 bg-blue-900/10' : 'border-blue-300 bg-blue-50'}
      `}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
              Credenciais de Teste Disponíveis
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Use as credenciais pré-configuradas para testar o checkout
            </p>
          </div>
          <button
            onClick={useTestCredentials}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Usar Teste
          </button>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
        Ou configure manualmente seu Access Token do Mercado Pago.
        <br />
        <a 
          href="https://www.mercadopago.com.br/developers/panel/credentials" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-purple-600 dark:text-purple-400 hover:underline"
        >
          Obtenha suas credenciais aqui
        </a>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Access Token *
          </label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className={`
                w-full px-4 py-3 pr-12 rounded-xl border transition-colors
                ${theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                }
                focus:outline-none focus:ring-2 focus:ring-purple-500/20
              `}
              placeholder="Seu Access Token do Mercado Pago"
              required
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
        >
          Configurar Token
        </button>
      </form>

      <div className={`
        mt-4 p-3 rounded-lg text-xs
        ${theme === 'dark' ? 'bg-yellow-900/20 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'}
      `}>
        <p className="text-yellow-800 dark:text-yellow-300">
          <strong>Importante:</strong> Use sempre o token de teste para desenvolvimento. 
          O token será salvo localmente no seu navegador.
        </p>
      </div>
    </div>
  );
};

export default MercadoPagoConfig;
