import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">Knowledge Assessment</Link>
            <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/about" className="nav-link">About</Link>
                {user ? (
                    <>
                        {user.role === 'student' && (
                            <>
                                <Link to="/student-assessments" className="nav-link">Assessments</Link>
                                <Link to="/student-dashboard" className="nav-link">Dashboard</Link>
                                <Link to="/badges" className="nav-link">Badges</Link>
                            </>
                        )}
                        {user.role === 'teacher' && (
                            <>
                                <Link to="/teacher-dashboard" className="nav-link">Dashboard</Link>
                                <Link to="/teacher-assessments" className="nav-link">Test Results</Link>
                                <Link to="/create-test" className="nav-link">Create Test</Link>
                                <Link to="/student-progress" className="nav-link">Student Progress</Link>
                            </>
                        )}
                        <Link to="/profile" className="nav-link">Profile</Link>
                        <button
                            onClick={toggleTheme}
                            className="btn btn-outline"
                            style={{ padding: '0.5rem 1rem', fontSize: '1.25rem' }}
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>
                        <button onClick={handleLogout} className="btn btn-outline">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="btn btn-primary">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
