# The Blissful Soul - Project Overview

Welcome to the **Blissful Soul** project! This document outlines what this project is, its goals, and the architecture we are building.

## What Are We Building?

We are building a **Headless E-commerce Application** for a store called "The Blissful Soul" (which appears to sell crystals, bracelets, and spiritual wellness products based on the database seed data like "Pyrite MONEY KEYCHAIN" and "Rose Quartz Natural Bracelet").

A "headless" architecture means that the "front-end" (what the user sees) is completely separated from the "back-end" (where the business logic lives) and the "CMS" (where the site's rich content lives). This setup gives you ultimate flexibility, better performance, and easier scalability.

## Architecture Breakdown

To achieve this, the project is split into three separate and independent parts:

### 1. The Storefront (`blissful-soul-storefront`)

- **Technology**: Next.js (React), Tailwind CSS
- **Port**: `8001` (http://localhost:8001)
- **Role**: This is the actual website that your customers interact with. It displays products, handles the shopping cart, and provides the checkout experience. It does not hold its own data; instead, it talks to the Backend via APIs to get product information and process orders. It also features a sleek, modern UI built with Medusa's UI components.

### 2. The Backend / E-commerce Engine (`blissful-soul-backend`)

- **Technology**: MedusaJS (Node.js framework for e-commerce), PostgreSQL, Redis
- **Port**: `9000` (http://localhost:9000/app)
- **Role**: This is the brain of your e-commerce operations. It handles complex business logic like:
  - Inventory management
  - Order processing and fulfillment
  - Payment and tax calculation
  - Shipping regions and currencies
- **Database**: PostgreSQL (running on port `5432` with database `medusa_db`)
- **Admin Panel**: Provides a dashboard for store owners to manage the catalog, view orders, and set up shipping.
  - Login Email: `admin@admin.com`
  - Login Password: `supersecret`

### 3. The Content Management System (CMS) (`blissful-soul-cms`)

- **Technology**: Strapi
- **Port**: `1337` (http://localhost:1337/admin)
- **Role**: Strapi acts as the Content Management System (CMS), handling all the marketing and visual content of the website. While Medusa manages strict e-commerce logic, Strapi lets you:
  - **Manage Homepage Content**: Upload and change hero banners, promotional sliders, and "Meet our Expert" sections.
  - **Extend Product Data**: Add deep dive blog-style descriptions or lifestyle images to product pages.
  - **Improve SEO**: Manage metadata (titles and descriptions for Google) for specific pages.
  - **Allow Marketing Teams to Work**: Update banners and blog posts without touching the codebase or risking the checkout process.
- **Database**: SQLite (stored locally inside the project)

## How They Work Together

1. A customer visits the **Storefront**.
2. The Storefront makes an API call to the **CMS (Strapi)** to load the homepage banners and blog posts.
3. The Storefront makes an API call to the **Backend (Medusa)** to fetch the latest products, prices, and stock availability.
4. When the customer checks out, the Storefront sends the order details to **Medusa** to securely process the payment and update inventory.

## How to Start the Project

To start development, open three separate terminals and run the following instances:

**Terminal 1:**

```bash
cd blissful-soul-backend
npm run dev
```

**Terminal 2:**

```bash
cd blissful-soul-cms
npm run dev
```

**Terminal 3:**

```bash
cd blissful-soul-storefront
npm run dev
```
