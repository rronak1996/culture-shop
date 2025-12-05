// Google Sheets Configuration
// IMPORTANT: Replace this URL with your Google Apps Script web app URL
// See GOOGLE_SHEETS_SETUP.md for instructions
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycby9BEZcv_4eycn_Pjps2u2LxzjpKjHe4t5hS16fk0TV_oXfH35HNI6p3-1dtUauNEY/exec';
// Security Token (Must match the one in your Apps Script)
const API_KEY = 'culture-secure-2025';

// --- MAINTENANCE MODE ---
// Set this to true to show the maintenance message
// Set this to false to show the normal website
const MAINTENANCE_MODE = false;

// Culture Product Data
const products = [
    {
        id: 1,
        name: 'Strawberry Bliss',
        description: 'Fresh strawberries dipped in 60% dark chocolate. A perfect balance of tart and sweet.',
        price: 249,
        image: 'https://images.unsplash.com/photo-1548130837-779899e0e378?auto=format&fit=crop&w=500&q=80', // Placeholder
        category: 'Fruit'
    },
    {
        id: 2,
        name: 'Pineapple Punch',
        description: 'Tangy dried pineapple chunks coated in creamy milk chocolate. A tropical delight.',
        price: 229,
        image: 'https://images.unsplash.com/photo-1548130837-779899e0e378?auto=format&fit=crop&w=500&q=80', // Placeholder
        category: 'Fruit'
    },
    {
        id: 3,
        name: 'Zesty Orange',
        description: 'Candied orange peel enrobed in rich dark chocolate. A classic sophisticated flavor.',
        price: 269,
        image: 'https://images.unsplash.com/photo-1548130837-779899e0e378?auto=format&fit=crop&w=500&q=80', // Placeholder
        category: 'Citrus'
    },
    {
        id: 4,
        name: 'Apple Crunch',
        description: 'Crisp apple slices covered in white chocolate with a hint of cinnamon.',
        price: 239,
        image: 'https://images.unsplash.com/photo-1548130837-779899e0e378?auto=format&fit=crop&w=500&q=80', // Placeholder
        category: 'Fruit'
    }
];

// State
let cart = [];
const DELIVERY_FEE = 40;

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cartSubtotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.getElementById('nav');
const header = document.getElementById('header');

// Checkout Elements
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutSubtotal = document.getElementById('checkoutSubtotal');
const checkoutTotal = document.getElementById('checkoutTotal');
const successModal = document.getElementById('successModal');
const closeSuccess = document.getElementById('closeSuccess');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    loadCart();
    setupEventListeners();
    initScrollReveal();

    // Auth integration
    if (typeof updateHeaderUI === 'function') {
        updateHeaderUI();
    }
});

