import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const Badges = () => {
    const [results, setResults] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const response = await api.get(`submissions.php?user_id=${user.id}`);
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching results', error);
        }
    };

    const avgScore = results.length > 0
        ? Math.round((results.reduce((sum, r) => sum + (r.score / r.total_marks * 100), 0) / results.length))
        : 0;

    const totalPoints = results.reduce((sum, r) => sum + parseInt(r.score), 0);

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

    const milestoneBadges = [
        // --- Subject Mastery (15) ---
        { name: 'Number Cruncher', emoji: '🧮', color: '#10b981', requirement: '1 Math Test (80%+)', unlocked: (subjectStats['Mathematics']?.highScores >= 1) },
        { name: 'Math Scholar', emoji: '📐', color: '#10b981', requirement: '3 Math Tests (80%+)', unlocked: (subjectStats['Mathematics']?.highScores >= 3) },
        { name: 'Theorem Titan', emoji: '⚛️', color: '#10b981', requirement: '5 Math Tests (80%+)', unlocked: (subjectStats['Mathematics']?.highScores >= 5) },
        
        { name: 'Lab Assistant', emoji: '🧪', color: '#3b82f6', requirement: '1 Science Test (80%+)', unlocked: (subjectStats['Science']?.highScores >= 1) },
        { name: 'Science Sage', emoji: '🔬', color: '#3b82f6', requirement: '3 Science Tests (80%+)', unlocked: (subjectStats['Science']?.highScores >= 3) },
        { name: 'Atomic Genius', emoji: '🌌', color: '#3b82f6', requirement: '5 Science Tests (80%+)', unlocked: (subjectStats['Science']?.highScores >= 5) },
        
        { name: 'Grammar Guide', emoji: '✍️', color: '#f59e0b', requirement: '1 English Test (80%+)', unlocked: (subjectStats['English']?.highScores >= 1) },
        { name: 'Linguistic Lord', emoji: '📖', color: '#f59e0b', requirement: '3 English Tests (80%+)', unlocked: (subjectStats['English']?.highScores >= 3) },
        { name: 'Literary Legend', emoji: '🎭', color: '#f59e0b', requirement: '5 English Tests (80%+)', unlocked: (subjectStats['English']?.highScores >= 5) },
        
        { name: 'Puzzle Solver', emoji: '🧩', color: '#8b5cf6', requirement: '1 Logic Test (80%+)', unlocked: (subjectStats['Logic']?.highScores >= 1) },
        { name: 'Strategy Star', emoji: '♟️', color: '#8b5cf6', requirement: '3 Logic Tests (80%+)', unlocked: (subjectStats['Logic']?.highScores >= 3) },
        { name: 'Mastermind', emoji: '⚡', color: '#8b5cf6', requirement: '5 Logic Tests (80%+)', unlocked: (subjectStats['Logic']?.highScores >= 5) },

        { name: 'Polymath Pupil', emoji: '🌍', color: '#808000', requirement: '1 General Test (80%+)', unlocked: (subjectStats['General Knowledge']?.highScores >= 1) },
        { name: 'Global Expert', emoji: '🗺️', color: '#808000', requirement: '3 General Tests (80%+)', unlocked: (subjectStats['General Knowledge']?.highScores >= 3) },
        { name: 'Universal Sage', emoji: '🔱', color: '#808000', requirement: '5 General Tests (80%+)', unlocked: (subjectStats['General Knowledge']?.highScores >= 5) },

        // --- Improvement & Growth (10) ---
        { name: 'Improving Student', emoji: '📈', color: '#f43f5e', requirement: 'Score higher than previous test', unlocked: recentResult && previousResult && getScorePct(recentResult) > getScorePct(previousResult) },
        { name: 'Consistent Growth', emoji: '🌱', color: '#f43f5e', requirement: 'Improve over 2 consecutive tests', unlocked: sortedResults.length >= 3 && getScorePct(sortedResults[sortedResults.length-1]) > getScorePct(sortedResults[sortedResults.length-2]) && getScorePct(sortedResults[sortedResults.length-2]) > getScorePct(sortedResults[sortedResults.length-3]) },
        { name: 'Bouncing Back', emoji: '🏀', color: '#f43f5e', requirement: 'Improve after a low score (<40%)', unlocked: recentResult && sortedResults.some((r, i) => i < sortedResults.length - 1 && getScorePct(r) < 40) && getScorePct(recentResult) >= 60 },
        { name: 'Persistent Learner', emoji: '🐢', color: '#f43f5e', requirement: 'Complete 3 tests regardless of score', unlocked: results.length >= 3 },
        { name: 'Dedication Hero', emoji: '🦸', color: '#f43f5e', requirement: 'Take a test after a 1-day break', unlocked: recentResult && previousResult && (new Date(recentResult.created_at) - new Date(previousResult.created_at) > 86400000) },
        { name: 'Late Night Scholar', emoji: '🌙', color: '#f43f5e', requirement: 'Finish a test after 8 PM', unlocked: results.some(r => new Date(r.created_at).getHours() >= 20) },
        { name: 'Early Bird', emoji: '🌅', color: '#f43f5e', requirement: 'Finish a test before 8 AM', unlocked: results.some(r => new Date(r.created_at).getHours() < 8) },
        { name: 'Accuracy Streak', emoji: '🎯', color: '#f43f5e', requirement: '2 tests in a row with 90%+', unlocked: sortedResults.length >= 2 && getScorePct(sortedResults[sortedResults.length-1]) >= 90 && getScorePct(sortedResults[sortedResults.length-2]) >= 90 },
        { name: 'Stability Master', emoji: '⚖️', color: '#f43f5e', requirement: 'Maintain 70%+ average over 5 tests', unlocked: results.length >= 5 && avgScore >= 70 },
        { name: 'Comeback King', emoji: '👑', color: '#f43f5e', requirement: 'Score 100% after a fail', unlocked: recentResult && getScorePct(recentResult) === 100 && sortedResults.some(r => getScorePct(r) < 35) },

        // --- Performance & Precision (10) ---
        { name: 'Clean Sweep', emoji: '🧹', color: '#ec4899', requirement: 'Get 100% on any test', unlocked: results.some(r => getScorePct(r) === 100) },
        { name: 'Double Trouble 100', emoji: '✌️', color: '#ec4899', requirement: 'Two 100% scores', unlocked: results.filter(r => getScorePct(r) === 100).length >= 2 },
        { name: 'Flawless Five', emoji: '🖐️', color: '#ec4899', requirement: 'Five 100% scores', unlocked: results.filter(r => getScorePct(r) === 100).length >= 5 },
        { name: 'Supreme Accuracy', emoji: '🎆', color: '#ec4899', requirement: 'Ten 100% scores', unlocked: results.filter(r => getScorePct(r) === 100).length >= 10 },
        { name: 'Quick Reflexes', emoji: '⚡', color: '#ec4899', requirement: 'Average score 90%+', unlocked: avgScore >= 90 },
        { name: 'Perfect Profile', emoji: '📁', color: '#ec4899', requirement: 'Complete all diagnostics', unlocked: results.filter(r => r.is_diagnostic == 1).length >= 5 },
        { name: 'Speed Runner', emoji: '🏃', requirement: 'Complete any test in under 5 mins', unlocked: results.some(r => r.time_taken && parseInt(r.time_taken) < 300) },
        { name: 'High Flyer', emoji: '✈️', color: '#ec4899', requirement: 'Reach 80% with 10+ tests', unlocked: results.length >= 10 && avgScore >= 80 },
        { name: 'Diamond Learner', emoji: '💎', color: '#ec4899', requirement: 'Average score 95%+', unlocked: avgScore >= 95 },
        { name: 'Academic God', emoji: '⛩️', color: '#ec4899', requirement: 'Reach top of leaderboard', unlocked: false /* Placeholder for live ranking check if available */ },

        // --- Engagement & Milestones (15) ---
        { name: 'Quiz Enthusiast', emoji: '❤️', color: '#8b5cf6', requirement: 'Complete 10 total tests', unlocked: results.length >= 10 },
        { name: 'Knowledge Hoarder', emoji: '📦', color: '#8b5cf6', requirement: 'Complete 30 total tests', unlocked: results.length >= 30 },
        { name: 'The Century Club', emoji: '💯', color: '#8b5cf6', requirement: 'Complete 100 total tests', unlocked: results.length >= 100 },
        { name: 'Day Two Hero', emoji: '📅', color: '#8b5cf6', requirement: '2 Day Streak', unlocked: user.streak_count >= 2 },
        { name: 'Week Strong', emoji: '🔥', color: '#8b5cf6', requirement: '7 Day Streak', unlocked: user.streak_count >= 7 },
        { name: 'Monthly Devotee', emoji: '🌕', color: '#8b5cf6', requirement: '30 Day Streak', unlocked: user.streak_count >= 30 },
        { name: 'Scoreboard Entry', emoji: '📝', color: '#f59e0b', requirement: 'Reach 100 Points', unlocked: totalPoints >= 100 },
        { name: 'Thousandaire', emoji: '💰', color: '#f59e0b', requirement: 'Reach 1000 Points', unlocked: totalPoints >= 1000 },
        { name: 'Point King', emoji: '👑', color: '#f59e0b', requirement: 'Reach 5000 Points', unlocked: totalPoints >= 5000 },
        { name: 'Early Adopter', emoji: '🆕', color: '#8b5cf6', requirement: 'Complete first diagnostic', unlocked: results.some(r => r.is_diagnostic == 1) },
        { name: 'Profile Professional', emoji: '👔', color: '#8b5cf6', requirement: 'Update your profile photo/details', unlocked: user.phone_number && user.subject },
        { name: 'Self Evaluator', emoji: '🔍', color: '#8b5cf6', requirement: 'View your progress report', unlocked: true }, 
        { name: 'Community Member', emoji: '🤝', color: '#8b5cf6', requirement: 'Be part of a class', unlocked: user.class_name },
        { name: 'Morning Motivation', emoji: '☕', color: '#8b5cf6', requirement: 'Complete a test at 8 AM', unlocked: results.some(r => new Date(r.created_at).getHours() === 8) },
        { name: 'Final Boss', emoji: '👿', color: '#8b5cf6', requirement: 'Complete 50 unique teacher tests', unlocked: results.filter(r => r.is_diagnostic == 0).length >= 50 },
    ];

    const allBadges = milestoneBadges;

    const unlockedBadges = allBadges.filter(b => b.unlocked);
    const nextBadge = allBadges.find(b => !b.unlocked);
    const futureBadges = allBadges.filter(b => !b.unlocked && b !== nextBadge);

    return (
        <div className="container" style={{ paddingBottom: '3rem' }}>
            <h2 className="mb-4">🎖 Achievement Collection</h2>

            {/* Summary Progress Card */}
            <div className="card mb-6" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #a0a000 100%)', color: 'white', padding: '2rem', boxShadow: '0 8px 24px rgba(128,128,0,0.2)' }}>
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.75rem' }}>Your Journey</h3>
                        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '1.1rem' }}>
                            Rank: <strong>{unlockedBadges.length >= 40 ? 'Legend' : unlockedBadges.length >= 25 ? 'Master' : unlockedBadges.length >= 10 ? 'Scholar' : 'Novice'}</strong>
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{unlockedBadges.length}</span>
                        <span style={{ fontSize: '1.25rem', opacity: 0.8 }}> / {allBadges.length} unlocked</span>
                    </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '1rem', height: '1.25rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.3)' }}>
                    <div style={{
                        width: `${(unlockedBadges.length / allBadges.length) * 100}%`,
                        height: '100%',
                        background: 'white',
                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 0 15px rgba(255,255,255,0.5)'
                    }}></div>
                </div>
            </div>

            {/* Current Focus: The Next Badge */}
            {nextBadge && (
                <div className="mb-6">
                    <h3 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🎯 Current Goal <span className="badge" style={{ background: 'var(--primary)', color: 'white', fontSize: '0.7rem' }}>NEXT</span>
                    </h3>
                    <div className="card" style={{ 
                        border: '2px solid var(--primary)', 
                        background: 'var(--primary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem',
                        padding: '1.5rem',
                        animation: 'pulse 2s infinite'
                    }}>
                        <div style={{ fontSize: '4rem', filter: 'grayscale(50%) contrast(0.8)' }}>{nextBadge.emoji}</div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, color: 'var(--primary)' }}>{nextBadge.name}</h3>
                            <p className="text-muted" style={{ margin: '0.25rem 0 0.5rem 0' }}>{nextBadge.requirement}</p>
                            <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', width: '200px', overflow: 'hidden' }}>
                                <div style={{ width: '0%', height: '100%', background: 'var(--primary)' }}></div>
                            </div>
                        </div>
                        <style>{`
                            @keyframes pulse {
                                0% { box-shadow: 0 0 0 0 rgba(128,128,0, 0.4); }
                                70% { box-shadow: 0 0 0 15px rgba(128,128,0, 0); }
                                100% { box-shadow: 0 0 0 0 rgba(128,128,0, 0); }
                            }
                        `}</style>
                    </div>
                </div>
            )}

            {/* Unlocked Badges Grid */}
            <div className="mb-8">
                <h3 className="mb-4">✨ Hard-Earned Achievements ({unlockedBadges.length})</h3>
                <div className="grid">
                    {unlockedBadges.map((badge, idx) => (
                        <div key={idx} className="card achievement-card" style={{
                            borderTop: `4px solid ${badge.color}`,
                            textAlign: 'center',
                            padding: '1.5rem 1rem'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{badge.emoji}</div>
                            <h4 style={{ margin: 0, color: badge.color, fontSize: '1rem' }}>{badge.name}</h4>
                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>{badge.requirement}</small>
                        </div>
                    ))}
                    {unlockedBadges.length === 0 && (
                        <div className="text-muted p-8 text-center" style={{ gridColumn: '1/-1', border: '2px dashed var(--border)', borderRadius: '1rem', padding: '3rem' }}>
                            Your trophy cabinet is empty. Complete your first test to start!
                        </div>
                    )}
                </div>
            </div>

            {/* Future Badges: Placeholders */}
            <div>
                <h3 className="mb-4" style={{ color: 'var(--text-muted)' }}>🔒 Locked Achievements ({futureBadges.length})</h3>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                    {futureBadges.map((badge, idx) => (
                        <div key={idx} style={{
                            background: 'var(--background)',
                            border: '1px solid var(--border)',
                            borderRadius: '0.75rem',
                            padding: '1rem',
                            textAlign: 'center',
                            opacity: 0.6
                        }}>
                            <div style={{ fontSize: '1.5rem', filter: 'grayscale(100%)', marginBottom: '0.5rem', opacity: 0.3 }}>
                                {badge.emoji}
                            </div>
                            <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', width: '60%', margin: '0 auto' }}></div>
                            <p style={{ margin: '8px 0 0 0', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '800' }}>LOCKED</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Badges;
