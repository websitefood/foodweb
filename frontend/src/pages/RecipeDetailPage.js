import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  useEffect(() => {
    fetch(`https://flavornest.onrender.com/api/recipes/${id}`)
      .then(res => res.json())
      .then(data => {
        setRecipe(data.recipe);
        setComments(data.comments);
      });
  }, [id]);

  const handleLike = () => {
    if (!isLoggedIn) return;
    fetch(`https://flavornest.onrender.com/api/recipes/${id}/like`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => {
      if (res.ok) setLiked(true);
    });
  };

  const handleSave = () => {
    if (!isLoggedIn) return;
    fetch(`https://flavornest.onrender.com/api/recipes/${id}/save`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => {
      if (res.ok) setSaved(true);
    });
  };

  const handleAddComment = () => {
    if (!isLoggedIn || !newComment) return;
    fetch(`https://flavornest.onrender.com/api/recipes/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ comment: newComment })
    })
    .then(res => res.json())
    .then(data => {
      setComments([...comments, data]);
      setNewComment("");
    });
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl mb-4">{recipe.title}</h1>
      <img 
        src={`https://flavornest.onrender.com/${recipe.image_path}`} 
        alt={recipe.title} 
        className="w-full h-96 object-cover mb-4 rounded" 
      />
      <p className="whitespace-pre-line">{recipe.instructions}</p>

      <div className="flex space-x-4 mt-4">
        <button onClick={handleLike} className="bg-blue-500 px-4 py-2 rounded">
          {liked ? 'Liked' : 'Like'}
        </button>
        <button onClick={handleSave} className="bg-green-500 px-4 py-2 rounded">
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      <hr className="my-4"/>

      <h2 className="text-xl mb-2">Comments</h2>
      <div>
        {comments.map(comment => (
          <div key={comment.id} className="border-b py-2">
            <p><strong>{comment.username}:</strong> {comment.comment}</p>
          </div>
        ))}
      </div>

      {isLoggedIn && (
        <div className="mt-4">
          <textarea 
            className="w-full p-2 text-black" 
            value={newComment} 
            onChange={e => setNewComment(e.target.value)} 
            placeholder="Add a comment" 
          />
          <button 
            onClick={handleAddComment} 
            className="mt-2 bg-blue-500 px-4 py-2 rounded"
          >
            Submit Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeDetailPage;
