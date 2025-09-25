import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddRecipe = () => {
  const [form, setForm] = useState({
    title: '', description: '', difficulty: 'Easy',
    time: 0, servings: 1, ingredients: '', steps: '', image: null
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('description', form.description);
      data.append('difficulty', form.difficulty);
      data.append('time', String(form.time));
      data.append('servings', String(form.servings));
      data.append('ingredients', form.ingredients); // newline separated
      data.append('steps', form.steps); // newline separated
      if (form.image) data.append('image', form.image);

      // Auth: send token if present
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Don't set Content-Type manually
      const res = await axios.post('/api/recipes', data, { headers });
      setSuccess(true);
      setLoading(false);

      // Short success animation, then go to recipes
      setTimeout(() => {
        navigate('/recipes');
      }, 1400);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Error adding recipe';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-6">Add New Recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text" required
          placeholder="Title"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={form.title}
          onChange={e => setForm({...form, title: e.target.value})}
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={form.description}
          onChange={e => setForm({...form, description: e.target.value})}
        />
        <div className="flex space-x-4">
          <select
            value={form.difficulty}
            onChange={e => setForm({...form, difficulty: e.target.value})}
            className="p-2 bg-gray-800 text-white rounded"
          >
            {['Easy','Medium','Hard'].map(level => <option key={level}>{level}</option>)}
          </select>
          <input
            type="number" min="0"
            placeholder="Time (min)"
            className="w-1/2 p-2 rounded bg-gray-800 text-white"
            value={form.time}
            onChange={e => setForm({...form, time: e.target.value})}
          />
          <input
            type="number" min="1"
            placeholder="Servings"
            className="w-1/2 p-2 rounded bg-gray-800 text-white"
            value={form.servings}
            onChange={e => setForm({...form, servings: e.target.value})}
          />
        </div>
        <textarea
          placeholder="Ingredients (one per line)"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={form.ingredients}
          onChange={e => setForm({...form, ingredients: e.target.value})}
        />
        <textarea
          placeholder="Steps (one per line)"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={form.steps}
          onChange={e => setForm({...form, steps: e.target.value})}
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setForm({...form, image: e.target.files[0]})}
        />
        <button type="submit" className="px-6 py-3 bg-primary text-white rounded hover:bg-orange-600 transition flex items-center justify-center" disabled={loading}>
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          ) : null}
          {loading ? 'Adding...' : 'Submit Recipe'}
        </button>
      </form>

      {error && <div className="mt-4 text-red-400">{error}</div>}

      {success && (
        <div className="mt-6 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white animate-pulse" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="font-semibold">Recipe added!</div>
            <div className="text-sm text-gray-300">Successfully added. Redirecting to recipes...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRecipe;
