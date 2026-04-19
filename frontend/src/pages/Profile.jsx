import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import html2pdf from 'html2pdf.js';
import ProgressReport from '../components/ProgressReport';

const Profile = () => {
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        class_name: '',
        section: '',
        roll_number: '',
        subject: '',
        phone_number: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [results, setResults] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                class_name: user.class_name || '',
                section: user.section || '',
                roll_number: user.roll_number || '',
                subject: user.subject || '',
                phone_number: user.phone_number || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            fetchResults();
        }
    }, [user]);

    const fetchResults = async () => {
        try {
            const response = await api.get(`submissions.php?user_id=${user.id}`);
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching results', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            const updateData = {
                id: user.id,
                name: formData.name,
                email: formData.email,
                class_name: formData.class_name,
                section: formData.section,
                roll_number: formData.roll_number,
                subject: formData.subject,
                phone_number: formData.phone_number
            };

            if (formData.newPassword) {
                updateData.password = formData.newPassword;
            }

            const response = await api.put('/users.php', updateData);

            if (response.data.message) {
                setMessage('Profile updated successfully!');
                const updatedUser = { ...user, ...updateData };
                delete updatedUser.password;
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));

                setFormData({
                    ...formData,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    const avgScore = results.length > 0
        ? Math.round(results.reduce((sum, r) => sum + (r.score / r.total_marks * 100), 0) / results.length)
        : 0;

    // Custom Chart Component (SVG based)
    const PerformanceChart = () => {
        if (results.length === 0) return <p className="text-muted text-center py-4">Take some tests to see your progress!</p>;

        const data = results.slice().reverse().map(r => (r.score / r.total_marks) * 100);
        const width = 500;
        const height = 150;
        const padding = 20;
        const points = data.map((d, i) => {
            const x = (i / (Math.max(data.length - 1, 1))) * (width - 2 * padding) + padding;
            const y = height - ((d / 100) * (height - 2 * padding) + padding);
            return `${x},${y}`;
        }).join(' ');

        return (
            <div className="mt-4" style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 1rem 0', display: 'flex', justifyContent: 'space-between' }}>
                    📈 Performance Trend
                    <span style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>Avg: {avgScore}%</span>
                </h4>
                <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                    {/* Grid Lines */}
                    {[0, 25, 50, 75, 100].map(h => {
                        const y = height - ((h / 100) * (height - 2 * padding) + padding);
                        return (
                            <line key={h} x1={padding} y1={y} x2={width - padding} y2={y} stroke="var(--border)" strokeDasharray="4" />
                        );
                    })}
                    {/* The Line */}
                    <polyline
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points}
                    />
                    {/* Points */}
                    {data.map((d, i) => {
                        const x = (i / (Math.max(data.length - 1, 1))) * (width - 2 * padding) + padding;
                        const y = height - ((d / 100) * (height - 2 * padding) + padding);
                        return (
                            <circle key={i} cx={x} cy={y} r="4" fill="var(--primary)" />
                        );
                    })}
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    <span>First Test</span>
                    <span>Recent</span>
                </div>
            </div>
        );
    };

    const handleDownloadReport = async () => {
        if (isDownloading) return;
        setIsDownloading(true);

        try {
            // Fetch comprehensive report data
            const response = await api.get(`student_progress.php?roll_number=${user.roll_number}`);
            setReportData(response.data);

            // Give it a moment to render the hidden component
            setTimeout(() => {
                const element = document.querySelector('#hidden-report .printable-report');
                if (element) {
                    const opt = {
                        margin: [10, 10, 10, 10],
                        filename: `Progress_Report_${user.name}.pdf`,
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2, useCORS: true },
                        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                    };
                    html2pdf().set(opt).from(element).save().then(() => {
                        setIsDownloading(false);
                        setReportData(null);
                    });
                }
            }, 800);
        } catch (error) {
            alert("Failed to generate report.");
            setIsDownloading(false);
        }
    };

    const handleDeleteRequest = async () => {
        if (window.confirm("ARE YOU SURE? This will request the teacher to PERMANENTLY DELETE your account and all scores. This cannot be undone.")) {
            try {
                const response = await api.put('users.php', {
                    id: user.id,
                    action: 'request_deletion'
                });
                alert(response.data.message);
                // Update local status
                const updatedUser = { ...user, delete_requested: 1 };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            } catch (error) {
                alert("Could not send deletion request.");
            }
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div className="flex justify-between items-center mb-2" style={{ marginTop: '2rem' }}>
                <h2 style={{ margin: 0 }}>👤 My Profile</h2>
                {user.delete_requested == 1 && (
                    <div className="badge" style={{ background: 'var(--danger-light)', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '0.4rem 1rem', fontSize: '0.8rem', fontWeight: 'bold', borderRadius: '0.5rem' }}>
                        ⏳ DELETION REQUEST PENDING
                    </div>
                )}
            </div>
            
            <div className="grid" style={{ gridTemplateColumns: '1fr 1.5fr', gap: '2rem', alignItems: 'start' }}>

                {/* Profile Information Card */}
                <div className="card" style={{ textAlign: 'center', padding: '2rem', position: 'sticky', top: '2rem' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #808000 0%, #94a3b8 100%)',
                        margin: '0 auto 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        color: 'white',
                        boxShadow: '0 10px 15px -3px rgba(128, 128, 0, 0.4)'
                    }}>
                        {user.name?.[0].toUpperCase()}
                    </div>

                    <h2 style={{ margin: '0 0 0.5rem 0' }}>{user.name}</h2>
                    <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 1rem',
                        background: 'var(--primary)',
                        color: 'white',
                        borderRadius: '2rem',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                        marginBottom: '1.5rem'
                    }}>
                        {user.role === 'teacher' ? 'Staff' : 'Student'}
                    </span>

                    <div style={{ textAlign: 'left', background: 'var(--background)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <small className="text-muted" style={{ display: 'block', marginBottom: '0.25rem' }}>Email Address</small>
                            <strong>{user.email}</strong>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <small className="text-muted" style={{ display: 'block', marginBottom: '0.25rem' }}>Phone Number</small>
                            <strong>{user.phone_number || 'Not provided'}</strong>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <small className="text-muted" style={{ display: 'block', marginBottom: '0.25rem' }}>Class</small>
                                <strong>{user.class_name || 'N/A'}</strong>
                            </div>
                            <div style={{ flex: 1 }}>
                                <small className="text-muted" style={{ display: 'block', marginBottom: '0.25rem' }}>Section</small>
                                <strong>{user.section || 'N/A'}</strong>
                            </div>
                        </div>
                    </div>

                    {user.role === 'student' && (
                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                            <div className="card" style={{ padding: '0.75rem', border: '1px solid var(--border)', background: 'var(--background)' }}>
                                <h3 style={{ margin: 0, color: 'var(--primary)' }}>{results.length}</h3>
                                <small className="text-muted">Tests</small>
                            </div>
                            <div className="card" style={{ padding: '0.75rem', border: '1px solid var(--border)', background: 'var(--background)' }}>
                                <h3 style={{ margin: 0, color: 'var(--primary)' }}>{avgScore}%</h3>
                                <small className="text-muted">Avg Score</small>
                            </div>
                        </div>
                    )}

                    <button onClick={logout} className="btn w-100" style={{ width: '100%', background: 'var(--secondary)', color: 'white', fontWeight: 'bold', marginBottom: '1rem' }}>
                        🚪 Logout Account
                    </button>

                    {user.role === 'student' && (
                        <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                            <button 
                                onClick={handleDeleteRequest}
                                disabled={user.delete_requested == 1}
                                className="btn" 
                                style={{ 
                                    width: '100%', 
                                    background: user.delete_requested == 1 ? 'var(--background)' : 'var(--danger-light)',
                                    color: 'var(--danger)',
                                    border: `1px solid ${user.delete_requested == 1 ? 'var(--border)' : 'var(--danger)'}`,
                                    fontSize: '0.875rem'
                                }}
                            >
                                {user.delete_requested == 1 ? 'Deletion Pending Approval' : '⚠️ Request Account Deletion'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Edit Section & Charts */}
                <div>
                    <div className="card mb-4">
                        <h3 className="mb-4">Personal Settings</h3>
                        {message && <div style={{ padding: '1rem', background: 'var(--success-light)', color: 'var(--success)', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid var(--success)' }}>{message}</div>}
                        {error && <div style={{ padding: '1rem', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid var(--danger)' }}>{error}</div>}

                        <form onSubmit={handleSubmit} className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label>Full Name</label>
                                <input type="text" name="name" className="input" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" name="email" className="input" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" name="phone_number" className="input" value={formData.phone_number} onChange={handleChange} required={user.role === 'student'} />
                            </div>
                            <div className="form-group">
                                <label>Class</label>
                                <input type="text" name="class_name" className="input" value={formData.class_name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Section</label>
                                <input type="text" name="section" className="input" value={formData.section} onChange={handleChange} required />
                            </div>
                            {user.role === 'student' && (
                                <div className="form-group">
                                    <label>Roll Number</label>
                                    <input type="text" name="roll_number" className="input" value={formData.roll_number} onChange={handleChange} required />
                                </div>
                            )}
                            <div className="form-group" style={{ gridColumn: user.role === 'teacher' ? 'span 2' : 'span 1' }}>
                                <label>Subject</label>
                                <input type="text" name="subject" className="input" value={formData.subject} onChange={handleChange} required />
                            </div>

                            <hr style={{ gridColumn: 'span 2', margin: '0.5rem 0', opacity: 0.2 }} />

                            <div className="form-group">
                                <label>New Password</label>
                                <input type="password" name="newPassword" className="input" value={formData.newPassword} onChange={handleChange} placeholder="Keep empty to stay same" />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input type="password" name="confirmPassword" className="input" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm new password" />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2', padding: '1rem' }}>
                                Save Changes
                            </button>
                        </form>
                    </div>

                    {user.role === 'student' && (
                        <div className="card">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 style={{ margin: 0 }}>Performance History</h3>
                                    <p className="text-muted" style={{ margin: 0 }}>Track your improvement across assessments.</p>
                                </div>
                                <button 
                                    onClick={handleDownloadReport}
                                    disabled={isDownloading}
                                    className="btn btn-primary" 
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                                >
                                    {isDownloading ? '⏳ Generating...' : '📄 Download Progress Report'}
                                </button>
                            </div>
                            <PerformanceChart />
                        </div>
                    )}
                </div>

            </div>

            {/* Hidden Report Container for PDF Generation */}
            <div id="hidden-report" style={{ 
                position: 'absolute', 
                left: '-9999px', 
                top: 0, 
                width: '800px',
                background: 'white'
             }}>
                {reportData && <ProgressReport studentData={reportData} />}
            </div>
        </div>
    );
};

export default Profile;
