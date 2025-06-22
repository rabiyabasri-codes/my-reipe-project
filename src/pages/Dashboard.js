import React from 'react';
import { Link } from 'react-router-dom';

const cuisines = [
  'Italian', 'Chinese', 'Japanese', 'Indian', 'Mexican', 'Thai', 'Spanish', 'French'
];

const Dashboard = () => {
  return (
    <div>
      <h1>Welcome to the Recipe Finder!</h1>
      <h2>Choose a Cuisine</h2>
      <div className="cuisine-list">
        {cuisines.map(cuisine => (
          <Link key={cuisine} to={`/cuisine/${cuisine.toLowerCase()}`} className="cuisine-link">
            {cuisine}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 