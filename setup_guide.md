# 💎 Blissful Soul - Ultimate Setup Guide

Follow this definitive 2-step process to get your Medusa v2 project live and fully connected.

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
4.  **Add Store Currencies**: Go to **Settings > Store**. By default, it might be in Euros (EUR/USD). Edit the store settings to add your desired currency (e.g., `INR` - Indian Rupee) to the list of available currencies and save.
5.  **Configure Regions**: Go to **Settings > Regions**, create your default region (e.g., "India") and assign the newly added currency (e.g., `INR`) to it.
6.  **Set Default Store Configuration**: Go back to **Settings > Store**, ensure your store uses the newly created Region and `INR` Currency as the default.
7.  **Create Key**: Go to **Settings > Publishable API Keys**, create "Main Storefront", and copy the token.
8.  **Assign to publishable key**: Open the "Main Storefront" publishable key you just created. Under the **Sales Channels** or **Regions/Currencies** section (depending on your Medusa version), attach the "Default Sales Channel" so the storefront can access products and regions.
9.  **Update .env**: Paste that token into `apps/storefront/.env` (for `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`).
10. **Apply Changes**: Since Next.js requires a build to inject environment variables, rebuild the storefront:

```bash
docker-compose up -d --build storefront
```

🎉 **Everything is now connected! Your storefront at [localhost:8001](http://localhost:8001) will finally be error-free.** 🏎️💨🏆

---

## Step 4: Maintenance & Manual Product Sync

While products sync automatically whenever you **Create** or **Update** them in Medusa, you can manually force a full synchronization if needed.

### **Manual Sync Endpoint**
If your Strapi CMS is empty and you want to push all products from Medusa instantly, visit the following URL in your browser (while logged into the Medusa Admin):

**Production:**
`https://klickvert.com/admin/sync-strapi`

**Development (Local):**
`http://localhost:9000/admin/sync-strapi`

> [!NOTE]
> You must be logged in to the Medusa Admin dashboard in the same browser session for this link to work, as it is a protected admin route.
