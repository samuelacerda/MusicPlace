
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Users, ShoppingBag, DollarSign, AlertTriangle, Download, TrendingUp, BarChart2, Calendar } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { users, products } = useAppStore();
  const navigate = useNavigate();
  const [filterPeriod, setFilterPeriod] = useState<'week' | 'month'>('week');

  const pendingProducts = products.filter(p => p.status === 'pending').length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const totalUsers = users.length;
  const stores = users.filter(u => u.accountType === 'store').length;

  // Mock Data Generators based on Filter
  const generateData = (type: 'week' | 'month') => {
      if (type === 'week') {
        return [
            { label: 'Seg', sales: 12, visits: 150 },
            { label: 'Ter', sales: 19, visits: 220 },
            { label: 'Qua', sales: 15, visits: 180 },
            { label: 'Qui', sales: 25, visits: 310 },
            { label: 'Sex', sales: 32, visits: 400 },
            { label: 'Sab', sales: 45, visits: 520 },
            { label: 'Dom', sales: 28, visits: 380 },
        ];
      } else {
        return [
            { label: 'Sem 1', sales: 80, visits: 1200 },
            { label: 'Sem 2', sales: 120, visits: 1500 },
            { label: 'Sem 3', sales: 95, visits: 1100 },
            { label: 'Sem 4', sales: 150, visits: 2100 },
        ];
      }
  };

  const chartData = generateData(filterPeriod);
  const maxVisits = Math.max(...chartData.map(d => d.visits));
  const maxSales = Math.max(...chartData.map(d => d.sales));

  const handleExport = () => {
    // Generate HTML Table for XLS export (Standard Excel readable format)
    const headers = ['Período', 'Vendas', 'Visitas'];
    const tableRows = chartData.map(row => `<tr><td>${row.label}</td><td>${row.sales}</td><td>${row.visits}</td></tr>`).join('');
    
    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
          <x:ExcelWorksheet>
            <x:Name>Relatório ${filterPeriod === 'week' ? 'Semanal' : 'Mensal'}</x:Name>
            <x:WorksheetOptions>
            <x:DisplayGridlines/>
            </x:WorksheetOptions>
          </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      </head>
      <body>
        <table>
          <thead>
            <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    // Create download link
    const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_musicplace_${filterPeriod}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Visão Geral da Plataforma</h1>
        <div className="flex gap-2">
            <div className="flex bg-white border border-gray-300 rounded-lg p-1">
                <button 
                    onClick={() => setFilterPeriod('week')}
                    className={`px-3 py-1 text-sm font-medium rounded ${filterPeriod === 'week' ? 'bg-brand-100 text-brand-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    Semana
                </button>
                <button 
                    onClick={() => setFilterPeriod('month')}
                    className={`px-3 py-1 text-sm font-medium rounded ${filterPeriod === 'month' ? 'bg-brand-100 text-brand-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    Mês
                </button>
            </div>
            <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition shadow-sm"
            >
            <Download size={18} /> Exportar Excel
            </button>
        </div>
      </div>
      
      {/* Clickable KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div onClick={() => navigate('/admin/users')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition group">
           <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                <Users size={24} />
              </div>
              <span className="text-green-500 text-sm font-bold">+12%</span>
           </div>
           <h3 className="text-gray-500 text-sm font-medium">Total de Usuários</h3>
           <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
           <p className="text-xs text-gray-400 mt-1">{stores} Lojas Ativas</p>
        </div>

        <div onClick={() => navigate('/admin/listings')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition group">
           <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition">
                <ShoppingBag size={24} />
              </div>
           </div>
           <h3 className="text-gray-500 text-sm font-medium">Anúncios Ativos</h3>
           <p className="text-3xl font-bold text-gray-900">{activeProducts}</p>
        </div>

        <div onClick={() => navigate('/admin/listings')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition group">
           <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg group-hover:bg-yellow-600 group-hover:text-white transition">
                <AlertTriangle size={24} />
              </div>
              {pendingProducts > 0 && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">Ação Necessária</span>}
           </div>
           <h3 className="text-gray-500 text-sm font-medium">Anúncios Pendentes</h3>
           <p className="text-3xl font-bold text-gray-900">{pendingProducts}</p>
        </div>

        <div onClick={() => navigate('/admin/plans')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition group">
           <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition">
                <DollarSign size={24} />
              </div>
           </div>
           <h3 className="text-gray-500 text-sm font-medium">Receita Estimada (Mês)</h3>
           <p className="text-3xl font-bold text-gray-900">R$ 12.450</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Vendas Semanais (Tower Chart - Blue Bars) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                 <BarChart2 className="text-blue-600" size={20} /> Vendas {filterPeriod === 'week' ? 'Semanais' : 'Mensais'}
              </h2>
           </div>
           <div className="h-64 flex items-end justify-between gap-4 px-2">
              {chartData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1 group h-full justify-end">
                   <div className="relative w-full flex items-end justify-center h-full">
                        <div 
                            className="w-full max-w-[40px] bg-blue-600 rounded-t-md hover:bg-blue-700 transition-all relative"
                            style={{ height: `${(data.sales / maxSales) * 100}%` }}
                        >
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                            {data.sales} vendas
                            </span>
                        </div>
                   </div>
                   <span className="text-xs text-gray-500 mt-3 font-medium">{data.label}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Visitas ao Site (Bar Chart - Black Bars) - Changed from Line to Tower/Bar as requested */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                 <TrendingUp className="text-gray-800" size={20} /> Visitas ao Site
              </h2>
           </div>
           <div className="h-64 flex items-end justify-between gap-4 px-2">
              {chartData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1 group h-full justify-end">
                   <div className="relative w-full flex items-end justify-center h-full">
                        <div 
                            className="w-full max-w-[40px] bg-gray-900 rounded-t-md hover:bg-black transition-all relative"
                            style={{ height: `${(data.visits / maxVisits) * 100}%` }}
                        >
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                            {data.visits} visitas
                            </span>
                        </div>
                   </div>
                   <span className="text-xs text-gray-500 mt-3 font-medium">{data.label}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
