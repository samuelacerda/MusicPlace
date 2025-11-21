import React from 'react';
import { SERVICES_MOCK } from '../constants';
import { Star, MapPin } from 'lucide-react';

export const Services: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profissionais e Serviços</h1>
        <p className="text-gray-600 mt-2">Encontre luthiers, estúdios e professores de confiança.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES_MOCK.map(service => (
          <div key={service.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="h-48 bg-gray-100 relative">
              <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-brand-800 text-xs font-bold px-3 py-1 rounded-full">
                {service.type}
              </span>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-1">{service.name}</h3>
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                <Star size={16} fill="currentColor" />
                <span className="text-gray-700 font-semibold text-sm">{service.rating}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  {service.location}
                </div>
                <div className="font-semibold text-gray-700">{service.priceRange}</div>
              </div>
              <button className="w-full mt-4 border border-brand-600 text-brand-600 font-medium py-2 rounded-lg hover:bg-brand-50 transition">
                Ver Perfil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};