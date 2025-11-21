
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Plus, Trash2, Edit2, CheckCircle, XCircle, CreditCard, Check } from 'lucide-react';
import { Plan } from '../../types';

export const AdminPlans: React.FC = () => {
  const { plans, addPlan, updatePlan, deletePlan } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const initialForm: Plan = {
    id: '',
    name: '',
    description: '',
    price: 0,
    duration: 'monthly',
    adLimit: 5,
    featuredLimit: 0,
    targetAudience: 'all',
    benefits: [],
    active: true
  };

  const [formData, setFormData] = useState<Plan>(initialForm);
  const [tempBenefit, setTempBenefit] = useState('');

  const handleEdit = (plan: Plan) => {
    setFormData(plan);
    setEditingId(plan.id);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setFormData({ ...initialForm, id: Date.now().toString() });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updatePlan(editingId, formData);
    } else {
      addPlan({ ...formData, id: Date.now().toString() });
    }
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza?')) deletePlan(id);
  };

  const addBenefit = () => {
    if (tempBenefit.trim()) {
      setFormData({ ...formData, benefits: [...formData.benefits, tempBenefit.trim()] });
      setTempBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    const newBenefits = [...formData.benefits];
    newBenefits.splice(index, 1);
    setFormData({ ...formData, benefits: newBenefits });
  };

  const getDurationLabel = (duration: string) => {
    switch (duration) {
      case 'monthly': return 'mês';
      case 'quarterly': return 'trimestre';
      case 'yearly': return 'ano';
      case '15_days': return '15 dias';
      default: return duration;
    }
  };

  if (isEditing) {
    return (
      <div className="max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{editingId ? 'Editar Plano' : 'Novo Plano'}</h1>
          <button onClick={() => setIsEditing(false)} className="text-gray-500">Cancelar</button>
        </div>
        <form onSubmit={handleSave} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Plano</label>
               <input type="text" required className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
               <input type="number" step="0.01" required className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
             </div>
           </div>

           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Curta</label>
              <input type="text" required className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Duração</label>
               <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value as any})}>
                 <option value="monthly">Mensal</option>
                 <option value="quarterly">Trimestral</option>
                 <option value="yearly">Anual</option>
                 <option value="15_days">Quinzenal (15 dias)</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Limite de Anúncios</label>
               <input type="number" className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.adLimit} onChange={e => setFormData({...formData, adLimit: parseInt(e.target.value)})} />
               <span className="text-xs text-gray-500">-1 para ilimitado</span>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Destaques Incluídos</label>
               <input type="number" className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.featuredLimit} onChange={e => setFormData({...formData, featuredLimit: parseInt(e.target.value)})} />
             </div>
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Público Alvo</label>
             <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.targetAudience} onChange={e => setFormData({...formData, targetAudience: e.target.value as any})}>
               <option value="all">Todos</option>
               <option value="individual">Pessoa Física</option>
               <option value="professional">Profissional</option>
               <option value="store">Lojista</option>
             </select>
           </div>

           {/* Benefits */}
           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Benefícios (Lista)</label>
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  className="flex-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-900" 
                  placeholder="Novo Benefício"
                  value={tempBenefit}
                  onChange={e => setTempBenefit(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                />
                <button type="button" onClick={addBenefit} className="bg-brand-600 text-white px-4 rounded-lg font-bold">Add</button>
              </div>
              <ul className="space-y-2">
                {formData.benefits.map((ben, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-gray-200 text-sm">
                    <div className="flex items-center gap-2"><Check size={14} className="text-green-500"/> {ben}</div>
                    <button type="button" onClick={() => removeBenefit(idx)} className="text-red-500 hover:text-red-700"><XCircle size={16}/></button>
                  </li>
                ))}
              </ul>
            </div>

           <div className="flex items-center gap-2">
              <input type="checkbox" id="active" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="h-5 w-5 text-brand-600 rounded" />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">Plano Ativo</label>
           </div>

           <button type="submit" className="w-full bg-brand-600 text-white py-4 rounded-lg font-bold hover:bg-brand-700">Salvar Plano</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planos de Assinatura</h1>
          <p className="text-gray-500">Gerencie os níveis de acesso da plataforma.</p>
        </div>
        <button onClick={handleCreate} className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-700">
          <Plus size={18} /> Novo Plano
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {plans.map(plan => (
           <div key={plan.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col ${plan.active ? 'border-gray-200' : 'border-red-200 bg-red-50 opacity-75'}`}>
              <div className="p-6 flex-1">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-brand-100 text-brand-600 rounded-lg"><CreditCard size={24} /></div>
                    {!plan.active && <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded">Inativo</span>}
                 </div>
                 <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                 <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                 <div className="text-2xl font-bold text-gray-900 mb-6">
                    R$ {plan.price.toFixed(2)} <span className="text-sm font-normal text-gray-500">/{getDurationLabel(plan.duration)}</span>
                 </div>
                 <ul className="space-y-2 mb-6">
                    {plan.benefits.slice(0, 4).map((ben, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                        <CheckCircle size={14} className="text-green-500 shrink-0" />
                        {ben}
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                 <button onClick={() => handleEdit(plan)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100">
                    <Edit2 size={16} /> Editar
                 </button>
                 <button onClick={() => handleDelete(plan.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg">
                    <Trash2 size={20} />
                 </button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};
