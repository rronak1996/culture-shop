// Google Sheets Configuration
// IMPORTANT: Replace this URL with your Google Apps Script web app URL
// See GOOGLE_SHEETS_SETUP.md for instructions
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyoN902SlucvKu2eF69MOFfznJ7XeZcb0UXFsLjqw3IoPD2PUd4bTsuayqQ875ZAuBA/exec';
// Security Token (Must match the one in your Apps Script)
const API_KEY = 'culture-secure-2025';

// --- MAINTENANCE MODE ---
// Set this to true to show the maintenance message
// Set this to false to show the normal website
const MAINTENANCE_MODE = false;

// Common product information
const COMMON_PRODUCT_INFO = {
    note: "Use the chocolates before 1 month after purchasing",
    directions: "Put chocolates in refrigerator after getting order before using it",
    commonIngredients: "Chocolate base, premium toppings, zero added sugar, zero preservatives"
};

// Culture Product Data
const products = [
    // Sugar Free Collection
    {
        id: 102,
        name: 'Culture | Cranberry Cashew Majesté',
        description: 'Roasted almonds clustered in sugar-free dark chocolate.',
        price: 179,
        image: 'assets/crane.jpg',
        category: 'sugar-free',
        ingredients: ['Dark chocolate (70% cocoa)', 'Cranberry', 'Cashew', 'Roasted almonds', 'Natural sweetener (Stevia)']
    },

    // Triple Chocolates
    {
        id: 201,
        name: 'Culture | Pistachio Noir',
        description: 'A heavenly assortment of White, Milk, and Dark chocolates.',
        price: 179,
        image: 'assets/pista.jpg',
        category: 'triple-choco',
        ingredients: ['White chocolate', 'Milk chocolate', 'Dark chocolate (70% cocoa)', 'Pistachio', 'Cocoa butter']
    },
    {
        id: 202,
        name: 'Culture | Almond Cashew Suprême',
        description: 'Three layers of chocolate perfection in every bite.',
        price: 189,
        image: 'assets/almond-cashew.jpg',
        category: 'triple-choco',
        ingredients: ['White chocolate', 'Milk chocolate', 'Dark chocolate', 'Almonds', 'Cashew', 'Cocoa butter']
    },

    // Individual / Custom
    {
        id: 301,
        name: 'Make Your Own Chocolate Bar',
        description: 'Customize your box with your favorite fruits and nuts.',
        price: 140,
        image: 'assets/custom.jpg',
        category: 'individual',
        isCustom: true,
        ingredients: ['Choose your own: Strawberry, Blueberry, Cranberry, Kiwi, Almonds, Raisins, Cashew, Hazelnuts']
    },

    // Previous Favorites (categorized as 'all' or kept for legacy if needed, or assigned a category)
    {
        id: 1,
        name: 'Culture | Nuts Overload',
        description: 'Premium dark chocolate loaded with almonds, pistachios, and cashews.',
        price: 199,
        image: 'assets/nuts-overload.jpg',
        category: 'triple-choco', // Displaying in Triple Chocolates section
        ingredients: ['Dark chocolate (70% cocoa)', 'Almonds', 'Pistachios', 'Cashews', 'Cocoa butter']
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

// Product Details Elements
const productDetailsModal = document.getElementById('productDetailsModal');
const closeProductDetails = document.getElementById('closeProductDetails');
const addToCartFromDetails = document.getElementById('addToCartFromDetails');
let currentProductId = null;

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
    // 1. All Products (except custom) in one grid
    const gridAllProducts = document.getElementById('grid-all-products');
    if (gridAllProducts) {
        const allProducts = products.filter(p => p.category !== 'individual');
        gridAllProducts.innerHTML = allProducts.map(product => createProductCard(product)).join('');
    }

    // 2. Custom / Individual
    const gridCustom = document.getElementById('grid-custom');
    if (gridCustom) {
        const customProducts = products.filter(p => p.category === 'individual');
        gridCustom.innerHTML = customProducts.map(product => createProductCard(product)).join('');
    }
}

function createProductCard(product) {
    // Check if product has any image URL (local or external)
    const hasImage = product.image && product.image.trim() !== '';

    return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image" onclick="openProductDetails(${product.id})">
                ${hasImage
            ? `<img src="${product.image}" alt="${product.name}" class="product-img">`
            : `<div class="product-placeholder">🍫</div>`}
            </div>
            <div class="product-details">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">₹${product.price}</span>
                    <button class="add-btn ${product.isCustom ? 'custom-btn' : ''}" 
                        onclick="${product.isCustom ? 'openCustomization(' + product.id + ')' : 'addToCart(' + product.id + ')'}" 
                        aria-label="${product.isCustom ? 'Customize' : 'Add to Cart'}">
                        ${product.isCustom ? '⚙️ Select Custom Ingredient' : '+'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Customization Logic
const customizationModal = document.getElementById('customizationModal');
const closeCustomization = document.getElementById('closeCustomization');
const customizationForm = document.getElementById('customizationForm');
const customPriceDisplay = document.getElementById('customTotalPrice');

// Topping Prices Configuration
const CUSTOM_BASE_PRICE = 140;
const TOPPING_PRICES = {
    // Fruits/Inclusions
    'Strawberry': 7,
    'Blueberry': 9,
    'Cranberry': 6,
    'Kiwi': 6,
    // Nuts
    'Almonds': 6,
    'Raisins': 9,
    'Cashew': 6,
    'Hazelnuts': 14
};

// Calculate total price based on selected toppings
function calculateCustomPrice() {
    let total = CUSTOM_BASE_PRICE;

    // Get all selected inclusions
    const selectedInclusions = document.querySelectorAll('input[name="inclusions"]:checked');
    selectedInclusions.forEach(checkbox => {
        const toppingName = checkbox.value;
        if (TOPPING_PRICES[toppingName]) {
            total += TOPPING_PRICES[toppingName];
        }
    });

    // Get all selected nuts
    const selectedNuts = document.querySelectorAll('input[name="nuts"]:checked');
    selectedNuts.forEach(checkbox => {
        const toppingName = checkbox.value;
        if (TOPPING_PRICES[toppingName]) {
            total += TOPPING_PRICES[toppingName];
        }
    });

    return total;
}

// Update price display in modal
function updateCustomPriceDisplay() {
    const total = calculateCustomPrice();
    if (customPriceDisplay) {
        customPriceDisplay.textContent = `₹${total} `;
    }
}

window.openCustomization = function (productId) {
    if (customizationModal) {
        customizationModal.classList.add('active');
        // Reset form and update price display
        if (customizationForm) customizationForm.reset();
        updateCustomPriceDisplay();
    }
}

if (closeCustomization) {
    closeCustomization.addEventListener('click', () => {
        customizationModal.classList.remove('active');
    });
}

// Add event listeners to all topping checkboxes for real-time price update
document.addEventListener('DOMContentLoaded', () => {
    const toppingCheckboxes = document.querySelectorAll('input[name="inclusions"], input[name="nuts"]');
    toppingCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateCustomPriceDisplay);
    });
});

