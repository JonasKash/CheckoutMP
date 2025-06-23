
import React, { useState } from 'react';
import { Key, Eye, EyeOff } from 'lucide-react';

interface MercadoPagoConfigProps {
  theme: 'light' | 'dark';
  onTokenSet: (token: string) => void;
}

const MercadoPagoConfig: React.FC<MercadoPagoConfigProps> = ({ theme, onTokenSet }) => {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSet(token.trim());
      localStorage.setItem('mp_token', token.trim());
    }
  };

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

      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
        Para utilizar o checkout transparente, você precisa configurar seu Access Token do Mercado Pago.
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
