import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
    const [assessments, setAssessments] = useState([]);
    const [students, setStudents] = useState([]);
    const [deleteRequests, setDeleteRequests] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchAssessments();
        fetchStudents();
        fetchDeleteRequests();
    }, []);

    const fetchAssessments = async () => {
        try {
            const response = await api.get(`assessments.php?teacher_id=${user.id}`);
            setAssessments(response.data);
        } catch (error) {
            console.error('Error fetching assessments', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await api.get(`users.php?class_name=${user.class_name}&section=${user.section}&role=student`);
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students', error);
        }
    };

    const fetchDeleteRequests = async () => {
        try {
            const response = await api.get(`users.php?class_name=${user.class_name}&section=${user.section}&role=student&delete_requested=1`);
            setDeleteRequests(response.data);
        } catch (error) {
            console.error('Error fetching delete requests', error);
        }
    };

    const handleApproveDelete = async (studentId) => {
        if (window.confirm("PERMANENTLY DELETE this account? This will remove all their test data and cannot be undone.")) {
            try {
                await api.delete(`users.php?id=${studentId}`);
                alert("Account deleted.");
                fetchDeleteRequests();
                fetchStudents();
            } catch (error) {
                alert("Failed to delete account.");
            }
        }
    };

    const handleRejectDelete = async (studentId) => {
        try {
            await api.put(`users.php`, { id: studentId, action: 'reject_deletion' });
            alert("Request rejected.");
            fetchDeleteRequests();
        } catch (error) {
            alert("Failed to reject request.");
        }
    };

    const stats = {
        totalAssessments: assessments.length,
        totalQuestions: assessments.reduce((sum, a) => sum + (parseInt(a.question_count) || 0), 0),
        totalStudents: students.length
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this assessment?')) {
            try {
                await api.delete(`assessments.php?id=${id}`);
                fetchAssessments();
            } catch (error) {
                console.error('Error deleting assessment', error);
            }
        }
    };

    return (
        <div className="container">
            <h2 className="mb-4">Teacher Dashboard</h2>

            <div className="card mb-4" style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                border: 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Management Overview</h3>
                <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>Monitor classes, questions, and assessment performance across your assigned groups.</p>
            </div>

            {/* Analytics Summary */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2rem' }}>
                <div className="card" style={{ textAlign: 'center', borderTop: '4px solid var(--primary)' }}>
                    <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary)' }}>{stats.totalAssessments}</h3>
                    <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>Assessments Created</p>
                </div>
                <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #94a3b8' }}>
                    <h3 style={{ margin: 0, fontSize: '2rem', color: '#94a3b8' }}>{stats.totalQuestions}</h3>
                    <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>Total Questions</p>
                </div>
            </div>

            {/* Pie Chart Visualization */}
            {assessments.length > 0 && (
                <div className="card mb-4">
                    <h3 className="mb-4">📊 Assessment Distribution</h3>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Simple Pie Chart */}
                        <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                                {assessments.slice(0, 5).map((assessment, idx) => {
                                    const colors = ['#808000', '#94a3b8', '#556b2f', '#cbd5e1', '#6b7280'];
                                    const total = assessments.length;
                                    const percent = 100 / total;
                                    const offset = assessments.slice(0, idx).reduce((sum) => sum + (100 / total), 0);
                                    const circumference = 2 * Math.PI * 30;
                                    const dashArray = `${(percent / 100) * circumference} ${circumference}`;
                                    const dashOffset = -((offset / 100) * circumference);

                                    return (
                                        <circle
                                            key={idx}
                                            cx="50"
                                            cy="50"
                                            r="30"
                                            fill="transparent"
                                            stroke={colors[idx % colors.length]}
                                            strokeWidth="20"
                                            strokeDasharray={dashArray}
                                            strokeDashoffset={dashOffset}
                                        />
                                    );
                                })}
                                <circle cx="50" cy="50" r="20" fill="var(--card-bg)" />
                            </svg>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{assessments.length}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total</div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div style={{ flex: 1 }}>
                            {assessments.slice(0, 5).map((assessment, idx) => {
                                const colors = ['#808000', '#94a3b8', '#556b2f', '#cbd5e1', '#6b7280'];
                                return (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <div style={{ width: '1rem', height: '1rem', background: colors[idx % colors.length], borderRadius: '0.25rem' }}></div>
                                        <span style={{ fontSize: '0.875rem' }}>{assessment.title}</span>
                                    </div>
                                );
                            })}
                            {assessments.length > 5 && (
                                <small style={{ color: 'var(--text-muted)' }}>+ {assessments.length - 5} more assessments</small>
                            )}
                        </div>
                    </div>
                </div>
            )}


            {/* Account Deletion Requests */}
            {deleteRequests.length > 0 && (
                <div className="card mb-4" style={{ border: '1px solid #dc2626', background: 'rgba(220, 38, 38, 0.05)' }}>
                    <h3 className="mb-4" style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        ⚠️ Account Deletion Requests ({deleteRequests.length})
                    </h3>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ color: 'var(--text-main)' }}>Roll No</th>
                                    <th style={{ color: 'var(--text-main)' }}>Student Name</th>
                                    <th style={{ textAlign: 'right', color: 'var(--text-main)' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deleteRequests.map((req) => (
                                    <tr key={req.id}>
                                        <td>{req.roll_number}</td>
                                        <td><strong>{req.name}</strong></td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button 
                                                onClick={() => handleApproveDelete(req.id)}
                                                className="btn btn-primary" 
                                                style={{ background: '#dc2626', borderColor: '#dc2626', marginRight: '0.5rem', fontSize: '0.75rem' }}
                                            >
                                                Approve Deletion
                                            </button>
                                            <button 
                                                onClick={() => handleRejectDelete(req.id)}
                                                className="btn btn-outline" 
                                                style={{ fontSize: '0.75rem' }}
                                            >
                                                Keep Account
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* My Students List */}
            {students.length > 0 && (
                <div className="card mb-4" style={{ padding: '0' }}>
                    <div style={{ padding: '2rem 2rem 0' }}>
                        <h3 className="mb-4">📋 My Students</h3>
                        <p className="text-muted mb-4">Students in your assigned class and section.</p>
                    </div>
                    <div className="table-responsive" style={{ padding: '0 2rem 2rem' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Roll Number</th>
                                    <th>Name</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id}>
                                        <td>{student.roll_number || 'N/A'}</td>
                                        <td>{student.name}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <Link to={`/student-progress?roll=${student.roll_number}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                📄 View & Export Report
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="card mb-4">
                <h3 className="mb-4">Quick Actions</h3>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Link to="/create-test" className="btn btn-primary" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        ➕ Create New Assessment
                    </Link>
                    <Link to="/teacher-assessments" className="btn btn-outline" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        📝 View All Assessments
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
