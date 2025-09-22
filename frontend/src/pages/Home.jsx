import React, { useEffect, useState } from 'react';
import API from '../api/api';
import RecipeCard from '../components/RecipeCard';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    API.get('/recipes').then(r => setRecipes(r.data)).catch(()=>{});
  }, []);

  const categories = ['All','Breakfast','Lunch','Dinner','Snacks','Desserts'];

  const filtered = recipes.filter(r => {
    const qq = q.toLowerCase();
    const matchQ = !q || r.title.toLowerCase().includes(qq) || (r.ingredients?.join(' ') || '').toLowerCase().includes(qq);
    const matchC = category === 'All' || (r.tags || '').toLowerCase().includes(category.toLowerCase());
    return matchQ && matchC;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <section className="rounded-lg overflow-hidden mb-6 relative">
        <img src="/hero-food.jpg" alt="hero" className="w-full h-64 object-cover rounded" />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold">Welcome to FlavorNest</h1>
            <p className="mt-2">Delicious recipes. Joyful cooking.</p>
          </div>
        </div>
      </section>

      <div className="flex gap-3 mb-4">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search recipes or ingredients..." className="flex-1 p-2 border rounded" />
        <select value={category} onChange={e=>setCategory(e.target.value)} className="p-2 border rounded">
          {categories.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Featured Recipes</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(r => <RecipeCard key={r.id} recipe={r} />)}
      </div>
    </div>
  );
}
