# 💎 Blissful Soul - Ultimate Setup Guide

Follow this definitive 2-step process to get your Medusa v2 project live and fully connected.

---

## Step 1: Start All Services (Fresh Start)
If you want to start from absolute zero:
```bash
docker-compose down -v
docker-compose up -d --build
```
*Wait 60 seconds.* During this time, Docker pull all the missing dashboard pieces we fixed today and starts the backend.

---

## Step 2: Initialize Everything
Run this single command in your terminal to create your admin account:

```bash
docker-compose exec backend npx medusa user --email admin@theblisfulsoul.in --password 'BlissfulSoul@123'
```

---

## Step 3: Get your Token & Configure the Store!
1.  **Login**: Go to [http://localhost:9000/app](http://localhost:9000/app) ⚙️
2.  **Credentials**: `admin@theblisfulsoul.in` / `BlissfulSoul@123`.
3.  **Add Store Currencies**: Go to **Settings > Store**. By default, it might be in Euros (EUR/USD). Edit the store settings to add your desired currency (e.g., `INR` - Indian Rupee) to the list of available currencies and save.
4.  **Configure Regions**: Go to **Settings > Regions**, create your default region (e.g., "India") and assign the newly added currency (e.g., `INR`) to it.
5.  **Set Default Store Configuration**: Go back to **Settings > Store**, ensure your store uses the newly created Region and `INR` Currency as the default.
6.  **Create Key**: Go to **Settings > Publishable API Keys**, create "Main Storefront", and copy the token.
7.  **Assign to publishable key**: Open the "Main Storefront" publishable key you just created. Under the **Sales Channels** or **Regions/Currencies** section (depending on your Medusa version), attach the "Default Sales Channel" so the storefront can access products and regions.
8.  **Update .env**: Paste that token into `apps/storefront/.env` (for `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`).
9.  **Apply Changes**: Since Next.js requires a build to inject environment variables, rebuild the storefront:

```bash
docker-compose up -d --build storefront
```

🎉 **Everything is now connected! Your storefront at [localhost:8001](http://localhost:8001) will finally be error-free.** 🏎️💨🏆
