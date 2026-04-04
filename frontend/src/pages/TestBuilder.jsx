import React, { useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TestBuilder = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState(30);
    const [className, setClassName] = useState('');
    const [section, setSection] = useState('');
    const [step, setStep] = useState(1); // 1: Assessment Info, 2: Add Questions
    const [assessmentId, setAssessmentId] = useState(null);

    // Question State
    const [questionText, setQuestionText] = useState('');
    const [optionA, setOptionA] = useState('');
    const [optionB, setOptionB] = useState('');
    const [optionC, setOptionC] = useState('');
    const [optionD, setOptionD] = useState('');
    const [correctOption, setCorrectOption] = useState('A');
    const [marks, setMarks] = useState(1);
    const [questions, setQuestions] = useState([]);

    const handleCreateAssessment = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('assessments.php', {
                title,
                description,
                created_by: user.id,
                duration_minutes: duration,
                class_name: className,
                section: section
            });
            if (response.data.id) {
                setAssessmentId(response.data.id);
                setStep(2);
            }
        } catch (error) {
            alert('Error creating assessment');
        }
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        try {
            await api.post('questions.php', {
                assessment_id: assessmentId,
                question_text: questionText,
                option_a: optionA,
                option_b: optionB,
                option_c: optionC,
                option_d: optionD,
                correct_option: correctOption,
                marks: marks
            });

            // Add to local list for display
            setQuestions([...questions, { question_text: questionText }]);

            // Reset form
            setQuestionText('');
            setOptionA('');
            setOptionB('');
            setOptionC('');
            setOptionD('');
            setCorrectOption('A');
            setMarks(1);

            alert('Question added!');
        } catch (error) {
            alert('Error adding question');
        }
    };

    const handleFinish = () => {
        navigate('/teacher-dashboard');
    };

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <div className="flex justify-between items-center mb-4">
                <h2>{step === 1 ? 'Step 1: Assessment Info' : 'Step 2: Add Questions'}</h2>
                {assessmentId && <span className="text-muted">ID: {assessmentId}</span>}
            </div>

            {step === 1 && (
                <div className="card">
                    <form onSubmit={handleCreateAssessment}>
                        <div className="form-group">
                            <label>Assessment Title</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="e.g. Mathematics Final Exam"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                className="textarea"
                                placeholder="Instructions for students..."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Target Class</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="e.g. Class 10"
                                value={className}
                                onChange={e => setClassName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Target Section</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="e.g. A"
                                value={section}
                                onChange={e => setSection(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Save & Continue
                        </button>
                    </form>
                </div>
            )}

            {step === 2 && (
                <div>
                    <div className="card mb-4" style={{ background: '#f8fafc' }}>
                        <h3 className="mb-2">Assessment Summary</h3>
                        <p><strong>Title:</strong> {title}</p>
                        <p><strong>Total Questions:</strong> {questions.length}</p>
                    </div>

                    <div className="card mb-4">
                        <h3>Add New Question</h3>
                        <form onSubmit={handleAddQuestion}>
                            <div className="form-group">
                                <label>Question Text</label>
                                <textarea
                                    className="textarea"
                                    value={questionText}
                                    onChange={e => setQuestionText(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Option A</label>
                                    <input type="text" className="input" value={optionA} onChange={e => setOptionA(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Option B</label>
                                    <input type="text" className="input" value={optionB} onChange={e => setOptionB(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Option C</label>
                                    <input type="text" className="input" value={optionC} onChange={e => setOptionC(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Option D</label>
                                    <input type="text" className="input" value={optionD} onChange={e => setOptionD(e.target.value)} required />
                                </div>
                            </div>
                            <div className="grid mt-4" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Correct Option</label>
                                    <select className="select" value={correctOption} onChange={e => setCorrectOption(e.target.value)}>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Marks</label>
                                    <input type="number" className="input" value={marks} onChange={e => setMarks(e.target.value)} required />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-outline" style={{ width: '100%' }}>Add Question</button>
                        </form>
                    </div>

                    <div className="card mb-4">
                        <h3 className="mb-4">Questions Added ({questions.length})</h3>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Question</th>
                                        <th>Marks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questions.map((q, idx) => (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td>{q.question_text}</td>
                                            <td>{q.marks || 1}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <button onClick={handleFinish} className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                        Finish & Save Assessment
                    </button>
                </div>
            )}
        </div>
    );
};

export default TestBuilder;
