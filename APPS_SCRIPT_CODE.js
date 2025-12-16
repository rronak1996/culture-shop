// ============================================
// CULTURE E-COMMERCE - GOOGLE APPS SCRIPT
// Backend for Orders & User Authentication
// ============================================

// CONFIGURATION
const API_KEY = 'culture-secure-2025';
const ORDERS_SHEET_NAME = 'Orders';
const USERS_SHEET_NAME = 'Users';
const REVIEWS_SHEET_NAME = 'Reviews';
const INQUIRIES_SHEET_NAME = 'Inquiries';

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Simple password hashing using SHA-256
 */
function hashPassword(password) {
    const rawHash = Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256,
        password,
        Utilities.Charset.UTF_8
    );
    return rawHash.map(function (byte) {
        const v = (byte < 0) ? 256 + byte : byte;
        return ('0' + v.toString(16)).slice(-2);
    }).join('');
}

/**
 * Generate a simple session token
 */
function generateToken(email) {
    const timestamp = new Date().getTime();
    const randomStr = Math.random().toString(36).substring(2);
    return Utilities.base64Encode(email + ':' + timestamp + ':' + randomStr);
}

/**
 * Generate a 6-digit delivery verification code
 */
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Get sheet by name
 */
function getSheet(sheetName) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);

    // Create sheet if it doesn't exist
    if (!sheet) {
        sheet = ss.insertSheet(sheetName);

        // Add headers based on sheet type
        if (sheetName === USERS_SHEET_NAME) {
            sheet.appendRow(['User ID', 'Name', 'Email', 'Mobile', 'Password Hash', 'Created Date', 'Last Login']);
        } else if (sheetName === ORDERS_SHEET_NAME) {
            sheet.appendRow(['Order ID', 'Date & Time', 'Customer Name', 'Mobile', 'Email', 'Address', 'Area', 'Pincode', 'Delivery Time', 'Payment Method', 'Transaction ID', 'Items', 'Subtotal', 'Delivery Fee', 'Total', 'User Email', 'Order Status', 'Verification Code']);
        } else if (sheetName === REVIEWS_SHEET_NAME) {
            sheet.appendRow(['Review ID', 'Date & Time', 'Name', 'Location', 'Rating', 'Review Text', 'Email', 'Status']);
        } else if (sheetName === INQUIRIES_SHEET_NAME) {
            sheet.appendRow(['Inquiry ID', 'Date & Time', 'Name', 'Email', 'Message', 'Status']);
        }
    }

    return sheet;
}

/**
 * Find user by email
 */
function findUserByEmail(email) {
    const sheet = getSheet(USERS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
        if (data[i][2] === email) { // Email is in column 3 (index 2)
            return {
                row: i + 1,
                userId: data[i][0],
                name: data[i][1],
                email: data[i][2],
                mobile: data[i][3],
                passwordHash: data[i][4],
                createdDate: data[i][5],
                lastLogin: data[i][6]
            };
        }
    }

    return null;
}

/**
 * Get orders for a specific user
 */
function getOrdersByEmail(userEmail) {
    const sheet = getSheet(ORDERS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const orders = [];

    // Skip header row
    for (let i = 1; i < data.length; i++) {
        const orderUserEmail = data[i][15]; // User Email column

        if (orderUserEmail === userEmail) {
            orders.push({
                orderId: data[i][0],
                dateTime: data[i][1],
                customerName: data[i][2],
                mobile: data[i][3],
                email: data[i][4],
                address: data[i][5],
                area: data[i][6],
                pincode: data[i][7],
                deliveryTime: data[i][8],
                paymentMethod: data[i][9],
                transactionId: data[i][10],
                items: data[i][11],
                subtotal: data[i][12],
                deliveryFee: data[i][13],
                total: data[i][14],
                status: data[i][16] || 'Pending', // Order Status column
                verificationCode: data[i][17] || '' // Verification Code column
            });
        }
    }

    return orders;
}

// ============================================
// API ENDPOINTS
// ============================================

/**
 * Handle POST requests (Orders & Authentication)
 */
function doPost(e) {
    try {
        const params = JSON.parse(e.postData.contents);
        const action = params.action;

        // Verify API key
        if (params.apiKey !== API_KEY) {
            return ContentService.createTextOutput(JSON.stringify({
                success: false,
                error: 'Invalid API key'
            })).setMimeType(ContentService.MimeType.JSON);
        }

        // Route to appropriate handler
        switch (action) {
            case 'signup':
                return handleSignup(params);
            case 'login':
                return handleLogin(params);
            case 'placeOrder':
                return handlePlaceOrder(params);
            case 'getUserOrders':
                return handleGetUserOrders(params.email);
            case 'submitReview':
                return handleSubmitReview(params);
            case 'submitInquiry':
                return handleSubmitInquiry(params);
            default:
                return ContentService.createTextOutput(JSON.stringify({
                    success: false,
                    error: 'Unknown action'
                })).setMimeType(ContentService.MimeType.JSON);
        }

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * Handle GET requests (User Orders)
 */
function doGet(e) {
    try {
        const action = e.parameter.action;
        const apiKey = e.parameter.apiKey;

        // Verify API key
        if (apiKey !== API_KEY) {
            return ContentService.createTextOutput(JSON.stringify({
                success: false,
                error: 'Invalid API key'
            })).setMimeType(ContentService.MimeType.JSON);
        }

        // Route to appropriate handler
        switch (action) {
            case 'getUserOrders':
                return handleGetUserOrders(e.parameter.email);
            default:
                return ContentService.createTextOutput(JSON.stringify({
                    success: false,
                    error: 'Unknown action'
                })).setMimeType(ContentService.MimeType.JSON);
        }

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

// ============================================
// AUTHENTICATION HANDLERS
// ============================================

/**
 * Handle user signup
 */
function handleSignup(params) {
    const { name, email, mobile, password } = params;

    // Validate required fields
    if (!name || !email || !mobile || !password) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: 'All fields are required'
        })).setMimeType(ContentService.MimeType.JSON);
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: 'Email already registered'
        })).setMimeType(ContentService.MimeType.JSON);
    }

    // Create new user
    const sheet = getSheet(USERS_SHEET_NAME);
    const userId = 'USER-' + new Date().getTime();
    const passwordHash = hashPassword(password);
    const createdDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const token = generateToken(email);

    sheet.appendRow([
        userId,
        name,
        email,
        mobile,
        passwordHash,
        createdDate,
        createdDate // Last login = created date initially
    ]);

    return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Account created successfully',
        user: {
            userId: userId,
            name: name,
            email: email,
            mobile: mobile
        },
        token: token
    })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle user login
 */
