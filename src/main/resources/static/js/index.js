async function loadMe() {
    const res = await fetch('/api/auth/me');
    if (!res.ok) {
        window.location.href = '/login.html';
        return;
    }
    const data = await res.json();
    document.getElementById('usernameDisplay').textContent = data.username;
}

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'X-XSRF-TOKEN': getCsrfToken() || '' }
    });
    window.location.href = '/login.html';
});

loadMe();
