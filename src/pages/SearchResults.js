import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RecipeList from '../components/RecipeList';

const SearchResults = () => {
  const { cuisine } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/recipes/cuisine?cuisine=${cuisine}`);
        setRecipes(response.data.results);
      } catch (err) {
        setError('Failed to fetch recipes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [cuisine]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>{cuisine.charAt(0).toUpperCase() + cuisine.slice(1)} Recipes</h1>
      <RecipeList recipes={recipes} />
    </div>
  );
};

export default SearchResults; 