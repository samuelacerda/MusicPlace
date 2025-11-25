
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Ban, CheckCircle, Search, Plus, X, User, Briefcase, Store, Edit2 } from 'lucide-react';
import { UserProfile, AccountType, ProfessionalArea, ProfessionalType } from '../../types';
import { STATES } from '../../constants';

const PROFESSIONAL_AREAS: ProfessionalArea[] = [
  'Musician', 'Luthier', 'AudioTechnician', 'MusicProducer', 'DJ', 'Builder', 'Other'
];

const AREA_LABELS: Record<ProfessionalArea, string> = {
  Musician: 'Músico',
  Luthier: 'Luthier',
  AudioTechnician: 'Técnico de Áudio',
  MusicProducer: 'Produtor Musical',
  DJ: 'DJ',
  Builder: 'Fabricante (Handmade)',
  Other: 'Outro'
};

export const AdminUsers: React.FC = () => {
  const { users, banUser, unbanUser, adminCreateUser, updateProfile } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // New User Form State
  const initialFormState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user' as 'user' | 'admin',
    accountType: 'individual' as AccountType,
    profType: 'individual' as ProfessionalType,
    profArea: 'Musician' as ProfessionalArea,
    state: '',
    city: '',
    cpf: '',
    birthDate: '',
    cnpj: '',
    legalName: '',
    tradeName: '',
    bio: '',
    website: '',
    address: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const openCreateModal = () => {
      setFormData(initialFormState);
      setIsEditing(false);
      setEditingUserId(null);
      setIsModalOpen(true);
  }

  const openEditModal = (user: UserProfile) => {
      setFormData({
          ...initialFormState,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role,
          accountType: user.accountType,
          state: user.state || '',
          city: user.city || '',
          cpf: user.cpf || '',
          birthDate: user.birthDate || '',
          cnpj: user.cnpj || '',
          legalName: user.legalName || '',
          tradeName: user.tradeName || '',
          bio: user.bio || '',
          website: user.website || '',
          profArea: user.professionalArea || 'Musician',
          profType: user.cnpj ? 'business' : 'individual',
          // Passwords are not pre-filled for security
          password: '',
          confirmPassword: ''
      });
      setIsEditing(true);
      setEditingUserId(user.id);
      setIsModalOpen(true);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
        alert("As senhas não coincidem.");
        return;
    }

    if (isEditing && editingUserId) {
        // UPDATE MODE
        const updates: Partial<UserProfile> = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            accountType: formData.accountType,
            state: formData.state,
            city: formData.city,
            cpf: formData.cpf,
            birthDate: formData.birthDate,
            cnpj: formData.cnpj,
            legalName: formData.legalName,
            tradeName: formData.tradeName,
            professionalArea: formData.accountType === 'professional' ? formData.profArea : undefined,
            bio: formData.bio,
            website: formData.website,
        };
        // Only update plan if changing account type
        if (formData.accountType === 'store') updates.plan = 'plan-store';
        
        updateProfile(editingUserId, updates);
        alert('Usuário atualizado com sucesso!');

    } else {
        // CREATE MODE
        const user: UserProfile = {
            id: Date.now().toString(),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            accountType: formData.accountType,
            state: formData.state,
            city: formData.city,
            createdAt: new Date().toISOString(),
            isBanned: false,
            cpf: formData.cpf,
            birthDate: formData.birthDate,
            cnpj: formData.cnpj,
            legalName: formData.legalName,
            tradeName: formData.tradeName,
            professionalArea: formData.accountType === 'professional' ? formData.profArea : undefined,
            bio: formData.bio,
            website: formData.website,
            plan: formData.accountType === 'store' ? 'plan-store' : formData.accountType === 'professional' ? 'plan-pro' : undefined
        };
        adminCreateUser(user);
        alert('Usuário criado com sucesso!');
    }

    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
         <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
         <button 
           onClick={openCreateModal}
           className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-700 shadow-sm w-full md:w-auto justify-center"
         >
           <Plus size={18} /> Novo Usuário
         </button>
      </div>

      {/* Modal (Create / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                 <h3 className="font-bold text-xl text-gray-900">{isEditing ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
              </div>
              
              <div className="overflow-y-auto p-6 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Account Type Selector */}
                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, accountType: 'individual'})}
                            className={`p-2 md:p-3 rounded-lg border-2 text-center transition flex flex-col items-center gap-2 ${formData.accountType === 'individual' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600'}`}
                        >
                            <User size={20} />
                            <span className="text-[10px] md:text-xs font-bold">Pessoa Física</span>
                        </button>
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, accountType: 'professional'})}
                            className={`p-2 md:p-3 rounded-lg border-2 text-center transition flex flex-col items-center gap-2 ${formData.accountType === 'professional' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600'}`}
                        >
                            <Briefcase size={20} />
                            <span className="text-[10px] md:text-xs font-bold">Profissional</span>
                        </button>
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, accountType: 'store'})}
                            className={`p-2 md:p-3 rounded-lg border-2 text-center transition flex flex-col items-center gap-2 ${formData.accountType === 'store' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600'}`}
                        >
                            <Store size={20} />
                            <span className="text-[10px] md:text-xs font-bold">Loja</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                            <input type="text" required className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" required className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Telefone / WhatsApp</label>
                            <input type="text" required className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                        
                        <div className="col-span-1 md:col-span-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                           <p className="text-xs text-yellow-800 mb-2 font-bold">{isEditing ? 'Alterar Senha (Opcional)' : 'Definir Senha'}</p>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Senha</label>
                                    <input type="password" required={!isEditing} className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
                                    <input type="password" required={!isEditing} className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
                                </div>
                           </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Permissão do Sistema</label>
                            <select className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})}>
                                <option value="user">Usuário Padrão</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                    </div>

                    {/* Conditional Fields */}
                    {/* ... existing logic for conditional fields ... */}
                    {formData.accountType === 'individual' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">CPF</label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Data Nascimento</label>
                                <input type="date" className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
                            </div>
                        </div>
                    )}

                    {/* Address */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700">UF</label>
                            <select className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})}>
                                <option value="">Selecione</option>
                                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Cidade</label>
                            <input type="text" required className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-brand-600 text-white font-bold py-3 rounded-lg hover:bg-brand-700 mt-4 shadow-md">
                        {isEditing ? 'Atualizar Dados' : 'Criar Conta'}
                    </button>
                </form>
              </div>
           </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
           <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Buscar usuário..." 
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-brand-500 bg-white text-gray-900" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>
        
        {/* TABLE WRAPPER FOR HORIZONTAL SCROLL */}
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm text-gray-600 min-w-[1000px]">
            <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
                <tr>
                <th className="p-4 whitespace-nowrap">Nome</th>
                <th className="p-4 whitespace-nowrap">Email</th>
                <th className="p-4 whitespace-nowrap">Tipo</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 text-right whitespace-nowrap">Ações</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{user.name}</td>
                    <td className="p-4 whitespace-nowrap">{user.email}</td>
                    <td className="p-4 capitalize whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                        user.accountType === 'store' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                        user.accountType === 'professional' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                        'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                        {user.accountType === 'individual' ? 'Pessoa Física' : user.accountType === 'store' ? 'Loja' : 'Profissional'}
                    </span>
                    {user.role === 'admin' && <span className="ml-2 bg-gray-800 text-white px-2 py-1 rounded-full text-xs border border-gray-600">Admin</span>}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                    {user.isBanned ? (
                        <span className="text-red-600 font-bold flex items-center gap-1 bg-red-50 px-2 py-1 rounded-full w-fit"><Ban size={14}/> Banido</span>
                    ) : (
                        <span className="text-green-600 font-bold flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full w-fit"><CheckCircle size={14}/> Ativo</span>
                    )}
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2 whitespace-nowrap">
                        <button 
                            onClick={() => openEditModal(user)} 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100 transition"
                            title="Editar Dados"
                        >
                            <Edit2 size={16} />
                        </button>
                        {user.role !== 'admin' && (
                            <button 
                            onClick={() => user.isBanned ? unbanUser(user.id) : banUser(user.id)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition border ${user.isBanned ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'}`}
                            >
                            {user.isBanned ? 'Reativar' : 'Banir'}
                            </button>
                        )}
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
