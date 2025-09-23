import React, { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch('https://flavornest.onrender.com/api/recipes')
      .then(res => res.json())
      .then(data => setRecipes(data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl mb-4">All Recipes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
