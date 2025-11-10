// register.js handles creating a new user account via POST /api/auth/register
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const alertArea = document.getElementById('regAlert');

  function showAlert(message, type = 'danger') {
    alertArea.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertArea.innerHTML = '';

    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const dob = document.getElementById('regDob').value || null;

    if (!username || !password) {
      showAlert('Username and password are required.');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, phone, dob })
      });
      const data = await res.json();
      if (!res.ok) {
        showAlert(data.message || 'Registration failed');
        return;
      }

      // Show success and optionally the new user id
      showAlert('Account created successfully. You can now log in.', 'success');
      if (data.id) {
        const p = document.createElement('p');
        p.className = 'small text-muted mt-2';
        p.textContent = `Your user id: ${data.id}`;
        alertArea.appendChild(p);
      }

      // Optionally redirect to login after a short delay
      setTimeout(() => window.location.href = '/', 1500);
    } catch (err) {
      console.error(err);
      showAlert('Network error');
    }
  });
});
