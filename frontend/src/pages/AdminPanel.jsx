import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [recipes, setRecipes] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get('https://flavornest.onrender.com/api/admin/recipes', { withCredentials: true })
      .then(res => setRecipes(res.data))
      .catch(err => console.error(err));
    axios.get('https://flavornest.onrender.com/api/admin/comments', { withCredentials: true })
      .then(res => setComments(res.data))
      .catch(err => console.error(err));
  }, []);

  const deleteRecipe = (id) => {
    axios.delete(`https://flavornest.onrender.com/api/admin/recipes/${id}`, { withCredentials: true })
      .then(res => setRecipes(recipes.filter(r => r.id !== id)))
      .catch(err => console.error(err));
  };

  const deleteComment = (id) => {
    axios.delete(`https://flavornest.onrender.com/api/admin/comments/${id}`, { withCredentials: true })
      .then(res => setComments(comments.filter(c => c.id !== id)))
      .catch(err => console.error(err));
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Manage Recipes</h2>
        <ul>
          {recipes.map(r => (
            <li key={r.id} className="flex justify-between py-2 border-b border-gray-700">
              <span>{r.title}</span>
              <button onClick={() => deleteRecipe(r.id)} className="text-red-500">Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Manage Comments</h2>
        <ul>
          {comments.map(c => (
            <li key={c.id} className="flex justify-between py-2 border-b border-gray-700">
              <span>{c.text.substring(0, 50)}...</span>
              <button onClick={() => deleteComment(c.id)} className="text-red-500">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
