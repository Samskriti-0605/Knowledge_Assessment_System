
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const runDiagnostics = async () => {
    try {
        const testUser = {
            name: 'TestUser',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            role: 'student'
        };

        console.log('Running diagnostics on:', API_URL);

        // Step 1: Check Registration
        const regRes = await fetch(`${API_URL}/auth.php?action=register`, {
            method: 'POST',
            body: JSON.stringify(testUser),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!regRes.ok) throw new Error(`Registration failed: ${regRes.statusText}`);
        console.log('Registration Success');

        // Step 2: Check Login
        const loginRes = await fetch(`${API_URL}/auth.php?action=login`, {
            method: 'POST',
            body: JSON.stringify({ email: testUser.email, password: testUser.password }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const loginData = await loginRes.json();

        console.log('Login Success:', loginData.user ? 'Got User Data' : 'No User Data');
        alert('Diagnostics Success! Backend is working correctly.');

    } catch (error) {
        console.error('Diagnosis Error:', error);
        alert(`Diagnostics Failed:\n${error.message}\nCheck console for details.`);
    }
};

export default runDiagnostics;
