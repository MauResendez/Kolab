import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => 
{
    return (
        <nav className="navbar bg-dark">
            <h1>
                {/* <a to="index.html"><i className="fas fa-code"></i>Kolab</a> */}
                <Link to="/">Kolab</Link>
            </h1>
            <ul>
                <Link to="/profiles">Entrepreneurs</Link>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
            </ul>
        </nav>
    )
}

export default Navbar;
