
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogPosts, theme } = useAppStore();

  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl font-bold text-gray-900 mb-4">Artigo não encontrado.</p>
        <button onClick={() => navigate('/blog')} className="text-brand-600 hover:underline">Voltar para o Blog</button>
      </div>
    );
  }

  const handleShare = () => {
     navigator.clipboard.writeText(window.location.href);
     alert('Link copiado!');
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Image */}
      <div className="h-[400px] w-full relative">
         <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
         <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 text-white">
            <div className="max-w-4xl mx-auto">
               <span className="bg-brand-600 px-3 py-1 rounded-lg font-bold text-xs uppercase tracking-wider mb-4 inline-block" style={{ backgroundColor: theme.primaryColor }}>
                  {post.category}
               </span>
               <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">{post.title}</h1>
               <p className="text-lg md:text-xl text-gray-200 mb-6 font-light">{post.subtitle}</p>
               
               <div className="flex items-center gap-6 text-sm font-medium">
                  <div className="flex items-center gap-2">
                     <User size={18} />
                     {post.author}
                  </div>
                  <div className="flex items-center gap-2">
                     <Calendar size={18} />
                     {new Date(post.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
         <button onClick={() => navigate('/blog')} className="mb-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition">
            <ArrowLeft size={20} /> Voltar para o Blog
         </button>

         <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-1">
               <div 
                 className="prose prose-lg prose-blue max-w-none text-gray-800"
                 dangerouslySetInnerHTML={{ __html: post.content }}
               ></div>
            </div>
         </div>

         <div className="mt-16 pt-8 border-t border-gray-200 flex justify-between items-center">
            <div className="font-bold text-gray-900">Gostou desse artigo?</div>
            <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition">
               <Share2 size={18} /> Compartilhar
            </button>
         </div>
      </div>
    </div>
  );
};
