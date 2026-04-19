import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import SkillMap from '../components/SkillMap';

const StudentDashboard = () => {
    const [assessments, setAssessments] = useState([]);
    const [results, setResults] = useState([]);
    const [diagnostics, setDiagnostics] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchAssessments();
        fetchResults();
        fetchDiagnostics();
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

    const fetchDiagnostics = async () => {
        try {
            const response = await api.get('assessments.php?is_diagnostic=1');
            setDiagnostics(response.data);
        } catch (error) {
            console.error('Error fetching diagnostics', error);
        }
    };

    const takenAssessmentIds = results.map(r => r.assessment_id);

    const getSkillData = () => {
        const categories = ['Mathematics', 'Science', 'English', 'Logic', 'General Knowledge'];
        return categories.map(cat => {
            const catResults = results.filter(r => r.category === cat || (r.assessment_title && r.assessment_title.includes(cat)));
            const avg = catResults.length > 0 
                ? Math.round(catResults.reduce((sum, r) => sum + (r.score / r.total_marks * 100), 0) / catResults.length)
                : 0;
            return { label: cat, value: avg };
        });
    };

    const completedDiagnostics = diagnostics.filter(d => results.some(r => r.assessment_id === d.id));
    const isDiagnosticStarted = results.length > 0;
    const isDiagnosticComplete = diagnostics.length > 0 && completedDiagnostics.length === diagnostics.length;

    const avgScore = results.length > 0
        ? Math.round((results.reduce((sum, r) => sum + (r.score / r.total_marks * 100), 0) / results.length))
        : 0;

    const getBadges = () => {
        if (results.length === 0) return [];
        const badges = [];
        
        const sortedResults = [...results].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        const recentResult = sortedResults[sortedResults.length - 1];
        const previousResult = sortedResults[sortedResults.length - 2];
        const getScorePct = (r) => (r.score / r.total_marks) * 100;

        const subjectStats = results.reduce((acc, r) => {
            const cat = r.category || 'General Knowledge';
            if (!acc[cat]) acc[cat] = { count: 0, highScores: 0 };
            acc[cat].count++;
            if (getScorePct(r) >= 80) acc[cat].highScores++;
            return acc;
        }, {});

        // Subject Honors (Highest Precedence)
        if (subjectStats['Mathematics']?.highScores >= 5) badges.push({ name: 'Theorem Titan', emoji: '⚛️' });
        else if (subjectStats['Science']?.highScores >= 5) badges.push({ name: 'Atomic Genius', emoji: '🌌' });
        else if (subjectStats['English']?.highScores >= 5) badges.push({ name: 'Literary Legend', emoji: '🎭' });
        else if (subjectStats['Logic']?.highScores >= 5) badges.push({ name: 'Mastermind', emoji: '⚡' });
        
        // Performance
        const perfectCount = results.filter(r => getScorePct(r) === 100).length;
        if (perfectCount >= 5) badges.push({ name: 'Flawless Five', emoji: '🖐️' });
        
        // Growth (High encouragement)
        if (recentResult && previousResult && getScorePct(recentResult) > getScorePct(previousResult)) {
            badges.push({ name: 'Improving Student', emoji: '📈' });
        }
        
        // Milestones
        if (results.length >= 100) badges.push({ name: 'The Century Club', emoji: '💯' });
        else if (results.length >= 10) badges.push({ name: 'Quiz Enthusiast', emoji: '❤️' });
        
        if (user.streak_count >= 30) badges.push({ name: 'Monthly Devotee', emoji: '🌕' });
        else if (user.streak_count >= 7) badges.push({ name: 'Week Strong', emoji: '🔥' });

        // User mentioned "only one badge per day", so we only show the most significant one
        return badges.length > 0 ? [badges[badges.length - 1]] : [];
    };

    return (
        <div className="container" style={{ paddingBottom: '3rem' }}>
            <h2 className="mb-4">Student Dashboard</h2>

            <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'start' }}>
                
                <div>
                    <div className="card mb-4" style={{ 
                        background: 'linear-gradient(135deg, var(--primary) 0%, #a0a000 100%)', 
                        color: 'white', 
                        padding: '2rem',
                        border: 'none'
                    }}>
                        <h3 style={{ margin: 0 }}>Welcome back, {user.name}!</h3>
                        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
                            {isDiagnosticComplete 
                                ? "Your skill map has evolved. Excellent work!" 
                                : isDiagnosticStarted 
                                    ? `You've started your journey! Complete ${diagnostics.length - completedDiagnostics.length} more diagnostic tests for a full profile.`
                                    : `Complete ${diagnostics.length} diagnostic tests to unlock your full profile.`}
                        </p>
                    </div>

                    {!isDiagnosticComplete && (
                        <div className="card mb-4">
                            <h3 className="mb-4">🚀 Phase 1: Unlock Your Skill Map</h3>
                            <p className="text-muted mb-4">Take these foundational tests to generate your learner profile.</p>
                            <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
                                {diagnostics.map(diag => {
                                    const done = results.some(r => r.assessment_id === diag.id);
                                    return (
                                        <div key={diag.id} className="card" style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center', 
                                            background: done ? 'rgba(34, 197, 94, 0.1)' : 'var(--background)',
                                            borderLeft: `4px solid ${done ? '#22c55e' : 'var(--border)'}` 
                                        }}>
                                            <div>
                                                <h4 style={{ margin: 0 }}>{diag.title}</h4>
                                                <small className="text-muted">{diag.category}</small>
                                            </div>
                                            {done ? (
                                                <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✓ Completed</span>
                                            ) : (
                                                <Link to={`/take-test/${diag.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
                                                    Start Test
                                                </Link>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {isDiagnosticStarted && (
                        <div className="card mb-4">
                            <h3 className="mb-4">🎓 Skill Map Analysis</h3>
                            <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1.5rem', background: 'var(--card-bg)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                                <SkillMap data={getSkillData()} size={400} />
                            </div>
                        </div>
                    )}

                    <div className="card">
                        <h3 className="mb-4">Recent Performance</h3>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Assessment</th>
                                        <th>Score</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.slice(0, 5).map(result => (
                                        <tr key={result.id}>
                                            <td>{result.assessment_title}</td>
                                            <td style={{ fontWeight: 'bold' }}>{result.score}/{result.total_marks}</td>
                                            <td className="text-muted" style={{ fontSize: '0.8rem' }}>{new Date(result.submitted_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                    {results.length === 0 && (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }} className="text-muted">No tests taken yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Link to="/student-assessments" className="btn btn-outline w-100 mt-4" style={{ textAlign: 'center' }}>
                            View All Assessments
                        </Link>
                    </div>
                </div>

                <div>
                    <div className="card mb-4">
                        <h3 className="mb-4">🏆 Your Achievements</h3>
                        <div className="flex flex-wrap gap-2">
                            {getBadges().map((badge, idx) => (
                                <div key={idx} style={{ 
                                    background: 'var(--card-bg)', 
                                    padding: '0.5rem 1rem', 
                                    borderRadius: '2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    border: '2px solid var(--primary)',
                                    boxShadow: 'var(--shadow)'
                                }}>
                                    <span style={{ fontSize: '1.25rem' }}>{badge.emoji}</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{badge.name}</span>
                                </div>
                            ))}
                            {getBadges().length === 0 && <p className="text-muted">Complete tasks to earn badges!</p>}
                        </div>
                        <Link to="/badges" className="btn btn-outline w-100 mt-4" style={{ textAlign: 'center' }}>
                            See 50 Achievement Collection
                        </Link>
                    </div>

                    <div className="card" style={{ background: 'var(--card-bg)', borderLeft: '4px solid var(--primary)' }}>
                        <h4 className="mb-2">Quick Tip</h4>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                            Finish the 5 Subject Diagnostics to see your Skill Map and unlock official reports.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
