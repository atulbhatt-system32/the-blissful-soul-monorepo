import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('CMS_ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('CMS_API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('CMS_TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('CMS_ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});

export default config;
