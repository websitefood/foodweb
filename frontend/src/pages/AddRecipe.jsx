import React, { useState } from 'react';
import axios from 'axios';

const AddRecipe = () => {
  const [form, setForm] = useState({
    title: '', description: '', difficulty: 'Easy',
    time: 0, servings: 1, ingredients: '', steps: '', image: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('description', form.description);
      data.append('difficulty', form.difficulty);
      data.append('time', String(form.time));
      data.append('servings', String(form.servings));

      // Send ingredients & steps as repeated fields so backend can parse arrays
      const ingredientLines = form.ingredients.split('\n').map(s => s.trim()).filter(Boolean);
      const stepLines = form.steps.split('\n').map(s => s.trim()).filter(Boolean);
      ingredientLines.forEach(item => data.append('ingredients[]', item));
      stepLines.forEach(item => data.append('steps[]', item));

      if (form.image) {
        data.append('image', form.image);
      }

      // Use relative path (works when frontend and backend are served from same origin)
      // or replace with the exact backend base URL if different.
      const res = await axios.post('/api/recipes', data);
      alert('Recipe added!');
    } catch (err) {
      console.error(err);
      // Prefer showing server message if available
      const msg = err?.response?.data?.message || err.message || 'Error adding recipe';
      alert(`Failed to add recipe: ${msg}`);
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
        <button type="submit" className="px-6 py-3 bg-primary text-white rounded hover:bg-orange-600 transition">
          Submit Recipe
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;
