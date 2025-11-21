
import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Users, ShoppingBag, DollarSign, AlertTriangle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { users, products } = useAppStore();

  const pendingProducts = products.filter(p => p.status === 'pending').length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const totalUsers = users.length;
  const stores = users.filter(u => u.accountType === 'store').length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Visão Geral da Plataforma</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Users size={24} />
              </div>
              <span className="text-green-500 text-sm font-bold">+12%</span>
           </div>
           <h3 className="text-gray-500 text-sm font-medium">Total de Usuários</h3>
           <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
           <p className="text-xs text-gray-400 mt-1">{stores} Lojas Ativas</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <ShoppingBag size={24} />
              </div>
           </div>
           <h3 className="text-gray-500 text-sm font-medium">Anúncios Ativos</h3>
           <p className="text-3xl font-bold text-gray-900">{activeProducts}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                <AlertTriangle size={24} />
              </div>
              {pendingProducts > 0 && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">Ação Necessária</span>}
           </div>
           <h3 className="text-gray-500 text-sm font-medium">Anúncios Pendentes</h3>
           <p className="text-3xl font-bold text-gray-900">{pendingProducts}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <DollarSign size={24} />
              </div>
           </div>
           <h3 className="text-gray-500 text-sm font-medium">Receita Estimada (Mensal)</h3>
           <p className="text-3xl font-bold text-gray-900">R$ 12.450</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
         <h2 className="text-lg font-bold text-gray-900 mb-4">Atividades Recentes</h2>
         <div className="text-gray-500 text-center py-12">
           Gráfico de atividades será implementado em breve.
         </div>
      </div>
    </div>
  );
};
