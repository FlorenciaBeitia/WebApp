// profile.js fetches and updates user profile using JWT stored in localStorage
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const msgArea = document.getElementById('msgArea');
  const form = document.getElementById('profileForm');

  function showMsg(message, type = 'danger') {
    msgArea.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
  }

  if (!token) {
    // Not authenticated
    window.location.href = '/';
    return;
  }

  // Fetch profile
  async function loadProfile() {
    try {
      const res = await fetch('/api/profile', { headers: { 'Authorization': 'Bearer ' + token } });
      const data = await res.json();
      if (!res.ok) {
        showMsg(data.message || 'Failed to load profile');
        if (res.status === 401) {
          localStorage.removeItem('token');
          setTimeout(() => window.location.href = '/', 1200);
        }
        return;
      }

  // Update UI heading to welcome the user
  const heading = document.getElementById('welcomeHeading');
  if (heading) heading.textContent = `Welcome ${data.username || ''}`;
  // Show the user's unique id (ObjectId) in a small muted line
  const idDisplay = document.getElementById('userIdDisplay');
  if (idDisplay) idDisplay.textContent = data._id ? `User ID: ${data._id}` : '';

      // Fill form fields with current profile data
      document.getElementById('username').value = data.username || '';
      document.getElementById('email').value = data.email || '';
      document.getElementById('phone').value = data.phone || '';
      if (data.dob) document.getElementById('dob').value = new Date(data.dob).toISOString().substring(0,10);
    } catch (err) {
      console.error(err);
      showMsg('Network error');
    }
  }

  // Validate email and phone
  function validate(email, phone) {
    if (email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(email)) return 'Invalid email format';
    }
    if (phone) {
      const digits = phone.replace(/\D/g, '');
      if (digits.length < 6) return 'Phone number seems too short';
    }
    return null;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msgArea.innerHTML = '';
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const dob = document.getElementById('dob').value || null;

    const err = validate(email, phone);
    if (err) {
      showMsg(err);
      return;
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ username, email, phone, dob })
      });
      const data = await res.json();
      if (!res.ok) {
        showMsg(data.message || 'Update failed');
        return;
      }
      showMsg('Profile updated', 'success');
    } catch (err) {
      console.error(err);
      showMsg('Network error');
    }
  });

  // Logout button
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  });

  loadProfile();
});
