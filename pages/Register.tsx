
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Briefcase, Store, CheckCircle, ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { STATES } from '../constants';
import { AccountType, ProfessionalType, ProfessionalArea, UserProfile } from '../types';
import { useAppStore } from '../store/useAppStore';

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

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { registerUser, login } = useAppStore();
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [profType, setProfType] = useState<ProfessionalType>('individual');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'professional' | 'store'>('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    state: '',
    city: '',
    cpf: '',
    birthDate: '',
    cnpj: '',
    legalName: '',
    tradeName: '',
    profArea: 'Musician' as ProfessionalArea,
    bio: '',
    website: '',
    businessHours: '',
    address: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    
    // Force lowercase and remove spaces for email
    if (e.target.name === 'email') {
      value = value.toLowerCase().replace(/\s/g, '');
    }

    setFormData({ ...formData, [e.target.name]: value });
  };

  const nextStep = () => {
    setError('');
    setStep(s => s + 1);
  };
  const prevStep = () => setStep(s => s - 1);

  const handleStep1Submit = (type: AccountType) => {
    setAccountType(type);
    nextStep();
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (accountType === 'individual') {
      await completeRegistration();
    } else {
      nextStep();
    }
  };

  const handleStep3Submit = async () => {
    await completeRegistration();
  };

  const completeRegistration = async () => {
    if (!accountType) return;
    setLoading(true);
    setError('');

    // Ensure email is clean before submitting
    const cleanEmail = formData.email.trim().toLowerCase();

    // Note: We register the user with a 'pending' plan logic if it's paid, 
    // or just set the ID. The payment flow happens next.
    const newUser: UserProfile = {
        id: '', 
        role: 'user',
        name: formData.name,
        email: cleanEmail,
        phone: formData.phone,
        state: formData.state,
        city: formData.city,
        accountType: accountType,
        createdAt: new Date(),
        isBanned: false,
        cpf: formData.cpf,
        cnpj: formData.cnpj,
        legalName: formData.legalName,
        tradeName: formData.tradeName,
        professionalArea: formData.profArea,
        bio: formData.bio,
        website: formData.website,
        // Se for individual, não tem plano. Se for pago, vamos configurar depois do checkout, 
        // mas salvamos a intenção aqui ou definimos um plano "free" inicial.
        plan: accountType === 'individual' ? undefined : 'plan-basic' 
    };

    try {
      const result = await registerUser(newUser, formData.password);
      
      if (result.success) {
        // Auto login to proceed to checkout or dashboard
        await login(cleanEmail, formData.password);

        if (accountType !== 'individual' && selectedPlan !== 'basic') {
            // Redirect to Plan Checkout if paid plan selected
            navigate(`/checkout-plano/plan-${selectedPlan}`);
        } else {
            // Free or Individual - Success Screen
            setStep(4);
        }
      } else {
        setError(result.error || 'Erro ao criar conta. Tente novamente.');
      }
    } catch (err: any) {
      console.error("Registration Error:", err);
      setError('Ocorreu um erro: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  // Render Functions

  const renderAccountTypeSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Escolha seu perfil</h1>
        <p className="text-gray-500 mt-2">Como você vai usar o MusicPlace?</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Individual */}
        <button 
          onClick={() => handleStep1Submit('individual')}
          className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-brand-500 hover:bg-brand-50 transition text-left group relative overflow-hidden"
        >
          <div className="bg-brand-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-brand-600 group-hover:bg-brand-500 group-hover:text-white transition">
            <User size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Pessoa Física</h3>
          <p className="text-sm text-gray-600">Para compradores e vendedores casuais. Compre e venda instrumentos usados.</p>
          <div className="mt-4 text-brand-600 font-bold text-sm flex items-center">
            Começar Grátis <ArrowRight size={16} className="ml-1" />
          </div>
        </button>

        {/* Professional */}
        <button 
          onClick={() => handleStep1Submit('professional')}
          className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-brand-500 hover:bg-brand-50 transition text-left group"
        >
          <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
            <Briefcase size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Profissional</h3>
          <p className="text-sm text-gray-600">Para músicos, luthiers, técnicos e prestadores de serviço. Divulgue seu trabalho.</p>
           <div className="mt-4 text-purple-600 font-bold text-sm flex items-center">
            Ver Planos <ArrowRight size={16} className="ml-1" />
          </div>
        </button>

        {/* Store */}
        <button 
          onClick={() => handleStep1Submit('store')}
          className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-brand-500 hover:bg-brand-50 transition text-left group"
        >
          <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition">
            <Store size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Lojista</h3>
          <p className="text-sm text-gray-600">Para lojas, revendas e distribuidores. Gerencie estoque e vendas ilimitadas.</p>
           <div className="mt-4 text-orange-600 font-bold text-sm flex items-center">
            Para Negócios <ArrowRight size={16} className="ml-1" />
          </div>
        </button>
      </div>

      <div className="text-center mt-8">
         <p className="text-gray-500">Já tem uma conta? <Link to="/login" className="text-brand-600 font-bold hover:underline">Fazer Login</Link></p>
      </div>
    </div>
  );

  const renderFormFields = () => (
    <form onSubmit={handleStep2Submit} className="max-w-2xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
         <button type="button" onClick={prevStep} className="text-gray-500 hover:text-gray-900 flex items-center gap-1 text-sm">
           <ArrowLeft size={16} /> Voltar
         </button>
         <span className="text-sm text-gray-400 font-medium">Passo 2 de {accountType === 'individual' ? 2 : 3}</span>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Seus Dados</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Professional Type Selection */}
      {accountType === 'professional' && (
        <div className="mb-8 bg-gray-50 p-4 rounded-xl flex gap-4">
           <label className="flex items-center gap-2 cursor-pointer">
             <input type="radio" name="ptype" checked={profType === 'individual'} onChange={() => setProfType('individual')} className="text-brand-600 focus:ring-brand-500" />
             <span className="font-medium text-gray-700">Profissional Autônomo (CPF)</span>
           </label>
           <label className="flex items-center gap-2 cursor-pointer">
             <input type="radio" name="ptype" checked={profType === 'business'} onChange={() => setProfType('business')} className="text-brand-600 focus:ring-brand-500" />
             <span className="font-medium text-gray-700">Empresa (CNPJ)</span>
           </label>
        </div>
      )}

      <div className="space-y-6">
        {/* Common Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none" 
              placeholder="nome@exemplo.com"
              required 
            />
            <p className="text-xs text-gray-500 mt-1">Sem espaços ou maiúsculas.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Celular</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="(00) 90000-0000" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select name="state" value={formData.state} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none" required>
              <option value="">Selecione</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none" required />
          </div>
        </div>

        {/* Individual Specific */}
        {accountType === 'individual' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="000.000.000-00" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none" required />
            </div>
          </div>
        )}

        {/* Professional - Individual */}
        {accountType === 'professional' && profType === 'individual' && (
          <div className="space-y-6 pt-4 border-t border-gray-100">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Área de Atuação</label>
                  <select name="profArea" value={formData.profArea} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none">
                    {PROFESSIONAL_AREAS.map(a => <option key={a} value={a}>{AREA_LABELS[a]}</option>)}
                  </select>
                </div>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Descrição Curta</label>
               <textarea name="bio" value={formData.bio} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none h-24"></textarea>
             </div>
          </div>
        )}

        {/* Business / Store */}
        {(accountType === 'store' || (accountType === 'professional' && profType === 'business')) && (
          <div className="space-y-6 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
                <input type="text" name="legalName" value={formData.legalName} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia (Loja)</label>
                <input type="text" name="tradeName" value={formData.tradeName} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                <input type="text" name="cnpj" value={formData.cnpj} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none" required />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website / Instagram</label>
                <input type="text" name="website" value={formData.website} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Comercial</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none" required />
              </div>
              <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Descrição da Empresa</label>
               <textarea name="bio" value={formData.bio} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none h-24"></textarea>
             </div>
          </div>
        )}

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-500 text-white font-bold py-4 rounded-xl hover:bg-brand-600 transition shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
               accountType === 'individual' ? 'Finalizar Cadastro' : 'Continuar para Planos'
            )}
          </button>
        </div>
      </div>
    </form>
  );

  const renderPlans = () => (
    <div className="max-w-5xl mx-auto">
       <div className="mb-8 flex items-center justify-between">
         <button type="button" onClick={prevStep} className="text-gray-500 hover:text-gray-900 flex items-center gap-1 text-sm">
           <ArrowLeft size={16} /> Voltar
         </button>
         <span className="text-sm text-gray-400 font-medium">Passo 3 de 3</span>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Escolha o Plano Ideal</h2>
        <p className="text-gray-500 mt-2">Potencialize suas vendas no MusicPlace</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Basic */}
        <div 
          className={`bg-white rounded-2xl p-8 border-2 cursor-pointer transition relative ${selectedPlan === 'basic' ? 'border-brand-500 ring-4 ring-brand-500/10' : 'border-gray-200 hover:border-gray-300'}`}
          onClick={() => setSelectedPlan('basic')}
        >
          <h3 className="text-xl font-bold text-gray-900">Plano Básico</h3>
          <div className="my-4">
            <span className="text-4xl font-extrabold text-gray-900">Grátis</span>
            <span className="text-gray-500">/sempre</span>
          </div>
          <ul className="space-y-3 text-sm text-gray-600 mb-8">
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-brand-500" /> 2 anúncios ativos</li>
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-brand-500" /> Chat com compradores</li>
          </ul>
          <div className={`w-5 h-5 rounded-full border-2 ml-auto ${selectedPlan === 'basic' ? 'bg-brand-500 border-brand-500' : 'border-gray-300'}`}></div>
        </div>

        {/* Professional */}
        <div 
          className={`bg-white rounded-2xl p-8 border-2 cursor-pointer transition relative shadow-xl transform md:-translate-y-4 ${selectedPlan === 'professional' ? 'border-brand-500 ring-4 ring-brand-500/10' : 'border-gray-200 hover:border-gray-300'}`}
          onClick={() => setSelectedPlan('professional')}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Mais Popular</div>
          <h3 className="text-xl font-bold text-gray-900">Profissional</h3>
          <div className="my-4">
            <span className="text-4xl font-extrabold text-gray-900">R$ 29,90</span>
            <span className="text-gray-500">/mês</span>
          </div>
          <ul className="space-y-3 text-sm text-gray-600 mb-8">
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-brand-500" /> 20 anúncios mensais</li>
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-brand-500" /> 2 Destaques</li>
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-brand-500" /> Estatísticas de venda</li>
          </ul>
          <div className={`w-5 h-5 rounded-full border-2 ml-auto ${selectedPlan === 'professional' ? 'bg-brand-500 border-brand-500' : 'border-gray-300'}`}></div>
        </div>

        {/* Store */}
        <div 
          className={`bg-white rounded-2xl p-8 border-2 cursor-pointer transition relative ${selectedPlan === 'store' ? 'border-brand-500 ring-4 ring-brand-500/10' : 'border-gray-200 hover:border-gray-300'}`}
          onClick={() => setSelectedPlan('store')}
        >
           <h3 className="text-xl font-bold text-gray-900">Loja Oficial</h3>
          <div className="my-4">
            <span className="text-4xl font-extrabold text-gray-900">R$ 99,90</span>
            <span className="text-gray-500">/mês</span>
          </div>
          <ul className="space-y-3 text-sm text-gray-600 mb-8">
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-brand-500" /> Anúncios Ilimitados</li>
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-brand-500" /> 10 Destaques</li>
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-brand-500" /> Página Exclusiva</li>
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-brand-500" /> Suporte Prioritário</li>
          </ul>
          <div className={`w-5 h-5 rounded-full border-2 ml-auto ${selectedPlan === 'store' ? 'bg-brand-500 border-brand-500' : 'border-gray-300'}`}></div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={handleStep3Submit} 
          disabled={loading}
          className="bg-brand-500 text-white font-bold py-4 px-12 rounded-xl hover:bg-brand-600 transition shadow-lg shadow-brand-500/20 text-lg disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin h-6 w-6 mx-auto" /> : (
              selectedPlan === 'basic' ? 'Finalizar Cadastro Grátis' : 'Ir para Pagamento'
          )}
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-12 max-w-md mx-auto">
       <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
         <CheckCircle size={40} />
       </div>
       <h2 className="text-3xl font-bold text-gray-900 mb-4">Conta Criada com Sucesso!</h2>
       <p className="text-gray-500 mb-8">
         Seja bem-vindo ao MusicPlace. Você já pode começar a {accountType === 'individual' ? 'navegar e comprar.' : 'configurar sua loja e vender.'}
       </p>
       <button onClick={() => navigate('/')} className="block w-full bg-brand-500 text-white font-bold py-4 rounded-xl hover:bg-brand-600 transition">
         Acessar Plataforma
       </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {step === 1 && renderAccountTypeSelection()}
      {step === 2 && renderFormFields()}
      {step === 3 && renderPlans()}
      {step === 4 && renderSuccess()}
    </div>
  );
};
