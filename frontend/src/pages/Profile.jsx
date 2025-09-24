import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    axios.get('https://flavornest.onrender.com/api/users/profile', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);
  if (!user) return <p>Loading...</p>;
  return (
    <div className="container mx-auto py-12 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Role:</strong> {user.isAdmin ? 'Administrator' : 'User'}</p>
      {/* Additional profile info */}
    </div>
  );
};

export default Profile;
