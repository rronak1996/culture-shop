# Google Sheets Order Tracking - Setup Guide

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"+ Blank"** to create a new spreadsheet
3. Rename it to **"Culture Orders"**
4. In the first row, add these column headers:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Order ID | Date & Time | Customer Name | Mobile | Email | Address | Area | Pincode | Delivery Time | Payment Method | Transaction ID | Items | Subtotal | Delivery Fee | Total |

5. **Keep this sheet open** - you'll need it in the next steps

---

## Step 2: Add Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Copy and paste this code:

```javascript
// SECURITY CONFIGURATION
// This must match the API_KEY in your main.js file
var VALID_API_KEY = 'culture-secure-2025';

function doPost(e) {
  try {
    // 1. SECURITY CHECK
    // Get the key from the URL parameters
    var providedKey = e.parameter.key;
    
    // If key is missing or wrong, reject the request
    if (providedKey !== VALID_API_KEY) {
      return ContentService.createTextOutput(JSON.stringify({
        'status': 'error',
        'message': 'Unauthorized: Invalid or missing API Key'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. PROCESS ORDER (Only if key is valid)
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    var itemsList = data.items.map(function(item) {
      return item.name + ' (x' + item.quantity + ')';
    }).join(', ');
    
    var rowData = [
      data.orderId,
      new Date(data.timestamp),
      data.customerName,
      data.mobile,
      data.email || 'N/A',
      data.address,
      data.area,
      data.pincode,
      data.deliveryTime,
      data.paymentMethod,
      data.transactionId || 'N/A',
      itemsList,
      '₹' + data.subtotal,
      '₹' + data.deliveryFee,
      '₹' + data.total
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Order saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (💾 icon) and name the project **"Culture Order Tracker"**

---

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description**: Culture Order Tracker
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. **Authorize access**:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to Culture Order Tracker (unsafe)**
   - Click **Allow**
7. **Copy the Web App URL** - it looks like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```
8. Click **Done**

---

## Step 4: Update Your Website Code

1. Open `main.js` in your project
2. Find this line near the top (around line 2):
   ```javascript
   const products = [
   ```
3. **Add this line BEFORE it**:
   ```javascript
   const GOOGLE_SHEETS_URL = 'YOUR_WEB_APP_URL_HERE';
   ```
4. **Replace** `'YOUR_WEB_APP_URL_HERE'` with the URL you copied in Step 3

Example:
```javascript
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
const products = [
```

---

## Step 5: Test It!

1. Run your website: `npm run dev`
2. Add items to cart
3. Complete a test order
4. Check your Google Sheet - the order should appear!

---

## Troubleshooting

### Orders not appearing in sheet?
- Check browser console (F12) for errors
- Verify the Web App URL is correct in `main.js`
- Make sure you clicked "Allow" during authorization
- Try redeploying the web app

### "Authorization required" error?
- Redeploy the web app
- Make sure "Who has access" is set to "Anyone"

### Need to update the script?
1. Edit the code in Apps Script editor
2. Click **Deploy** → **Manage deployments**
3. Click ✏️ Edit
4. Change version to **New version**
5. Click **Deploy**

---

## What Gets Tracked

Every order will automatically save:
- ✅ Order ID and timestamp
- ✅ Customer contact details
- ✅ Full delivery address
- ✅ Payment method and transaction ID
- ✅ Complete cart items
- ✅ Pricing breakdown

You can access your orders anytime at [sheets.google.com](https://sheets.google.com)!