function handleLogin(params) {
    const { email, password } = params;

    // Validate required fields
    if (!email || !password) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: 'Email and password are required'
        })).setMimeType(ContentService.MimeType.JSON);
    }

    // Find user
    const user = findUserByEmail(email);
    if (!user) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: 'Invalid email or password'
        })).setMimeType(ContentService.MimeType.JSON);
    }

    // Verify password
    const passwordHash = hashPassword(password);
    if (passwordHash !== user.passwordHash) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: 'Invalid email or password'
        })).setMimeType(ContentService.MimeType.JSON);
    }

    // Update last login
    const sheet = getSheet(USERS_SHEET_NAME);
    const lastLogin = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    sheet.getRange(user.row, 7).setValue(lastLogin);

    // Generate token
    const token = generateToken(email);

    return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Login successful',
        user: {
            userId: user.userId,
            name: user.name,
            email: user.email,
            mobile: user.mobile
        },
        token: token
    })).setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// ORDER HANDLERS
// ============================================

/**
 * Handle order placement
 */
function handlePlaceOrder(params) {
    const sheet = getSheet(ORDERS_SHEET_NAME);

    const {
        orderId,
        customerName,
        mobile,
        email,
        address,
        area,
        pincode,
        deliveryTime,
        paymentMethod,
        transactionId,
        items,
        subtotal,
        deliveryFee,
        total,
        userEmail, // Email of logged-in user (if any)
        verificationCode: providedCode // Verification code from frontend
    } = params;

    const dateTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const itemsStr = items.map(function (item) { return item.name + ' (x' + item.quantity + ')'; }).join(', ');
    const orderStatus = 'Pending';

    // Use provided code from frontend, or generate new one if not provided
    const verificationCode = providedCode || generateVerificationCode();

    sheet.appendRow([
        orderId,
        dateTime,
        customerName,
        mobile,
        email,
        address,
        area,
        pincode,
        deliveryTime,
        paymentMethod,
        transactionId || '',
        itemsStr,
        subtotal,
        deliveryFee,
        total,
        userEmail || email, // Link to user email
        orderStatus,
        verificationCode // Verification code for delivery partner
    ]);

    return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Order saved successfully',
        verificationCode: verificationCode
    })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Get all orders for a user
 */
function handleGetUserOrders(email) {
    if (!email) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: 'Email is required'
        })).setMimeType(ContentService.MimeType.JSON);
    }

    const orders = getOrdersByEmail(email);

    return ContentService.createTextOutput(JSON.stringify({
        success: true,
        orders: orders
    })).setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// REVIEW HANDLERS
// ============================================

/**
 * Handle review submission
 */
function handleSubmitReview(params) {
    const sheet = getSheet(REVIEWS_SHEET_NAME);

    const { name, location, rating, review, email } = params;

    // Validate required fields
    if (!name || !rating || !review) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: 'Name, rating, and review are required'
        })).setMimeType(ContentService.MimeType.JSON);
    }

    const reviewId = 'REV-' + new Date().getTime();
    const dateTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const status = 'Pending Review';

    sheet.appendRow([
        reviewId,
        dateTime,
        name,
        location || 'Not specified',
        rating,
        review,
        email || 'Not provided',
        status
    ]);

    return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Review submitted successfully',
        reviewId: reviewId
    })).setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// INQUIRY HANDLERS
// ============================================

/**
 * Handle contact form / order inquiry submission
 */
function handleSubmitInquiry(params) {
    const sheet = getSheet(INQUIRIES_SHEET_NAME);

    const { name, email, message } = params;

    // Validate required fields
    if (!name || !email || !message) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: 'Name, email, and message are required'
        })).setMimeType(ContentService.MimeType.JSON);
    }

    const inquiryId = 'INQ-' + new Date().getTime();
    const dateTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const status = 'New';

    sheet.appendRow([
        inquiryId,
        dateTime,
        name,
        email,
        message,
        status
    ]);

    return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Inquiry submitted successfully',
        inquiryId: inquiryId
    })).setMimeType(ContentService.MimeType.JSON);
}
