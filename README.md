# The Blissful Soul - Monorepo

Welcome to the **The Blissful Soul** monorepo. This is a headless e-commerce ecosystem built on **Medusa v2**, **Strapi**, and **Next.js**, designed for high performance, localized storefronts, and seamless content management.

## 🏗 Project Structure

This monorepo is managed using **pnpm workspaces** and **Turborepo** for optimized development and builds.

```text
the-blissful-soul-monorepo/
├── apps/
│   ├── backend/          # Medusa v2 e-commerce core
│   │   ├── src/
│   │   │   ├── modules/  # Custom Modules (e.g., SMTP Notification)
│   │   │   ├── subscribers/# Event handlers (e.g., PDF Invoice generation)
│   │   │   └── api/      # Custom store & admin endpoints
│   │   └── medusa-config.ts
│   ├── cms/              # Strapi CMS for static content & pages
│   └── storefront/       # Next.js 14+ Storefront (App Router)
│       ├── src/
│       │   ├── app/      # Localized routes ([countryCode])
│       │   ├── modules/  # Reusable UI components
│       │   └── lib/      # Data fetching & SDK config
├── docker-compose.yml    # Full local environment setup
├── setup_guide.md        # Detailed installation & dev guide
└── turbo.json           # Turborepo build & cache configuration
```

---

## 🚀 Key Features

### 1. **Medusa v2 Backend**
*   **Headless Commerce**: Fully decoupled commerce engine.
*   **Custom Notifications**: integrated **Google SMTP** for transactional emails (replaces WordPress SMTP).
*   **PDF Invoicing**: Automatic generation of invoices via `easyinvoice` attached directly to customer emails.
*   **Payment Support**: Native integration with **Razorpay**.
*   **Sync Logic**: Automated product synchronization between Medusa and Strapi CMS via subscribers.

### 2. **Localized Next.js Storefront**
*   **dynamic Localized Routes**: URL-based country and language support (e.g., `/in/en`, `/us/en`).
*   **Customer Accounts**: Full support for customer registration, login, order history, and profile management.
*   **Real-time Cart**: Persistent server-side sessions for a seamless shopping experience.

### 3. **Strapi CMS**
*   **Content API**: Centrally managed marketing content, categories, and about-pages.
*   **Image Management**: Optimized asset management for product and marketing visuals.

---

## 🛠 Setup & Development

### Prerequisites
*   **Docker** & **Docker Compose**
*   **Node.js 20+**
*   **PNPM**

### Quick Start
1.  **Clone the repository**.
2.  **Initialize Environment**: Ensure `.env` files are present in `root`, `apps/backend/`, and `apps/storefront/`.
3.  **Start Services**:
    ```bash
    docker-compose up --build
    ```
4.  **Backend Console**: Access the Medusa admin at `http://localhost:9000/admin`.
5.  **Storefront**: Access the development site at `http://localhost:8000`.

---

## 🔧 Post-Setup Configuration

### Google SMTP & Invoicing
1.  Go to `apps/backend/.env`.
2.  Set `GOOGLE_SMTP_USER` to your Gmail address.
3.  Set `GOOGLE_SMTP_PASS` to your **16-character Google App Password**.
4.  Restart the backend to enable automated PDF invoice emailing.

---

## 📦 Deployment
The project is optimized for containerized deployments. Refer to `DOCKER.md` for specific deployment instructions and production configuration.
