
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Plus, Trash2, Ticket, Edit2 } from 'lucide-react';
import { Coupon } from '../../types';

export const AdminCoupons: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialForm: Coupon = {
    id: '',
    code: '',
    discountType: 'percentage',
    value: 0,
    usageCount: 0,
    active: true,
    applicablePlans: ['all']
  };

  const [formData, setFormData] = useState<Coupon>(initialForm);

  const handleEdit = (c: Coupon) => {
    setFormData(c);
    setEditingId(c.id);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setFormData({ ...initialForm, id: Date.now().toString() });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Auto-uppercase code
    const data = { ...formData, code: formData.code.toUpperCase() };
    if (editingId) {
      updateCoupon(editingId, data);
    } else {
      addCoupon({ ...data, id: Date.now().toString() });
    }
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Excluir cupom?')) deleteCoupon(id);
  };

  if (isEditing) {
    return (
      <div className="max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{editingId ? 'Editar Cupom' : 'Novo Cupom'}</h1>
          <button onClick={() => setIsEditing(false)} className="text-gray-500">Cancelar</button>
        </div>
        <form onSubmit={handleSave} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código do Cupom</label>
              <input type="text" required className="w-full p-3 border border-gray-300 rounded-lg uppercase font-mono bg-white text-gray-900" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="EX: BLACKFRIDAY" />
           </div>
           
           <div className="grid grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Desconto</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value as any})}>
                  <option value="percentage">Porcentagem (%)</option>
                  <option value="fixed">Fixed Value ($)</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Desconto</label>
                <input type="number" required className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.value} onChange={e => setFormData({...formData, value: parseFloat(e.target.value)})} />
             </div>
           </div>

           <div className="flex items-center gap-2">
              <input type="checkbox" id="active" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="h-5 w-5 text-brand-600 rounded" />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">Cupom Ativo</label>
           </div>

           <button type="submit" className="w-full bg-brand-600 text-white py-4 rounded-lg font-bold hover:bg-brand-700">Salvar Cupom</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cupons de Desconto</h1>
          <p className="text-gray-500">Crie códigos promocionais para alavancar vendas.</p>
        </div>
        <button onClick={handleCreate} className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-700">
          <Plus size={18} /> Novo Cupom
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
                <tr>
                    <th className="p-4 whitespace-nowrap">Código</th>
                    <th className="p-4 whitespace-nowrap">Desconto</th>
                    <th className="p-4 whitespace-nowrap">Usos</th>
                    <th className="p-4 whitespace-nowrap">Status</th>
                    <th className="p-4 text-right whitespace-nowrap">Ações</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {coupons.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                        <td className="p-4">
                            <span className="font-mono font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded border border-brand-100">
                                {c.code}
                            </span>
                        </td>
                        <td className="p-4 font-medium">{c.value} {c.discountType === 'percentage' ? '%' : '$'}</td>
                        <td className="p-4 text-gray-500">{c.usageCount} vezes</td>
                        <td className="p-4">
                        {c.active ? 
                            <span className="text-green-700 font-bold text-xs bg-green-100 px-2 py-1 rounded-full border border-green-200">Ativo</span> : 
                            <span className="text-red-700 font-bold text-xs bg-red-100 px-2 py-1 rounded-full border border-red-200">Inativo</span>
                        }
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                            <button onClick={() => handleEdit(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded border border-transparent hover:border-blue-100 transition"><Edit2 size={16}/></button>
                            <button onClick={() => handleDelete(c.id)} className="p-2 text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-100 transition"><Trash2 size={16}/></button>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
