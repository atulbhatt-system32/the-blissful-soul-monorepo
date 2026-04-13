# 🎨 Strapi CMS: Editing UI Elements & Content

This guide explains how to manage your storefront's user interface, pages, and copy directly from the Strapi CMS. Since your setup relies on Strapi headless CMS, you can edit the website's frontend feel without writing any code!

---

### Step 1: Access the Content Manager
1. Log into your Strapi Admin dashboard at `http://localhost:1337/admin`.
2. In the top-left sidebar menu, click on **Content Manager**.
3. Under the **Single Types** and **Collection Types** sub-menus, you will see the structures that control your storefront UI.

---

### Step 2: Global UI Configuration
Your overall site branding—the things that appear on *every* page—is handled by the **Store Config**.

1. Under **Single Types** in the Content Manager, click on **Store-config**.
2. Here you can edit site-wide UI elements:
   * **Logos & Branding:** Upload new images to instantly replace your site logos in the header and footer.
   * **Social Links:** Update your Instagram, YouTube, or Facebook URLs natively.
   * **Navigation Menus:** Add, remove, or rename the header links (e.g., changing "Shop" to "Collections").
   * **Announcement Bars:** Change the text of promotional hero banners at the top of the site.
3. Click the **Save** button in the top right corner.

---

### Step 3: Editing Individual Pages
Core pages are isolated into their own instances so you can build them modularly:
* **Homepage**
* **About Page**
* **Contact Page**
* **Book Session Page**

**How to edit a page UI:**
1. Click on the desired page (e.g., **Homepage**) under the **Single Types** menu.
2. Most pages are broken down into **Dynamic Zones** or modular **Components** (like Hero Sections, Feature Grids, Text blocks, Testimonials).
3. To update UI details:
   - Change headline text in the Title fields.
   - Click existing images to swap them out in the Media Library.
   - Use the **`+`** icon to add new UI blocks or use the drag handles to reorder sections horizontally or vertically!
4. Click **Save**.

---

### Step 4: Enhancing Products with Strapi
While Medusa strictly handles Core E-commerce logic (Pricing, Inventory, Add to Cart), Strapi handles purely **Rich Content**. 

If you want to add customized UI elements to a specific product's page (like a dedicated embedded tutorial video, an extended FAQ section, or styled rich-text marketing copy):
1. Under **Collection Types**, click on **Product**.
2. Find the product synced from Medusa.
3. Use the Strapi interface to attach and flesh out the rich media blocks the storefront uses to augment the standard Medusa design.

---

### Step 5: Publishing Your Changes
> **Important:** Changes made in Strapi only appear on the active storefront if the content is in a **Published** state!

1. When you edit a live entry, the **Save** button saves it as a draft modification.
2. Once you are 100% happy with the UI changes, make sure you hit the **Publish** button to make it live instantly. Your Next.js storefront will automatically detect the updated API data.
