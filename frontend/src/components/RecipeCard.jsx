import React from 'react';
import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe }) {
  const img = recipe.photos?.[0] || '/placeholder.jpg';
  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
      <Link to={`/recipes/${recipe.slug}`}>
        <img src={img} alt={recipe.title} className="w-full h-48 object-cover" />
        <div className="p-3">
          <h3 className="font-semibold">{recipe.title}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{recipe.short}</p>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <div>⭐ {recipe.rating ?? 0}</div>
            <div>{recipe.prep}m prep • {recipe.cook}m cook</div>
          </div>
        </div>
      </Link>
    </div>
  );
}
