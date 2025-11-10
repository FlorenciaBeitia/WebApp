// login.js handles the login form submission and stores JWT token on success
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const alertArea = document.getElementById('alertArea');

  function showAlert(message, type = 'danger') {
    alertArea.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertArea.innerHTML = '';
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    //Authenticating and provide whether login is successful or not
    if (!username || !password) {
      showAlert('Please provide username and password.');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok) {
        showAlert(data.message || 'Login failed');
        return;
      }

      // Store token and redirect to profile
      localStorage.setItem('token', data.token);
      window.location.href = '/profile.html';
    } catch (err) {
      console.error(err);
      showAlert('Network error');
    }
  });
});
