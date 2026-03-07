import React from 'react';

const About = () => {
    return (
        <div className="container">
            <div className="card mt-4 p-5" style={{ textAlign: 'center' }}>
                <h1 className="mb-4">About Knowledge Assessment System</h1>
                <p className="text-muted" style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
                    Welcome to the <strong>Knowledge Assessment System</strong>, a comprehensive platform designed
                    to streamline the educational experience for both students and teachers.
                </p>
                <div className="grid mt-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    <div className="card" style={{ border: '1px solid var(--border)' }}>
                        <h3>👨‍🏫 For Teachers</h3>
                        <p>Create detailed assessments, track student performance in real-time, and provide valuable feedback.</p>
                    </div>
                    <div className="card" style={{ border: '1px solid var(--border)' }}>
                        <h3>🎓 For Students</h3>
                        <p>Take assessments tailored to your class and section, earn badges, and track your learning progress over time.</p>
                    </div>
                    <div className="card" style={{ border: '1px solid var(--border)' }}>
                        <h3>🚀 Our Mission</h3>
                        <p>To provide a modern, efficient, and user-friendly environment for knowledge evaluation and growth.</p>
                    </div>
                </div>
                <div className="mt-5">
                    <p className="text-muted">Built with React & PHP</p>
                </div>
            </div>
        </div>
    );
};

export default About;
