import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import html2pdf from 'html2pdf.js';
import ProgressReport from '../components/ProgressReport';

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
        if (!rollToSearch || rollToSearch.trim() === '') return;
        
        setError('');
        setLoading(true);

        try {
            const response = await api.get(`student_progress.php?roll_number=${rollToSearch.trim()}`);
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

    const handleDownloadPDF = () => {
        const element = document.querySelector('.printable-report');
        if (!element) return;

        const opt = {
            margin: [10, 10, 10, 10],
            filename: `Progress_Report_${studentData.student.roll_number || 'Student'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: true,
                letterRendering: true
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <h2 className="mb-4">Student Progress Tracker</h2>

            <div className="card mb-4 hide-on-print" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                <h3>Search Student</h3>
                <p className="text-muted mb-4">Search by student roll number to view or export their comprehensive academic record.</p>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        className="input"
                        placeholder="Enter Roll Number (e.g. STU-001)"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        required
                        style={{ flex: 1, background: 'var(--background)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Searching...' : 'Search Record'}
                    </button>
                </form>
                {error && <div className="mt-4 p-3" style={{ background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '0.5rem', border: '1px solid var(--danger)' }}>{error}</div>}
            </div>

            {studentData && (
                <div>
                    <div className="flex justify-between items-center mb-6 hide-on-print">
                        <h3 style={{ margin: 0 }}>Academic Record: {studentData.student.name}</h3>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button 
                                onClick={() => window.print()} 
                                className="btn btn-outline"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: 'var(--primary)', color: 'var(--primary)', background: 'transparent' }}
                            >
                                🖨️ Print
                            </button>
                            <button 
                                onClick={handleDownloadPDF} 
                                className="btn btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                📄 Export PDF
                            </button>
                        </div>
                    </div>

                    {/* Shared Report Component */}
                    <div className="card" style={{ padding: '0', background: 'transparent', boxShadow: 'none', border: 'none' }}>
                        <ProgressReport studentData={studentData} />
                    </div>

                    <style>{`
                        @media print {
                            @page { size: A4; margin: 0; }
                            body { margin: 0; padding: 0; background: white !important; -webkit-print-color-adjust: exact; }
                            .hide-on-print { display: none !important; }
                            .container { padding: 30mm !important; max-width: none !important; margin: 0 !important; }
                            .card { border: none !important; box-shadow: none !important; page-break-inside: avoid !important; }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default StudentProgress;
