// ============================================
// AUTHENTICATION MODULE
// Handles user signup, login, logout, and session management
// ============================================

// Configuration - Google Apps Script URL
const AUTH_API_URL = 'https://script.google.com/macros/s/AKfycby9BEZcv_4eycn_Pjps2u2LxzjpKjHe4t5hS16fk0TV_oXfH35HNI6p3-1dtUauNEY/exec';
const AUTH_API_KEY = 'culture-secure-2025';

// Session storage keys
const SESSION_USER_KEY = 'culture_user';
const SESSION_TOKEN_KEY = 'culture_token';

/**
 * Simple client-side password hashing (SHA-256)
 */
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Make API request to Google Apps Script
 */
async function makeAuthRequest(action, data) {
    try {
        const payload = {
            action: action,
            apiKey: AUTH_API_KEY,
            ...data
        };

        const response = await fetch(AUTH_API_URL, {
            method: 'POST',
            redirect: 'follow',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(payload)
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Auth request error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Make GET request to fetch user data
 */
async function makeAuthGetRequest(action, params) {
    try {
        const url = new URL(AUTH_API_URL);
        url.searchParams.append('action', action);
        url.searchParams.append('apiKey', AUTH_API_KEY);

        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });

        const response = await fetch(url.toString());
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Auth GET request error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// SESSION MANAGEMENT
// ============================================

/**
 * Save user session to localStorage
 */
function saveSession(user, token) {
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
    localStorage.setItem(SESSION_TOKEN_KEY, token);
}

/**
 * Get current user from session
 */
function getCurrentUser() {
    const userJson = localStorage.getItem(SESSION_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Get session token
 */
function getSessionToken() {
    return localStorage.getItem(SESSION_TOKEN_KEY);
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return getCurrentUser() !== null && getSessionToken() !== null;
}

/**
 * Clear session (logout)
 */
function clearSession() {
    localStorage.removeItem(SESSION_USER_KEY);
    localStorage.removeItem(SESSION_TOKEN_KEY);
}

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

/**
 * User Signup
 */
async function signup(name, email, mobile, password) {
    try {
        // Validate inputs
        if (!name || !email || !mobile || !password) {
            return {
                success: false,
                error: 'All fields are required'
            };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                success: false,
                error: 'Invalid email format'
            };
        }

        // Validate password strength
        if (password.length < 6) {
            return {
                success: false,
                error: 'Password must be at least 6 characters'
            };
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Make API request
        const result = await makeAuthRequest('signup', {
            name,
            email,
            mobile,
            password: hashedPassword
        });

        if (result.success) {
            saveSession(result.user, result.token);
            return result;
        }

        return result;
    } catch (error) {
        console.error('Signup error:', error);
        return {
            success: false,
            error: 'Signup failed. Please try again.'
        };
    }
}

/**
 * User Login
 */
async function login(email, password) {
    try {
        // Validate inputs
        if (!email || !password) {
            return {
                success: false,
                error: 'Email and password are required'
            };
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Make API request
        const result = await makeAuthRequest('login', {
            email,
            password: hashedPassword
        });

        if (result.success) {
            saveSession(result.user, result.token);
            return result;
        }

        return result;
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: 'Login failed. Please check your credentials.'
        };
    }
}

/**
 * User Logout
 */
function logout() {
    clearSession();
    window.location.href = '/';
}

/**
 * Get user's orders
 */
async function getUserOrders() {
    try {
        const user = getCurrentUser();
        if (!user) {
            return {
                success: false,
                error: 'Not logged in'
            };
        }

        const result = await makeAuthRequest('getUserOrders', {
            email: user.email
        });

        return result;
    } catch (error) {
        console.error('Get orders error:', error);
        return {
            success: false,
            error: 'Failed to fetch orders'
        };
    }
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================

/**
 * Update header based on login status
 */
function updateHeaderUI() {
    const user = getCurrentUser();
    const authButton = document.querySelector('.auth-button');

    if (!authButton) return;

    if (user) {
        // User is logged in
        authButton.innerHTML = `
            <a href="account.html" class="btn btn-outline">
                <span>👤</span> ${user.name}
            </a>
        `;
    } else {
        // User is not logged in
        authButton.innerHTML = `
            <a href="login.html" class="btn btn-outline">Login</a>
        `;
    }
}

/**
 * Auto-fill checkout form if logged in
 */
function autoFillCheckout() {
    const user = getCurrentUser();
    if (!user) return;

    const nameInput = document.getElementById('customer-name');
    const emailInput = document.getElementById('customer-email');
    const mobileInput = document.getElementById('customer-mobile');

    if (nameInput) nameInput.value = user.name;
    if (emailInput) emailInput.value = user.email;
    if (mobileInput) mobileInput.value = user.mobile;
}

/**
 * Protect page - redirect if not logged in
 */
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    updateHeaderUI();

    // Auto-fill checkout if on checkout page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        autoFillCheckout();
    }
});

// Export functions for use in other scripts
window.auth = {
    signup,
    login,
    logout,
    isLoggedIn,
    getCurrentUser,
    getUserOrders,
    requireAuth,
    updateHeaderUI,
    autoFillCheckout
};
