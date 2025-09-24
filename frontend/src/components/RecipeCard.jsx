import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => (
  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition">
    <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-xl font-semibold text-white">{recipe.title}</h3>
      <div className="flex justify-between mt-2">
        <span className="text-sm bg-primary text-white px-2 py-1 rounded-full">{recipe.difficulty}</span>
        <span className="text-sm text-gray-300">{recipe.time} min</span>
        <span className="text-sm text-gray-300">{recipe.servings} servings</span>
      </div>
      <Link
        to={`/recipes/${recipe.id}`}
        className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-orange-600 transition"
      >
        View Recipe
      </Link>
    </div>
  </div>
);

export default RecipeCard;
