import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const [assessments, setAssessments] = useState([]);
    const [results, setResults] = useState([]);
    const [classmates, setClassmates] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchAssessments();
        fetchResults();
        fetchClassmates();
    }, []);

    const fetchAssessments = async () => {
        try {
            const response = await api.get(`assessments.php?class_name=${user.class_name}&section=${user.section}`);
            setAssessments(response.data);
        } catch (error) {
            console.error('Error fetching assessments', error);
        }
    };

    const fetchResults = async () => {
        try {
            const response = await api.get(`submissions.php?user_id=${user.id}`);
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching results', error);
        }
    };

    const fetchClassmates = async () => {
        try {
            const response = await api.get(`users.php?class_name=${user.class_name}&section=${user.section}&role=student`);
            // Filter out the current user
            setClassmates(response.data.filter(c => c.id !== user.id));
        } catch (error) {
            console.error('Error fetching classmates', error);
        }
    };

    // Correctly calculate tests remaining (available tests NOT yet taken)
    const takenAssessmentIds = results.map(r => r.assessment_id);
    const remainingTests = assessments.filter(a => !takenAssessmentIds.includes(a.id)).length;

    // Calculate badge achievement
    const avgScore = results.length > 0
        ? Math.round((results.reduce((sum, r) => sum + (r.score / r.total_marks * 100), 0) / results.length))
        : 0;

    const getBadges = () => {
        const badges = [];
        const oliveGreen = '#808000'; // Olive Green
        if (results.length >= 1) badges.push({ name: 'First Steps', emoji: '🎯', color: oliveGreen });
        if (results.length >= 3) badges.push({ name: 'Dedicated', emoji: '🔥', color: oliveGreen });
        if (results.length >= 5) badges.push({ name: 'Committed', emoji: '⭐', color: oliveGreen });
        if (avgScore >= 80) badges.push({ name: 'High Achiever', emoji: '🏆', color: oliveGreen });
        if (avgScore >= 95) badges.push({ name: 'Excellence', emoji: '💎', color: oliveGreen });
        return badges;
    };

    return (
        <div className="container" style={{ padding: '2rem', background: 'var(--background)', minHeight: '100vh' }}>
            <h2 style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '1.25rem', marginBottom: '1.5rem', fontFamily: 'Inter, sans-serif' }}>Student Dashboard</h2>

            {/* Achievement Badges */}
            {getBadges().length > 0 && (
                <div style={{
                    background: 'var(--primary)',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1.5rem',
                    position: 'relative'
                }}>
                    <h3 style={{ margin: 0, marginBottom: '1rem', color: 'white', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                        🏅 Your Achievements
                    </h3>
                    <div className="flex" style={{ gap: '1rem', flexWrap: 'wrap' }}>
                        {getBadges().map((badge, idx) => (
                            <div key={idx} style={{
                                padding: '0.5rem 1rem',
                                background: 'var(--card-bg)',
                                borderRadius: '0.35rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                minWidth: '140px',
                                border: '1px solid var(--border)'
                            }}>
                                <span style={{ fontSize: '1.25rem' }}>{badge.emoji}</span>
                                <div style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--primary)' }}>{badge.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Performance Summary Cards */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{
                    textAlign: 'center',
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '2rem 1rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <h3 style={{ margin: 0, fontSize: '2.25rem', fontWeight: '700', lineHeight: '1' }}>{results.length}</h3>
                    <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '0.8rem', fontWeight: '500' }}>Tests Completed</p>
                </div>
                <div style={{
                    textAlign: 'center',
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '2rem 1rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <h3 style={{ margin: 0, fontSize: '2.25rem', fontWeight: '700', lineHeight: '1' }}>{avgScore}%</h3>
                    <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '0.8rem', fontWeight: '500' }}>Average Score</p>
                </div>
                <div style={{
                    textAlign: 'center',
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '2rem 1rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <h3 style={{ margin: 0, fontSize: '2.25rem', fontWeight: '700', lineHeight: '1' }}>{remainingTests}</h3>
                    <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '0.8rem', fontWeight: '500' }}>Tests Remaining</p>
                </div>
            </div>

            {/* Performance Graph Card */}
            <div className="card" style={{ borderRadius: '0.5rem', padding: '1.5rem' }}>
                <h3 className="mb-6" style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📊 Performance Over Time
                </h3>
                <div style={{
                    position: 'relative',
                    height: '240px',
                    display: 'flex',
                    alignItems: 'stretch',
                    justifyContent: 'space-around',
                    padding: '3rem 1rem 1rem 1rem',
                    background: 'var(--background)',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border)'
                }}>
                    {results.slice().reverse().slice(0, 5).map((result, idx) => {
                        const percentage = (result.score / result.total_marks) * 100;
                        const barHeight = Math.max(percentage, 5);
                        let performanceLabel = 'LOW';

                        return (
                            <div key={idx} style={{
                                flex: '0 0 60px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                height: '100%'
                            }}>
                                <div style={{
                                    width: '60%',
                                    height: `${barHeight}%`,
                                    backgroundColor: 'var(--text-muted)',
                                    borderRadius: '0.1rem',
                                    position: 'relative',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '-3rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        width: 'max-content'
                                    }}>
                                        <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-main)' }}>{performanceLabel}</span>
                                        <span style={{ fontSize: '0.65rem', fontWeight: '500', color: 'var(--text-muted)' }}>{Math.round(percentage)}%</span>
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.65rem', marginTop: '0.75rem', fontWeight: '500', color: 'var(--text-muted)' }}>
                                    Test {results.length - idx}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1rem', fontWeight: '400' }}>
                    Your performance history
                </p>
            </div>
        </div>
    );
};

export default StudentDashboard;
