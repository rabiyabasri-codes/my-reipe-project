import React from 'react';
import { Link } from 'react-router-dom';

const RecipeList = ({ recipes }) => {
  return (
    <div className="recipe-list">
      {recipes.map(recipe => (
        <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="recipe-card-link">
          <div className="recipe-card">
            <img src={recipe.image} alt={recipe.title} />
            <div className="recipe-card-content">
              <h3>{recipe.title}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecipeList; 