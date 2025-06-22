import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import AuthContext from '../context/AuthContext';

const NavBar = () => {
  const { token, logout } = useContext(AuthContext);

  const guestLinks = (
    <>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </>
  );

  const authLinks = (
    <li>
      <button onClick={logout} className="logout-button">Logout</button>
    </li>
  );

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">Recipe Finder</Link>
      <SearchBar />
      <ul className="nav-links">
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        {token ? authLinks : guestLinks}
      </ul>
    </nav>
  );
};

export default NavBar; 