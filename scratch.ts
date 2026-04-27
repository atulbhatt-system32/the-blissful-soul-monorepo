import { sdk } from "./apps/storefront/src/lib/config";

async function checkHandles() {
  const intentionsRoot = await sdk.client
    .fetch("/store/product-categories", {
      query: {
        fields: "*category_children",
        handle: "intentions",
        limit: 1,
      },
    })
    .then((res: any) => res.product_categories[0]);

  if (!intentionsRoot) {
    console.log("Intentions category not found");
    return;
  }

  console.log("Intentions Children Handles:");
  intentionsRoot.category_children.forEach((c: any) => {
    console.log(`- ${c.name}: ${c.handle}`);
  });
}

checkHandles();
