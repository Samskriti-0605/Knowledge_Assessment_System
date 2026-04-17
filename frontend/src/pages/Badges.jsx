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

    const milestoneBadges = [
        { name: 'First Steps', emoji: '🎯', color: '#808000', requirement: 'Complete 1 test', unlocked: results.length >= 1 },
        { name: 'Dedicated', emoji: '🔥', color: '#808000', requirement: 'Complete 3 tests', unlocked: results.length >= 3 },
        { name: 'Committed', emoji: '⭐', color: '#808000', requirement: 'Complete 5 tests', unlocked: results.length >= 5 },
        { name: 'Unstoppable', emoji: '💪', color: '#808000', requirement: 'Complete 10 tests', unlocked: results.length >= 10 },
        { name: 'Veteran', emoji: '🏅', color: '#808000', requirement: 'Complete 15 tests', unlocked: results.length >= 15 },
        { name: 'Bronze Streak', emoji: '⚡', color: '#808000', requirement: '3 Day Login Streak', unlocked: user.streak_count >= 3 },
        { name: 'Gold Streak', emoji: '👑', color: '#808000', requirement: '7 Day Login Streak', unlocked: user.streak_count >= 7 },
        { name: 'Point Master', emoji: '💰', color: '#808000', requirement: 'Reach 200 Total Points', unlocked: totalPoints >= 200 },
        { name: 'High Achiever', emoji: '🏆', color: '#808000', requirement: 'Average 80%+ score', unlocked: avgScore >= 80 },
        { name: 'Excellence', emoji: '💎', color: '#808000', requirement: 'Average 95%+ score', unlocked: avgScore >= 95 },
        { name: 'Perfect Score', emoji: '🌟', color: '#808000', requirement: 'Score 100% on any test', unlocked: results.some(r => (r.score / r.total_marks) * 100 === 100) },
    ];

    const allBadges = milestoneBadges;

    const unlockedBadges = allBadges.filter(b => b.unlocked);
    // Only show the SINGLE NEXT locked badge to unlock it one by one
    const lockedBadges = allBadges.filter(b => !b.unlocked).slice(0, 1);

    return (
        <div className="container">
            <h2 className="mb-4">🎖 Achievement Badges</h2>

            <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #808000 0%, #a0a000 100%)', color: 'white', padding: '2rem' }}>
                <h3 style={{ margin: 0 }}>Your Progress</h3>
                <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
                    You've unlocked {unlockedBadges.length} out of {allBadges.length} badges!
                </p>
                <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '0.5rem', height: '1rem', overflow: 'hidden' }}>
                    <div style={{
                        width: `${(unlockedBadges.length / allBadges.length) * 100}%`,
                        height: '100%',
                        background: 'white',
                        transition: 'width 0.5s ease'
                    }}></div>
                </div>
            </div>

            <div className="mb-4">
                <h3 className="mb-4">✨ Unlocked Badges ({unlockedBadges.length})</h3>
                <div className="grid">
                    {unlockedBadges.map((badge, idx) => (
                        <div key={idx} className="card" style={{
                            borderLeft: `4px solid ${badge.color}`,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            transform: 'translateY(0)',
                            transition: 'transform 0.3s ease'
                        }}>
                            <div className="flex items-center gap-2 mb-2">
                                <span style={{ fontSize: '3rem' }}>{badge.emoji}</span>
                                <div>
                                    <h4 style={{ margin: 0, color: badge.color }}>{badge.name}</h4>
                                    <small className="text-muted">{badge.requirement}</small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {lockedBadges.length > 0 && (
                <div className="mb-4">
                    <h3 className="mb-4">🔒 Locked Badges ({lockedBadges.length})</h3>
                    <div className="grid">
                        {lockedBadges.map((badge, idx) => (
                            <div key={idx} className="card" style={{
                                opacity: 0.5,
                                borderLeft: `4px solid #cbd5e1`
                            }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span style={{ fontSize: '3rem', filter: 'grayscale(100%)' }}>{badge.emoji}</span>
                                    <div>
                                        <h4 style={{ margin: 0, color: '#94a3b8' }}>{badge.name}</h4>
                                        <small className="text-muted">{badge.requirement}</small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Badges;
