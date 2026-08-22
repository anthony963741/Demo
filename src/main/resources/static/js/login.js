document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.hidden = true;

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getCsrfToken() || ''
        },
        body: JSON.stringify({ username, password })
    });

    if (res.ok) {
        window.location.href = '/index.html';
        return;
    }

    const data = await res.json().catch(() => ({}));
    errorMsg.textContent = data.message || '登入失敗';
    errorMsg.hidden = false;
});
