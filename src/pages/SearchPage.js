import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RecipeList from '../components/RecipeList';

const SearchPage = () => {
  const { query } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5001/api/recipes?ingredients=${query}`);
        setRecipes(response.data);
      } catch (err) {
        setError('Failed to fetch recipes. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [query]);

  if (loading) return <div>Searching for recipes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      {recipes.length > 0 ? (
        <RecipeList recipes={recipes} />
      ) : (
        <p>No recipes found for "{query}". Try different ingredients!</p>
      )}
    </div>
  );
};

export default SearchPage; 