import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: '0.0.0.0',
  port: 1337,
  url: env('CMS_PUBLIC_URL'),
  app: {
    keys: env.array('CMS_APP_KEYS'),
  },
});

export default config;
