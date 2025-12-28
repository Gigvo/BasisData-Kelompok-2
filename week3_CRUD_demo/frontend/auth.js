// API Base URL
const API_URL = 'http://localhost:3000/api';

// Login function
async function login(email, password, role) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, role })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token and user data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Show error message
            const errorElement = document.getElementById('errorMessage');
            if (errorElement) {
                errorElement.textContent = data.message || 'Login failed';
                errorElement.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.textContent = 'Network error. Please check if the server is running.';
            errorElement.style.display = 'block';
        }
    }
}

// Signup function
async function signup(formData) {
    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            // Show success message
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } else {
            // Show error message
            const errorElementId = formData.role === 'pasien' ? 'errorMessagePasien' : 'errorMessageDokter';
            const errorElement = document.getElementById(errorElementId);
            if (errorElement) {
                errorElement.textContent = data.message || 'Registration failed';
                errorElement.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Signup error:', error);
        const errorElementId = formData.role === 'pasien' ? 'errorMessagePasien' : 'errorMessageDokter';
        const errorElement = document.getElementById(errorElementId);
        if (errorElement) {
            errorElement.textContent = 'Network error. Please check if the server is running.';
            errorElement.style.display = 'block';
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedRole');
    window.location.href = 'index.html';
}

// Check authentication status
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'index.html';
    }
    return token;
}

// Get authenticated user
function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Make authenticated API request
async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('authToken');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        // Token expired or invalid
        logout();
    }

    return response;
}
