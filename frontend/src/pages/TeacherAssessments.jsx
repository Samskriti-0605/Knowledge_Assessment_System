import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const TeacherAssessments = () => {
    const [assessments, setAssessments] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchAssessments();
    }, []);

    const fetchAssessments = async () => {
        try {
            const response = await api.get(`assessments.php?teacher_id=${user.id}`);
            setAssessments(response.data);
        } catch (error) {
            console.error('Error fetching assessments', error);
        }
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
            <div className="flex justify-between items-center mb-4">
                <h2>📝 My Assessments</h2>
                <Link to="/create-test" className="btn btn-primary">Create New Assessment</Link>
            </div>

            <div className="grid">
                {assessments.length === 0 ? (
                    <p>No assessments created yet.</p>
                ) : (
                    assessments.map(assessment => (
                        <div key={assessment.id} className="card">
                            <div className="mb-4">
                                <h3>{assessment.title}</h3>
                                <p className="text-muted">{assessment.description}</p>
                                <small className="text-gray-500">Created: {new Date(assessment.created_at).toLocaleDateString()}</small>
                            </div>
                            <div className="flex gap-2">
                                {assessment.is_diagnostic != 1 && (
                                    <Link to={`/edit-test/${assessment.id}`} className="btn btn-outline">Edit/Add Questions</Link>
                                )}
                                <Link to={`/results/${assessment.id}`} className="btn btn-primary">Results</Link>
                                {assessment.is_diagnostic != 1 && (
                                    <button onClick={() => handleDelete(assessment.id)} className="btn btn-outline" style={{ color: 'var(--secondary)', borderColor: 'var(--secondary)' }}>Delete</button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeacherAssessments;
