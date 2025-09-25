import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    fetchRecipes(q);
    // eslint-disable-next-line
  }, []);

  const fetchRecipes = async (q = '') => {
    setLoading(true);
    try {
      const res = await axios.get('/api/recipes' + (q ? `?q=${encodeURIComponent(q)}` : ''));
      setRecipes(res.data);
    } catch (err) {
      console.error('Failed to fetch recipes', err);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(q => {
      if (query) return { q: query };
      return {};
    });
    fetchRecipes(query);
  };

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSearch} className="mb-6 flex">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search recipes..." className="flex-1 p-2 rounded-l bg-gray-800 text-white" />
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-r">Search</button>
      </form>

      {loading ? <div>Loading...</div> : (
        <div className="grid md:grid-cols-3 gap-6">
          {recipes.map(r => (
            <Link to={`/recipes/${r.id}`} key={r.id} className="block p-4 bg-gray-800 rounded">
              {r.imageUrl ? <img src={r.imageUrl} alt={r.title} className="w-full h-40 object-cover rounded mb-2" /> : null}
              <h3 className="text-xl font-semibold">{r.title}</h3>
              <p className="text-sm text-gray-400">{r.description}</p>
            </Link>
          ))}
          {recipes.length === 0 && <div>No recipes found.</div>}
        </div>
      )}
    </div>
  );
};

export default Recipes;
