// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: any }) {
    // Generate an API token for Medusa if none exists
    const tokenService = strapi.service('admin::api-token');

    const existingTokens = await tokenService.list();
    let medusaToken = existingTokens.find((t: any) => t.name === 'medusa-sync');

    if (!medusaToken) {
      medusaToken = await tokenService.create({
        name: 'medusa-sync',
        type: 'full-access',
        description: 'Medusa Synchronization Token'
      });
      console.log('--- STRAPI API TOKEN CREATED for Medusa sync ---');
      console.log('CMS_API_TOKEN=' + medusaToken.accessKey);
      console.log('------------------------------------------------');
    }
  },
};
