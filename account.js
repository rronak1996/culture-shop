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

        if (!user) {
            console.error('No user found in session');
            window.location.href = 'login.html';
            return;
        }

        document.getElementById('user-name').textContent = user.name || 'N/A';
        document.getElementById('user-email').textContent = user.email || 'N/A';
        document.getElementById('user-mobile').textContent = user.mobile || 'N/A';
        document.getElementById('user-initial').textContent = user.name ? user.name.charAt(0).toUpperCase() : 'U';
    }

    // Load user orders
    async function loadUserOrders() {
        const loadingDiv = document.getElementById('orders-loading');
        const emptyDiv = document.getElementById('orders-empty');
        const listDiv = document.getElementById('orders-list');

        try {
            const result = await window.auth.getUserOrders();

            loadingDiv.style.display = 'none';

            if (result.success && result.orders && result.orders.length > 0) {
                // Display orders
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
            } else {
                // No orders found
                emptyDiv.style.display = 'flex';
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            loadingDiv.style.display = 'none';
            emptyDiv.style.display = 'flex';
        }
    }

    // Initialize
    loadUserProfile();
    await loadUserOrders();
});
