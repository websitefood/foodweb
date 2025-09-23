import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-gray-800 rounded p-4">
      <Link to={`/recipe/${recipe.id}`}>
        <img 
          src={`https://flavornest.onrender.com/${recipe.image_path}`} 
          alt={recipe.title} 
          className="w-full h-48 object-cover rounded" 
        />
      </Link>
      <h2 className="text-xl mt-2">{recipe.title}</h2>
      <p className="text-gray-400">
        {recipe.instructions && recipe.instructions.substring(0, 100)}...
      </p>
      <Link to={`/recipe/${recipe.id}`} className="text-blue-400 hover:underline">View Details</Link>
    </div>
  );
};

export default RecipeCard;
