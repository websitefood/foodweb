import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Rating from '../components/Rating';
import Comment from '../components/Comment';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ text: '', rating: 0 });
  const [likes, setLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);

  useEffect(() => {
    // Fetch recipe details and increment view count
    axios.get(`https://flavornest.onrender.com/api/recipes/${id}`)
      .then(res => setRecipe(res.data))
      .catch(err => console.error(err));
    // Fetch comments
    axios.get(`https://flavornest.onrender.com/api/comments?recipeId=${id}`)
      .then(res => setComments(res.data))
      .catch(err => console.error(err));
    // Fetch likes count
    axios.get(`https://flavornest.onrender.com/api/recipes/${id}/likes`)
      .then(res => {
        setLikes(res.data.count);
        setUserLiked(res.data.userHasLiked);
      })
      .catch(err => console.error(err));
  }, [id]);

  const submitComment = (e) => {
    e.preventDefault();
    axios.post(`https://flavornest.onrender.com/api/comments`, { ...newComment, recipeId: id })
      .then(res => {
        setComments([...comments, res.data]);
        setNewComment({ text: '', rating: 0 });
      })
      .catch(err => console.error(err));
  };

  const toggleLike = () => {
    axios.post(`https://flavornest.onrender.com/api/recipes/${id}/like`)
      .then(res => {
        setLikes(res.data.count);
        setUserLiked(res.data.userHasLiked);
      })
      .catch(err => console.error(err));
  };

  const handleDeleteComment = (cid) => {
    axios.delete(`https://flavornest.onrender.com/api/comments/${cid}`)
      .then(() => setComments(comments.filter(c => c.id !== cid)))
      .catch(err => console.error(err));
  };

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="container mx-auto py-12 px-4 md:px-0">
      <div className="mb-8">
        <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-64 object-cover rounded" />
      </div>
      <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
      <div className="flex items-center space-x-4 mb-4">
        <Rating value={recipe.averageRating} />
        <span className="text-gray-400">({recipe.ratings.length} reviews)</span>
        <button onClick={toggleLike} className={`px-3 py-1 rounded ${userLiked ? 'bg-red-500 text-white' : 'bg-gray-700'}`}>
          {userLiked ? '♥' : '♡'} {likes}
        </button>
        <button onClick={() => window.print()} className="ml-auto px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition">
          Print Recipe
        </button>
      </div>
      <p className="mb-8 text-gray-300">{recipe.description}</p>

      {/* Ingredients */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
        <ul className="list-disc list-inside text-gray-200">
          {recipe.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
        </ul>
      </div>
      {/* Steps */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
        <ol className="list-decimal list-inside text-gray-200">
          {recipe.steps.map((step, idx) => <li key={idx}>{step}</li>)}
        </ol>
      </div>

      {/* Comments */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {comments.map(comment => (
          <Comment key={comment.id} comment={comment} isAdmin={false} onDelete={handleDeleteComment}/>
        ))}
      </div>

      {/* Add Comment */}
      <form onSubmit={submitComment} className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Add a Review</h3>
        <div className="flex items-center mb-2">
          {[1,2,3,4,5].map(n => (
            <span key={n} onClick={() => setNewComment({...newComment, rating: n})}>
              <Rating value={newComment.rating >= n ? 1 : 0} />
            </span>
          ))}
        </div>
        <textarea
          required
          value={newComment.text}
          onChange={e => setNewComment({...newComment, text: e.target.value})}
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="Write your review..."
        />
        <button type="submit" className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-orange-600 transition">
          Submit
        </button>
      </form>
    </div>
  );
};

export default RecipeDetail;
