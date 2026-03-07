import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [className, setClassName] = useState('');
    const [section, setSection] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [subject, setSubject] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = { name, email, password, role };

        // Add role-specific fields
        if (role === 'student' || role === 'teacher') {
            userData.class_name = className;
            userData.section = section;
            userData.roll_number = rollNumber;
            userData.subject = subject;
            userData.phone_number = phoneNumber;
        }

        try {
            await api.post('/auth.php?action=register', userData);
            navigate('/login');
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <h2 className="text-center mb-4">Create Account</h2>
                {error && <div className="p-3 mb-3" style={{ background: 'var(--secondary)', color: 'white', borderRadius: '0.5rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            className="input"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="e.g., +1234567890"
                            required={role === 'student'}
                        />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select
                            className="select"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>

                    {/* Role-specific fields */}
                    {(role === 'student' || role === 'teacher') && (
                        <>
                            <div className="form-group">
                                <label>Class Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={className}
                                    onChange={(e) => setClassName(e.target.value)}
                                    placeholder="e.g., Class 10"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Section</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={section}
                                    onChange={(e) => setSection(e.target.value)}
                                    placeholder="e.g., A, B, C"
                                    required
                                />
                            </div>
                            {role === 'student' && (
                                <div className="form-group">
                                    <label>Roll Number</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={rollNumber}
                                        onChange={(e) => setRollNumber(e.target.value)}
                                        placeholder="e.g., 101"
                                        required
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label>{role === 'teacher' ? 'Teaching Subject' : 'Interested Subject'}</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="e.g., Mathematics, Science"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn btn-primary w-100" style={{ width: '100%' }}>Register</button>
                    <p className="mt-4 text-center">
                        Already have an account? <span onClick={() => navigate('/login')} style={{ color: 'var(--primary)', cursor: 'pointer' }}>Login</span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
