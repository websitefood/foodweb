import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/api';

export default function RecipeDetails() {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    API.get(`/recipes/${slug}`).then(r => {
      setRecipe(r.data);
      setComments(r.data.comments || []);
    }).catch(()=>{});
  }, [slug]);

  async function postComment() {
    try {
      await API.post(`/recipes/${slug}/comments`, { text: comment });
      setComments(prev => [{ text: comment, created_at: new Date().toISOString(), user_name: 'You' }, ...prev]);
      setComment('');
    } catch (e) {
      alert('Login required to comment');
    }
  }

  if (!recipe) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
        <img src={recipe.photos?.[0] || '/placeholder.jpg'} className="w-full h-80 object-cover rounded" alt={recipe.title} />
        <h1 className="text-3xl font-bold mt-4">{recipe.title}</h1>
        <p className="text-gray-500 mt-2">{recipe.short}</p>
        <div className="mt-4 text-sm text-gray-400">Prep: {recipe.prep}m • Cook: {recipe.cook}m • Difficulty: {recipe.difficulty || '—'}</div>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Ingredients</h3>
            <ul className="list-disc ml-5 text-sm">
              {(recipe.ingredients || '').split('\n').filter(Boolean).map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Steps</h3>
            <ol className="list-decimal ml-5 text-sm">
              {(recipe.steps || '').split('\n').filter(Boolean).map((s, i) => <li key={i} className="mb-1">{s}</li>)}
            </ol>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={()=>window.print()} className="px-3 py-2 bg-orange-500 text-white rounded">Print</button>
          <a href={`${API.defaults.baseURL}/recipes/${slug}/pdf`} target="_blank" rel="noreferrer" className="px-3 py-2 border rounded">Download PDF</a>
        </div>
      </div>

      <div className="mt-6 max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold mb-2">Comments</h3>
        <div className="mb-4">
          <textarea value={comment} onChange={e=>setComment(e.target.value)} className="w-full p-2 border rounded" placeholder="Write a comment..."></textarea>
          <div className="mt-2">
            <button onClick={postComment} className="px-3 py-1 bg-indigo-500 text-white rounded">Post Comment</button>
          </div>
        </div>
        <div className="space-y-3">
          {comments.map((c, i) => (
            <div key={i} className="p-3 bg-white dark:bg-gray-800 rounded shadow">
              <div className="text-sm text-gray-700 dark:text-gray-200"><strong>{c.user_name || c.user_name || 'User'}</strong> • <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleString()}</span></div>
              <div className="mt-1 text-sm">{c.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
