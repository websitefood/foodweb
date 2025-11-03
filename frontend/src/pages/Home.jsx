// (ফাইলের উপরের অংশ অপরিবর্তিত থাকলে শুধু নিচের অংশটি ব্যবহার করুন)
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RecipeCard from '../components/RecipeCard';
import axios from 'axios';
import AdSense from '../components/AdSense'; // <-- import here

const Home = () => {
  const { t } = useTranslation();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    axios.get('https://flavornest.onrender.com/api/recipes?featured=true')
      .then(res => setFeatured(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="h-[70vh] bg-cover bg-center flex flex-col items-center justify-center text-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80')"}}>
        <div className="bg-black bg-opacity-50 p-6 rounded">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{t('welcome')}</h1>
          <p className="mb-6 text-gray-300">{t('subtitle')}</p>
          <div className="flex space-x-4 justify-center">
            <a href="#featured" className="px-6 py-3 bg-white text-gray-900 rounded font-semibold hover:bg-gray-200 transition">{t('exploreRecipes')}</a>
            <a href="/add" className="px-6 py-3 border border-white text-white rounded font-semibold hover:bg-white hover:text-gray-900 transition">{t('addRecipe')}</a>
          </div>
        </div>
      </section>

      {/* INSERT AD HERE: responsive ad between hero and featured */}
      <div className="container mx-auto py-6 px-4 md:px-0">
        <AdSense adSlot="YYYYYYYYYYY" />
      </div>

      {/* Featured Recipes */}
      <section id="featured" className="container mx-auto py-12 px-4 md:px-0">
        <h2 className="text-3xl font-bold text-center mb-4">{t('featuredTitle')}</h2>
        <p className="text-gray-400 text-center mb-8">{t('featuredSubtitle')}</p>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {featured.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
