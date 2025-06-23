
import React from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';

interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    features: string[];
    popular?: boolean;
    icon: 'star' | 'zap' | 'crown';
    gradient: string;
  };
  selectedPlan: string;
  onSelectPlan: (planId: string) => void;
  theme: 'light' | 'dark';
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, selectedPlan, onSelectPlan, theme }) => {
  const isSelected = selectedPlan === plan.id;
  
  const IconComponent = {
    star: Star,
    zap: Zap,
    crown: Crown
  }[plan.icon];

  return (
    <div 
      className={`
        relative cursor-pointer transition-all duration-300 transform hover:scale-105
        ${isSelected 
          ? 'ring-2 ring-purple-500 ring-offset-4 ring-offset-background shadow-2xl animate-pulse-glow' 
          : 'hover:shadow-xl'
        }
        ${plan.popular ? 'border-2 border-purple-400' : ''}
      `}
      onClick={() => onSelectPlan(plan.id)}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
            Mais Popular
          </div>
        </div>
      )}

      <div className={`
        h-full p-8 rounded-2xl border transition-all duration-300
        ${theme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm' 
          : 'bg-white/80 border-gray-200 backdrop-blur-sm'
        }
        ${isSelected ? 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20' : ''}
      `}>
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex p-3 rounded-full mb-4 ${plan.gradient}`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {plan.name}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {plan.description}
          </p>

          {/* Pricing */}
          <div className="mb-6">
            {plan.originalPrice && (
              <div className="text-gray-400 dark:text-gray-500 line-through text-lg">
                R$ {plan.originalPrice}/mês
              </div>
            )}
            <div className="flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                R$ {plan.price}
              </span>
              <span className="text-gray-600 dark:text-gray-300 ml-2">/mês</span>
            </div>
            {plan.originalPrice && (
              <div className="text-green-600 dark:text-green-400 text-sm font-semibold">
                Economize {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}%
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          className={`
            w-full py-4 px-6 rounded-xl font-semibold text-center transition-all duration-300 transform
            ${isSelected
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl scale-105'
              : theme === 'dark'
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }
            hover:scale-105 active:scale-95
          `}
        >
          {isSelected ? 'Plano Selecionado' : 'Selecionar Plano'}
        </button>
      </div>
    </div>
  );
};

export default PlanCard;
