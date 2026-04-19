// Ensure the diagnostics hit the correct /api path
const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
let API_URL = isVercel 
    ? 'https://knowledge-assessment-backend.onrender.com/api' 
    : (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').trim();

// Sanitize just in case
if (API_URL.includes('https://') && API_URL.lastIndexOf('https://') > 0) {
    API_URL = API_URL.substring(API_URL.lastIndexOf('https://'));
}
if (!API_URL.endsWith('/api')) {
    API_URL = `${API_URL.replace(/\/$/, '')}/api`;
}


const runDiagnostics = async () => {
    try {
        console.log('Running diagnostics on:', API_URL);

        // Step 0: Ping Test
        console.log('Step 0: Pinging backend...');
        const pingStartTime = Date.now();
        const pingRes = await fetch(`${API_URL}/ping.php`).catch(e => {
            throw new Error(`CORS or Network Error: Connection to backend was refused. Verify VITE_API_URL and Backend CORS headers.`);
        });
        
        if (!pingRes.ok) {
            throw new Error(`Backend Ping Failed: Status ${pingRes.status} (${pingRes.statusText})`);
        }
        const pingData = await pingRes.json();
        const pingTime = Date.now() - pingStartTime;
        console.log('Ping Success:', pingData.message, `(${pingTime}ms)`);

        const testUser = {
            name: 'TestUser',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            role: 'student'
        };

        // Step 1: Check Registration
        console.log('Step 1: Testing registration...');
        const regRes = await fetch(`${API_URL}/auth.php?action=register`, {
            method: 'POST',
            body: JSON.stringify(testUser),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!regRes.ok) {
            const errorData = await regRes.json().catch(() => ({}));
            throw new Error(`Registration failed: Status ${regRes.status}. ${errorData.message || regRes.statusText || 'Is the database connected?'}`);
        }
        console.log('Registration Success');

        // Step 2: Check Login
        console.log('Step 2: Testing login...');
        const loginRes = await fetch(`${API_URL}/auth.php?action=login`, {
            method: 'POST',
            body: JSON.stringify({ email: testUser.email, password: testUser.password }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!loginRes.ok) {
            const errorData = await loginRes.json().catch(() => ({}));
            throw new Error(`Login failed: Status ${loginRes.status}. ${errorData.message || loginRes.statusText}`);
        }
        
        console.log('Login Success');
        alert('✅ SUCCESS! Backend is online, database is connected, and CORS is configured perfectly.');

    } catch (error) {
        console.error('Diagnosis Error:', error);
        let msg = `❌ Diagnostics Failed:\n\n${error.message}\n\n`;
        
        if (error.message.includes('CORS')) {
            msg += "Suggestion: Check if Render has finished deploying and verify backend is reachable.";
        } else if (error.message.includes('Status 500')) {
            msg += "Suggestion: Check Render logs for MySQL connection errors. Verify DB_HOST and DB_PASS.";
        }

        alert(msg);
    }
};

export default runDiagnostics;
