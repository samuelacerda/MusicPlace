
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Ban, CheckCircle, Search, Plus, X, User, Briefcase, Store } from 'lucide-react';
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
  const { users, banUser, unbanUser, adminCreateUser } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const [newUser, setNewUser] = useState(initialFormState);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (newUser.password !== newUser.confirmPassword) {
        alert("As senhas não coincidem.");
        return;
    }

    const user: UserProfile = {
       id: Date.now().toString(),
       name: newUser.name,
       email: newUser.email,
       phone: newUser.phone,
       role: newUser.role,
       accountType: newUser.accountType,
       state: newUser.state,
       city: newUser.city,
       createdAt: new Date().toISOString(),
       isBanned: false,
       // Optional Fields based on type
       cpf: newUser.cpf,
       birthDate: newUser.birthDate,
       cnpj: newUser.cnpj,
       legalName: newUser.legalName,
       tradeName: newUser.tradeName,
       professionalArea: newUser.accountType === 'professional' ? newUser.profArea : undefined,
       bio: newUser.bio,
       website: newUser.website,
       // Admin created users might get a default plan or handle via update
       plan: newUser.accountType === 'store' ? 'plan-store' : newUser.accountType === 'professional' ? 'plan-pro' : undefined
    };

    adminCreateUser(user);
    setIsModalOpen(false);
    setNewUser(initialFormState);
    alert('Usuário criado com sucesso!');
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-700 shadow-sm"
         >
           <Plus size={18} /> Novo Usuário
         </button>
      </div>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                 <h3 className="font-bold text-xl text-gray-900">Cadastrar Novo Usuário</h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
              </div>
              
              <div className="overflow-y-auto p-6">
                <form onSubmit={handleCreateUser} className="space-y-6">
                    
                    {/* Account Type Selector */}
                    <div className="grid grid-cols-3 gap-4">
                        <button 
                            type="button"
                            onClick={() => setNewUser({...newUser, accountType: 'individual'})}
                            className={`p-3 rounded-lg border-2 text-center transition flex flex-col items-center gap-2 ${newUser.accountType === 'individual' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600'}`}
                        >
                            <User size={20} />
                            <span className="text-xs font-bold">Pessoa Física</span>
                        </button>
                        <button 
                            type="button"
                            onClick={() => setNewUser({...newUser, accountType: 'professional'})}
                            className={`p-3 rounded-lg border-2 text-center transition flex flex-col items-center gap-2 ${newUser.accountType === 'professional' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600'}`}
                        >
                            <Briefcase size={20} />
                            <span className="text-xs font-bold">Profissional</span>
                        </button>
                        <button 
                            type="button"
                            onClick={() => setNewUser({...newUser, accountType: 'store'})}
                            className={`p-3 rounded-lg border-2 text-center transition flex flex-col items-center gap-2 ${newUser.accountType === 'store' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600'}`}
                        >
                            <Store size={20} />
                            <span className="text-xs font-bold">Loja</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                            <input type="text" required className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" required className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Telefone / WhatsApp</label>
                            <input type="text" required className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Senha</label>
                            <input type="password" required className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
                            <input type="password" required className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={newUser.confirmPassword} onChange={e => setNewUser({...newUser, confirmPassword: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Permissão do Sistema</label>
                            <select className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as any})}>
                                <option value="user">Usuário Padrão</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                    </div>

                    {/* Conditional Fields - Individual */}
                    {newUser.accountType === 'individual' && (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">CPF</label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={newUser.cpf} onChange={e => setNewUser({...newUser, cpf: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Data Nascimento</label>
                                <input type="date" className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={newUser.birthDate} onChange={e => setNewUser({...newUser, birthDate: e.target.value})} />
                            </div>
                        </div>
                    )}

                    {/* Conditional Fields - Professional */}
                    {newUser.accountType === 'professional' && (
                        <div className="pt-4 border-t border-gray-100 space-y-4">
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" checked={newUser.profType === 'individual'} onChange={() => setNewUser({...newUser, profType: 'individual'})} />
                                    <span className="text-sm">Autônomo (CPF)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" checked={newUser.profType === 'business'} onChange={() => setNewUser({...newUser, profType: 'business'})} />
                                    <span className="text-sm">Empresa (CNPJ)</span>
                                </label>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{newUser.profType === 'individual' ? 'CPF' : 'CNPJ'}</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={newUser.profType === 'individual' ? newUser.cpf : newUser.cnpj} onChange={e => setNewUser(newUser.profType === 'individual' ? {...newUser, cpf: e.target.value} : {...newUser, cnpj: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Área de Atuação</label>
                                    <select className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={newUser.profArea} onChange={e => setNewUser({...newUser, profArea: e.target.value as ProfessionalArea})}>
                                        {PROFESSIONAL_AREAS.map(a => <option key={a} value={a}>{AREA_LABELS[a]}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bio / Descrição</label>
                                <textarea className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 h-20" value={newUser.bio} onChange={e => setNewUser({...newUser, bio: e.target.value})}></textarea>
                            </div>
                        </div>
                    )}

                    {/* Conditional Fields - Store */}
                    {(newUser.accountType === 'store' || (newUser.accountType === 'professional' && newUser.profType === 'business')) && (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Razão Social</label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={newUser.legalName} onChange={e => setNewUser({...newUser, legalName: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nome Fantasia</label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={newUser.tradeName} onChange={e => setNewUser({...newUser, tradeName: e.target.value})} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">CNPJ</label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={newUser.cnpj} onChange={e => setNewUser({...newUser, cnpj: e.target.value})} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Website</label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={newUser.website} onChange={e => setNewUser({...newUser, website: e.target.value})} />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Endereço</label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={newUser.address} onChange={e => setNewUser({...newUser, address: e.target.value})} />
                            </div>
                        </div>
                    )}

                    {/* Address */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">UF</label>
                            <select className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={newUser.state} onChange={e => setNewUser({...newUser, state: e.target.value})}>
                                <option value="">Selecione</option>
                                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Cidade</label>
                            <input type="text" required className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900" value={newUser.city} onChange={e => setNewUser({...newUser, city: e.target.value})} />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-brand-600 text-white font-bold py-3 rounded-lg hover:bg-brand-700 mt-4">
                        Criar Conta
                    </button>
                </form>
              </div>
           </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
           <div className="relative w-64">
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
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
            <tr>
              <th className="p-4">Nome</th>
              <th className="p-4">Email</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4 capitalize">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.accountType === 'store' ? 'bg-orange-100 text-orange-700' : 
                    user.accountType === 'professional' ? 'bg-purple-100 text-purple-700' : 
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {user.accountType === 'individual' ? 'Pessoa Física' : user.accountType === 'store' ? 'Loja' : 'Profissional'}
                  </span>
                  {user.role === 'admin' && <span className="ml-2 bg-gray-800 text-white px-2 py-1 rounded-full text-xs">Admin</span>}
                </td>
                <td className="p-4">
                   {user.isBanned ? (
                     <span className="text-red-600 font-bold flex items-center gap-1"><Ban size={14}/> Banido</span>
                   ) : (
                     <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={14}/> Ativo</span>
                   )}
                </td>
                <td className="p-4 text-right">
                  {user.role !== 'admin' && (
                    <button 
                      onClick={() => user.isBanned ? unbanUser(user.id) : banUser(user.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-md transition ${user.isBanned ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
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
  );
};
