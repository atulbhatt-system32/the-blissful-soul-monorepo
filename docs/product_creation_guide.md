# 📦 How to Create Products in Medusa

This guide walks you through the process of adding new products to your Medusa store, including setting details, organizing them, configuring prices/variants, and managing inventory.

---

### Step 1: Open Product Creation
1. Log into your Medusa Admin dashboard.
2. In the left-hand sidebar menu, click on **Products**.
3. Click the **Create** button in the top right corner.

---

### Step 2: Product Details
In the **Details** tab, fill in the core information:
1. **Title:** The name of your product (e.g., `Crystal Charges - Selenite Plate`).
2. **Subtitle (Optional):** A brief catchphrase or subtitle.
3. **Handle (Optional):** The URL slug (e.g., `crystal-charges-selenite-plate`). If left empty, Medusa generates one from the title.
4. **Description:** A detailed description of the product.
5. **Media:** Upload or drag-and-drop your product images here.
6. **Variants:** Toggle "Yes, this is a product with variants" if you have multiple sizes, colors, etc. If unchecked, a default variant will be created.

![Product Details](./assets/product_details.png)

---

### Step 3: Organize Your Product
Switch to the **Organize** tab to categorize your product:
1. **Discountable:** Toggle this on if you want this product to be eligible for promotional discounts.
2. **Shipping Profile:** Select the appropriate shipping profile (usually `Default Shipping Profile`).
3. **Sales Channels:** Ensure it is added to your "Default Sales Channel" (or "Main Storefront") so it appears on the website.
4. **Collection/Categories/Tags:** Optional fields to help filter and group your products.

![Organize Product](./assets/product_organize.png)

---

### Step 4: Setup Variants & Pricing
In the **Variants** (or Pricing) section:
1. If you didn't toggle "Product with variants", you will just set the price for the default variant.
2. **SKU:** Enter a unique identifier for the product (e.g., `TBS-CC-SP`).
3. **Price INR:** Enter the price for the Indian market (e.g., `1,999.00`).
4. **Managed Inventory:** Check this if you want Medusa to track stock levels.

![Product Variants and Pricing](./assets/product_variants.png)

---

### Step 5: Save and Publish
1. Review your information.
2. Click **Publish** (or **Save as draft** if you aren't ready to go live).
3. Once published, your product will appear on the storefront!

---

### Step 6: Managing Existing Products
Once created, you can click on any product in the list to see the **Product Overview**. From here, you can:
- Edit details and media.
- Manage variant-specific settings (like weight, dimensions, or stock).
- Edit individual variant details by clicking on the variant in the list.

![Product Overview](./assets/product_overview.png)
![Edit Variant Modal](./assets/edit_variant.png)

---

### Step 7: Managing Inventory and Stock
To ensure customers can actually purchase your product, you need to assign stock to a location (warehouse).

1. From the **Product Detail** page, scroll down to the **Variants** section.
2. Click on the Variant name (e.g., `Default variant`). This will open the **Inventory** page for that specific variant.
3. You will see an overview showing `In stock`, `Reserved`, and `Available`. Initially, these will be 0.

![Inventory Overview](./assets/inventory_overview.png)
![Associated Variants](./assets/associated_variants.png)

4. Scroll down to the **Locations** section and click the **Manage locations** button.
5. In the modal that slides out, select your warehouse (e.g., `The Blissful Soul Warehouse`) and click **Save**.

![Manage Locations](./assets/manage_locations.png)

6. Now, click on the **three dots (`...`)** next to the location you just added and select **Edit**.
7. In the **Manage location quantity** modal, enter the amount of stock you have (e.g., `10000`) in the **In stock** field and click **Save**.

![Manage Quantity](./assets/manage_quantity.png)

8. **Verify:** You should now see the updated stock levels reflected in the variant details and on the storefront!

![Inventory Updated](./assets/inventory_updated.png)
