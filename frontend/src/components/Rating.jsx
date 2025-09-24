import React from 'react';
import { FaStar } from 'react-icons/fa';

const Rating = ({ value }) => {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <FaStar key={i} className={i < value ? 'text-yellow-400' : 'text-gray-600'} />
  ));
  return <div className="flex">{stars}</div>;
};

export default Rating;
