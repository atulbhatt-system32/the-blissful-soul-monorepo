import type { Schema, Struct } from '@strapi/strapi';

export interface SharedBioPoint extends Struct.ComponentSchema {
  collectionName: 'components_shared_bio_points';
  info: {
    description: 'A single bullet point in a biography section';
    displayName: 'Bio Point';
    icon: 'bulletList';
  };
  attributes: {
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedHero extends Struct.ComponentSchema {
  collectionName: 'components_shared_heroes';
  info: {
    description: '';
    displayName: 'Hero';
    icon: 'layout';
  };
  attributes: {
    cta_link: Schema.Attribute.String & Schema.Attribute.DefaultTo<'/store'>;
    cta_text: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Shop Now'>;
    image: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    subtitle: Schema.Attribute.Text;
    theme: Schema.Attribute.Enumeration<['dark', 'light']> &
      Schema.Attribute.DefaultTo<'dark'>;
    title: Schema.Attribute.String;
  };
}

export interface SharedPopUp extends Struct.ComponentSchema {
  collectionName: 'components_shared_pop_ups';
  info: {
    description: 'A promotional pop-up to show on the page';
    displayName: 'Pop-up';
    icon: 'bullhorn';
  };
  attributes: {
    button_link: Schema.Attribute.String;
    button_text: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    metaDescription: Schema.Attribute.String & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSessionPackage extends Struct.ComponentSchema {
  collectionName: 'components_shared_session_packages';
  info: {
    description: 'A bookable session package';
    displayName: 'Session Package';
    icon: 'calendar';
  };
  attributes: {
    duration: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    price: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Audio session'>;
  };
}

export interface SharedStatItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_stat_items';
  info: {
    description: 'A single statistic displayed in the stats bar';
    displayName: 'Stat Item';
    icon: 'chartPie';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_shared_testimonials';
  info: {
    description: 'A customer testimonial';
    displayName: 'Testimonial';
    icon: 'quote';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.bio-point': SharedBioPoint;
      'shared.hero': SharedHero;
      'shared.pop-up': SharedPopUp;
      'shared.seo': SharedSeo;
      'shared.session-package': SharedSessionPackage;
      'shared.stat-item': SharedStatItem;
      'shared.testimonial': SharedTestimonial;
    }
  }
}
