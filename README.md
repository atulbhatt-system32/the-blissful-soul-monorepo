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

### Full Setup Guide

For a complete, step-by-step walkthrough — including environment variables, admin account creation, store configuration (currencies, regions, shipping), API key setup, payment gateway (Razorpay), and more — refer to the **[Setup Guide](./setup_guide.md)**.

### Quick Start
1.  **Clone the repository**.
2.  **Initialize Environment**: Copy the example env files:
    ```bash
    cp env.example .env
    cp apps/backend/.env.example apps/backend/.env
    cp apps/storefront/.env.example apps/storefront/.env
    cp apps/cms/.env.example apps/cms/.env
    ```
3.  **Start Services**:
    ```bash
    docker-compose up -d --build
    ```
4.  **Backend Console**: Access the Medusa admin at `http://localhost:9000/app`.
5.  **Storefront**: Access the development site at `http://localhost:8001`.

> For post-startup configuration (store currencies, regions, API keys, Razorpay webhooks, etc.), follow the [Setup Guide](./setup_guide.md) from Step 2 onwards.

---

## 📦 Deployment
The project is optimized for containerized deployments. Refer to `DOCKER.md` for specific deployment instructions and production configuration.

---

## 📚 Additional Guides

| Guide | Description |
| :--- | :--- |
| [Setup Guide](./setup_guide.md) | End-to-end setup: environment, services, store config, payments |
| [Currency Setup](./docs/currency_setup_guide.md) | Adding and managing store currencies |
| [Region Setup](./docs/region_setup_guide.md) | Creating regions and assigning currencies |
| [Locations & Shipping](./docs/locations_shipping_guide.md) | Stock locations, sales channels, fulfillment |
| [Publishable API Keys](./docs/publishable_keys_guide.md) | Generating and wiring up Medusa API keys |
| [Strapi API Token](./docs/strapi_api_token_guide.md) | Creating and using Strapi API tokens |
| [Product Creation](./docs/product_creation_guide.md) | Adding products and configuring visibility rules |
