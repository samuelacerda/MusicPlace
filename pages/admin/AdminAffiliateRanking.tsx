
import React, { useState } from 'react';
import { Trophy, Download, Search, ExternalLink, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';

interface AffiliateRankingItem {
  position: number;
  name: string;
  totalSales: number;
  revenue: number;
  commission: number;
  status: 'active' | 'inactive';
}

export const AdminAffiliateRanking: React.FC = () => {
  const [filterPeriod, setFilterPeriod] = useState<'week' | 'month'>('month');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Data
  const rankingData: AffiliateRankingItem[] = [
    { position: 1, name: 'Carlos Alberto', totalSales: 145, revenue: 45200, commission: 4520, status: 'active' },
    { position: 2, name: 'Mariana Santos', totalSales: 132, revenue: 38900, commission: 3890, status: 'active' },
    { position: 3, name: 'Pedro Oliveira', totalSales: 98, revenue: 28400, commission: 2840, status: 'active' },
    { position: 4, name: 'Beatriz Lima', totalSales: 87, revenue: 24100, commission: 2410, status: 'active' },
    { position: 5, name: 'Ricardo Souza', totalSales: 76, revenue: 19800, commission: 1980, status: 'active' },
    { position: 6, name: 'Fernanda Costa', totalSales: 65, revenue: 15600, commission: 1560, status: 'inactive' },
    { position: 7, name: 'Gustavo Pereira', totalSales: 54, revenue: 12300, commission: 1230, status: 'active' },
    { position: 8, name: 'Juliana Mendes', totalSales: 43, revenue: 9800, commission: 980, status: 'active' },
    { position: 9, name: 'Lucas Rocha', totalSales: 32, revenue: 7400, commission: 740, status: 'active' },
    { position: 10, name: 'Amanda Silva', totalSales: 21, revenue: 4200, commission: 420, status: 'active' },
  ];

  const filteredData = rankingData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    // Mock export functionality
    const headers = ['Posição', 'Nome do Afiliado', 'Total de Vendas', 'Receita Gerada', 'Comissão', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        item.position,
        item.name,
        item.totalSales,
        item.revenue,
        item.commission,
        item.status === 'active' ? 'Ativo' : 'Inativo'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ranking_afiliados_${filterPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="text-yellow-500" /> Ranking de Afiliados
          </h1>
          <p className="text-gray-500">Acompanhe o desempenho dos seus principais parceiros.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="flex bg-white border border-gray-300 rounded-lg p-1">
            <button 
              onClick={() => setFilterPeriod('week')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${filterPeriod === 'week' ? 'bg-brand-100 text-brand-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Semana
            </button>
            <button 
              onClick={() => setFilterPeriod('month')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${filterPeriod === 'month' ? 'bg-brand-100 text-brand-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Mês
            </button>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition shadow-sm flex-1 md:flex-none"
          >
            <Download size={18} /> Exportar Excel
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <ShoppingCart size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Vendas por Afiliados</p>
              <p className="text-2xl font-bold text-gray-900">1.245</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Receita Total Gerada</p>
              <p className="text-2xl font-bold text-gray-900">$ 284,500</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Comissões Pagas</p>
              <p className="text-2xl font-bold text-gray-900">$ 28,450</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900">Performance Detalhada</h2>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar afiliado..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Posição</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nome do Afiliado</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total de Vendas</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Receita Gerada</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Comissão</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => (
                <tr key={item.position} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      item.position === 1 ? 'bg-yellow-100 text-yellow-700' :
                      item.position === 2 ? 'bg-gray-200 text-gray-700' :
                      item.position === 3 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-50 text-gray-500'
                    }`}>
                      {item.position}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-gray-900">{item.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-600 font-medium">{item.totalSales}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-900 font-bold">$ {item.revenue.toLocaleString('en-US')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-brand-600 font-bold">$ {item.commission.toLocaleString('en-US')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      item.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {item.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-gray-400 hover:text-brand-600 transition p-1">
                      <ExternalLink size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredData.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500">Nenhum afiliado encontrado com esse nome.</p>
          </div>
        )}
      </div>
    </div>
  );
};
