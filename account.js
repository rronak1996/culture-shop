// Wait for auth.js to load with retry mechanism
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for window.auth to be available (with retry)
    async function waitForAuth(maxRetries = 50, delay = 100) {
        for (let i = 0; i < maxRetries; i++) {
            if (window.auth && typeof window.auth.getCurrentUser === 'function') {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        return false;
    }

    // Wait for auth module
    const authLoaded = await waitForAuth();

    if (!authLoaded) {
        console.error('Auth module failed to load');
        alert('Failed to load authentication. Please refresh the page.');
        return;
    }

    // Protect this page - require login
    window.auth.requireAuth();

    // Load user profile
    function loadUserProfile() {
        const user = window.auth.getCurrentUser();

        if (!user || !user.email) {
            console.error('No user found in session or invalid session data');
            alert('Your session has expired. Please log in again.');
            window.location.href = 'login.html';
            return false;
        }

        console.log('Loading profile for user:', user.email);
        document.getElementById('user-name').textContent = user.name || 'N/A';
        document.getElementById('user-email').textContent = user.email || 'N/A';
        document.getElementById('user-mobile').textContent = user.mobile || 'N/A';
        document.getElementById('user-initial').textContent = user.name ? user.name.charAt(0).toUpperCase() : 'U';
        return true;
    }

    // Load user orders
    async function loadUserOrders() {
        const loadingDiv = document.getElementById('orders-loading');
        const emptyDiv = document.getElementById('orders-empty');
        const listDiv = document.getElementById('orders-list');

        // Show timeout warning after 10 seconds
        const timeoutWarning = setTimeout(() => {
            if (loadingDiv.style.display !== 'none') {
                loadingDiv.innerHTML = `
                    <p>⚠️ Loading is taking longer than expected...</p>
                    <p style="font-size: 0.9em; color: #666;">This may be due to slow network or backend issues.</p>
                    <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 10px;">Retry</button>
                `;
            }
        }, 10000);

        try {
            console.log('Fetching user orders...');
            const result = await window.auth.getUserOrders();
            clearTimeout(timeoutWarning);

            console.log('Orders API response:', result);
            loadingDiv.style.display = 'none';

            if (result.success && result.orders && result.orders.length > 0) {
                // Display orders
                console.log(`Displaying ${result.orders.length} orders`);
                listDiv.style.display = 'grid';
                listDiv.innerHTML = result.orders.map(order => `
                    <div class="order-card">
                        <div class="order-header">
                            <div>
                                <h3>${order.orderId}</h3>
                                <p class="order-date">${order.dateTime}</p>
                            </div>
                            <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
                        </div>
                        <div class="order-items">
                            <p><strong>Items:</strong> ${order.items}</p>
                        </div>
                        ${order.verificationCode ? `
                        <div class="order-verification">
                            <span class="verification-label">🔐 Delivery Code:</span>
                            <span class="verification-code">${order.verificationCode}</span>
                        </div>
                        ` : ''}
                        <div class="order-footer">
                            <div class="order-total">
                                <span>Total:</span>
                                <strong>₹${order.total}</strong>
                            </div>
                            <div class="order-details">
                                <p><strong>Payment:</strong> ${order.paymentMethod}</p>
                                <p><strong>Delivery:</strong> ${order.deliveryTime}</p>
                            </div>
                        </div>
                    </div>
                `).join('');
            } else if (result.success) {
                // No orders found
                console.log('No orders found for user');
                emptyDiv.style.display = 'flex';
            } else {
                // API returned error
                console.error('API error:', result.error);
                loadingDiv.style.display = 'none';
                emptyDiv.innerHTML = `
                    <span class="empty-icon">⚠️</span>
                    <h3>Error Loading Orders</h3>
                    <p>${result.error || 'Unable to fetch orders. Please try again later.'}</p>
                    <button class="btn btn-primary" onclick="location.reload()">Retry</button>
                `;
                emptyDiv.style.display = 'flex';
            }
        } catch (error) {
            clearTimeout(timeoutWarning);
            console.error('Error loading orders:', error);
            loadingDiv.style.display = 'none';
            emptyDiv.innerHTML = `
                <span class="empty-icon">⚠️</span>
                <h3>Error Loading Orders</h3>
                <p>${error.message || 'Failed to fetch orders. Please check your connection and try again.'}</p>
                <button class="btn btn-primary" onclick="location.reload()">Retry</button>
            `;
            emptyDiv.style.display = 'flex';
        }
    }

    // Initialize
    const profileLoaded = loadUserProfile();
    if (profileLoaded) {
        await loadUserOrders();
    }
});
