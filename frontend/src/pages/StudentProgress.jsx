import React, { useState } from 'react';
import api from '../utils/api';

const StudentProgress = () => {
    const [rollNumber, setRollNumber] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.get(`student_progress.php?roll_number=${rollNumber}`);
            setStudentData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Student not found');
            setStudentData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2 className="mb-4">Student Progress Tracker</h2>

            <div className="card mb-4">
                <h3>Search Student</h3>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <input
                        type="text"
                        className="input"
                        placeholder="Enter Roll Number"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        required
                        style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>
                {error && <div className="mt-4 p-3" style={{ background: 'var(--secondary)', color: 'white', borderRadius: '0.5rem' }}>{error}</div>}
            </div>

            {studentData && (
                <>
                    {/* Student Info Card */}
                    <div className="card mb-4">
                        <h3 className="mb-4">Student Information</h3>
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div>
                                <p className="text-muted" style={{ marginBottom: '0.5rem' }}>Name</p>
                                <p style={{ fontWeight: 'bold', margin: 0 }}>{studentData.student.name}</p>
                            </div>
                            <div>
                                <p className="text-muted" style={{ marginBottom: '0.5rem' }}>Email</p>
                                <p style={{ fontWeight: 'bold', margin: 0 }}>{studentData.student.email}</p>
                            </div>
                            <div>
                                <p className="text-muted" style={{ marginBottom: '0.5rem' }}>Class</p>
                                <p style={{ fontWeight: 'bold', margin: 0 }}>{studentData.student.class_name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-muted" style={{ marginBottom: '0.5rem' }}>Section</p>
                                <p style={{ fontWeight: 'bold', margin: 0 }}>{studentData.student.section || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-muted" style={{ marginBottom: '0.5rem' }}>Roll Number</p>
                                <p style={{ fontWeight: 'bold', margin: 0 }}>{studentData.student.roll_number}</p>
                            </div>
                        </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="grid mb-4">
                        <div className="card" style={{ textAlign: 'center', borderTop: '4px solid var(--primary)' }}>
                            <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary)' }}>{studentData.statistics.total_tests}</h3>
                            <p className="text-muted" style={{ margin: '0.5rem 0 0 0' }}>Tests Completed</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center', borderTop: '4px solid var(--secondary)' }}>
                            <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--secondary)' }}>{studentData.statistics.average_score}%</h3>
                            <p className="text-muted" style={{ margin: '0.5rem 0 0 0' }}>Average Score</p>
                        </div>
                    </div>

                    {/* Test History */}
                    <div className="card">
                        <h3 className="mb-4">Test History</h3>
                        {studentData.submissions.length === 0 ? (
                            <p className="text-muted">No tests completed yet.</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Assessment</th>
                                            <th>Score</th>
                                            <th>Total Marks</th>
                                            <th>Percentage</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentData.submissions.map((submission) => {
                                            const percentage = ((submission.score / submission.total_marks) * 100).toFixed(2);
                                            return (
                                                <tr key={submission.id}>
                                                    <td>{submission.assessment_title}</td>
                                                    <td>{submission.score}</td>
                                                    <td>{submission.total_marks}</td>
                                                    <td>
                                                        <span style={{
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '0.25rem',
                                                            background: percentage >= 60 ? 'var(--primary)' : 'var(--secondary)',
                                                            color: 'white',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {percentage}%
                                                        </span>
                                                    </td>
                                                    <td>{new Date(submission.submitted_at).toLocaleDateString()}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default StudentProgress;
