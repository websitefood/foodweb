import React from 'react';
import Rating from './Rating';

const Comment = ({ comment, isAdmin, onDelete }) => (
  <div className="border-b border-gray-700 py-4">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-white font-semibold">{comment.username}</p>
        <p className="text-gray-400 text-sm">{new Date(comment.date).toLocaleString()}</p>
      </div>
      <Rating value={comment.rating || 0} />
    </div>
    <p className="mt-2 text-gray-200">{comment.text}</p>
    {isAdmin && (
      <button onClick={() => onDelete(comment.id)} className="text-red-500 text-sm mt-1">Delete</button>
    )}
  </div>
);

export default Comment;
