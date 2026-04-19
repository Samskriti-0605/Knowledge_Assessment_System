import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const TestPlayer = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [assessment, setAssessment] = useState(null);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);

    const [warningCount, setWarningCount] = useState(0);
    const [isCheating, setIsCheating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check if already taken
                const resultRes = await api.get(`submissions.php?user_id=${user.id}&assessment_id=${id}`);
                if (resultRes.data.length > 0) {
                    alert('You have already completed this assessment.');
                    navigate('/student-dashboard');
                    return;
                }

                const assessRes = await api.get(`assessments.php?id=${id}`);
                setAssessment(assessRes.data);
                if (assessRes.data.duration_minutes) {
                    setTimeLeft(assessRes.data.duration_minutes * 60);
                }

                const qRes = await api.get(`questions.php?assessment_id=${id}`);
                setQuestions(qRes.data);
            } catch (error) {
                console.error('Error loading test', error);
            }
        };
        fetchData();
    }, [id, user.id, navigate]);

    // Anti-Cheating: Detect tab switching
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setWarningCount(prev => {
                    const next = prev + 1;
                    if (next >= 2) {
                        alert("ZERO TOLERANCE POLICY: Test auto-submitted due to multiple tab switches.");
                        handleSubmit();
                    } else {
                        setIsCheating(true);
                    }
                    return next;
                });
            }
        };

        const handlePaste = (e) => {
            e.preventDefault();
            alert("Copy-Paste is disabled during assessments.");
        };

        const handleCopy = (e) => {
            e.preventDefault();
            alert("Copying questions is not allowed.");
        };

        const preventContextMenu = (e) => e.preventDefault();

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('paste', handlePaste);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('contextmenu', preventContextMenu);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('paste', handlePaste);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('contextmenu', preventContextMenu);
        };
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && assessment && timeLeft !== null) {
            // Auto-submit when time is up
            handleSubmit();
        }
    }, [timeLeft, assessment]);

    const handleOptionSelect = (questionId, option) => {
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const handleSubmit = async () => {
        const formattedAnswers = Object.keys(answers).map(qid => ({
            question_id: qid,
            selected_option: answers[qid]
        }));

        try {
            await api.post('submissions.php', {
                user_id: user.id,
                assessment_id: id,
                answers: formattedAnswers
            });
            alert('Test Submitted Successfully!');
            navigate('/student-dashboard');
        } catch (error) {
            alert('Error submitting test');
        }
    };

    if (!assessment) return <div className="container text-center mt-4">Loading assessment...</div>;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="container" style={{ maxWidth: '800px', userSelect: 'none' }}>
            {/* Warning Overlay */}
            {isCheating && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex',
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white'
                }}>
                    <h1 style={{ fontSize: '4rem' }}>⚠️ WARNING</h1>
                    <p style={{ fontSize: '1.5rem' }}>Switching tabs is strictly prohibited!</p>
                    <p>Current Warnings: {warningCount} / 2</p>
                    <button className="btn btn-primary" onClick={() => setIsCheating(false)} style={{ marginTop: '2rem' }}>
                        I Understand, Resume Test
                    </button>
                </div>
            )}

            <div className="flex justify-between items-center mb-4 p-4 card" style={{ 
                position: 'sticky', top: '1rem', zIndex: 10, 
                background: 'var(--card-bg)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--border)'
            }}>
                <h2 style={{ margin: 0 }}>{assessment.title}</h2>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: timeLeft < 60 ? '#ef4444' : 'var(--primary)' }}>
                    ⏱ Time Left: {formatTime(timeLeft)}
                </div>
            </div>

            <div className="mb-4">
                {questions.length === 0 ? (
                    <div className="card text-center">No questions found for this assessment.</div>
                ) : (
                    questions.map((q, idx) => (
                        <div key={q.id} className="card mb-4">
                            <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                                <span style={{ color: 'var(--primary)', marginRight: '0.5rem' }}>Question {idx + 1}:</span>
                                {q.question_text}
                                <span className="text-muted" style={{ fontSize: '0.9rem', marginLeft: '1rem' }}>({q.marks} marks)</span>
                            </p>
                            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                                {['A', 'B', 'C', 'D'].map(opt => (
                                    <label 
                                        key={opt} 
                                        className="flex items-center gap-2 p-3 card" 
                                        style={{ 
                                            cursor: 'pointer', 
                                            background: answers[q.id] === opt ? 'rgba(128, 128, 0, 0.1)' : 'var(--background)', 
                                            borderColor: answers[q.id] === opt ? 'var(--primary)' : 'var(--border)' 
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name={`q_${q.id}`}
                                            value={opt}
                                            checked={answers[q.id] === opt}
                                            onChange={() => handleOptionSelect(q.id, opt)}
                                            style={{ width: '1.2rem', height: '1.2rem' }}
                                        />
                                        <div style={{ flex: 1, color: 'var(--text-main)' }}>
                                            <strong style={{ marginRight: '0.5rem' }}>{opt}:</strong>
                                            {q[`option_${opt.toLowerCase()}`]}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="text-center mt-4 mb-4">
                <button
                    onClick={() => { if (window.confirm('Are you sure you want to submit?')) handleSubmit(); }}
                    className="btn btn-primary"
                    style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}
                >
                    Submit Assessment
                </button>
            </div>
        </div>
    );
};

export default TestPlayer;
