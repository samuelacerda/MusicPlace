
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Save, Palette, Layout, Globe, PlusCircle, MinusCircle } from 'lucide-react';

export const AdminTheme: React.FC = () => {
  const { theme, updateTheme } = useAppStore();
  const [localTheme, setLocalTheme] = useState(theme);

  const handleSave = () => {
    updateTheme(localTheme);
    alert('Personalização salva com sucesso!');
  };

  // Helper for social links
  const updateSocialLink = (index: number, field: 'label' | 'url' | 'icon', value: string) => {
    const newLinks = [...localTheme.footer.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLocalTheme({ ...localTheme, footer: { ...localTheme.footer, socialLinks: newLinks } });
  };

  const addSocialLink = () => {
    setLocalTheme({
      ...localTheme,
      footer: {
        ...localTheme.footer,
        socialLinks: [...localTheme.footer.socialLinks, { label: 'Nova Rede', url: '#', icon: 'Globe' }]
      }
    });
  };

  const removeSocialLink = (index: number) => {
    const newLinks = localTheme.footer.socialLinks.filter((_, i) => i !== index);
    setLocalTheme({ ...localTheme, footer: { ...localTheme.footer, socialLinks: newLinks } });
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personalização do Site</h1>
          <p className="text-gray-500">Defina as cores e a identidade visual do marketplace.</p>
        </div>
        <button onClick={handleSave} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-700 shadow-lg">
          <Save size={20} /> Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* SECTION A: SITE COLORS */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
           <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
             <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Palette size={20} /></div>
             Cores do Site
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Cor Primária</label>
                 <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={localTheme.primaryColor}
                      onChange={(e) => setLocalTheme({...localTheme, primaryColor: e.target.value})}
                      className="h-12 w-12 rounded-lg cursor-pointer border border-gray-300 bg-white p-1 shadow-sm"
                    />
                    <input 
                      type="text" 
                      value={localTheme.primaryColor}
                      onChange={(e) => setLocalTheme({...localTheme, primaryColor: e.target.value})}
                      className="flex-1 border border-gray-300 bg-white text-gray-900 rounded-lg p-3 uppercase font-mono shadow-sm"
                    />
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Cor Secundária</label>
                 <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={localTheme.secondaryColor}
                      onChange={(e) => setLocalTheme({...localTheme, secondaryColor: e.target.value})}
                      className="h-12 w-12 rounded-lg cursor-pointer border border-gray-300 bg-white p-1 shadow-sm"
                    />
                    <input 
                      type="text" 
                      value={localTheme.secondaryColor}
                      onChange={(e) => setLocalTheme({...localTheme, secondaryColor: e.target.value})}
                      className="flex-1 border border-gray-300 bg-white text-gray-900 rounded-lg p-3 uppercase font-mono shadow-sm"
                    />
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Cor de Fundo (Global)</label>
                 <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={localTheme.backgroundColor}
                      onChange={(e) => setLocalTheme({...localTheme, backgroundColor: e.target.value})}
                      className="h-12 w-12 rounded-lg cursor-pointer border border-gray-300 bg-white p-1 shadow-sm"
                    />
                    <input 
                      type="text" 
                      value={localTheme.backgroundColor}
                      onChange={(e) => setLocalTheme({...localTheme, backgroundColor: e.target.value})}
                      className="flex-1 border border-gray-300 bg-white text-gray-900 rounded-lg p-3 uppercase font-mono shadow-sm"
                    />
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Cor do Texto (Global)</label>
                 <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={localTheme.textColor}
                      onChange={(e) => setLocalTheme({...localTheme, textColor: e.target.value})}
                      className="h-12 w-12 rounded-lg cursor-pointer border border-gray-300 bg-white p-1 shadow-sm"
                    />
                    <input 
                      type="text" 
                      value={localTheme.textColor}
                      onChange={(e) => setLocalTheme({...localTheme, textColor: e.target.value})}
                      className="flex-1 border border-gray-300 bg-white text-gray-900 rounded-lg p-3 uppercase font-mono shadow-sm"
                    />
                 </div>
              </div>
           </div>
        </section>

        {/* SECTION B: HEADER */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
               <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Layout size={20} /></div>
               Cabeçalho
             </h2>
             <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                <input 
                  type="checkbox" 
                  checked={localTheme.header.visible} 
                  onChange={(e) => setLocalTheme({...localTheme, header: { ...localTheme.header, visible: e.target.checked }})} 
                  className="h-5 w-5 text-brand-600 rounded"
                />
                <span className="font-medium text-gray-900">Exibir Cabeçalho</span>
             </label>
           </div>

           <div className="space-y-6">
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (Opcional)</label>
                 <input 
                   type="text" 
                   placeholder="https://..." 
                   className="w-full p-3 border border-gray-300 bg-white text-gray-900 rounded-lg shadow-sm"
                   value={localTheme.header.logoUrl}
                   onChange={(e) => setLocalTheme({...localTheme, header: { ...localTheme.header, logoUrl: e.target.value }})}
                 />
                 <p className="text-xs text-gray-500 mt-1">Se vazio, será exibido o nome do site.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cor de Fundo</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={localTheme.header.backgroundColor} 
                        onChange={(e) => setLocalTheme({...localTheme, header: { ...localTheme.header, backgroundColor: e.target.value }})}
                        className="h-10 w-12 rounded cursor-pointer border border-gray-300 bg-white p-1"
                      />
                      <input type="text" value={localTheme.header.backgroundColor} readOnly className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 font-mono text-sm" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cor do Texto</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={localTheme.header.textColor} 
                        onChange={(e) => setLocalTheme({...localTheme, header: { ...localTheme.header, textColor: e.target.value }})}
                        className="h-10 w-12 rounded cursor-pointer border border-gray-300 bg-white p-1"
                      />
                      <input type="text" value={localTheme.header.textColor} readOnly className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 font-mono text-sm" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cor dos Links</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={localTheme.header.linksColor} 
                        onChange={(e) => setLocalTheme({...localTheme, header: { ...localTheme.header, linksColor: e.target.value }})}
                        className="h-10 w-12 rounded cursor-pointer border border-gray-300 bg-white p-1"
                      />
                      <input type="text" value={localTheme.header.linksColor} readOnly className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 font-mono text-sm" />
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* SECTION C: FOOTER */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
           <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
             <div className="p-2 bg-gray-100 text-gray-600 rounded-lg"><Globe size={20} /></div>
             Rodapé
           </h2>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Cor de Fundo</label>
                 <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={localTheme.footer.backgroundColor} 
                      onChange={(e) => setLocalTheme({...localTheme, footer: { ...localTheme.footer, backgroundColor: e.target.value }})}
                      className="h-10 w-12 rounded cursor-pointer border border-gray-300 bg-white p-1"
                    />
                    <input type="text" value={localTheme.footer.backgroundColor} readOnly className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 font-mono text-sm" />
                 </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Cor do Texto</label>
                 <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={localTheme.footer.textColor} 
                      onChange={(e) => setLocalTheme({...localTheme, footer: { ...localTheme.footer, textColor: e.target.value }})}
                      className="h-10 w-12 rounded cursor-pointer border border-gray-300 bg-white p-1"
                    />
                    <input type="text" value={localTheme.footer.textColor} readOnly className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 font-mono text-sm" />
                 </div>
              </div>
           </div>

           <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Texto de Copyright</label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-300 bg-white text-gray-900 rounded-lg shadow-sm"
                value={localTheme.footer.copyrightText}
                onChange={(e) => setLocalTheme({...localTheme, footer: { ...localTheme.footer, copyrightText: e.target.value }})}
              />
           </div>

           <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-gray-900">Redes Sociais</h3>
                 <button onClick={addSocialLink} className="text-brand-600 text-sm font-bold flex items-center gap-1 hover:underline">
                    <PlusCircle size={16} /> Adicionar Rede
                 </button>
              </div>
              
              {localTheme.footer.socialLinks.map((link, idx) => (
                 <div key={idx} className="flex gap-4 mb-3 items-center">
                    <input 
                      type="text" 
                      placeholder="Ícone (Ex: Instagram)" 
                      className="w-1/4 p-2 border border-gray-300 bg-white text-gray-900 rounded"
                      value={link.icon}
                      onChange={(e) => updateSocialLink(idx, 'icon', e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="Nome (Label)" 
                      className="w-1/4 p-2 border border-gray-300 bg-white text-gray-900 rounded"
                      value={link.label}
                      onChange={(e) => updateSocialLink(idx, 'label', e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="URL (https://...)" 
                      className="flex-1 p-2 border border-gray-300 bg-white text-gray-900 rounded"
                      value={link.url}
                      onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                    />
                    <button onClick={() => removeSocialLink(idx)} className="text-red-500 hover:text-red-700">
                       <MinusCircle size={20} />
                    </button>
                 </div>
              ))}
           </div>
        </section>

      </div>
    </div>
  );
};
