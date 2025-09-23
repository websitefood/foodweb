import React, { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch('https://flavornest.onrender.com/recipes');
        const data = await res.json();

        if (Array.isArray(data)) {
          setRecipes(data);
        } else if (data.recipes && Array.isArray(data.recipes)) {
          setRecipes(data.recipes);
        } else {
          setRecipes([]);
          setError(data.error || 'No recipes found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch recipes.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg">Loading recipes...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">All Recipes</h1>
      {recipes.length === 0 ? (
        <p className="text-center">No recipes available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
