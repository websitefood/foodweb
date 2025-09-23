import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('ingredients', ingredients);
    formData.append('instructions', instructions);
    formData.append('image', image);

    fetch('https://flavornest.onrender.com/api/recipes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.id) {
        navigate(`/recipe/${data.id}`);
      }
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-4">Upload Recipe</h1>
      <input 
        type="text" 
        placeholder="Title" 
        className="w-full p-2 mb-2 text-black" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
      />
      <textarea 
        placeholder="Ingredients" 
        className="w-full p-2 mb-2 text-black" 
        value={ingredients} 
        onChange={e => setIngredients(e.target.value)} 
      />
      <textarea 
        placeholder="Instructions" 
        className="w-full p-2 mb-2 text-black" 
        value={instructions} 
        onChange={e => setInstructions(e.target.value)} 
      />
      <input 
        type="file" 
        accept="image/*" 
        onChange={e => setImage(e.target.files[0])} 
        className="mb-2" 
      />
      <button onClick={handleSubmit} className="w-full bg-green-500 p-2 rounded">Submit</button>
    </div>
  );
};

export default UploadPage;
