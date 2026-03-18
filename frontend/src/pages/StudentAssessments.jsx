import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const StudentAssessments = () => {
    const [assessments, setAssessments] = useState([]);
    const [results, setResults] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchAssessments();
        fetchResults();
    }, []);

    const fetchAssessments = async () => {
        try {
            const response = await api.get(`/assessments.php?class_name=${user.class_name}&section=${user.section}`);
            setAssessments(response.data);
        } catch (error) {
            console.error('Error fetching assessments', error);
        }
    };

    const fetchResults = async () => {
        try {
            const response = await api.get(`/submissions.php?user_id=${user.id}`);
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching results', error);
        }
    };

    return (
        <div className="container">
            <h2 className="mb-4">📚 All Assessments</h2>

            <div className="mb-4">
                <h3 className="mb-4">Available Tests</h3>
                <div className="grid">
                    {assessments.map(assessment => {
                        const result = results.find(r => r.assessment_id === assessment.id);
                        const alreadyTaken = !!result;
                        return (
                            <div key={assessment.id} className="card shadow-sm" style={{ borderTop: '4px solid var(--primary)' }}>
                                <div className="flex justify-between items-start mb-4">
                                    <h4 style={{ margin: 0, fontSize: '1.25rem' }}>{assessment.title}</h4>
                                    <span className="badge" style={{ background: '#f1f5f9', color: '#475569', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                                        {assessment.duration_minutes} mins
                                    </span>
                                </div>
                                <p className="text-muted" style={{ fontSize: '0.9rem', minHeight: '3rem' }}>{assessment.description}</p>

                                <div className="mt-4 pt-4" style={{ borderTop: '1px solid #f1f5f9' }}>
                                    {alreadyTaken ? (
                                        <div className="flex justify-between items-center">
                                            <div style={{ color: '#808000', fontWeight: '700' }}>
                                                Score: <span style={{ fontSize: '1.25rem' }}>{result.score}</span> / {result.total_marks}
                                            </div>
                                            <span className="text-muted" style={{ fontSize: '0.9rem' }}>✓ Completed</span>
                                        </div>
                                    ) : (
                                        <Link to={`/take-test/${assessment.id}`} className="btn btn-primary w-full" style={{ textAlign: 'center', background: '#808000', borderColor: '#808000' }}>
                                            Take Assessment →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="card mt-4">
                <h3 className="mb-4">My Results</h3>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Assessment</th>
                                <th>Score</th>
                                <th>Total Marks</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(result => (
                                <tr key={result.id}>
                                    <td>{result.assessment_title}</td>
                                    <td>{result.score}</td>
                                    <td>{result.total_marks}</td>
                                    <td>{new Date(result.submitted_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentAssessments;
