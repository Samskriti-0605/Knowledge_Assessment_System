import React from 'react';
import SkillMap from './SkillMap';

const ProgressReport = ({ studentData }) => {
    if (!studentData) return null;

    const getSkillData = () => {
        const categories = ['Mathematics', 'Science', 'English', 'Logic', 'General Knowledge'];
        return categories.map(cat => {
            const catResults = studentData.submissions.filter(r => 
                r.category === cat || (r.assessment_title && r.assessment_title.includes(cat))
            );
            const avg = catResults.length > 0 
                ? Math.round(catResults.reduce((sum, r) => sum + (r.score / r.total_marks * 100), 0) / catResults.length)
                : 0;
            return { label: cat, value: avg };
        });
    };

    return (
        <div className="printable-report" style={{ padding: '0', background: 'var(--card-bg)' }}>
            {/* Header Card */}
            <div className="card mb-4 report-container" style={{ background: 'var(--card-bg)', color: 'var(--text-main)', padding: '3rem' }}>
                <div className="report-header">
                    <div style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '3px double var(--primary)', paddingBottom: '1.5rem' }}>
                        <h1 style={{ color: 'var(--primary)', margin: 0, fontSize: '2.5rem', letterSpacing: '2px' }}>OFFICIAL PROGRESS REPORT</h1>
                        <p style={{ margin: '10px 0', fontWeight: '800', fontSize: '1.2rem', color: 'var(--secondary)' }}>Knowledge Assessment System</p>
                    </div>
                </div>

                <div className="report-details-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '4rem',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '3rem',
                    marginBottom: '2rem'
                }}>
                    <div>
                        <h4 style={{ color: 'var(--primary)', marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.9rem', borderLeft: '4px solid var(--primary)', paddingLeft: '10px' }}>Student Profile</h4>
                        <p style={{ margin: '0.5rem 0' }}><strong>Name:</strong> {studentData.student.name}</p>
                        <p style={{ margin: '0.5rem 0' }}><strong>Email:</strong> {studentData.student.email}</p>
                        <p style={{ margin: '0.5rem 0' }}><strong>Roll Number:</strong> {studentData.student.roll_number}</p>
                        <p style={{ margin: '0.5rem 0' }}><strong>Class/Sec:</strong> {studentData.student.class_name} - {studentData.student.section}</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--secondary)', marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.9rem', borderLeft: '4px solid var(--secondary)', paddingLeft: '10px' }}>Staff Authority</h4>
                        <p style={{ margin: '0.5rem 0' }}><strong>Staff Name:</strong> {studentData.teacher.name}</p>
                        <p style={{ margin: '0.5rem 0' }}><strong>Staff Email:</strong> {studentData.teacher.email}</p>
                        <p style={{ margin: '0.5rem 0' }}><strong>Department:</strong> Examinations & Assessments</p>
                        <p style={{ margin: '0.5rem 0' }}><strong>Designation:</strong> Class Mentor</p>
                    </div>
                </div>
            </div>

            <div style={{ height: '2rem' }}></div>

            {/* Skill Map Section */}
            <div className="card mb-4" style={{ padding: '3rem', pageBreakInside: 'avoid', background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 2rem 0', fontWeight: '800', borderBottom: '2px solid var(--border)', paddingBottom: '1rem', color: 'var(--text-main)' }}>🌐 MULTI-DIMENSIONAL SKILL MAPPING</h4>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--background)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--border)' }}>
                    <SkillMap data={getSkillData()} size={400} />
                </div>
            </div>

            <div style={{ height: '2rem' }}></div>

            {/* Stats Card */}
            <div className="grid mb-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="card" style={{ textAlign: 'center', borderTop: '8px solid var(--primary)', padding: '2rem' }}>
                        <small className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>CUMULATIVE SCORE</small>
                        <h2 style={{ fontSize: '3rem', color: 'var(--primary)', margin: 0 }}>{studentData.statistics.average_score}%</h2>
                    </div>
                    <div className="card" style={{ textAlign: 'center', borderTop: '8px solid var(--secondary)', padding: '1rem' }}>
                        <small className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>ASSESSMENTS</small>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', margin: 0 }}>{studentData.statistics.total_tests}</h2>
                    </div>
                </div>

                <div className="card" style={{ borderTop: '8px solid var(--primary)', padding: '2rem' }}>
                    <h4 style={{ margin: '0 0 1.5rem 0', fontWeight: '800' }}>📈 PERFORMANCE TRAJECTORY</h4>
                    <div style={{ height: '140px', width: '100%' }}>
                        {studentData.submissions.length > 0 ? (
                            <svg viewBox="0 0 500 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                                {[0, 25, 50, 75, 100].map(h => {
                                    const y = 100 - (h * 0.8);
                                    return <line key={h} x1="0" y1={y} x2="500" y2={y} stroke="var(--border)" strokeWidth="1" strokeDasharray="4" />;
                                })}
                                <polyline
                                    fill="none"
                                    stroke="var(--primary)"
                                    strokeWidth="4"
                                    points={studentData.submissions.slice().reverse().map((s, i) => {
                                        const x = (i / (Math.max(studentData.submissions.length - 1, 1))) * 500;
                                        const y = 100 - ((s.score / s.total_marks) * 100 * 0.8);
                                        return `${x},${y}`;
                                    }).join(' ')}
                                />
                                {studentData.submissions.slice().reverse().map((s, i) => {
                                    const x = (i / (Math.max(studentData.submissions.length - 1, 1))) * 500;
                                    const y = 100 - ((s.score / s.total_marks) * 100 * 0.8);
                                    return <circle key={i} cx={x} cy={y} r="6" fill="var(--primary)" stroke="white" strokeWidth="2" />;
                                })}
                            </svg>
                        ) : <p className="text-muted text-center pt-4">No performance data.</p>}
                    </div>
                </div>
            </div>

            {/* History Card */}
            <div className="card mb-4" style={{ padding: '2.5rem' }}>
                <h4 style={{ marginBottom: '1.5rem', borderBottom: '2px solid var(--border)', paddingBottom: '1rem' }}>DETAILED ASSESSMENT LOG</h4>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '0 1rem' }}>ASSESSMENT</th>
                            <th>SCORE</th>
                            <th>RESULT %</th>
                            <th>DATE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentData.submissions.map((s) => {
                            const perc = ((s.score / s.total_marks) * 100).toFixed(1);
                            return (
                                <tr key={s.id} style={{ background: 'var(--background)' }}>
                                    <td style={{ padding: '1.2rem 1rem', borderRadius: '10px 0 0 10px', color: 'var(--text-main)' }}>
                                        <strong>{s.assessment_title}</strong>
                                    </td>
                                    <td style={{ color: 'var(--text-main)' }}>{s.score} / {s.total_marks}</td>
                                    <td>
                                        <span style={{ 
                                            background: perc >= 60 ? 'var(--success-light)' : 'var(--danger-light)', 
                                            color: perc >= 60 ? 'var(--success)' : 'var(--danger)',
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: '8px',
                                            fontWeight: 'bold',
                                            border: `1px solid ${perc >= 60 ? 'var(--success)' : 'var(--danger)'}`
                                        }}>{perc}%</span>
                                    </td>
                                    <td style={{ borderRadius: '0 10px 10px 0', color: 'var(--text-muted)' }}>
                                        {new Date(s.submitted_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div style={{ height: '4rem' }}></div>

            {/* Signature Block */}
            <div className="report-footer" style={{ padding: '0 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ textAlign: 'center', width: '220px' }}>
                        <div style={{ borderBottom: '2px solid var(--text-main)', marginBottom: '1.5rem', height: '50px' }}></div>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{studentData.student.name}</strong>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.7rem' }}>CANDIDATE SIGNATURE</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--text-main)' }}>KAS-{studentData.student.roll_number}-REF</p>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.7rem' }}>Issued: {new Date().toLocaleDateString()}</p>
                    </div>
                    <div style={{ textAlign: 'center', width: '220px' }}>
                        <div style={{ borderBottom: '2px solid var(--text-main)', marginBottom: '1.5rem', height: '50px' }}></div>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{studentData.teacher.name}</strong>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.7rem' }}>AUTHORIZED SIGNATORY</p>
                    </div>
                </div>
            </div>

            <style>{`
                .report-container { border: 1px solid var(--border) !important; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
                .card { page-break-inside: avoid !important; }
            `}</style>
        </div>
    );
};

export default ProgressReport;
