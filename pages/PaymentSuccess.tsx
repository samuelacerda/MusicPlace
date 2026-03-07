
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export const PaymentSuccess: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
       <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-lg w-full text-center border border-gray-100">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
             <CheckCircle size={48} />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Pagamento Confirmado!</h1>
          <p className="text-gray-600 text-lg mb-8">
             Sua compra foi realizada com sucesso. O vendedor será notificado para preparar o envio.
          </p>

          <div className="bg-gray-50 p-6 rounded-xl mb-8 text-left border border-gray-200">
             <h3 className="font-bold text-gray-900 mb-2 text-sm uppercase">Próximos Passos:</h3>
             <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                   <span className="font-bold text-brand-600">1.</span> Você receberá um e-mail com os detalhes do pedido.
                </li>
                <li className="flex items-start gap-2">
                   <span className="font-bold text-brand-600">2.</span> Combine a entrega diretamente com o vendedor pelo chat.
                </li>
                <li className="flex items-start gap-2">
                   <span className="font-bold text-brand-600">3.</span> Libere o pagamento final apenas após receber o produto.
                </li>
             </ul>
          </div>

          <div className="flex flex-col gap-3">
             <Link to="/minha-conta/anuncios" className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition flex items-center justify-center gap-2">
                <ShoppingBag size={18} /> Ver Meus Pedidos
             </Link>
             <Link to="/" className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2">
                Voltar para a Loja <ArrowRight size={18} />
             </Link>
          </div>
       </div>
    </div>
  );
};