if (customizationForm) {
    customizationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const inclusions = formData.getAll('inclusions');
        const nuts = formData.getAll('nuts');

        if (inclusions.length === 0 && nuts.length === 0) {
            alert('Please select at least one inclusion or nut.');
            return;
        }

        // Calculate dynamic price
        const calculatedPrice = calculateCustomPrice();

        const customProduct = {
            id: Date.now(), // Unique ID for custom item
            name: 'Custom Chocolate Bar (' + inclusions.concat(nuts).join(', ') + ')',
            price: calculatedPrice,
            description: 'Customized with ' + inclusions.length + ' inclusions and ' + nuts.length + ' nuts.',
            image: '',
            category: 'individual'
        };

        // Add to cart directly
        cart.push({ ...customProduct, quantity: 1 });
        updateCart();
        saveCart();
        showAddToCartNotification('Custom Chocolate Bar');

        customizationModal.classList.remove('active');
        customizationForm.reset();
    });
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
    if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal} `;

    // Render Items
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
        < div class="empty-cart-msg" >
            Your bag is empty.< br > Time to fill it with sweetness!
            </div >
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
        < div class="cart-item" >
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
            </div >
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

    // Check if user is logged in using window.auth from auth.js
    // If auth module not loaded yet, allow checkout to proceed (fallback)
    try {
        if (window.auth && typeof window.auth.isLoggedIn === 'function' && !window.auth.isLoggedIn()) {
            // Show login prompt modal
            const loginPromptModal = document.getElementById('loginPromptModal');
            if (loginPromptModal) {
                loginPromptModal.classList.add('active');
            }
            closeCartMenu();
            return;
        }
    } catch (e) {
        console.log('Auth check failed, proceeding with checkout:', e);
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + DELIVERY_FEE;

    checkoutSubtotal.textContent = `₹${subtotal} `;
    checkoutTotal.textContent = `₹${total} `;

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

// Login Prompt Modal
const loginPromptModal = document.getElementById('loginPromptModal');
const closeLoginPrompt = document.getElementById('closeLoginPrompt');

if (closeLoginPrompt) {
    closeLoginPrompt.addEventListener('click', () => {
        loginPromptModal.classList.remove('active');
    });
}

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

    // Close Login Prompt Modal
    const closeLoginPrompt = document.getElementById('closeLoginPrompt');
    if (closeLoginPrompt) {
        closeLoginPrompt.addEventListener('click', () => {
            const loginPromptModal = document.getElementById('loginPromptModal');
            if (loginPromptModal) {
                loginPromptModal.classList.remove('active');
            }
        });
    }

    // Close Product Details Modal
    if (closeProductDetails) {
        closeProductDetails.addEventListener('click', () => {
            productDetailsModal.classList.remove('active');
        });
    }

    // Add to Cart from Details
    if (addToCartFromDetails) {
        addToCartFromDetails.addEventListener('click', () => {
            if (currentProductId) {
                addToCart(currentProductId);
                productDetailsModal.classList.remove('active');
            }
        });
    }
}

// Open Product Details Modal
window.openProductDetails = function (productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentProductId = productId;

    // Set product name
    document.getElementById('productDetailsName').textContent = product.name;

    // Set ingredients list
    const ingredientsList = document.getElementById('productIngredientsList');
    if (product.ingredients && product.ingredients.length > 0) {
        ingredientsList.innerHTML = product.ingredients
            .map(ingredient => `< li >✓ ${ingredient}</li > `)
            .join('');
    } else {
        ingredientsList.innerHTML = '<li>No specific ingredients listed</li>';
    }

    // Set common ingredients
    document.getElementById('commonIngredients').textContent = COMMON_PRODUCT_INFO.commonIngredients;

    // Set note
    document.getElementById('productNote').textContent = COMMON_PRODUCT_INFO.note;

    // Set directions
    document.getElementById('productDirections').textContent = COMMON_PRODUCT_INFO.directions;

    // Set price in button
    document.getElementById('productDetailsPrice').textContent = product.price;

    // Show modal
    if (productDetailsModal) {
        productDetailsModal.classList.add('active');
    }
};
function handleCheckout(e) {
    e.preventDefault();

    // Prevent double submission
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn.disabled) return;

    // Disable button and show spinner
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    const formData = new FormData(e.target);
    const method = formData.get('paymentMethod');

    if (method === 'cod') {
        completeOrder(formData, 'cod');
    } else if (method === 'upi') {
        document.getElementById('upiModal').classList.add('active');
    } /* else if (method === 'online') {
        // Razorpay Integration - DISABLED
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
    } */
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

    // Generate verification code locally (will be synced with backend)
    const localVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Show initial success modal with the generated code
    document.getElementById('successName').textContent = name;
    document.getElementById('successArea').textContent = area;
    document.getElementById('successOrderId').textContent = orderId;
    document.getElementById('successVerificationCode').textContent = localVerificationCode;

    checkoutModal.classList.remove('active');
    successModal.classList.add('active');

    // Send order to Google Sheets with the verification code
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
        total: total,
        verificationCode: localVerificationCode
    });

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
        // Generate a local verification code for testing
        const testCode = Math.floor(100000 + Math.random() * 900000).toString();
        document.getElementById('successVerificationCode').textContent = testCode;
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
        userEmail: orderData.email, // Link to user email
        verificationCode: orderData.verificationCode // Verification code for delivery
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
                // Update verification code from API response
                if (data.verificationCode) {
                    document.getElementById('successVerificationCode').textContent = data.verificationCode;
                }
            } else {
                console.error('Google Sheets error:', data.error);
            }
        })
        .catch((error) => {
            console.error('Error saving to Google Sheets:', error);
            // Order still completes even if Sheets fails
        });
}

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const formData = {
            action: 'submitInquiry',
            apiKey: API_KEY,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        try {
            if (GOOGLE_SHEETS_URL !== 'YOUR_WEB_APP_URL_HERE') {
                await fetch(GOOGLE_SHEETS_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8',
                    },
                    body: JSON.stringify(formData)
                });
            }

            // Show success
            alert('Thank you! Your message has been sent. We will get back to you soon.');
            contactForm.reset();

        } catch (error) {
            console.error('Error submitting inquiry:', error);
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}
