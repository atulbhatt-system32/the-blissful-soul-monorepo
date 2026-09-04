// scripts/update_sort_priority.js

// ==============================================================================
// INSTRUCTIONS:
// 1. Set your Medusa Backend URL and Admin API Token below (or via environment variables).
// 2. Run the script from the root of your project: 
//    node scripts/update_sort_priority.js
// ==============================================================================

const MEDUSA_URL = process.env.MEDUSA_URL || "http://localhost:9000";
const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN || "YOUR_ADMIN_API_TOKEN_HERE";
// DRY_RUN defaults to true for safety. Set DRY_RUN=false to actually update the database.
const DRY_RUN = process.env.DRY_RUN !== "false";

if (ADMIN_API_TOKEN === "YOUR_ADMIN_API_TOKEN_HERE") {
    console.error("❌ Please provide an ADMIN_API_TOKEN.");
    console.error("You can set it in the script directly, or run like this:");
    console.error("ADMIN_API_TOKEN=sk_12345 node scripts/update_sort_priority.js");
    process.exit(1);
}

const headers = {
    "Content-Type": "application/json",
    // Medusa v2 Admin API Keys require Basic Auth
    "Authorization": `Basic ${Buffer.from(`${ADMIN_API_TOKEN}:`).toString("base64")}`
};

async function fetchAllProducts() {
    let allProducts = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
        const res = await fetch(`${MEDUSA_URL}/admin/products?limit=${limit}&offset=${offset}&fields=id,title,handle,metadata`, { headers });
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to fetch products: ${res.status} ${res.statusText} - ${errorText}`);
        }
        
        const data = await res.json();
        const products = data.products || [];
        
        allProducts = allProducts.concat(products);
        
        if (products.length < limit) {
            hasMore = false;
        } else {
            offset += limit;
        }
    }
    return allProducts;
}

async function updateProductPriority(product, priority) {
    const existingMetadata = product.metadata || {};
    
    // Skip if already correct
    // (Medusa metadata is often converted to string depending on how it's saved, so checking both)
    if (existingMetadata.sort_priority === priority || existingMetadata.sort_priority === String(priority)) {
        return { skipped: true };
    }

    const payload = {
        metadata: {
            ...existingMetadata,
            sort_priority: priority
        }
    };

    if (DRY_RUN) {
        return { skipped: false, dryRun: true };
    }

    const res = await fetch(`${MEDUSA_URL}/admin/products/${product.id}`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update ${product.title} (${product.id}): ${errorText}`);
    }

    return { skipped: false };
}

async function run() {
    console.log(`Connecting to Medusa at ${MEDUSA_URL}...`);
    console.log("Fetching all products...");
    
    let products;
    try {
        products = await fetchAllProducts();
    } catch (err) {
        console.error("❌ Error fetching products:", err.message);
        process.exit(1);
    }

    console.log(`Found ${products.length} products. Assigning priorities...`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const product of products) {
        const title = (product.title || "").toLowerCase();
        const handle = (product.handle || "").toLowerCase();
        
        let priority = 50; // Default (Middle) for all other products

        const isBracelet = title.includes("bracelet") || handle.includes("bracelet");
        const isPyramid = title.includes("pyramid") || handle.includes("pyramid");
        const isLocket = title.includes("locket") || handle.includes("locket");

        if (isBracelet) {
            // First page bracelets
            if (
                title.includes("black obsidian") ||
                title.includes("rose quartz") ||
                title.includes("money magnet") ||
                title.includes("amethyst") ||
                handle.includes("black-obsidian") ||
                handle.includes("rose-quartz") ||
                handle.includes("money-magnet") ||
                handle.includes("amethyst")
            ) {
                priority = 10;
            } else {
                // Other bracelets on page 2+
                priority = 30;
            }
        } else if (isPyramid) {
            // Pyramids at the end
            priority = 100;
        } else if (isLocket) {
            // Lockets at the very end
            priority = 200;
        }

        try {
            const result = await updateProductPriority(product, priority);
            if (result.skipped) {
                console.log(`⏭️  Skipped [Priority: ${priority}] - ${product.title}`);
                skippedCount++;
            } else if (result.dryRun) {
                console.log(`🧪 [DRY RUN] Would update [Priority: ${priority}] - ${product.title}`);
                updatedCount++;
            } else {
                console.log(`✅ Updated [Priority: ${priority}] - ${product.title}`);
                updatedCount++;
            }
        } catch (err) {
            console.error(`❌ Error updating ${product.title}:`, err.message);
        }
    }

    console.log("\n=================================================");
    if (DRY_RUN) {
        console.log(`🧪 DRY RUN COMPLETE: Would update ${updatedCount}, skipped ${skippedCount}`);
        console.log(`To actually run the updates, set DRY_RUN=false in the command.`);
    } else {
        console.log(`🎉 Done! Updated: ${updatedCount}, Skipped: ${skippedCount}`);
    }
    console.log("=================================================");
}

run();
