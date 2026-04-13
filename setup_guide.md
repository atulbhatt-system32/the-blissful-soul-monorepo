# 💎 Blissful Soul - Ultimate Setup Guide

Follow this definitive process to get your Medusa v2 project live and fully connected.

---

## Step 0: Setup Environment Variables

Before starting the services, you need to set up your `.env` files across the project by copying the provided example files:

```bash
# Project root
cp env.example .env

# Backend
cp apps/backend/.env.example apps/backend/.env

# Storefront
cp apps/storefront/.env.example apps/storefront/.env

# CMS
cp apps/cms/.env.example apps/cms/.env
```

---

## Step 1: Start All Services (Fresh Start)
If you want to start from absolute zero:
```bash
docker-compose down
docker-compose up -d --build
```
*Wait 60 seconds.* During this time, Docker pull all the missing dashboard pieces we fixed today and starts the backend.

---

## Step 2: Initialize Everything
Run these commands in your terminal to create your admin accounts:

**For Medusa (Backend):**
```bash
docker-compose exec backend npx medusa user --email admin@theblisfulsoul.in --password 'BlissfulSoul@123'
```

**For Strapi (CMS):**
```bash
docker-compose exec cms npx strapi admin:create-user --email admin@theblisfulsoul.in --password 'BlissfulSoul@123' --firstname Admin --lastname User
```

---

## Step 3: Get your Token & Configure the Store!
1.  **Login to Medusa**: Go to [http://localhost:9000/app](http://localhost:9000/app) ⚙️
2.  **Login to Strapi**: Go to [http://localhost:1337/admin](http://localhost:1337/admin) 🚀
3.  **Credentials**: `admin@theblisfulsoul.in` / `BlissfulSoul@123` (Same for both).
4.  **Add Store Currencies**: Go to **Settings > Store**. By default, it might be in Euros (EUR/USD). Edit the store settings to add your desired currency (e.g., `INR` - Indian Rupee) to the list of available currencies and save. *(See detailed guide: [Currency Setup Guide](./docs/currency_setup_guide.md))*
5.  **Configure Regions**: Go to **Settings > Regions**, create your default region (e.g., "India") and assign the newly added currency (e.g., `INR`) to it. *(See detailed guide: [Region Setup Guide](./docs/region_setup_guide.md))*
6.  **Configure Locations & Shipping**: Go to **Settings > Locations & Shipping**, create your stock location (e.g., "The Blissful Soul Warehouse"), assign your sales channel, and add your fulfillment provider (e.g., "Manual"). *(See detailed guide: [Locations & Shipping Guide](./docs/locations_shipping_guide.md))*
7.  **Set Default Store Configuration**: Go back to **Settings > Store**, ensure your store uses the newly created Region and `INR` Currency as the default.
8.  **Configure API Keys**: In the Medusa Admin, go to **Settings > Publishable API Keys**. Find or create your storefront key, copy the token, and ensure the "Default Sales Channel" is attached.
9.  **Update .env (Medusa)**: Paste that token into `apps/storefront/.env` (for `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`). *(See detailed visual guide: [Publishable Keys Setup Guide](./docs/publishable_keys_guide.md))*
10. **Get Strapi API Token**: In Strapi Admin, go to **Settings > API Tokens**. Click **Create new API Token**. Name it (e.g., "Storefront"), select `Unlimited` duration and `Full Access` type. Save, copy the token, and paste it into both `apps/storefront/.env` and `apps/backend/.env` (for `CMS_API_TOKEN`). *(See detailed guide: [Strapi API Token Guide](./docs/strapi_api_token_guide.md))*
11. **Apply Changes**: Since Next.js and Medusa require a build/restart to inject environment variables, rebuild both services:

```bash
docker-compose up -d --build storefront backend
```

🎉 **Everything is now connected! Your storefront at [localhost:8001](http://localhost:8001) will finally be error-free.** 🏎️💨🏆

---

## Step 4: Product & Service Display Rules

### **General Visibility (Products)**
To prevent a product (like a free gift or a draft) from appearing in the main shop list or search, add one of these tags in Medusa Admin:
*   **Tag:** `free-gift`
*   **Tag:** `hidden`

### **Session Visibility (Variants)**
The "Book Your Session" section on the homepage splits products into separate cards for each variant (e.g., 30m, 60m). You can control these specifically:
*   **Hide from "Top Services" only**: Add Metadata to the **Variant**:
    *   **Key:** `hide_from_top`
    *   **Value:** `true`
    *(This variant will still show up in the dedicated "Audio/Video Session" tabs).*
*   **Hide from Everywhere**: Add Metadata to the **Variant**:
    *   **Key:** `hidden`
    *   **Value:** `true`

---

## Step 5: Automatic Free Gift Logic
The system automatically adds a gift to the cart based on spend.
*   **Target Product Handle:** `money-potli-free-gift`
*   **Default Threshold:** ₹1,499

**Customizing Threshold per Product:**
To change the minimum spend required for a specific gift, add this to the product's **Metadata**:
*   **Key:** `gift_threshold`
*   **Value:** `2000` (for ₹2,000)

---

## Step 6: Maintenance & Manual Product Sync

While products sync automatically whenever you **Create** or **Update** them in Medusa, you can manually force a full synchronization if needed.

### **Manual Sync Endpoint**
Visit this URL while logged into Medusa Admin:
*   **Local:** `http://localhost:9000/admin/sync-strapi`
*   **Production:** `https://your-domain.com/admin/sync-strapi`

> [!NOTE]
> You must be logged in to the Medusa Admin in the same browser session for this link to work.

---

## Step 7: Razorpay Payment Gateway Setup

To enable payments and ensure orders are automatically marked as "Paid" once the customer completes the transaction, follow these steps:

### **1. Configure Credentials**
Ensure these values are set in your `apps/backend/.env` file:
*   `RAZORPAY_ID`: Your Razorpay Key ID
*   `RAZORPAY_SECRET`: Your Razorpay Key Secret
*   `RAZORPAY_WEBHOOK_SECRET`: A secure random string (e.g., `_n'&%5S?Qs;2URp`)

### **2. Set Up Webhook in Razorpay Dashboard**
1.  Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2.  Go to **Account & Settings > Webhooks**.
3.  Click **Add New Webhook** and use the following details:

| Field | Value |
| :--- | :--- |
| **Webhook URL** | `https://backend.theblissfulsoul.in/hooks/payment/razorpay` |
| **Secret** | (Same as your `RAZORPAY_WEBHOOK_SECRET`) |
| **Alert Email** | Your admin email (e.g., `theblissfulsoul27@gmail.com`) |

### **3. Active Events**
In the "Active Events" section, you **must** select the following to ensure Medusa processes orders correctly:
*   `payment.authorized`
*   `payment.captured`
*   `payment.failed`
*   `order.paid` (Optional)

### **4. Local Testing (Ngrok)**
If you are testing payments locally, use your ngrok URL:
*   `https://[your-ngrok-id].ngrok-free.app/hooks/payment/razorpay`
