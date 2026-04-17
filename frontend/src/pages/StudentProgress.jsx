import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';

const StudentProgress = () => {
    const [rollNumber, setRollNumber] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const roll = searchParams.get('roll');
        if (roll) {
            setRollNumber(roll);
            fetchProgress(roll);
        }
    }, [searchParams]);

    const fetchProgress = async (rollToSearch) => {
        setError('');
        setLoading(true);

        try {
            const response = await api.get(`student_progress.php?roll_number=${rollToSearch}`);
            setStudentData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Student not found');
            setStudentData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        fetchProgress(rollNumber);
    };

    const handleDownloadCSV = () => {
        if (!studentData || !studentData.submissions) return;

        const headers = ["Assessment", "Score", "Total Marks", "Percentage", "Date"];
        const rows = studentData.submissions.map(sub => [
            sub.assessment_title,
            sub.score,
            sub.total_marks,
            ((sub.score / sub.total_marks) * 100).toFixed(2) + "%",
            new Date(sub.submitted_at).toLocaleDateString()
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Report_${studentData.student.roll_number}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                <div className="printable-report">
                    {/* Student Info Card */}
                    <div className="card mb-4 report-container">
                        <div className="report-header" style={{ display: 'none' }}>
                            <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid var(--primary)', paddingBottom: '1rem' }}>
                                <h1 style={{ color: 'var(--primary)', margin: 0 }}>OFFICIAL PROGRESS REPORT</h1>
                                <p style={{ margin: '5px 0', fontWeight: '600' }}>Knowledge Assessment System</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-4 hide-on-print">
                            <h3 style={{ margin: 0 }}>Student Information</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button 
                                    onClick={handleDownloadCSV} 
                                    className="btn btn-outline"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                                >
                                    📊 Download CSV
                                </button>
                                <button 
                                    onClick={() => window.print()} 
                                    className="btn btn-outline"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    📥 Download PDF Report
                                </button>
                            </div>
                        </div>
                        
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
                                                        <span className="percentage-badge" style={{
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
                        
                        {/* Report Footer */}
                        <div className="report-footer" style={{ display: 'none', marginTop: '5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div style={{ borderTop: '1px solid #000', width: '200px', textAlign: 'center', paddingTop: '0.5rem' }}>
                                    Student Signature
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Generated on {new Date().toLocaleDateString()}</p>
                                </div>
                                <div style={{ borderTop: '1px solid #000', width: '200px', textAlign: 'center', paddingTop: '0.5rem' }}>
                                    Authorized Signature
                                </div>
                            </div>
                        </div>
                    </div>

                    <style>{`
                        @media print {
                            /* Set up the page */
                            @page {
                                size: A4;
                                margin: 20mm;
                            }

                            /* Hide EVERYTHING first */
                            html, body, #root, .container {
                                background: white !important;
                                margin: 0 !important;
                                padding: 0 !important;
                            }

                            body * {
                                visibility: hidden !important;
                                position: static !important;
                            }

                            /* Show ONLY our specific report container */
                            .printable-report, .printable-report * {
                                visibility: visible !important;
                            }

                            .printable-report {
                                position: absolute !important;
                                left: 0 !important;
                                top: 0 !important;
                                width: 100% !important;
                                display: block !important;
                                padding: 0 !important;
                                margin: 0 !important;
                            }

                            /* Hide non-print UI inside the report */
                            .hide-on-print, button, form, .input {
                                display: none !important;
                            }

                            /* Clean up layout for print */
                            .card {
                                border: 1px solid #eee !important;
                                box-shadow: none !important;
                                margin-bottom: 2rem !important;
                                padding: 2rem !important;
                                page-break-inside: avoid !important;
                                background: white !important;
                            }

                            .grid {
                                display: flex !important;
                                flex-wrap: wrap !important;
                                gap: 2rem !important;
                            }

                            .grid > div {
                                flex: 1 1 200px !important;
                            }

                            /* Ensure headers and footers are visible */
                            .report-header, .report-footer {
                                display: block !important;
                                width: 100% !important;
                            }

                            .report-header h1 {
                                font-size: 24pt !important;
                                margin-bottom: 10pt !important;
                            }

                            /* Table styling */
                            .table-responsive {
                                overflow: visible !important;
                            }
                            .table {
                                width: 100% !important;
                                border-collapse: collapse !important;
                            }
                            .table th, .table td {
                                border: 1px solid #ddd !important;
                                padding: 12px !important;
                                text-align: left !important;
                                font-size: 10pt !important;
                            }
                            .table th {
                                background-color: #f8f8f8 !important;
                                -webkit-print-color-adjust: exact;
                            }

                            /* Badges/Percentages colors */
                            .percentage-badge {
                                -webkit-print-color-adjust: exact !important;
                                color-adjust: exact !important;
                                border: 1px solid #ccc !important;
                                color: black !important;
                                background: transparent !important;
                            }

                            h2, .mb-4:not(.printable-report *) { display: none !important; }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default StudentProgress;
