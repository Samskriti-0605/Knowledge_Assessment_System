import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

const Results = () => {
    const { id } = useParams();
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await api.get(`submissions.php?assessment_id=${id}`);
                setSubmissions(response.data);
            } catch (error) {
                console.error('Error fetching results', error);
            }
        };
        fetchResults();
    }, [id]);

    return (
        <div className="container">
            <h2 className="mb-4">Assessment Results</h2>
            <div className="card">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Score</th>
                                <th>Total Marks</th>
                                <th>Percentage</th>
                                <th>Submitted At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map(sub => (
                                <tr key={sub.id}>
                                    <td>{sub.student_name}</td>
                                    <td>{sub.score}</td>
                                    <td>{sub.total_marks}</td>
                                    <td>{((sub.score / sub.total_marks) * 100).toFixed(1)}%</td>
                                    <td>{new Date(sub.submitted_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Results;
