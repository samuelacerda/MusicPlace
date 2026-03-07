
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { BlogPost } from '../types';
import { useAppStore } from '../store/useAppStore';

interface Props {
  post: BlogPost;
  compact?: boolean;
}

export const BlogCard: React.FC<Props> = ({ post, compact }) => {
  const { theme } = useAppStore();

  return (
    <Link to={`/blog/${post.id}`} className="group block h-full">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition h-full flex flex-col">
         {/* Image */}
         <div className={`overflow-hidden bg-gray-100 relative ${compact ? 'aspect-video' : 'aspect-[3/2]'}`}>
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4">
               <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm" style={{ backgroundColor: theme.primaryColor }}>
                 {post.category}
               </span>
            </div>
         </div>

         {/* Content */}
         <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition line-clamp-2" style={{ '--hover-text': theme.primaryColor } as React.CSSProperties}>
              {post.title}
            </h3>
            {!compact && (
              <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                {post.subtitle}
              </p>
            )}
            
            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium">
               <div className="flex items-center gap-2">
                  <User size={14} />
                  <span>{post.author}</span>
               </div>
               <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
               </div>
            </div>
         </div>
      </div>
    </Link>
  );
};
