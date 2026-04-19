const apiUrl = 'https://knowledge-assessment-backend.onrender.com/api/auth.php?action=register';

fetch(apiUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'Node User',
        email: 'node@example.com',
        password: 'password123',
        role: 'student'
    })
})
.then(res => res.text())
.then(text => console.log('Response:', text))
.catch(err => console.error('Error:', err));
