import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [classmates, setClassmates] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        if (user) {
            fetchClassmates();
            fetchLeaderboard();
        }
    }, [user]);

    const fetchLeaderboard = async () => {
        try {
            const response = await api.get(`submissions.php?leaderboard=true&class_name=${user.class_name}&section=${user.section}`);
            setLeaderboard(response.data);
        } catch (error) {
            console.error('Error fetching leaderboard', error);
        }
    };

    const fetchClassmates = async () => {
        try {
            const response = await api.get(`users.php?class_name=${user.class_name}&section=${user.section}&role=student`);
            // Sort by roll number if available, else by name
            const sorted = (response.data || []).sort((a, b) => {
                if (a.roll_number && b.roll_number) {
                    return a.roll_number.localeCompare(b.roll_number, undefined, { numeric: true });
                }
                return a.name.localeCompare(b.name);
            });
            setClassmates(sorted);
        } catch (error) {
            console.error('Error fetching classmates', error);
        }
    };

    if (!user) return null;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-0.05em' }}>
                    Welcome back, {user.name.split(' ')[0]}!
                </h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Here is your class overview for today.</p>
            </div>

            {/* Leaderboard Section */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                borderRadius: '1.5rem',
                padding: '2rem',
                color: 'white',
                marginBottom: '2rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                maxWidth: '600px',
                margin: '0 auto 3rem auto', // Centered
                textAlign: 'center'
            }}>
                <h2 style={{
                    fontSize: '2rem',
                    fontWeight: '900',
                    color: 'white',
                    marginBottom: '1.5rem',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                    🏆 Leaderboard {user.class_name} "{user.section}"
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {leaderboard.length > 0 ? (
                        leaderboard.map((student, index) => (
                            <div key={index} style={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(5px)',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                border: index === 0 ? '2px solid rgba(255, 215, 0, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{
                                        fontWeight: '900',
                                        fontSize: '1.2rem',
                                        width: '2rem',
                                        color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'white'
                                    }}>
                                        #{index + 1}
                                    </span>
                                    <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{student.name}</span>
                                </div>
                                <span style={{ fontWeight: '800', fontSize: '1.1rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem 0.75rem', borderRadius: '0.5rem' }}>
                                    {student.total_score} pts
                                </span>
                            </div>
                        ))
                    ) : (
                        <p style={{ opacity: 0.8 }}>No entries yet. Be the first!</p>
                    )}
                </div>
            </div>

            <div className="card" style={{ borderRadius: '1rem', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
                    👥 Your Classmates
                </h3>

                <div className="table-responsive">
                    <table className="table" style={{ borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                        <thead>
                            <tr>
                                <th style={{ border: 'none', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: '800', padding: '0 1rem' }}>Name</th>
                                <th style={{ border: 'none', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: '800', padding: '0 1rem', textAlign: 'right' }}>Roll Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classmates.map((c, idx) => (
                                <tr key={idx} style={{ background: c.id === user.id ? 'rgba(128, 128, 0, 0.1)' : 'var(--background)' }}>
                                    <td style={{ padding: '1rem', borderRadius: '0.5rem 0 0 0.5rem', fontWeight: '700', fontSize: '1rem', border: 'none', color: 'var(--text-main)' }}>
                                        {c.name} {c.id === user.id && <span style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>(You)</span>}
                                    </td>
                                    <td style={{ padding: '1rem', borderRadius: '0 0.5rem 0.5rem 0', textAlign: 'right', fontWeight: '800', fontSize: '1rem', color: 'var(--primary)', border: 'none' }}>
                                        {c.roll_number || 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


            </div>
        </div>
    );
};

export default Home;
