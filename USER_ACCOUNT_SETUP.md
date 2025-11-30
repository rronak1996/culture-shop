# User Account System - Setup Guide

## Overview
This guide will help you set up the complete user account system for your Culture e-commerce website, including user authentication, login/signup, and order history tracking.

## Prerequisites
- Existing Google Sheet with "Orders" sheet
- Google Apps Script already set up
- Basic understanding of Google Sheets

---

## Step 1: Update Google Apps Script

### 1.1 Open Your Apps Script Project
1. Open your Google Sheet (the one with "Orders")
2. Click **Extensions** → **Apps Script**
3. You should see your existing code

### 1.2 Replace the Code
1. **Delete all existing code** in the script editor
2. Open the file `apps-script-backend.js` from your project folder
3. **Copy all the code** from that file
4. **Paste it** into the Apps Script editor
5. Click **Save** (💾 icon)
6. Name the project: "Culture Backend API"

### 1.3 What This New Code Does
- ✅ **User Signup** - Creates new user accounts
- ✅ **User Login** - Authenticates users with email/password
- ✅ **Password Hashing** - Securely stores passwords (SHA-256)
- ✅ **Session Tokens** - Manages user sessions
- ✅ **Order Linking** - Links orders to user accounts
- ✅ **Order History** - Fetches all orders for a user
- ✅ **Auto-creates Sheets** - Creates "Users" sheet if it doesn't exist

---

## Step 2: Deploy the Updated Script

### 2.1 Create New Deployment
1. In Apps Script editor, click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**

### 2.2 Configure Deployment
Fill in the following:
- **Description**: "User Account System v1.0"
- **Execute as**: **Me** (your email)
- **Who has access**: **Anyone**

### 2.3 Authorize & Deploy
1. Click **Deploy**
2. Click **Authorize access**
3. Choose your Google account
4. Click **Advanced** → **Go to Culture Backend API (unsafe)**
5. Click **Allow**
6. **Copy the Web App URL** (you'll need this!)

Example URL:
```
https://script.google.com/macros/s/AKfycbx.../exec
```

---

## Step 3: Verify Google Sheets Structure

### 3.1 Check "Users" Sheet
The script will auto-create this sheet when first user signs up, but you can create it manually:

1. In your Google Sheet, click the **+** button to add a new sheet
2. Name it exactly: **Users**
3. Add these headers in Row 1:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| User ID | Name | Email | Mobile | Password Hash | Created Date | Last Login |

### 3.2 Update "Orders" Sheet
Add two new columns to your existing "Orders" sheet:

**Column P (16th column)**: `User Email`
**Column Q (17th column)**: `Order Status`

Your Orders sheet should now have these columns:
```
A: Order ID
B: Date & Time
C: Customer Name
D: Mobile
E: Email
F: Address
G: Area
H: Pincode
I: Delivery Time
J: Payment Method
K: Transaction ID
L: Items
M: Subtotal
N: Delivery Fee
O: Total
P: User Email (NEW)
Q: Order Status (NEW)
```

---

## Step 4: Update Website Configuration

### 4.1 Update main.js
1. Open `main.js` in your project
2. Find this line near the top:
```javascript
const GOOGLE_SHEETS_URL = 'YOUR_WEB_APP_URL_HERE';
```

3. Replace it with your new Web App URL:
```javascript
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
```

4. The API_KEY should match (already set to `'culture-secure-2025'`)

---

## Step 5: Test the System

### 5.1 Test Signup
1. Run your website: `npm run dev`
2. Navigate to the signup page (we'll create this next)
3. Create a test account:
   - Name: Test User
   - Email: test@example.com
   - Mobile: 9876543210
   - Password: Test@123

4. Check your "Users" sheet - you should see the new user!

### 5.2 Test Login
1. Try logging in with the credentials you just created
2. You should be redirected to the home page
3. Your name should appear in the header

### 5.3 Test Order Placement
1. While logged in, add items to cart
2. Complete checkout
3. Check "Orders" sheet - the "User Email" column should have your email

### 5.4 Test Order History
1. Visit "My Account" page
2. You should see all your orders
3. Each order should show its current status

---

## Managing Order Status

### How to Update Order Status
1. Open your Google Sheet
2. Go to the "Orders" sheet
3. Find the order you want to update
4. In the "Order Status" column (Q), enter one of these values:
   - `Pending` - Order received, awaiting confirmation
   - `Accepted` - Order confirmed
   - `Preparing` - Order being prepared
   - `Out for Delivery` - On the way
   - `Delivered` - Successfully delivered
   - `Cancelled` - Order cancelled

5. Customer will see the updated status when they refresh their account page

---

## Security Notes

### ✅ What's Secure
- Passwords are hashed (SHA-256) - never stored in plain text
- API key validation on all requests
- HTTPS enforced when deployed on Netlify
- Session tokens for authentication

### ⚠️ Limitations
- This is suitable for small to medium e-commerce sites
- Not recommended for high-security applications (banking, etc.)
- No email-based password reset (would need email service)
- Users can only access from devices where they logged in

---

## Troubleshooting

### Issue: "Invalid API key" error
**Solution**: Make sure the API_KEY in both `main.js` and Apps Script match exactly (`'culture-secure-2025'`)

### Issue: "Email already registered"
**Solution**: This email is already in use. Try a different email or login instead.

### Issue: Orders not showing in account
**Solution**: 
1. Check that "User Email" column exists in Orders sheet
2. Verify you're logged in when placing orders
3. Check browser console for errors

### Issue: Can't see "Users" sheet
**Solution**: The sheet is auto-created on first signup. Try creating a test account.

---

## Next Steps

After completing this setup:
1. ✅ Backend is ready
2. ✅ Google Sheets configured
3. 🔄 Next: Create frontend pages (login.html, signup.html, account.html)
4. 🔄 Next: Add authentication logic (auth.js)
5. 🔄 Next: Style the pages
6. 🔄 Next: Test everything
7. 🔄 Next: Deploy to Netlify

---

## Support

If you encounter any issues:
1. Check browser console (F12) for error messages
2. Verify Web App URL is correct in `main.js`
3. Ensure Apps Script deployment is set to "Anyone" access
4. Check that both sheets ("Users" and "Orders") exist with correct columns