// Render Products
function renderProducts() {
    if (!productsGrid) return;
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <div class="product-placeholder">🍫</div>
            </div>
            <div class="product-details">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">₹${product.price}</span>
                    <button class="add-btn" onclick="addToCart(${product.id})" aria-label="Add to Cart">
                        +
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Cart Functions
window.addToCart = function (productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    saveCart();

    // Show visual feedback instead of opening cart
    showAddToCartNotification(product.name);
};

// Show notification when item is added to cart
function showAddToCartNotification(productName) {
    // Remove any existing notifications
    const existingNotif = document.querySelector('.add-to-cart-notification');
    if (existingNotif) {
        existingNotif.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'add-to-cart-notification';
    notification.innerHTML = `
        <span class="notif-icon">✓</span>
        <span class="notif-text">${productName} added to cart</span>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove after 2.5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2500);
}

window.updateQuantity = function (productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }

    updateCart();
    saveCart();
};

window.removeFromCart = function (productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCart();
};

function updateCart() {
    // Update Count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;

    // Update Subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal}`;

    // Render Items
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-msg">
                Your bag is empty.<br>Time to fill it with sweetness!
            </div>
        `;
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = '0.5';
            checkoutBtn.style.cursor = 'not-allowed';
        }
    } else {
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = '1';
            checkoutBtn.style.cursor = 'pointer';
        }

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-img">🍫</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                    <div class="cart-item-controls">
                        <div class="qty-controls">
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function saveCart() {
    localStorage.setItem('cultureCart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('cultureCart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCart();
    }
}

// UI Functions
function openCart() {
    cartOverlay.classList.add('active');
    cartSidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartMenu() {
    cartOverlay.classList.remove('active');
    cartSidebar.classList.remove('active');
    document.body.style.overflow = '';
}

function openCheckout() {
    if (cart.length === 0) return;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + DELIVERY_FEE;

    checkoutSubtotal.textContent = `₹${subtotal}`;
    checkoutTotal.textContent = `₹${total}`;

    // Auto-fill form if user is logged in
    if (typeof autoFillCheckout === 'function') {
        autoFillCheckout();
    }

    closeCartMenu();
    checkoutModal.classList.add('active');
}


// Success Modal
closeSuccess.addEventListener('click', () => {
    successModal.classList.remove('active');
});

// UPI Modal
const upiModal = document.getElementById('upiModal');
const closeUpi = document.getElementById('closeUpi');
const confirmUpiBtn = document.getElementById('confirmUpiBtn');

closeUpi.addEventListener('click', () => {
    upiModal.classList.remove('active');
});

confirmUpiBtn.addEventListener('click', () => {
    const txnId = document.getElementById('transactionId').value;
    if (!txnId) {
        alert('Please enter the Transaction ID');
        return;
    }
    upiModal.classList.remove('active');
    completeOrder(new FormData(checkoutForm), 'upi', txnId);
});

// Payment Method Change
const paymentMethods = document.getElementsByName('paymentMethod');
paymentMethods.forEach(radio => {
    radio.addEventListener('change', (e) => {
        // Logic for payment method change if needed
    });
});

// Setup Event Listeners
function setupEventListeners() {
    // Cart Button - Open Cart
    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }

    // Close Cart Button
    if (closeCart) {
        closeCart.addEventListener('click', closeCartMenu);
    }

    // Cart Overlay - Close on click
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartMenu);
    }

    // Checkout Button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openCheckout);
    }

    // Close Checkout Modal Button
    if (closeCheckout) {
        closeCheckout.addEventListener('click', () => {
            checkoutModal.classList.remove('active');
        });
    }

    // Checkout Form
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        const nav = document.getElementById('nav');
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
}
function handleCheckout(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const method = formData.get('paymentMethod');

    if (method === 'cod') {
        completeOrder(formData, 'cod');
    } else if (method === 'upi') {
        document.getElementById('upiModal').classList.add('active');
    } else if (method === 'online') {
        // Razorpay Integration
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + DELIVERY_FEE;

        const options = {
            "key": "rzp_test_placeholder", // Placeholder Key
            "amount": total * 100,
            "currency": "INR",
            "name": "Culture Chocolates",
            "description": "Order Payment",
            "handler": function (response) {
                completeOrder(formData, 'online', response.razorpay_payment_id);
            },
            "prefill": {
                "name": formData.get('name'),
                "email": formData.get('email'),
                "contact": formData.get('mobile')
            },
            "theme": {
                "color": "#3D2412"
            }
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();
    }
}

function completeOrder(formData, method, txnId = '') {
    const name = formData.get('name');
    const area = formData.get('area');
    const orderId = '#CULTURE-' + Math.floor(Math.random() * 10000);

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + DELIVERY_FEE;

    // Get user email if logged in
    let userEmail = formData.get('email') || '';
    if (typeof getCurrentUser === 'function') {
        const currentUser = getCurrentUser();
        if (currentUser) {
            userEmail = currentUser.email;
        }
    }

    // Send order to Google Sheets
    sendToGoogleSheets({
        orderId: orderId,
        timestamp: new Date().toISOString(),
        customerName: name,
        mobile: formData.get('mobile'),
        email: userEmail,
        address: formData.get('address'),
        area: area,
        pincode: formData.get('pincode'),
        deliveryTime: formData.get('deliveryTime'),
        paymentMethod: method,
        transactionId: txnId,
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        subtotal: subtotal,
        deliveryFee: DELIVERY_FEE,
        total: total
    });

    document.getElementById('successName').textContent = name;
    document.getElementById('successArea').textContent = area;
    document.getElementById('successOrderId').textContent = orderId;

    checkoutModal.classList.remove('active');
    successModal.classList.add('active');

    // Clear Cart
    cart = [];
    updateCart();
    saveCart();
    checkoutForm.reset();
    document.getElementById('transactionId').value = '';
}

// Scroll Reveal
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.product-card, .section-title, .about-content');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        revealElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
    checkMaintenanceMode();

    // Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Maintenance Mode Check
function checkMaintenanceMode() {
    if (MAINTENANCE_MODE) {
        const overlay = document.getElementById('maintenance-overlay');
        if (overlay) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Disable scrolling
        }
    }
}

// Google Sheets Integration
function sendToGoogleSheets(orderData) {
    // Check if URL is configured
    if (GOOGLE_SHEETS_URL === 'YOUR_WEB_APP_URL_HERE') {
        console.warn('Google Sheets URL not configured. Order will not be saved to spreadsheet.');
        console.log('Order data:', orderData);
        return;
    }

    // Prepare data for backend - match the Apps Script API format
    const payload = {
        action: 'placeOrder',
        apiKey: API_KEY,
        orderId: orderData.orderId,
        customerName: orderData.customerName,
        mobile: orderData.mobile,
        email: orderData.email,
        address: orderData.address,
        area: orderData.area,
        pincode: orderData.pincode,
        deliveryTime: orderData.deliveryTime,
        paymentMethod: orderData.paymentMethod,
        transactionId: orderData.transactionId || '',
        items: orderData.items,
        subtotal: orderData.subtotal,
        deliveryFee: orderData.deliveryFee,
        total: orderData.total,
        userEmail: orderData.email // Link to user email
    };

    // Send data to Google Sheets
    fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Order saved to Google Sheets successfully');
            } else {
                console.error('Google Sheets error:', data.error);
            }
        })
        .catch((error) => {
            console.error('Error saving to Google Sheets:', error);
            // Order still completes even if Sheets fails
        });
}

