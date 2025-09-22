import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    API.get('/users/me').then(r => setUser(r.data)).catch(()=>{});
    API.get('/users/me/saved').then(r => setSaved(r.data)).catch(()=>{});
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold">Profile</h2>
      {user ? (
        <div className="mt-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <div><strong>{user.name}</strong></div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Saved Recipes</h3>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {saved.map(r => (
                <Link key={r.id} to={`/recipes/${r.slug}`} className="p-3 bg-white dark:bg-gray-800 rounded shadow">
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-sm text-gray-400">{r.short}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4">Login to view profile.</div>
      )}
    </div>
  );
}
