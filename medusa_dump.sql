--
-- PostgreSQL database dump
--

\restrict 635cpOC1P1nuwGi76j9HIrQ2HlfefbPa3cgYOtArgXrgDfbHdlQvvMwhcmhZez9

-- Dumped from database version 14.20 (Homebrew)
-- Dumped by pg_dump version 14.20 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: claim_reason_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.claim_reason_enum AS ENUM (
    'missing_item',
    'wrong_item',
    'production_failure',
    'other'
);


ALTER TYPE public.claim_reason_enum OWNER TO postgres;

--
-- Name: order_claim_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_claim_type_enum AS ENUM (
    'refund',
    'replace'
);


ALTER TYPE public.order_claim_type_enum OWNER TO postgres;

--
-- Name: order_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status_enum AS ENUM (
    'pending',
    'completed',
    'draft',
    'archived',
    'canceled',
    'requires_action'
);


ALTER TYPE public.order_status_enum OWNER TO postgres;

--
-- Name: return_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.return_status_enum AS ENUM (
    'open',
    'requested',
    'received',
    'partially_received',
    'canceled'
);


ALTER TYPE public.return_status_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account_holder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_holder (
    id text NOT NULL,
    provider_id text NOT NULL,
    external_id text NOT NULL,
    email text,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.account_holder OWNER TO postgres;

--
-- Name: api_key; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_key (
    id text NOT NULL,
    token text NOT NULL,
    salt text NOT NULL,
    redacted text NOT NULL,
    title text NOT NULL,
    type text NOT NULL,
    last_used_at timestamp with time zone,
    created_by text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_by text,
    revoked_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT api_key_type_check CHECK ((type = ANY (ARRAY['publishable'::text, 'secret'::text])))
);


ALTER TABLE public.api_key OWNER TO postgres;

--
-- Name: application_method_buy_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.application_method_buy_rules (
    application_method_id text NOT NULL,
    promotion_rule_id text NOT NULL
);


ALTER TABLE public.application_method_buy_rules OWNER TO postgres;

--
-- Name: application_method_target_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.application_method_target_rules (
    application_method_id text NOT NULL,
    promotion_rule_id text NOT NULL
);


ALTER TABLE public.application_method_target_rules OWNER TO postgres;

--
-- Name: auth_identity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_identity (
    id text NOT NULL,
    app_metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.auth_identity OWNER TO postgres;

--
-- Name: capture; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.capture (
    id text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    payment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    created_by text,
    metadata jsonb
);


ALTER TABLE public.capture OWNER TO postgres;

--
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    id text NOT NULL,
    region_id text,
    customer_id text,
    sales_channel_id text,
    email text,
    currency_code text NOT NULL,
    shipping_address_id text,
    billing_address_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    completed_at timestamp with time zone,
    locale text
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- Name: cart_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_address (
    id text NOT NULL,
    customer_id text,
    company text,
    first_name text,
    last_name text,
    address_1 text,
    address_2 text,
    city text,
    country_code text,
    province text,
    postal_code text,
    phone text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.cart_address OWNER TO postgres;

--
-- Name: cart_line_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_line_item (
    id text NOT NULL,
    cart_id text NOT NULL,
    title text NOT NULL,
    subtitle text,
    thumbnail text,
    quantity integer NOT NULL,
    variant_id text,
    product_id text,
    product_title text,
    product_description text,
    product_subtitle text,
    product_type text,
    product_collection text,
    product_handle text,
    variant_sku text,
    variant_barcode text,
    variant_title text,
    variant_option_values jsonb,
    requires_shipping boolean DEFAULT true NOT NULL,
    is_discountable boolean DEFAULT true NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    compare_at_unit_price numeric,
    raw_compare_at_unit_price jsonb,
    unit_price numeric NOT NULL,
    raw_unit_price jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    product_type_id text,
    is_custom_price boolean DEFAULT false NOT NULL,
    is_giftcard boolean DEFAULT false NOT NULL,
    CONSTRAINT cart_line_item_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.cart_line_item OWNER TO postgres;

--
-- Name: cart_line_item_adjustment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_line_item_adjustment (
    id text NOT NULL,
    description text,
    promotion_id text,
    code text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    item_id text,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    CONSTRAINT cart_line_item_adjustment_check CHECK ((amount >= (0)::numeric))
);


ALTER TABLE public.cart_line_item_adjustment OWNER TO postgres;

--
-- Name: cart_line_item_tax_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_line_item_tax_line (
    id text NOT NULL,
    description text,
    tax_rate_id text,
    code text NOT NULL,
    rate real NOT NULL,
    provider_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    item_id text
);


ALTER TABLE public.cart_line_item_tax_line OWNER TO postgres;

--
-- Name: cart_payment_collection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_payment_collection (
    cart_id character varying(255) NOT NULL,
    payment_collection_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.cart_payment_collection OWNER TO postgres;

--
-- Name: cart_promotion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_promotion (
    cart_id character varying(255) NOT NULL,
    promotion_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.cart_promotion OWNER TO postgres;

--
-- Name: cart_shipping_method; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_shipping_method (
    id text NOT NULL,
    cart_id text NOT NULL,
    name text NOT NULL,
    description jsonb,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    shipping_option_id text,
    data jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT cart_shipping_method_check CHECK ((amount >= (0)::numeric))
);


ALTER TABLE public.cart_shipping_method OWNER TO postgres;

--
-- Name: cart_shipping_method_adjustment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_shipping_method_adjustment (
    id text NOT NULL,
    description text,
    promotion_id text,
    code text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    shipping_method_id text
);


ALTER TABLE public.cart_shipping_method_adjustment OWNER TO postgres;

--
-- Name: cart_shipping_method_tax_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_shipping_method_tax_line (
    id text NOT NULL,
    description text,
    tax_rate_id text,
    code text NOT NULL,
    rate real NOT NULL,
    provider_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    shipping_method_id text
);


ALTER TABLE public.cart_shipping_method_tax_line OWNER TO postgres;

--
-- Name: credit_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credit_line (
    id text NOT NULL,
    cart_id text NOT NULL,
    reference text,
    reference_id text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.credit_line OWNER TO postgres;

--
-- Name: currency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currency (
    code text NOT NULL,
    symbol text NOT NULL,
    symbol_native text NOT NULL,
    decimal_digits integer DEFAULT 0 NOT NULL,
    rounding numeric DEFAULT 0 NOT NULL,
    raw_rounding jsonb NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.currency OWNER TO postgres;

--
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer (
    id text NOT NULL,
    company_name text,
    first_name text,
    last_name text,
    email text,
    phone text,
    has_account boolean DEFAULT false NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    created_by text
);


ALTER TABLE public.customer OWNER TO postgres;

--
-- Name: customer_account_holder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_account_holder (
    customer_id character varying(255) NOT NULL,
    account_holder_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.customer_account_holder OWNER TO postgres;

--
-- Name: customer_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_address (
    id text NOT NULL,
    customer_id text NOT NULL,
    address_name text,
    is_default_shipping boolean DEFAULT false NOT NULL,
    is_default_billing boolean DEFAULT false NOT NULL,
    company text,
    first_name text,
    last_name text,
    address_1 text,
    address_2 text,
    city text,
    country_code text,
    province text,
    postal_code text,
    phone text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.customer_address OWNER TO postgres;

--
-- Name: customer_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_group (
    id text NOT NULL,
    name text NOT NULL,
    metadata jsonb,
    created_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.customer_group OWNER TO postgres;

--
-- Name: customer_group_customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_group_customer (
    id text NOT NULL,
    customer_id text NOT NULL,
    customer_group_id text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text,
    deleted_at timestamp with time zone
);


ALTER TABLE public.customer_group_customer OWNER TO postgres;

--
-- Name: fulfillment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment (
    id text NOT NULL,
    location_id text NOT NULL,
    packed_at timestamp with time zone,
    shipped_at timestamp with time zone,
    delivered_at timestamp with time zone,
    canceled_at timestamp with time zone,
    data jsonb,
    provider_id text,
    shipping_option_id text,
    metadata jsonb,
    delivery_address_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    marked_shipped_by text,
    created_by text,
    requires_shipping boolean DEFAULT true NOT NULL
);


ALTER TABLE public.fulfillment OWNER TO postgres;

--
-- Name: fulfillment_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment_address (
    id text NOT NULL,
    company text,
    first_name text,
    last_name text,
    address_1 text,
    address_2 text,
    city text,
    country_code text,
    province text,
    postal_code text,
    phone text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fulfillment_address OWNER TO postgres;

--
-- Name: fulfillment_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment_item (
    id text NOT NULL,
    title text NOT NULL,
    sku text NOT NULL,
    barcode text NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    line_item_id text,
    inventory_item_id text,
    fulfillment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fulfillment_item OWNER TO postgres;

--
-- Name: fulfillment_label; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment_label (
    id text NOT NULL,
    tracking_number text NOT NULL,
    tracking_url text NOT NULL,
    label_url text NOT NULL,
    fulfillment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fulfillment_label OWNER TO postgres;

--
-- Name: fulfillment_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment_provider (
    id text NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fulfillment_provider OWNER TO postgres;

--
-- Name: fulfillment_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment_set (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fulfillment_set OWNER TO postgres;

--
-- Name: geo_zone; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.geo_zone (
    id text NOT NULL,
    type text DEFAULT 'country'::text NOT NULL,
    country_code text NOT NULL,
    province_code text,
    city text,
    service_zone_id text NOT NULL,
    postal_expression jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT geo_zone_type_check CHECK ((type = ANY (ARRAY['country'::text, 'province'::text, 'city'::text, 'zip'::text])))
);


ALTER TABLE public.geo_zone OWNER TO postgres;

--
-- Name: image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.image (
    id text NOT NULL,
    url text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    rank integer DEFAULT 0 NOT NULL,
    product_id text NOT NULL
);


ALTER TABLE public.image OWNER TO postgres;

--
-- Name: inventory_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_item (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    sku text,
    origin_country text,
    hs_code text,
    mid_code text,
    material text,
    weight integer,
    length integer,
    height integer,
    width integer,
    requires_shipping boolean DEFAULT true NOT NULL,
    description text,
    title text,
    thumbnail text,
    metadata jsonb
);


ALTER TABLE public.inventory_item OWNER TO postgres;

--
-- Name: inventory_level; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_level (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    inventory_item_id text NOT NULL,
    location_id text NOT NULL,
    stocked_quantity numeric DEFAULT 0 NOT NULL,
    reserved_quantity numeric DEFAULT 0 NOT NULL,
    incoming_quantity numeric DEFAULT 0 NOT NULL,
    metadata jsonb,
    raw_stocked_quantity jsonb,
    raw_reserved_quantity jsonb,
    raw_incoming_quantity jsonb
);


ALTER TABLE public.inventory_level OWNER TO postgres;

--
-- Name: invite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invite (
    id text NOT NULL,
    email text NOT NULL,
    accepted boolean DEFAULT false NOT NULL,
    token text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.invite OWNER TO postgres;

--
-- Name: link_module_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.link_module_migrations (
    id integer NOT NULL,
    table_name character varying(255) NOT NULL,
    link_descriptor jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.link_module_migrations OWNER TO postgres;

--
-- Name: link_module_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.link_module_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.link_module_migrations_id_seq OWNER TO postgres;

--
-- Name: link_module_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.link_module_migrations_id_seq OWNED BY public.link_module_migrations.id;


--
-- Name: location_fulfillment_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.location_fulfillment_provider (
    stock_location_id character varying(255) NOT NULL,
    fulfillment_provider_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.location_fulfillment_provider OWNER TO postgres;

--
-- Name: location_fulfillment_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.location_fulfillment_set (
    stock_location_id character varying(255) NOT NULL,
    fulfillment_set_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.location_fulfillment_set OWNER TO postgres;

--
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255),
    executed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mikro_orm_migrations OWNER TO postgres;

--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mikro_orm_migrations_id_seq OWNER TO postgres;

--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    id text NOT NULL,
    "to" text NOT NULL,
    channel text NOT NULL,
    template text,
    data jsonb,
    trigger_type text,
    resource_id text,
    resource_type text,
    receiver_id text,
    original_notification_id text,
    idempotency_key text,
    external_id text,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    status text DEFAULT 'pending'::text NOT NULL,
    "from" text,
    provider_data jsonb,
    CONSTRAINT notification_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'success'::text, 'failure'::text])))
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- Name: notification_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_provider (
    id text NOT NULL,
    handle text NOT NULL,
    name text NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    channels text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.notification_provider OWNER TO postgres;

--
-- Name: order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."order" (
    id text NOT NULL,
    region_id text,
    display_id integer,
    customer_id text,
    version integer DEFAULT 1 NOT NULL,
    sales_channel_id text,
    status public.order_status_enum DEFAULT 'pending'::public.order_status_enum NOT NULL,
    is_draft_order boolean DEFAULT false NOT NULL,
    email text,
    currency_code text NOT NULL,
    shipping_address_id text,
    billing_address_id text,
    no_notification boolean,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    canceled_at timestamp with time zone,
    custom_display_id text,
    locale text
);


ALTER TABLE public."order" OWNER TO postgres;

--
-- Name: order_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_address (
    id text NOT NULL,
    customer_id text,
    company text,
    first_name text,
    last_name text,
    address_1 text,
    address_2 text,
    city text,
    country_code text,
    province text,
    postal_code text,
    phone text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_address OWNER TO postgres;

--
-- Name: order_cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_cart (
    order_id character varying(255) NOT NULL,
    cart_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_cart OWNER TO postgres;

--
-- Name: order_change; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_change (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer NOT NULL,
    description text,
    status text DEFAULT 'pending'::text NOT NULL,
    internal_note text,
    created_by text,
    requested_by text,
    requested_at timestamp with time zone,
    confirmed_by text,
    confirmed_at timestamp with time zone,
    declined_by text,
    declined_reason text,
    metadata jsonb,
    declined_at timestamp with time zone,
    canceled_by text,
    canceled_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    change_type text,
    deleted_at timestamp with time zone,
    return_id text,
    claim_id text,
    exchange_id text,
    carry_over_promotions boolean,
    CONSTRAINT order_change_status_check CHECK ((status = ANY (ARRAY['confirmed'::text, 'declined'::text, 'requested'::text, 'pending'::text, 'canceled'::text])))
);


ALTER TABLE public.order_change OWNER TO postgres;

--
-- Name: order_change_action; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_change_action (
    id text NOT NULL,
    order_id text,
    version integer,
    ordering bigint NOT NULL,
    order_change_id text,
    reference text,
    reference_id text,
    action text NOT NULL,
    details jsonb,
    amount numeric,
    raw_amount jsonb,
    internal_note text,
    applied boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    return_id text,
    claim_id text,
    exchange_id text
);


ALTER TABLE public.order_change_action OWNER TO postgres;

--
-- Name: order_change_action_ordering_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_change_action_ordering_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_change_action_ordering_seq OWNER TO postgres;

--
-- Name: order_change_action_ordering_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_change_action_ordering_seq OWNED BY public.order_change_action.ordering;


--
-- Name: order_claim; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_claim (
    id text NOT NULL,
    order_id text NOT NULL,
    return_id text,
    order_version integer NOT NULL,
    display_id integer NOT NULL,
    type public.order_claim_type_enum NOT NULL,
    no_notification boolean,
    refund_amount numeric,
    raw_refund_amount jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    canceled_at timestamp with time zone,
    created_by text
);


ALTER TABLE public.order_claim OWNER TO postgres;

--
-- Name: order_claim_display_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_claim_display_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_claim_display_id_seq OWNER TO postgres;

--
-- Name: order_claim_display_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_claim_display_id_seq OWNED BY public.order_claim.display_id;


--
-- Name: order_claim_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_claim_item (
    id text NOT NULL,
    claim_id text NOT NULL,
    item_id text NOT NULL,
    is_additional_item boolean DEFAULT false NOT NULL,
    reason public.claim_reason_enum,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    note text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_claim_item OWNER TO postgres;

--
-- Name: order_claim_item_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_claim_item_image (
    id text NOT NULL,
    claim_item_id text NOT NULL,
    url text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_claim_item_image OWNER TO postgres;

--
-- Name: order_credit_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_credit_line (
    id text NOT NULL,
    order_id text NOT NULL,
    reference text,
    reference_id text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    version integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.order_credit_line OWNER TO postgres;

--
-- Name: order_display_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_display_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_display_id_seq OWNER TO postgres;

--
-- Name: order_display_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_display_id_seq OWNED BY public."order".display_id;


--
-- Name: order_exchange; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_exchange (
    id text NOT NULL,
    order_id text NOT NULL,
    return_id text,
    order_version integer NOT NULL,
    display_id integer NOT NULL,
    no_notification boolean,
    allow_backorder boolean DEFAULT false NOT NULL,
    difference_due numeric,
    raw_difference_due jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    canceled_at timestamp with time zone,
    created_by text
);


ALTER TABLE public.order_exchange OWNER TO postgres;

--
-- Name: order_exchange_display_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_exchange_display_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_exchange_display_id_seq OWNER TO postgres;

--
-- Name: order_exchange_display_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_exchange_display_id_seq OWNED BY public.order_exchange.display_id;


--
-- Name: order_exchange_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_exchange_item (
    id text NOT NULL,
    exchange_id text NOT NULL,
    item_id text NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    note text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_exchange_item OWNER TO postgres;

--
-- Name: order_fulfillment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_fulfillment (
    order_id character varying(255) NOT NULL,
    fulfillment_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_fulfillment OWNER TO postgres;

--
-- Name: order_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_item (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer NOT NULL,
    item_id text NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    fulfilled_quantity numeric NOT NULL,
    raw_fulfilled_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    shipped_quantity numeric NOT NULL,
    raw_shipped_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    return_requested_quantity numeric NOT NULL,
    raw_return_requested_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    return_received_quantity numeric NOT NULL,
    raw_return_received_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    return_dismissed_quantity numeric NOT NULL,
    raw_return_dismissed_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    written_off_quantity numeric NOT NULL,
    raw_written_off_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    delivered_quantity numeric DEFAULT 0 NOT NULL,
    raw_delivered_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    unit_price numeric,
    raw_unit_price jsonb,
    compare_at_unit_price numeric,
    raw_compare_at_unit_price jsonb
);


ALTER TABLE public.order_item OWNER TO postgres;

--
-- Name: order_line_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_line_item (
    id text NOT NULL,
    totals_id text,
    title text NOT NULL,
    subtitle text,
    thumbnail text,
    variant_id text,
    product_id text,
    product_title text,
    product_description text,
    product_subtitle text,
    product_type text,
    product_collection text,
    product_handle text,
    variant_sku text,
    variant_barcode text,
    variant_title text,
    variant_option_values jsonb,
    requires_shipping boolean DEFAULT true NOT NULL,
    is_discountable boolean DEFAULT true NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    compare_at_unit_price numeric,
    raw_compare_at_unit_price jsonb,
    unit_price numeric NOT NULL,
    raw_unit_price jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_custom_price boolean DEFAULT false NOT NULL,
    product_type_id text,
    is_giftcard boolean DEFAULT false NOT NULL
);


ALTER TABLE public.order_line_item OWNER TO postgres;

--
-- Name: order_line_item_adjustment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_line_item_adjustment (
    id text NOT NULL,
    description text,
    promotion_id text,
    code text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    item_id text NOT NULL,
    deleted_at timestamp with time zone,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    version integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.order_line_item_adjustment OWNER TO postgres;

--
-- Name: order_line_item_tax_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_line_item_tax_line (
    id text NOT NULL,
    description text,
    tax_rate_id text,
    code text NOT NULL,
    rate numeric NOT NULL,
    raw_rate jsonb NOT NULL,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    item_id text NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_line_item_tax_line OWNER TO postgres;

--
-- Name: order_payment_collection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_payment_collection (
    order_id character varying(255) NOT NULL,
    payment_collection_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_payment_collection OWNER TO postgres;

--
-- Name: order_promotion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_promotion (
    order_id character varying(255) NOT NULL,
    promotion_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_promotion OWNER TO postgres;

--
-- Name: order_shipping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_shipping (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer NOT NULL,
    shipping_method_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    return_id text,
    claim_id text,
    exchange_id text
);


ALTER TABLE public.order_shipping OWNER TO postgres;

--
-- Name: order_shipping_method; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_shipping_method (
    id text NOT NULL,
    name text NOT NULL,
    description jsonb,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    shipping_option_id text,
    data jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_custom_amount boolean DEFAULT false NOT NULL
);


ALTER TABLE public.order_shipping_method OWNER TO postgres;

--
-- Name: order_shipping_method_adjustment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_shipping_method_adjustment (
    id text NOT NULL,
    description text,
    promotion_id text,
    code text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    shipping_method_id text NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_shipping_method_adjustment OWNER TO postgres;

--
-- Name: order_shipping_method_tax_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_shipping_method_tax_line (
    id text NOT NULL,
    description text,
    tax_rate_id text,
    code text NOT NULL,
    rate numeric NOT NULL,
    raw_rate jsonb NOT NULL,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    shipping_method_id text NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_shipping_method_tax_line OWNER TO postgres;

--
-- Name: order_summary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_summary (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    totals jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_summary OWNER TO postgres;

--
-- Name: order_transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_transaction (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    currency_code text NOT NULL,
    reference text,
    reference_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    return_id text,
    claim_id text,
    exchange_id text
);


ALTER TABLE public.order_transaction OWNER TO postgres;

--
-- Name: payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment (
    id text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    currency_code text NOT NULL,
    provider_id text NOT NULL,
    data jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    captured_at timestamp with time zone,
    canceled_at timestamp with time zone,
    payment_collection_id text NOT NULL,
    payment_session_id text NOT NULL,
    metadata jsonb
);


ALTER TABLE public.payment OWNER TO postgres;

--
-- Name: payment_collection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_collection (
    id text NOT NULL,
    currency_code text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    authorized_amount numeric,
    raw_authorized_amount jsonb,
    captured_amount numeric,
    raw_captured_amount jsonb,
    refunded_amount numeric,
    raw_refunded_amount jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    completed_at timestamp with time zone,
    status text DEFAULT 'not_paid'::text NOT NULL,
    metadata jsonb,
    CONSTRAINT payment_collection_status_check CHECK ((status = ANY (ARRAY['not_paid'::text, 'awaiting'::text, 'authorized'::text, 'partially_authorized'::text, 'canceled'::text, 'failed'::text, 'partially_captured'::text, 'completed'::text])))
);


ALTER TABLE public.payment_collection OWNER TO postgres;

--
-- Name: payment_collection_payment_providers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_collection_payment_providers (
    payment_collection_id text NOT NULL,
    payment_provider_id text NOT NULL
);


ALTER TABLE public.payment_collection_payment_providers OWNER TO postgres;

--
-- Name: payment_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_provider (
    id text NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.payment_provider OWNER TO postgres;

--
-- Name: payment_session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_session (
    id text NOT NULL,
    currency_code text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text NOT NULL,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    context jsonb,
    status text DEFAULT 'pending'::text NOT NULL,
    authorized_at timestamp with time zone,
    payment_collection_id text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT payment_session_status_check CHECK ((status = ANY (ARRAY['authorized'::text, 'captured'::text, 'pending'::text, 'requires_more'::text, 'error'::text, 'canceled'::text])))
);


ALTER TABLE public.payment_session OWNER TO postgres;

--
-- Name: price; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price (
    id text NOT NULL,
    title text,
    price_set_id text NOT NULL,
    currency_code text NOT NULL,
    raw_amount jsonb NOT NULL,
    rules_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    price_list_id text,
    amount numeric NOT NULL,
    min_quantity numeric,
    max_quantity numeric,
    raw_min_quantity jsonb,
    raw_max_quantity jsonb
);


ALTER TABLE public.price OWNER TO postgres;

--
-- Name: price_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_list (
    id text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    rules_count integer DEFAULT 0,
    title text NOT NULL,
    description text NOT NULL,
    type text DEFAULT 'sale'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT price_list_status_check CHECK ((status = ANY (ARRAY['active'::text, 'draft'::text]))),
    CONSTRAINT price_list_type_check CHECK ((type = ANY (ARRAY['sale'::text, 'override'::text])))
);


ALTER TABLE public.price_list OWNER TO postgres;

--
-- Name: price_list_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_list_rule (
    id text NOT NULL,
    price_list_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    value jsonb,
    attribute text DEFAULT ''::text NOT NULL
);


ALTER TABLE public.price_list_rule OWNER TO postgres;

--
-- Name: price_preference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_preference (
    id text NOT NULL,
    attribute text NOT NULL,
    value text,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.price_preference OWNER TO postgres;

--
-- Name: price_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_rule (
    id text NOT NULL,
    value text NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    price_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    attribute text DEFAULT ''::text NOT NULL,
    operator text DEFAULT 'eq'::text NOT NULL,
    CONSTRAINT price_rule_operator_check CHECK ((operator = ANY (ARRAY['gte'::text, 'lte'::text, 'gt'::text, 'lt'::text, 'eq'::text])))
);


ALTER TABLE public.price_rule OWNER TO postgres;

--
-- Name: price_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_set (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.price_set OWNER TO postgres;

--
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id text NOT NULL,
    title text NOT NULL,
    handle text NOT NULL,
    subtitle text,
    description text,
    is_giftcard boolean DEFAULT false NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    thumbnail text,
    weight text,
    length text,
    height text,
    width text,
    origin_country text,
    hs_code text,
    mid_code text,
    material text,
    collection_id text,
    type_id text,
    discountable boolean DEFAULT true NOT NULL,
    external_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    metadata jsonb,
    CONSTRAINT product_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'proposed'::text, 'published'::text, 'rejected'::text])))
);


ALTER TABLE public.product OWNER TO postgres;

--
-- Name: product_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_category (
    id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    handle text NOT NULL,
    mpath text NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    is_internal boolean DEFAULT false NOT NULL,
    rank integer DEFAULT 0 NOT NULL,
    parent_category_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    metadata jsonb
);


ALTER TABLE public.product_category OWNER TO postgres;

--
-- Name: product_category_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_category_product (
    product_id text NOT NULL,
    product_category_id text NOT NULL
);


ALTER TABLE public.product_category_product OWNER TO postgres;

--
-- Name: product_collection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_collection (
    id text NOT NULL,
    title text NOT NULL,
    handle text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_collection OWNER TO postgres;

--
-- Name: product_option; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_option (
    id text NOT NULL,
    title text NOT NULL,
    product_id text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_option OWNER TO postgres;

--
-- Name: product_option_value; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_option_value (
    id text NOT NULL,
    value text NOT NULL,
    option_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_option_value OWNER TO postgres;

--
-- Name: product_sales_channel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_sales_channel (
    product_id character varying(255) NOT NULL,
    sales_channel_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_sales_channel OWNER TO postgres;

--
-- Name: product_shipping_profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_shipping_profile (
    product_id character varying(255) NOT NULL,
    shipping_profile_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_shipping_profile OWNER TO postgres;

--
-- Name: product_tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_tag (
    id text NOT NULL,
    value text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_tag OWNER TO postgres;

--
-- Name: product_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_tags (
    product_id text NOT NULL,
    product_tag_id text NOT NULL
);


ALTER TABLE public.product_tags OWNER TO postgres;

--
-- Name: product_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_type (
    id text NOT NULL,
    value text NOT NULL,
    metadata json,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_type OWNER TO postgres;

--
-- Name: product_variant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant (
    id text NOT NULL,
    title text NOT NULL,
    sku text,
    barcode text,
    ean text,
    upc text,
    allow_backorder boolean DEFAULT false NOT NULL,
    manage_inventory boolean DEFAULT true NOT NULL,
    hs_code text,
    origin_country text,
    mid_code text,
    material text,
    weight integer,
    length integer,
    height integer,
    width integer,
    metadata jsonb,
    variant_rank integer DEFAULT 0,
    product_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    thumbnail text
);


ALTER TABLE public.product_variant OWNER TO postgres;

--
-- Name: product_variant_inventory_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant_inventory_item (
    variant_id character varying(255) NOT NULL,
    inventory_item_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    required_quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_variant_inventory_item OWNER TO postgres;

--
-- Name: product_variant_option; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant_option (
    variant_id text NOT NULL,
    option_value_id text NOT NULL
);


ALTER TABLE public.product_variant_option OWNER TO postgres;

--
-- Name: product_variant_price_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant_price_set (
    variant_id character varying(255) NOT NULL,
    price_set_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_variant_price_set OWNER TO postgres;

--
-- Name: product_variant_product_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant_product_image (
    id text NOT NULL,
    variant_id text NOT NULL,
    image_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_variant_product_image OWNER TO postgres;

--
-- Name: promotion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion (
    id text NOT NULL,
    code text NOT NULL,
    campaign_id text,
    is_automatic boolean DEFAULT false NOT NULL,
    type text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    status text DEFAULT 'draft'::text NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    "limit" integer,
    used integer DEFAULT 0 NOT NULL,
    metadata jsonb,
    CONSTRAINT promotion_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'active'::text, 'inactive'::text]))),
    CONSTRAINT promotion_type_check CHECK ((type = ANY (ARRAY['standard'::text, 'buyget'::text])))
);


ALTER TABLE public.promotion OWNER TO postgres;

--
-- Name: promotion_application_method; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_application_method (
    id text NOT NULL,
    value numeric,
    raw_value jsonb,
    max_quantity integer,
    apply_to_quantity integer,
    buy_rules_min_quantity integer,
    type text NOT NULL,
    target_type text NOT NULL,
    allocation text,
    promotion_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    currency_code text,
    CONSTRAINT promotion_application_method_allocation_check CHECK ((allocation = ANY (ARRAY['each'::text, 'across'::text, 'once'::text]))),
    CONSTRAINT promotion_application_method_target_type_check CHECK ((target_type = ANY (ARRAY['order'::text, 'shipping_methods'::text, 'items'::text]))),
    CONSTRAINT promotion_application_method_type_check CHECK ((type = ANY (ARRAY['fixed'::text, 'percentage'::text])))
);


ALTER TABLE public.promotion_application_method OWNER TO postgres;

--
-- Name: promotion_campaign; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_campaign (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    campaign_identifier text NOT NULL,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.promotion_campaign OWNER TO postgres;

--
-- Name: promotion_campaign_budget; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_campaign_budget (
    id text NOT NULL,
    type text NOT NULL,
    campaign_id text NOT NULL,
    "limit" numeric,
    raw_limit jsonb,
    used numeric DEFAULT 0 NOT NULL,
    raw_used jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    currency_code text,
    attribute text,
    CONSTRAINT promotion_campaign_budget_type_check CHECK ((type = ANY (ARRAY['spend'::text, 'usage'::text, 'use_by_attribute'::text, 'spend_by_attribute'::text])))
);


ALTER TABLE public.promotion_campaign_budget OWNER TO postgres;

--
-- Name: promotion_campaign_budget_usage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_campaign_budget_usage (
    id text NOT NULL,
    attribute_value text NOT NULL,
    used numeric DEFAULT 0 NOT NULL,
    budget_id text NOT NULL,
    raw_used jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.promotion_campaign_budget_usage OWNER TO postgres;

--
-- Name: promotion_promotion_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_promotion_rule (
    promotion_id text NOT NULL,
    promotion_rule_id text NOT NULL
);


ALTER TABLE public.promotion_promotion_rule OWNER TO postgres;

--
-- Name: promotion_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_rule (
    id text NOT NULL,
    description text,
    attribute text NOT NULL,
    operator text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT promotion_rule_operator_check CHECK ((operator = ANY (ARRAY['gte'::text, 'lte'::text, 'gt'::text, 'lt'::text, 'eq'::text, 'ne'::text, 'in'::text])))
);


ALTER TABLE public.promotion_rule OWNER TO postgres;

--
-- Name: promotion_rule_value; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_rule_value (
    id text NOT NULL,
    promotion_rule_id text NOT NULL,
    value text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.promotion_rule_value OWNER TO postgres;

--
-- Name: provider_identity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provider_identity (
    id text NOT NULL,
    entity_id text NOT NULL,
    provider text NOT NULL,
    auth_identity_id text NOT NULL,
    user_metadata jsonb,
    provider_metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.provider_identity OWNER TO postgres;

--
-- Name: publishable_api_key_sales_channel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.publishable_api_key_sales_channel (
    publishable_key_id character varying(255) NOT NULL,
    sales_channel_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.publishable_api_key_sales_channel OWNER TO postgres;

--
-- Name: refund; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refund (
    id text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    payment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    created_by text,
    metadata jsonb,
    refund_reason_id text,
    note text
);


ALTER TABLE public.refund OWNER TO postgres;

--
-- Name: refund_reason; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refund_reason (
    id text NOT NULL,
    label text NOT NULL,
    description text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    code text NOT NULL
);


ALTER TABLE public.refund_reason OWNER TO postgres;

--
-- Name: region; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.region (
    id text NOT NULL,
    name text NOT NULL,
    currency_code text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    automatic_taxes boolean DEFAULT true NOT NULL
);


ALTER TABLE public.region OWNER TO postgres;

--
-- Name: region_country; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.region_country (
    iso_2 text NOT NULL,
    iso_3 text NOT NULL,
    num_code text NOT NULL,
    name text NOT NULL,
    display_name text NOT NULL,
    region_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.region_country OWNER TO postgres;

--
-- Name: region_payment_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.region_payment_provider (
    region_id character varying(255) NOT NULL,
    payment_provider_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.region_payment_provider OWNER TO postgres;

--
-- Name: reservation_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservation_item (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    line_item_id text,
    location_id text NOT NULL,
    quantity numeric NOT NULL,
    external_id text,
    description text,
    created_by text,
    metadata jsonb,
    inventory_item_id text NOT NULL,
    allow_backorder boolean DEFAULT false,
    raw_quantity jsonb
);


ALTER TABLE public.reservation_item OWNER TO postgres;

--
-- Name: return; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return (
    id text NOT NULL,
    order_id text NOT NULL,
    claim_id text,
    exchange_id text,
    order_version integer NOT NULL,
    display_id integer NOT NULL,
    status public.return_status_enum DEFAULT 'open'::public.return_status_enum NOT NULL,
    no_notification boolean,
    refund_amount numeric,
    raw_refund_amount jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    received_at timestamp with time zone,
    canceled_at timestamp with time zone,
    location_id text,
    requested_at timestamp with time zone,
    created_by text
);


ALTER TABLE public.return OWNER TO postgres;

--
-- Name: return_display_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.return_display_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.return_display_id_seq OWNER TO postgres;

--
-- Name: return_display_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.return_display_id_seq OWNED BY public.return.display_id;


--
-- Name: return_fulfillment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return_fulfillment (
    return_id character varying(255) NOT NULL,
    fulfillment_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.return_fulfillment OWNER TO postgres;

--
-- Name: return_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return_item (
    id text NOT NULL,
    return_id text NOT NULL,
    reason_id text,
    item_id text NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    received_quantity numeric DEFAULT 0 NOT NULL,
    raw_received_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    note text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    damaged_quantity numeric DEFAULT 0 NOT NULL,
    raw_damaged_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL
);


ALTER TABLE public.return_item OWNER TO postgres;

--
-- Name: return_reason; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return_reason (
    id character varying NOT NULL,
    value character varying NOT NULL,
    label character varying NOT NULL,
    description character varying,
    metadata jsonb,
    parent_return_reason_id character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.return_reason OWNER TO postgres;

--
-- Name: sales_channel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_channel (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    is_disabled boolean DEFAULT false NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.sales_channel OWNER TO postgres;

--
-- Name: sales_channel_stock_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_channel_stock_location (
    sales_channel_id character varying(255) NOT NULL,
    stock_location_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.sales_channel_stock_location OWNER TO postgres;

--
-- Name: script_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.script_migrations (
    id integer NOT NULL,
    script_name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    finished_at timestamp with time zone
);


ALTER TABLE public.script_migrations OWNER TO postgres;

--
-- Name: script_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.script_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.script_migrations_id_seq OWNER TO postgres;

--
-- Name: script_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.script_migrations_id_seq OWNED BY public.script_migrations.id;


--
-- Name: service_zone; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_zone (
    id text NOT NULL,
    name text NOT NULL,
    metadata jsonb,
    fulfillment_set_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.service_zone OWNER TO postgres;

--
-- Name: shipping_option; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_option (
    id text NOT NULL,
    name text NOT NULL,
    price_type text DEFAULT 'flat'::text NOT NULL,
    service_zone_id text NOT NULL,
    shipping_profile_id text,
    provider_id text,
    data jsonb,
    metadata jsonb,
    shipping_option_type_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT shipping_option_price_type_check CHECK ((price_type = ANY (ARRAY['calculated'::text, 'flat'::text])))
);


ALTER TABLE public.shipping_option OWNER TO postgres;

--
-- Name: shipping_option_price_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_option_price_set (
    shipping_option_id character varying(255) NOT NULL,
    price_set_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.shipping_option_price_set OWNER TO postgres;

--
-- Name: shipping_option_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_option_rule (
    id text NOT NULL,
    attribute text NOT NULL,
    operator text NOT NULL,
    value jsonb,
    shipping_option_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT shipping_option_rule_operator_check CHECK ((operator = ANY (ARRAY['in'::text, 'eq'::text, 'ne'::text, 'gt'::text, 'gte'::text, 'lt'::text, 'lte'::text, 'nin'::text])))
);


ALTER TABLE public.shipping_option_rule OWNER TO postgres;

--
-- Name: shipping_option_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_option_type (
    id text NOT NULL,
    label text NOT NULL,
    description text,
    code text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.shipping_option_type OWNER TO postgres;

--
-- Name: shipping_profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_profile (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.shipping_profile OWNER TO postgres;

--
-- Name: stock_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_location (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    name text NOT NULL,
    address_id text,
    metadata jsonb
);


ALTER TABLE public.stock_location OWNER TO postgres;

--
-- Name: stock_location_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_location_address (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    address_1 text NOT NULL,
    address_2 text,
    company text,
    city text,
    country_code text NOT NULL,
    phone text,
    province text,
    postal_code text,
    metadata jsonb
);


ALTER TABLE public.stock_location_address OWNER TO postgres;

--
-- Name: store; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store (
    id text NOT NULL,
    name text DEFAULT 'Medusa Store'::text NOT NULL,
    default_sales_channel_id text,
    default_region_id text,
    default_location_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.store OWNER TO postgres;

--
-- Name: store_currency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_currency (
    id text NOT NULL,
    currency_code text NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    store_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.store_currency OWNER TO postgres;

--
-- Name: store_locale; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_locale (
    id text NOT NULL,
    locale_code text NOT NULL,
    store_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.store_locale OWNER TO postgres;

--
-- Name: tax_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_provider (
    id text NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.tax_provider OWNER TO postgres;

--
-- Name: tax_rate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_rate (
    id text NOT NULL,
    rate real,
    code text NOT NULL,
    name text NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    is_combinable boolean DEFAULT false NOT NULL,
    tax_region_id text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text,
    deleted_at timestamp with time zone
);


ALTER TABLE public.tax_rate OWNER TO postgres;

--
-- Name: tax_rate_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_rate_rule (
    id text NOT NULL,
    tax_rate_id text NOT NULL,
    reference_id text NOT NULL,
    reference text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text,
    deleted_at timestamp with time zone
);


ALTER TABLE public.tax_rate_rule OWNER TO postgres;

--
-- Name: tax_region; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_region (
    id text NOT NULL,
    provider_id text,
    country_code text NOT NULL,
    province_code text,
    parent_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text,
    deleted_at timestamp with time zone,
    CONSTRAINT "CK_tax_region_country_top_level" CHECK (((parent_id IS NULL) OR (province_code IS NOT NULL))),
    CONSTRAINT "CK_tax_region_provider_top_level" CHECK (((parent_id IS NULL) OR (provider_id IS NULL)))
);


ALTER TABLE public.tax_region OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id text NOT NULL,
    first_name text,
    last_name text,
    email text NOT NULL,
    avatar_url text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_preference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_preference (
    id text NOT NULL,
    user_id text NOT NULL,
    key text NOT NULL,
    value jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.user_preference OWNER TO postgres;

--
-- Name: user_rbac_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_rbac_role (
    user_id character varying(255) NOT NULL,
    rbac_role_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.user_rbac_role OWNER TO postgres;

--
-- Name: view_configuration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.view_configuration (
    id text NOT NULL,
    entity text NOT NULL,
    name text,
    user_id text,
    is_system_default boolean DEFAULT false NOT NULL,
    configuration jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.view_configuration OWNER TO postgres;

--
-- Name: workflow_execution; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workflow_execution (
    id character varying NOT NULL,
    workflow_id character varying NOT NULL,
    transaction_id character varying NOT NULL,
    execution jsonb,
    context jsonb,
    state character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    retention_time integer,
    run_id text DEFAULT '01KKB6VBFCG8EVY8E61SSY1770'::text NOT NULL
);


ALTER TABLE public.workflow_execution OWNER TO postgres;

--
-- Name: link_module_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link_module_migrations ALTER COLUMN id SET DEFAULT nextval('public.link_module_migrations_id_seq'::regclass);


--
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- Name: order display_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order" ALTER COLUMN display_id SET DEFAULT nextval('public.order_display_id_seq'::regclass);


--
-- Name: order_change_action ordering; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_change_action ALTER COLUMN ordering SET DEFAULT nextval('public.order_change_action_ordering_seq'::regclass);


--
-- Name: order_claim display_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_claim ALTER COLUMN display_id SET DEFAULT nextval('public.order_claim_display_id_seq'::regclass);


--
-- Name: order_exchange display_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_exchange ALTER COLUMN display_id SET DEFAULT nextval('public.order_exchange_display_id_seq'::regclass);


--
-- Name: return display_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return ALTER COLUMN display_id SET DEFAULT nextval('public.return_display_id_seq'::regclass);


--
-- Name: script_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.script_migrations ALTER COLUMN id SET DEFAULT nextval('public.script_migrations_id_seq'::regclass);


--
-- Data for Name: account_holder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_holder (id, provider_id, external_id, email, data, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: api_key; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_key (id, token, salt, redacted, title, type, last_used_at, created_by, created_at, revoked_by, revoked_at, updated_at, deleted_at) FROM stdin;
apk_01KKB6VT37HNAW39V48A86KFN5	pk_2c2c7743f7ba60c660a518965bee8c7dbdce18f65cd69c323283b7c2a3fb1944		pk_2c2***944	Default Publishable API Key	publishable	\N		2026-03-10 11:57:33.095+05:30	\N	\N	2026-03-10 11:57:33.095+05:30	\N
\.


--
-- Data for Name: application_method_buy_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.application_method_buy_rules (application_method_id, promotion_rule_id) FROM stdin;
\.


--
-- Data for Name: application_method_target_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.application_method_target_rules (application_method_id, promotion_rule_id) FROM stdin;
\.


--
-- Data for Name: auth_identity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_identity (id, app_metadata, created_at, updated_at, deleted_at) FROM stdin;
authid_01KKB74WW61QPK5144M9VB75GN	{"user_id": "user_01KKB74WTDX61HPKGPNXZ0K7SA"}	2026-03-10 12:02:30.854+05:30	2026-03-10 12:02:30.862+05:30	\N
authid_01KKBNF62Q3DX94KHR72XXH6HC	{"customer_id": "cus_01KKBNF6A1T3EABE3324ZTY321"}	2026-03-10 16:12:48.025+05:30	2026-03-10 16:12:48.278+05:30	\N
\.


--
-- Data for Name: capture; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.capture (id, amount, raw_amount, payment_id, created_at, updated_at, deleted_at, created_by, metadata) FROM stdin;
\.


--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (id, region_id, customer_id, sales_channel_id, email, currency_code, shipping_address_id, billing_address_id, metadata, created_at, updated_at, deleted_at, completed_at, locale) FROM stdin;
cart_01KKBWSW7ZSZ3KYQRSBW71ZW5X	reg_01KKB79PXYZ123	cus_01KKBNF6A1T3EABE3324ZTY321	sc_01KKB6VT2GA936E202BCVNT0DC	kunalrisaanva12@gmail.com	inr	\N	\N	\N	2026-03-10 18:20:58.447+05:30	2026-03-10 18:20:58.447+05:30	\N	\N	\N
cart_01KM01A6X9YPPYZG9GXVSTJXMF	reg_01KKB79PXYZ123	cus_01KKBNF6A1T3EABE3324ZTY321	sc_01KKB6VT2GA936E202BCVNT0DC	kunalrisaanva12@gmail.com	inr	caaddr_01KM01E2143S3SMKJJ69F8R1M9	caaddr_01KM01E213VS40RZN262PDHC8K	\N	2026-03-18 14:04:36.587+05:30	2026-03-18 14:06:42.66+05:30	\N	\N	\N
cart_01KMPTH5Q9R6EWZ7PFAKYF0H7K	reg_01KKB79PXYZ123	cus_01KKBNF6A1T3EABE3324ZTY321	sc_01KKB6VT2GA936E202BCVNT0DC	kunalrisaanva12@gmail.com	inr	caaddr_01KMYG6X6MAM32JB1F2WBHQ29N	caaddr_01KMYG6X6M9EG9GQ53B208F3KP	\N	2026-03-27 10:28:36.651+05:30	2026-03-30 10:02:09.94+05:30	\N	\N	\N
\.


--
-- Data for Name: cart_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_address (id, customer_id, company, first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone, metadata, created_at, updated_at, deleted_at) FROM stdin;
caaddr_01KM01E213VS40RZN262PDHC8K	\N		Kunal	Jangra	Kharak		Bhiwani	in	Haryana	127114		\N	2026-03-18 14:06:42.66+05:30	2026-03-18 14:06:42.66+05:30	\N
caaddr_01KM01E2143S3SMKJJ69F8R1M9	\N		Kunal	Jangra	Kharak		Bhiwani	in	Haryana	127114		\N	2026-03-18 14:06:42.66+05:30	2026-03-18 14:06:42.66+05:30	\N
caaddr_01KMPVGJ1MENHR1HYH0Y9D678K	\N		Kunal	Jangra	Kharak		Bhiwani	in	Haryana	127114	08168336581	\N	2026-03-27 10:45:45.077+05:30	2026-03-27 10:45:45.077+05:30	\N
caaddr_01KMPVGJ1M3HTPAKG3JA7PEMV4	\N		Kunal	Jangra	Kharak		Bhiwani	in	Haryana	127114	08168336581	\N	2026-03-27 10:45:45.077+05:30	2026-03-27 10:45:45.077+05:30	\N
caaddr_01KMPX2BBHNAEWAKYVE799BPZN	\N		Kunal	Jangra	Kharak		Bhiwani	in	Haryana	127114	08168336581	\N	2026-03-27 11:12:56.626+05:30	2026-03-27 11:12:56.626+05:30	\N
caaddr_01KMPX2BBHXNQRFMDXJFED2S5G	\N		Kunal	Jangra	Kharak		Bhiwani	in	Haryana	127114	08168336581	\N	2026-03-27 11:12:56.626+05:30	2026-03-27 11:12:56.626+05:30	\N
caaddr_01KMQ5C3KZYQR4HX7BG2TK0X6B	\N	\N	Kunal	Jangra	Session Booking	\N	Delhi	us	\N	110007	08168336581	\N	2026-03-27 13:38:04.992+05:30	2026-03-27 13:38:04.992+05:30	\N
caaddr_01KMQ5C3M02Z6J2MAZX8S26JD3	\N	\N	Kunal	Jangra	Session Booking	\N	Delhi	us	\N	110007	08168336581	\N	2026-03-27 13:38:04.992+05:30	2026-03-27 13:38:04.992+05:30	\N
caaddr_01KMYG6X6M9EG9GQ53B208F3KP	\N		Kunal	Jangra	bhiwani 		bhiwani	in	Haryana	110007	08168336581	\N	2026-03-30 10:02:09.94+05:30	2026-03-30 10:02:09.94+05:30	\N
caaddr_01KMYG6X6MAM32JB1F2WBHQ29N	\N		Kunal	Jangra	bhiwani 		bhiwani	in	Haryana	110007	08168336581	\N	2026-03-30 10:02:09.94+05:30	2026-03-30 10:02:09.94+05:30	\N
\.


--
-- Data for Name: cart_line_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_line_item (id, cart_id, title, subtitle, thumbnail, quantity, variant_id, product_id, product_title, product_description, product_subtitle, product_type, product_collection, product_handle, variant_sku, variant_barcode, variant_title, variant_option_values, requires_shipping, is_discountable, is_tax_inclusive, compare_at_unit_price, raw_compare_at_unit_price, unit_price, raw_unit_price, metadata, created_at, updated_at, deleted_at, product_type_id, is_custom_price, is_giftcard) FROM stdin;
cali_01KM03BEWKHHQE36GHBPATRZZW	cart_01KM01A6X9YPPYZG9GXVSTJXMF	Therapy & Counselling Sessions	video	http://localhost:9000/static/1773652920929-Therapy-Counselling-Sessions.png	1	variant_01KKTZ7JQ2DC3HB3E1XMTZ16QE	prod_01KKTZ7JMM93QMPPSH61S8DP7K	Therapy & Counselling Sessions			session	\N	therapy-counselling-sessions	\N	\N	video	\N	f	t	f	\N	\N	999	{"value": "999", "precision": 20}	{}	2026-03-18 14:40:14.676+05:30	2026-03-18 14:40:14.676+05:30	\N	ptyp_01KKK18C4KW84N78TGBEJTCHK7	f	f
cali_01KM01A74VDTAF0HZAP3X890S6	cart_01KM01A6X9YPPYZG9GXVSTJXMF	Tarot Reading	Tarot Reading	http://localhost:9000/static/1773645550965-WhatsApp-Image-2025-08-30-at-2.03.56-PM-1-scaled-e1756997216538.jpg	5	variant_01KKTWER0W0KP66KP7VJ8PXZ7H	prod_01KKTR6NCKGH4S7ZZKT8ESKT41	Tarot Reading			session	\N	tarot-reading	\N	\N	Tarot Reading	\N	f	t	f	\N	\N	499	{"value": "499", "precision": 20}	{}	2026-03-18 14:04:36.827+05:30	2026-03-18 20:59:09.359+05:30	\N	ptyp_01KKK18C4KW84N78TGBEJTCHK7	f	f
cali_01KMYHS0R6EFH3V99M04HB21Q1	cart_01KMPTH5Q9R6EWZ7PFAKYF0H7K	Healing sea salt	Default variant	http://localhost:9000/static/1773303028619-2-18.webp	1	variant_01KKGHHPXMKDFS9NQ7T1PHT94G	prod_01KKGHHPWS4T4BEWQ85AZ3N4H7	Healing sea salt			\N	\N	healing-sea-salt	\N	\N	Default variant	\N	f	t	f	\N	\N	299	{"value": "299", "precision": 20}	{}	2026-03-30 10:29:31.974+05:30	2026-03-30 10:34:08.674+05:30	2026-03-30 10:34:08.672+05:30	\N	f	f
cali_01KMYJ1KEZBAX9848ZKNQ16BMG	cart_01KMPTH5Q9R6EWZ7PFAKYF0H7K	Black obsidian Pencil Locket(evil eye and Nazar)	Default variant	http://localhost:9000/static/1773302845418-2-14.webp	1	variant_01KKGHC40DXRH9RHMXXK7ZRE4V	prod_01KKGHC3ZR2HTWW0GA4D777CPP	Black obsidian Pencil Locket(evil eye and Nazar)			\N	\N	black-obsidian-pencil-locketevil-eye-and-nazar	\N	\N	Default variant	\N	f	t	f	\N	\N	699	{"value": "699", "precision": 20}	{}	2026-03-30 10:34:13.279+05:30	2026-03-30 10:34:13.279+05:30	\N	\N	f	f
\.


--
-- Data for Name: cart_line_item_adjustment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_line_item_adjustment (id, description, promotion_id, code, amount, raw_amount, provider_id, metadata, created_at, updated_at, deleted_at, item_id, is_tax_inclusive) FROM stdin;
\.


--
-- Data for Name: cart_line_item_tax_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_line_item_tax_line (id, description, tax_rate_id, code, rate, provider_id, metadata, created_at, updated_at, deleted_at, item_id) FROM stdin;
\.


--
-- Data for Name: cart_payment_collection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_payment_collection (cart_id, payment_collection_id, id, created_at, updated_at, deleted_at) FROM stdin;
cart_01KMPTH5Q9R6EWZ7PFAKYF0H7K	pay_col_01KMYHS90P51HEDZMMF7WQTVRN	capaycol_01KMYHS90SQDG9HXZFK36AV87F	2026-03-30 10:29:40.441129+05:30	2026-03-30 10:29:40.441129+05:30	\N
\.


--
-- Data for Name: cart_promotion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_promotion (cart_id, promotion_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: cart_shipping_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_shipping_method (id, cart_id, name, description, amount, raw_amount, is_tax_inclusive, shipping_option_id, data, metadata, created_at, updated_at, deleted_at) FROM stdin;
casm_01KMYHS5AJAG1R1K13NGWQ79YP	cart_01KMPTH5Q9R6EWZ7PFAKYF0H7K	Standard Delivery	\N	0	{"value": "0", "precision": 20}	f	so_01KMYGBJGWC35PVQPRQZ7CZ1GZ	{}	\N	2026-03-30 10:29:36.658+05:30	2026-03-30 10:29:36.658+05:30	\N
casm_01KMYHS53K3JMRA7R14FHT7GV0	cart_01KMPTH5Q9R6EWZ7PFAKYF0H7K	Standard Delivery	\N	0	{"value": "0", "precision": 20}	f	so_01KMYGBJGWC35PVQPRQZ7CZ1GZ	{}	\N	2026-03-30 10:29:36.435+05:30	2026-03-30 10:29:36.659+05:30	2026-03-30 10:29:36.659+05:30
\.


--
-- Data for Name: cart_shipping_method_adjustment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_shipping_method_adjustment (id, description, promotion_id, code, amount, raw_amount, provider_id, metadata, created_at, updated_at, deleted_at, shipping_method_id) FROM stdin;
\.


--
-- Data for Name: cart_shipping_method_tax_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_shipping_method_tax_line (id, description, tax_rate_id, code, rate, provider_id, metadata, created_at, updated_at, deleted_at, shipping_method_id) FROM stdin;
\.


--
-- Data for Name: credit_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.credit_line (id, cart_id, reference, reference_id, amount, raw_amount, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: currency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currency (code, symbol, symbol_native, decimal_digits, rounding, raw_rounding, name, created_at, updated_at, deleted_at) FROM stdin;
usd	$	$	2	0	{"value": "0", "precision": 20}	US Dollar	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
cad	CA$	$	2	0	{"value": "0", "precision": 20}	Canadian Dollar	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
eur	€	€	2	0	{"value": "0", "precision": 20}	Euro	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
aed	AED	د.إ.‏	2	0	{"value": "0", "precision": 20}	United Arab Emirates Dirham	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
afn	Af	؋	0	0	{"value": "0", "precision": 20}	Afghan Afghani	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
all	ALL	Lek	0	0	{"value": "0", "precision": 20}	Albanian Lek	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
amd	AMD	դր.	0	0	{"value": "0", "precision": 20}	Armenian Dram	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
ars	AR$	$	2	0	{"value": "0", "precision": 20}	Argentine Peso	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
aud	AU$	$	2	0	{"value": "0", "precision": 20}	Australian Dollar	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
azn	man.	ман.	2	0	{"value": "0", "precision": 20}	Azerbaijani Manat	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
bam	KM	KM	2	0	{"value": "0", "precision": 20}	Bosnia-Herzegovina Convertible Mark	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
bdt	Tk	৳	2	0	{"value": "0", "precision": 20}	Bangladeshi Taka	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
bgn	BGN	лв.	2	0	{"value": "0", "precision": 20}	Bulgarian Lev	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
bhd	BD	د.ب.‏	3	0	{"value": "0", "precision": 20}	Bahraini Dinar	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
bif	FBu	FBu	0	0	{"value": "0", "precision": 20}	Burundian Franc	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
bnd	BN$	$	2	0	{"value": "0", "precision": 20}	Brunei Dollar	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
bob	Bs	Bs	2	0	{"value": "0", "precision": 20}	Bolivian Boliviano	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
brl	R$	R$	2	0	{"value": "0", "precision": 20}	Brazilian Real	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
bwp	BWP	P	2	0	{"value": "0", "precision": 20}	Botswanan Pula	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
byn	Br	руб.	2	0	{"value": "0", "precision": 20}	Belarusian Ruble	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
bzd	BZ$	$	2	0	{"value": "0", "precision": 20}	Belize Dollar	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
cdf	CDF	FrCD	2	0	{"value": "0", "precision": 20}	Congolese Franc	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
chf	CHF	CHF	2	0.05	{"value": "0.05", "precision": 20}	Swiss Franc	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
clp	CL$	$	0	0	{"value": "0", "precision": 20}	Chilean Peso	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
cny	CN¥	CN¥	2	0	{"value": "0", "precision": 20}	Chinese Yuan	2026-03-10 11:57:20.269+05:30	2026-03-10 11:57:20.269+05:30	\N
cop	CO$	$	0	0	{"value": "0", "precision": 20}	Colombian Peso	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
crc	₡	₡	0	0	{"value": "0", "precision": 20}	Costa Rican Colón	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
cve	CV$	CV$	2	0	{"value": "0", "precision": 20}	Cape Verdean Escudo	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
czk	Kč	Kč	2	0	{"value": "0", "precision": 20}	Czech Republic Koruna	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
djf	Fdj	Fdj	0	0	{"value": "0", "precision": 20}	Djiboutian Franc	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
dkk	Dkr	kr	2	0	{"value": "0", "precision": 20}	Danish Krone	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
dop	RD$	RD$	2	0	{"value": "0", "precision": 20}	Dominican Peso	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
dzd	DA	د.ج.‏	2	0	{"value": "0", "precision": 20}	Algerian Dinar	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
eek	Ekr	kr	2	0	{"value": "0", "precision": 20}	Estonian Kroon	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
egp	EGP	ج.م.‏	2	0	{"value": "0", "precision": 20}	Egyptian Pound	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
ern	Nfk	Nfk	2	0	{"value": "0", "precision": 20}	Eritrean Nakfa	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
etb	Br	Br	2	0	{"value": "0", "precision": 20}	Ethiopian Birr	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
gbp	£	£	2	0	{"value": "0", "precision": 20}	British Pound Sterling	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
gel	GEL	GEL	2	0	{"value": "0", "precision": 20}	Georgian Lari	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
ghs	GH₵	GH₵	2	0	{"value": "0", "precision": 20}	Ghanaian Cedi	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
gnf	FG	FG	0	0	{"value": "0", "precision": 20}	Guinean Franc	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
gtq	GTQ	Q	2	0	{"value": "0", "precision": 20}	Guatemalan Quetzal	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
hkd	HK$	$	2	0	{"value": "0", "precision": 20}	Hong Kong Dollar	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
hnl	HNL	L	2	0	{"value": "0", "precision": 20}	Honduran Lempira	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
hrk	kn	kn	2	0	{"value": "0", "precision": 20}	Croatian Kuna	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
huf	Ft	Ft	0	0	{"value": "0", "precision": 20}	Hungarian Forint	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
idr	Rp	Rp	0	0	{"value": "0", "precision": 20}	Indonesian Rupiah	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
ils	₪	₪	2	0	{"value": "0", "precision": 20}	Israeli New Sheqel	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
inr	Rs	₹	2	0	{"value": "0", "precision": 20}	Indian Rupee	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
iqd	IQD	د.ع.‏	0	0	{"value": "0", "precision": 20}	Iraqi Dinar	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
irr	IRR	﷼	0	0	{"value": "0", "precision": 20}	Iranian Rial	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
isk	Ikr	kr	0	0	{"value": "0", "precision": 20}	Icelandic Króna	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
jmd	J$	$	2	0	{"value": "0", "precision": 20}	Jamaican Dollar	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
jod	JD	د.أ.‏	3	0	{"value": "0", "precision": 20}	Jordanian Dinar	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
jpy	¥	￥	0	0	{"value": "0", "precision": 20}	Japanese Yen	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
kes	Ksh	Ksh	2	0	{"value": "0", "precision": 20}	Kenyan Shilling	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
khr	KHR	៛	2	0	{"value": "0", "precision": 20}	Cambodian Riel	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
kmf	CF	FC	0	0	{"value": "0", "precision": 20}	Comorian Franc	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
krw	₩	₩	0	0	{"value": "0", "precision": 20}	South Korean Won	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
kwd	KD	د.ك.‏	3	0	{"value": "0", "precision": 20}	Kuwaiti Dinar	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
kzt	KZT	тңг.	2	0	{"value": "0", "precision": 20}	Kazakhstani Tenge	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
lbp	LB£	ل.ل.‏	0	0	{"value": "0", "precision": 20}	Lebanese Pound	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
lkr	SLRs	SL Re	2	0	{"value": "0", "precision": 20}	Sri Lankan Rupee	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
ltl	Lt	Lt	2	0	{"value": "0", "precision": 20}	Lithuanian Litas	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
lvl	Ls	Ls	2	0	{"value": "0", "precision": 20}	Latvian Lats	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
lyd	LD	د.ل.‏	3	0	{"value": "0", "precision": 20}	Libyan Dinar	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
mad	MAD	د.م.‏	2	0	{"value": "0", "precision": 20}	Moroccan Dirham	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
mdl	MDL	MDL	2	0	{"value": "0", "precision": 20}	Moldovan Leu	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
mga	MGA	MGA	0	0	{"value": "0", "precision": 20}	Malagasy Ariary	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
mkd	MKD	MKD	2	0	{"value": "0", "precision": 20}	Macedonian Denar	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
mmk	MMK	K	0	0	{"value": "0", "precision": 20}	Myanma Kyat	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
mnt	MNT	₮	0	0	{"value": "0", "precision": 20}	Mongolian Tugrig	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
mop	MOP$	MOP$	2	0	{"value": "0", "precision": 20}	Macanese Pataca	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
mur	MURs	MURs	0	0	{"value": "0", "precision": 20}	Mauritian Rupee	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
mwk	K	K	2	0	{"value": "0", "precision": 20}	Malawian Kwacha	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
mxn	MX$	$	2	0	{"value": "0", "precision": 20}	Mexican Peso	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
myr	RM	RM	2	0	{"value": "0", "precision": 20}	Malaysian Ringgit	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
mzn	MTn	MTn	2	0	{"value": "0", "precision": 20}	Mozambican Metical	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
nad	N$	N$	2	0	{"value": "0", "precision": 20}	Namibian Dollar	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
ngn	₦	₦	2	0	{"value": "0", "precision": 20}	Nigerian Naira	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
nio	C$	C$	2	0	{"value": "0", "precision": 20}	Nicaraguan Córdoba	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
nok	Nkr	kr	2	0	{"value": "0", "precision": 20}	Norwegian Krone	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
npr	NPRs	नेरू	2	0	{"value": "0", "precision": 20}	Nepalese Rupee	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
nzd	NZ$	$	2	0	{"value": "0", "precision": 20}	New Zealand Dollar	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
omr	OMR	ر.ع.‏	3	0	{"value": "0", "precision": 20}	Omani Rial	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
pab	B/.	B/.	2	0	{"value": "0", "precision": 20}	Panamanian Balboa	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
pen	S/.	S/.	2	0	{"value": "0", "precision": 20}	Peruvian Nuevo Sol	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
php	₱	₱	2	0	{"value": "0", "precision": 20}	Philippine Peso	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
pkr	PKRs	₨	0	0	{"value": "0", "precision": 20}	Pakistani Rupee	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
pln	zł	zł	2	0	{"value": "0", "precision": 20}	Polish Zloty	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
pyg	₲	₲	0	0	{"value": "0", "precision": 20}	Paraguayan Guarani	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
qar	QR	ر.ق.‏	2	0	{"value": "0", "precision": 20}	Qatari Rial	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
ron	RON	RON	2	0	{"value": "0", "precision": 20}	Romanian Leu	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
rsd	din.	дин.	0	0	{"value": "0", "precision": 20}	Serbian Dinar	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
rub	RUB	₽.	2	0	{"value": "0", "precision": 20}	Russian Ruble	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
rwf	RWF	FR	0	0	{"value": "0", "precision": 20}	Rwandan Franc	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
sar	SR	ر.س.‏	2	0	{"value": "0", "precision": 20}	Saudi Riyal	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
sdg	SDG	SDG	2	0	{"value": "0", "precision": 20}	Sudanese Pound	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
sek	Skr	kr	2	0	{"value": "0", "precision": 20}	Swedish Krona	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
sgd	S$	$	2	0	{"value": "0", "precision": 20}	Singapore Dollar	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
sos	Ssh	Ssh	0	0	{"value": "0", "precision": 20}	Somali Shilling	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
syp	SY£	ل.س.‏	0	0	{"value": "0", "precision": 20}	Syrian Pound	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
thb	฿	฿	2	0	{"value": "0", "precision": 20}	Thai Baht	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
tnd	DT	د.ت.‏	3	0	{"value": "0", "precision": 20}	Tunisian Dinar	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
top	T$	T$	2	0	{"value": "0", "precision": 20}	Tongan Paʻanga	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
tjs	TJS	с.	2	0	{"value": "0", "precision": 20}	Tajikistani Somoni	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
try	₺	₺	2	0	{"value": "0", "precision": 20}	Turkish Lira	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
ttd	TT$	$	2	0	{"value": "0", "precision": 20}	Trinidad and Tobago Dollar	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
twd	NT$	NT$	2	0	{"value": "0", "precision": 20}	New Taiwan Dollar	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
tzs	TSh	TSh	0	0	{"value": "0", "precision": 20}	Tanzanian Shilling	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
uah	₴	₴	2	0	{"value": "0", "precision": 20}	Ukrainian Hryvnia	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
ugx	USh	USh	0	0	{"value": "0", "precision": 20}	Ugandan Shilling	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
uyu	$U	$	2	0	{"value": "0", "precision": 20}	Uruguayan Peso	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
uzs	UZS	UZS	0	0	{"value": "0", "precision": 20}	Uzbekistan Som	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
vef	Bs.F.	Bs.F.	2	0	{"value": "0", "precision": 20}	Venezuelan Bolívar	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
vnd	₫	₫	0	0	{"value": "0", "precision": 20}	Vietnamese Dong	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
xaf	FCFA	FCFA	0	0	{"value": "0", "precision": 20}	CFA Franc BEAC	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
xof	CFA	CFA	0	0	{"value": "0", "precision": 20}	CFA Franc BCEAO	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
xpf	₣	₣	0	0	{"value": "0", "precision": 20}	CFP Franc	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
yer	YR	ر.ي.‏	0	0	{"value": "0", "precision": 20}	Yemeni Rial	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
zar	R	R	2	0	{"value": "0", "precision": 20}	South African Rand	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
zmk	ZK	ZK	0	0	{"value": "0", "precision": 20}	Zambian Kwacha	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
zwl	ZWL$	ZWL$	0	0	{"value": "0", "precision": 20}	Zimbabwean Dollar	2026-03-10 11:57:20.27+05:30	2026-03-10 11:57:20.27+05:30	\N
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer (id, company_name, first_name, last_name, email, phone, has_account, metadata, created_at, updated_at, deleted_at, created_by) FROM stdin;
cus_01KKBNF6A1T3EABE3324ZTY321	\N	Kunal	Jangra	kunalrisaanva12@gmail.com	08168336581	t	\N	2026-03-10 16:12:48.258+05:30	2026-03-10 16:12:48.258+05:30	\N	\N
\.


--
-- Data for Name: customer_account_holder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_account_holder (customer_id, account_holder_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: customer_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_address (id, customer_id, address_name, is_default_shipping, is_default_billing, company, first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: customer_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_group (id, name, metadata, created_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: customer_group_customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_group_customer (id, customer_id, customer_group_id, metadata, created_at, updated_at, created_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: fulfillment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment (id, location_id, packed_at, shipped_at, delivered_at, canceled_at, data, provider_id, shipping_option_id, metadata, delivery_address_id, created_at, updated_at, deleted_at, marked_shipped_by, created_by, requires_shipping) FROM stdin;
\.


--
-- Data for Name: fulfillment_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment_address (id, company, first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: fulfillment_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment_item (id, title, sku, barcode, quantity, raw_quantity, line_item_id, inventory_item_id, fulfillment_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: fulfillment_label; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment_label (id, tracking_number, tracking_url, label_url, fulfillment_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: fulfillment_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment_provider (id, is_enabled, created_at, updated_at, deleted_at) FROM stdin;
manual_manual	t	2026-03-10 11:57:20.284+05:30	2026-03-10 11:57:20.284+05:30	\N
\.


--
-- Data for Name: fulfillment_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment_set (id, name, type, metadata, created_at, updated_at, deleted_at) FROM stdin;
fuset_01KMQ2FTWPXCYAYM88E94SV3A9	The Blissful Soul Warehouse pick up	pickup	\N	2026-03-27 12:47:41.399+05:30	2026-03-27 12:47:41.399+05:30	\N
fuset_01KMQ2GRFHF46DE7YV0YKCYXFJ	The Blissful Soul Warehouse shipping	shipping	\N	2026-03-27 12:48:11.697+05:30	2026-03-27 12:48:11.697+05:30	\N
\.


--
-- Data for Name: geo_zone; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.geo_zone (id, type, country_code, province_code, city, service_zone_id, postal_expression, metadata, created_at, updated_at, deleted_at) FROM stdin;
fgz_01KMQ2KNE3JATWSACXFSZNQ4RE	country	in	\N	\N	serzo_01KMQ2KNE5MD69P6KVX8GTX0JJ	\N	\N	2026-03-27 12:49:46.886+05:30	2026-03-27 12:49:46.886+05:30	\N
fgz_01KMQ4TBQYJYATX1EECHRVFJ2V	country	in	\N	\N	serzo_01KMQ4TBQYYJTSQXDA2THYY07V	\N	\N	2026-03-27 13:28:23.487+05:30	2026-03-27 13:28:23.487+05:30	\N
fgz_01KMQ4TBQYZ57KHS0N8J9QK9E0	country	us	\N	\N	serzo_01KMQ4TBQYYJTSQXDA2THYY07V	\N	\N	2026-03-27 13:28:23.487+05:30	2026-03-27 13:28:23.487+05:30	\N
\.


--
-- Data for Name: image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.image (id, url, metadata, created_at, updated_at, deleted_at, rank, product_id) FROM stdin;
img_01KKGEV0T5269JS99GA2RGH50D	http://localhost:9000/static/1773300187949-1-22.webp	\N	2026-03-12 12:53:07.974+05:30	2026-03-12 12:53:07.974+05:30	\N	0	prod_01KKGEV0T2SE3CBBTHBSCDX5S3
img_01KKGF0JY19BR9F0MH87WJ1RRP	http://localhost:9000/static/1773300370343-1-23.webp	\N	2026-03-12 12:56:10.371+05:30	2026-03-12 12:56:10.371+05:30	\N	0	prod_01KKGF0JXXE36GBNN7GRRZ0J6F
img_01KKGFD3XM5N4657CM7JD5GT5Z	http://localhost:9000/static/1773300780960-4.webp	\N	2026-03-12 13:03:00.983+05:30	2026-03-12 13:03:00.983+05:30	\N	0	prod_01KKGFD3XJW2DF5NM4N9NH3BPB
img_01KKGFEDP2MSQCS20ESKN9PDAV	http://localhost:9000/static/1773300823720-1-e1757322710183.webp	\N	2026-03-12 13:03:43.747+05:30	2026-03-12 13:03:43.747+05:30	\N	0	prod_01KKGFEDP1B71M6E0VAXVCD132
img_01KKGFHZQ0FHEC08YWTTGJ587N	http://localhost:9000/static/1773300940495-2-21.webp	\N	2026-03-12 13:05:40.513+05:30	2026-03-12 13:05:40.513+05:30	\N	0	prod_01KKGFHZPZ4ZYDZ8DBZ5Q8CFF5
img_01KKGFQ2PDDFWG77066E2X091Q	http://localhost:9000/static/1773301107390-1-26.webp	\N	2026-03-12 13:08:27.406+05:30	2026-03-12 13:08:27.406+05:30	\N	0	prod_01KKGFQ2PBH10AEGGBY47EGDWD
img_01KKGFS54QPHD54X308ND3ZC0B	http://localhost:9000/static/1773301175433-2-3.webp	\N	2026-03-12 13:09:35.447+05:30	2026-03-12 13:09:35.447+05:30	\N	0	prod_01KKGFS54N6JFJ00AN1X0B778M
img_01KKGG1ZW660JPAF04K0W18F3B	http://localhost:9000/static/1773301464931-1-27.webp	\N	2026-03-12 13:14:24.967+05:30	2026-03-12 13:14:24.967+05:30	\N	0	prod_01KKGG1ZW550D0X09AD05PFNJD
img_01KKGGBWPZEDJ5V6GGHNPBH0DX	http://localhost:9000/static/1773301789385-3-3.webp	\N	2026-03-12 13:19:49.409+05:30	2026-03-12 13:19:49.409+05:30	\N	0	prod_01KKGGBWPWW603YYCM9QSA8M8F
img_01KKGGCYRV7W8APSDRR9F45FV2	http://localhost:9000/static/1773301824262-2-5.webp	\N	2026-03-12 13:20:24.283+05:30	2026-03-12 13:20:24.283+05:30	\N	0	prod_01KKGGCYRS02FZPXSS5E81Z0VT
img_01KKGGDSH16JQRQ694T6SGRSY0	http://localhost:9000/static/1773301851661-1-6.webp	\N	2026-03-12 13:20:51.681+05:30	2026-03-12 13:20:51.681+05:30	\N	0	prod_01KKGGDSGZAQA07E2W95SYWFJY
img_01KKGGETJTFGRVBM7PJZFQXMKY	http://localhost:9000/static/1773301885501-1-7.webp	\N	2026-03-12 13:21:25.531+05:30	2026-03-12 13:21:25.531+05:30	\N	0	prod_01KKGGETJS4R9WWQDEZXVC6YKP
img_01KKGGGS8W0EXEWBP3010NPEBJ	http://localhost:9000/static/1773301949707-photo-4.png	\N	2026-03-12 13:22:29.725+05:30	2026-03-12 13:22:29.725+05:30	\N	0	prod_01KKGGGS8V9GRPDY2RM0EX5T8V
img_01KKGGSX677XVFM5AS3G2YS5CC	http://localhost:9000/static/1773302248632-3-8.webp	\N	2026-03-12 13:27:28.647+05:30	2026-03-12 13:27:28.647+05:30	\N	0	prod_01KKGGSX663XAWMPZPXXZ152T0
img_01KKGGTJQW11YQHX84NKQNP90G	http://localhost:9000/static/1773302270695-1-10.webp	\N	2026-03-12 13:27:50.717+05:30	2026-03-12 13:27:50.717+05:30	\N	0	prod_01KKGGTJQV56K1RZXS5PVCR33Q
img_01KKGH7HHJ3MWRPZDJSDK05BVK	http://localhost:9000/static/1773302695457-1-11.webp	\N	2026-03-12 13:34:55.475+05:30	2026-03-12 13:34:55.475+05:30	\N	0	prod_01KKGH7HHH2ZZC94E0HEP3N1PH
img_01KKGH86CDK79BS576S0BBGVMZ	http://localhost:9000/static/1773302716800-1-12.webp	\N	2026-03-12 13:35:16.814+05:30	2026-03-12 13:35:16.814+05:30	\N	0	prod_01KKGH86CCFJ4680NM1TTRZBBZ
img_01KKGH9BC4P8FYYSSE0V3KE19K	http://localhost:9000/static/1773302754679-photo-5.png	\N	2026-03-12 13:35:54.692+05:30	2026-03-12 13:35:54.692+05:30	\N	0	prod_01KKGH9BC3KA041DVWQV1XACAK
img_01KKGHA006SHEQCJACTYHJ1CVW	http://localhost:9000/static/1773302775791-1-14.webp	\N	2026-03-12 13:36:15.815+05:30	2026-03-12 13:36:15.815+05:30	\N	0	prod_01KKGHA00514BHTAHQMFK1BXX5
img_01KKGHBHJCVBVY8EMN30WFCN9P	http://localhost:9000/static/1773302826560-1-15.webp	\N	2026-03-12 13:37:06.572+05:30	2026-03-12 13:37:06.572+05:30	\N	0	prod_01KKGHBHJBDQTRSV188CTFDNR6
img_01KKGHC3ZTTC4D07J1Q0H26SY8	http://localhost:9000/static/1773302845418-2-14.webp	\N	2026-03-12 13:37:25.434+05:30	2026-03-12 13:37:25.434+05:30	\N	0	prod_01KKGHC3ZR2HTWW0GA4D777CPP
img_01KKGHEGQXFM4CKBVXRNS1CHEB	http://localhost:9000/static/1773302924014-2-15.webp	\N	2026-03-12 13:38:44.029+05:30	2026-03-12 13:38:44.029+05:30	\N	0	prod_01KKGHEGQWSYMSHDTKRG61JRV8
img_01KKGHGGGCYEGEDG316W6XY0W2	http://localhost:9000/static/1773302989305-1-19.webp	\N	2026-03-12 13:39:49.325+05:30	2026-03-12 13:39:49.325+05:30	\N	0	prod_01KKGHGGGB544H7EA1GY5RZ1B3
img_01KKGHGZ1Y2QWY66BSXS3J8J5A	http://localhost:9000/static/1773303004196-3-17.webp	\N	2026-03-12 13:40:04.222+05:30	2026-03-12 13:40:04.222+05:30	\N	0	prod_01KKGHGZ1XN4KR4VXRSMX4N1N7
img_01KKGHHPWTSPZEW8YAP99QN3R0	http://localhost:9000/static/1773303028619-2-18.webp	\N	2026-03-12 13:40:28.635+05:30	2026-03-12 13:40:28.635+05:30	\N	0	prod_01KKGHHPWS4T4BEWQ85AZ3N4H7
img_01KKBDMEKX0HFEYN1EYCFHH19C	http://localhost:9000/static/1773131151964-SB-9001copy.webp	\N	2026-03-10 13:55:51.999+05:30	2026-03-12 16:02:32.641+05:30	2026-03-12 16:02:32.626+05:30	0	prod_01KKBDMEKJY42ZVZNDDP102XVQ
img_01KKB6VT3VGX6JJS8AM92H24GX	https://theblissfulsoul.in/cdn/shop/files/pyrite-keychain.jpg	\N	2026-03-10 11:57:33.116+05:30	2026-03-12 16:02:38.022+05:30	2026-03-12 16:02:38.011+05:30	0	prod_01KKB6VT3TZZFRMNP201QPVDTK
img_01KKB6VT6M7YZPE54M90GCMPHG	https://theblissfulsoul.in/cdn/shop/files/money-pyramid.jpg	\N	2026-03-10 11:57:33.205+05:30	2026-03-12 16:02:40.977+05:30	2026-03-12 16:02:40.971+05:30	0	prod_01KKB6VT6MG5P31Y6NH6W1KRZJ
img_01KKB6VT8H1D1HYHAQMEVA8889	https://theblissfulsoul.in/cdn/shop/files/amethyst-bracelet.jpg	\N	2026-03-10 11:57:33.265+05:30	2026-03-12 16:02:43.14+05:30	2026-03-12 16:02:43.137+05:30	0	prod_01KKB6VT8GE0JVDMNBMB5CRNTB
img_01KKB6VT9V7QRME96VWAF2PC05	https://theblissfulsoul.in/cdn/shop/files/rose-quartz-bracelet.jpg	\N	2026-03-10 11:57:33.307+05:30	2026-03-12 16:02:45.856+05:30	2026-03-12 16:02:45.844+05:30	0	prod_01KKB6VT9V8NQCAT15G2AFEWG7
img_01KKB6VTAV99EZ44V5K3JNVWXM	https://theblissfulsoul.in/cdn/shop/files/money-magnet.jpg	\N	2026-03-10 11:57:33.339+05:30	2026-03-12 16:02:48.98+05:30	2026-03-12 16:02:48.971+05:30	0	prod_01KKB6VTATHKEEE6MXR51QSD4T
img_01KKB6VTBT3KHRRFZ254QH58YX	https://theblissfulsoul.in/cdn/shop/files/selenite-plate.jpg	\N	2026-03-10 11:57:33.37+05:30	2026-03-12 16:03:09.174+05:30	2026-03-12 16:03:09.166+05:30	0	prod_01KKB6VTBTDH1X31R50EC7Q1GB
img_01KKGT0Q08TJ9ECG0V3YN9QZFE	http://localhost:9000/static/1773311908843-1-24.webp	\N	2026-03-12 16:08:28.874+05:30	2026-03-12 16:08:28.874+05:30	\N	0	prod_01KKGT0Q069BHJ6VP4P98TZEXB
img_01KKTQC8215SQMTRFZ21GMM9DH	http://localhost:9000/static/1773644685358-Screenshot_1.png	\N	2026-03-16 12:34:45.378+05:30	2026-03-16 12:34:45.378+05:30	\N	0	prod_01KKTQC820Z82HT7ZNZAPRENCW
img_01KKTNFA13WKVMSSPRWKYG94AG	http://localhost:9000/static/1773642688458-WhatsApp-Image-2025-08-30-at-2.03.56-PM-1-scaled-e1756997216538.jpg	\N	2026-03-16 12:01:28.548+05:30	2026-03-16 12:45:00.563+05:30	2026-03-16 12:45:00.552+05:30	0	prod_01KKTNFA12ZYJMT053XBDDXXHX
img_01KKK08Q69ZS5TXT1YCP2136EA	http://localhost:9000/static/1773385571504-6.png	\N	2026-03-13 12:36:11.53+05:30	2026-03-16 12:47:39.994+05:30	2026-03-16 12:47:39.977+05:30	0	prod_01KKK08Q66WYDN10VJ75BDQX47
img_01KKTR6NCNQ9XCJ5VE8T2AGMAH	http://localhost:9000/static/1773645550965-WhatsApp-Image-2025-08-30-at-2.03.56-PM-1-scaled-e1756997216538.jpg	\N	2026-03-16 12:49:10.998+05:30	2026-03-16 12:49:10.998+05:30	\N	0	prod_01KKTR6NCKGH4S7ZZKT8ESKT41
img_01KKTQ8QPQ2RA40348FZHS4QD7	http://localhost:9000/static/1773644570135-Therapy-Counselling-Sessions.png	\N	2026-03-16 12:32:50.329+05:30	2026-03-16 14:40:45.072+05:30	2026-03-16 14:40:45.067+05:30	0	prod_01KKTQ8QPN5Y2K8ZAB53CHDB12
img_01KKTYN1SMGGYS8XENHW1H9R13	http://localhost:9000/static/1773652313883-Therapy-Counselling-Sessions.png	\N	2026-03-16 14:41:53.909+05:30	2026-03-16 14:46:32.003+05:30	2026-03-16 14:46:31.955+05:30	0	prod_01KKTYN1SKJF99NAKB81G9R1NX
img_01KKTZ7JMTNA2K1BFK8B5F02GN	http://localhost:9000/static/1773652920929-Therapy-Counselling-Sessions.png	\N	2026-03-16 14:52:00.988+05:30	2026-03-16 14:52:00.988+05:30	\N	0	prod_01KKTZ7JMM93QMPPSH61S8DP7K
img_01KKTNA7JCTJXFNKBPJ0ZVFD9X	http://localhost:9000/static/1773642522149-Kundli.png	\N	2026-03-16 11:58:42.189+05:30	2026-03-16 15:09:27.599+05:30	2026-03-16 15:09:27.583+05:30	0	prod_01KKTNA7JBNG7PVCK2D7VFVEG0
img_01KKV08VDRYCJS48KJGAZKQ2A7	http://localhost:9000/static/1773654011295-Kundli.png	\N	2026-03-16 15:10:11.321+05:30	2026-03-16 15:10:11.321+05:30	\N	0	prod_01KKV08VDQQ210Z466H8Z4P9NY
\.


--
-- Data for Name: inventory_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_item (id, created_at, updated_at, deleted_at, sku, origin_country, hs_code, mid_code, material, weight, length, height, width, requires_shipping, description, title, thumbnail, metadata) FROM stdin;
iitem_01KKGF0JZE35HM4ZZ5GZ6M8RBX	2026-03-12 12:56:10.414+05:30	2026-03-12 12:56:10.414+05:30	\N	999	\N	\N	\N	\N	\N	\N	\N	\N	t	Default variant	Default variant	\N	\N
iitem_01KKGFHZR28FB1F7RZTHGFK2TQ	2026-03-12 13:05:40.546+05:30	2026-03-12 13:05:40.546+05:30	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	Default variant	Default variant	\N	\N
iitem_01KKGG1ZXXAJASD66F24D0VGK0	2026-03-12 13:14:25.022+05:30	2026-03-12 13:14:25.022+05:30	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	Crystal Charger – Selenite Plate	Crystal Charger – Selenite Plate	\N	\N
iitem_01KKB6VT5M68DX6W4C944ZWQW4	2026-03-10 11:57:33.172+05:30	2026-03-12 16:02:37.981+05:30	2026-03-12 16:02:37.981+05:30	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	Standard	Standard	\N	\N
iitem_01KKB6VT7EM9T7FHMWR0A28KTP	2026-03-10 11:57:33.23+05:30	2026-03-12 16:02:40.962+05:30	2026-03-12 16:02:40.961+05:30	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	Standard	Standard	\N	\N
iitem_01KKB6VT93GQGKX90VQY26ANJ7	2026-03-10 11:57:33.284+05:30	2026-03-12 16:02:43.125+05:30	2026-03-12 16:02:43.125+05:30	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	Standard	Standard	\N	\N
iitem_01KKB6VTAETXHW429F59VMQFP5	2026-03-10 11:57:33.326+05:30	2026-03-12 16:02:45.835+05:30	2026-03-12 16:02:45.835+05:30	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	Standard	Standard	\N	\N
iitem_01KKB6VTBCXVX1R04XE3N7TC3J	2026-03-10 11:57:33.357+05:30	2026-03-12 16:02:48.95+05:30	2026-03-12 16:02:48.95+05:30	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	Standard	Standard	\N	\N
iitem_01KKB6VTC953R7V5MK3KXD5X1B	2026-03-10 11:57:33.385+05:30	2026-03-12 16:03:09.141+05:30	2026-03-12 16:03:09.141+05:30	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	Standard	Standard	\N	\N
\.


--
-- Data for Name: inventory_level; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_level (id, created_at, updated_at, deleted_at, inventory_item_id, location_id, stocked_quantity, reserved_quantity, incoming_quantity, metadata, raw_stocked_quantity, raw_reserved_quantity, raw_incoming_quantity) FROM stdin;
\.


--
-- Data for Name: invite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invite (id, email, accepted, token, expires_at, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: link_module_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.link_module_migrations (id, table_name, link_descriptor, created_at) FROM stdin;
1	cart_payment_collection	{"toModel": "payment_collection", "toModule": "payment", "fromModel": "cart", "fromModule": "cart"}	2026-03-10 11:57:18.302473
2	cart_promotion	{"toModel": "promotions", "toModule": "promotion", "fromModel": "cart", "fromModule": "cart"}	2026-03-10 11:57:18.327216
3	customer_account_holder	{"toModel": "account_holder", "toModule": "payment", "fromModel": "customer", "fromModule": "customer"}	2026-03-10 11:57:18.347206
4	location_fulfillment_provider	{"toModel": "fulfillment_provider", "toModule": "fulfillment", "fromModel": "location", "fromModule": "stock_location"}	2026-03-10 11:57:18.349329
5	location_fulfillment_set	{"toModel": "fulfillment_set", "toModule": "fulfillment", "fromModel": "location", "fromModule": "stock_location"}	2026-03-10 11:57:18.3508
6	order_cart	{"toModel": "cart", "toModule": "cart", "fromModel": "order", "fromModule": "order"}	2026-03-10 11:57:18.375189
7	order_fulfillment	{"toModel": "fulfillments", "toModule": "fulfillment", "fromModel": "order", "fromModule": "order"}	2026-03-10 11:57:18.378192
8	order_payment_collection	{"toModel": "payment_collection", "toModule": "payment", "fromModel": "order", "fromModule": "order"}	2026-03-10 11:57:18.379789
9	order_promotion	{"toModel": "promotions", "toModule": "promotion", "fromModel": "order", "fromModule": "order"}	2026-03-10 11:57:18.382679
10	return_fulfillment	{"toModel": "fulfillments", "toModule": "fulfillment", "fromModel": "return", "fromModule": "order"}	2026-03-10 11:57:18.383957
11	product_sales_channel	{"toModel": "sales_channel", "toModule": "sales_channel", "fromModel": "product", "fromModule": "product"}	2026-03-10 11:57:18.385145
12	product_shipping_profile	{"toModel": "shipping_profile", "toModule": "fulfillment", "fromModel": "product", "fromModule": "product"}	2026-03-10 11:57:18.409096
13	product_variant_inventory_item	{"toModel": "inventory", "toModule": "inventory", "fromModel": "variant", "fromModule": "product"}	2026-03-10 11:57:18.412778
14	product_variant_price_set	{"toModel": "price_set", "toModule": "pricing", "fromModel": "variant", "fromModule": "product"}	2026-03-10 11:57:18.416157
15	publishable_api_key_sales_channel	{"toModel": "sales_channel", "toModule": "sales_channel", "fromModel": "api_key", "fromModule": "api_key"}	2026-03-10 11:57:18.419286
16	region_payment_provider	{"toModel": "payment_provider", "toModule": "payment", "fromModel": "region", "fromModule": "region"}	2026-03-10 11:57:18.443439
17	sales_channel_stock_location	{"toModel": "location", "toModule": "stock_location", "fromModel": "sales_channel", "fromModule": "sales_channel"}	2026-03-10 11:57:18.465197
18	shipping_option_price_set	{"toModel": "price_set", "toModule": "pricing", "fromModel": "shipping_option", "fromModule": "fulfillment"}	2026-03-10 11:57:18.469938
19	user_rbac_role	{"toModel": "rbac_role", "toModule": "rbac", "fromModel": "user", "fromModule": "user"}	2026-03-10 11:57:18.474322
\.


--
-- Data for Name: location_fulfillment_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.location_fulfillment_provider (stock_location_id, fulfillment_provider_id, id, created_at, updated_at, deleted_at) FROM stdin;
sloc_01KMQ2C4Y3EYJDZ1G9RWFVQAB5	manual_manual	locfp_01KMQ2F340CFSW48PCJTS9ABEM	2026-03-27 12:47:17.05101+05:30	2026-03-27 12:47:17.05101+05:30	\N
\.


--
-- Data for Name: location_fulfillment_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.location_fulfillment_set (stock_location_id, fulfillment_set_id, id, created_at, updated_at, deleted_at) FROM stdin;
sloc_01KMQ2C4Y3EYJDZ1G9RWFVQAB5	fuset_01KMQ2FTWPXCYAYM88E94SV3A9	locfs_01KMQ2FTX5FCVQW57FPZHRAC7W	2026-03-27 12:47:41.410647+05:30	2026-03-27 12:47:41.410647+05:30	\N
sloc_01KMQ2C4Y3EYJDZ1G9RWFVQAB5	fuset_01KMQ2GRFHF46DE7YV0YKCYXFJ	locfs_01KMQ2GRGB4VHMCZ0RDAGN0HZR	2026-03-27 12:48:11.722875+05:30	2026-03-27 12:48:11.722875+05:30	\N
\.


--
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20240307161216	2026-03-10 11:57:17.208115+05:30
2	Migration20241210073813	2026-03-10 11:57:17.208115+05:30
3	Migration20250106142624	2026-03-10 11:57:17.208115+05:30
4	Migration20250120110820	2026-03-10 11:57:17.208115+05:30
5	Migration20240307132720	2026-03-10 11:57:17.267357+05:30
6	Migration20240719123015	2026-03-10 11:57:17.267357+05:30
7	Migration20241213063611	2026-03-10 11:57:17.267357+05:30
8	Migration20251010131115	2026-03-10 11:57:17.267357+05:30
9	InitialSetup20240401153642	2026-03-10 11:57:17.315004+05:30
10	Migration20240601111544	2026-03-10 11:57:17.315004+05:30
11	Migration202408271511	2026-03-10 11:57:17.315004+05:30
12	Migration20241122120331	2026-03-10 11:57:17.315004+05:30
13	Migration20241125090957	2026-03-10 11:57:17.315004+05:30
14	Migration20250411073236	2026-03-10 11:57:17.315004+05:30
15	Migration20250516081326	2026-03-10 11:57:17.315004+05:30
16	Migration20250910154539	2026-03-10 11:57:17.315004+05:30
17	Migration20250911092221	2026-03-10 11:57:17.315004+05:30
18	Migration20250929204438	2026-03-10 11:57:17.315004+05:30
19	Migration20251008132218	2026-03-10 11:57:17.315004+05:30
20	Migration20251011090511	2026-03-10 11:57:17.315004+05:30
21	Migration20230929122253	2026-03-10 11:57:17.39647+05:30
22	Migration20240322094407	2026-03-10 11:57:17.39647+05:30
23	Migration20240322113359	2026-03-10 11:57:17.39647+05:30
24	Migration20240322120125	2026-03-10 11:57:17.39647+05:30
25	Migration20240626133555	2026-03-10 11:57:17.39647+05:30
26	Migration20240704094505	2026-03-10 11:57:17.39647+05:30
27	Migration20241127114534	2026-03-10 11:57:17.39647+05:30
28	Migration20241127223829	2026-03-10 11:57:17.39647+05:30
29	Migration20241128055359	2026-03-10 11:57:17.39647+05:30
30	Migration20241212190401	2026-03-10 11:57:17.39647+05:30
31	Migration20250408145122	2026-03-10 11:57:17.39647+05:30
32	Migration20250409122219	2026-03-10 11:57:17.39647+05:30
33	Migration20251009110625	2026-03-10 11:57:17.39647+05:30
34	Migration20251112192723	2026-03-10 11:57:17.39647+05:30
35	Migration20240227120221	2026-03-10 11:57:17.468357+05:30
36	Migration20240617102917	2026-03-10 11:57:17.468357+05:30
37	Migration20240624153824	2026-03-10 11:57:17.468357+05:30
38	Migration20241211061114	2026-03-10 11:57:17.468357+05:30
39	Migration20250113094144	2026-03-10 11:57:17.468357+05:30
40	Migration20250120110700	2026-03-10 11:57:17.468357+05:30
41	Migration20250226130616	2026-03-10 11:57:17.468357+05:30
42	Migration20250508081510	2026-03-10 11:57:17.468357+05:30
43	Migration20250828075407	2026-03-10 11:57:17.468357+05:30
44	Migration20250909083125	2026-03-10 11:57:17.468357+05:30
45	Migration20250916120552	2026-03-10 11:57:17.468357+05:30
46	Migration20250917143818	2026-03-10 11:57:17.468357+05:30
47	Migration20250919122137	2026-03-10 11:57:17.468357+05:30
48	Migration20251006000000	2026-03-10 11:57:17.468357+05:30
49	Migration20251015113934	2026-03-10 11:57:17.468357+05:30
50	Migration20251107050148	2026-03-10 11:57:17.468357+05:30
51	Migration20240124154000	2026-03-10 11:57:17.527519+05:30
52	Migration20240524123112	2026-03-10 11:57:17.527519+05:30
53	Migration20240602110946	2026-03-10 11:57:17.527519+05:30
54	Migration20241211074630	2026-03-10 11:57:17.527519+05:30
55	Migration20251010130829	2026-03-10 11:57:17.527519+05:30
56	Migration20240115152146	2026-03-10 11:57:17.554156+05:30
57	Migration20240222170223	2026-03-10 11:57:17.565318+05:30
58	Migration20240831125857	2026-03-10 11:57:17.565318+05:30
59	Migration20241106085918	2026-03-10 11:57:17.565318+05:30
60	Migration20241205095237	2026-03-10 11:57:17.565318+05:30
61	Migration20241216183049	2026-03-10 11:57:17.565318+05:30
62	Migration20241218091938	2026-03-10 11:57:17.565318+05:30
63	Migration20250120115059	2026-03-10 11:57:17.565318+05:30
64	Migration20250212131240	2026-03-10 11:57:17.565318+05:30
65	Migration20250326151602	2026-03-10 11:57:17.565318+05:30
66	Migration20250508081553	2026-03-10 11:57:17.565318+05:30
67	Migration20251017153909	2026-03-10 11:57:17.565318+05:30
68	Migration20251208130704	2026-03-10 11:57:17.565318+05:30
69	Migration20240205173216	2026-03-10 11:57:17.610754+05:30
70	Migration20240624200006	2026-03-10 11:57:17.610754+05:30
71	Migration20250120110744	2026-03-10 11:57:17.610754+05:30
72	InitialSetup20240221144943	2026-03-10 11:57:17.673276+05:30
73	Migration20240604080145	2026-03-10 11:57:17.673276+05:30
74	Migration20241205122700	2026-03-10 11:57:17.673276+05:30
75	Migration20251015123842	2026-03-10 11:57:17.673276+05:30
76	InitialSetup20240227075933	2026-03-10 11:57:17.696284+05:30
77	Migration20240621145944	2026-03-10 11:57:17.696284+05:30
78	Migration20241206083313	2026-03-10 11:57:17.696284+05:30
79	Migration20251202184737	2026-03-10 11:57:17.696284+05:30
80	Migration20251212161429	2026-03-10 11:57:17.696284+05:30
81	Migration20240227090331	2026-03-10 11:57:17.717646+05:30
82	Migration20240710135844	2026-03-10 11:57:17.717646+05:30
83	Migration20240924114005	2026-03-10 11:57:17.717646+05:30
84	Migration20241212052837	2026-03-10 11:57:17.717646+05:30
85	InitialSetup20240228133303	2026-03-10 11:57:17.750817+05:30
86	Migration20240624082354	2026-03-10 11:57:17.750817+05:30
87	Migration20240225134525	2026-03-10 11:57:17.763886+05:30
88	Migration20240806072619	2026-03-10 11:57:17.763886+05:30
89	Migration20241211151053	2026-03-10 11:57:17.763886+05:30
90	Migration20250115160517	2026-03-10 11:57:17.763886+05:30
91	Migration20250120110552	2026-03-10 11:57:17.763886+05:30
92	Migration20250123122334	2026-03-10 11:57:17.763886+05:30
93	Migration20250206105639	2026-03-10 11:57:17.763886+05:30
94	Migration20250207132723	2026-03-10 11:57:17.763886+05:30
95	Migration20250625084134	2026-03-10 11:57:17.763886+05:30
96	Migration20250924135437	2026-03-10 11:57:17.763886+05:30
97	Migration20250929124701	2026-03-10 11:57:17.763886+05:30
98	Migration20240219102530	2026-03-10 11:57:17.812979+05:30
99	Migration20240604100512	2026-03-10 11:57:17.812979+05:30
100	Migration20240715102100	2026-03-10 11:57:17.812979+05:30
101	Migration20240715174100	2026-03-10 11:57:17.812979+05:30
102	Migration20240716081800	2026-03-10 11:57:17.812979+05:30
103	Migration20240801085921	2026-03-10 11:57:17.812979+05:30
104	Migration20240821164505	2026-03-10 11:57:17.812979+05:30
105	Migration20240821170920	2026-03-10 11:57:17.812979+05:30
106	Migration20240827133639	2026-03-10 11:57:17.812979+05:30
107	Migration20240902195921	2026-03-10 11:57:17.812979+05:30
108	Migration20240913092514	2026-03-10 11:57:17.812979+05:30
109	Migration20240930122627	2026-03-10 11:57:17.812979+05:30
110	Migration20241014142943	2026-03-10 11:57:17.812979+05:30
111	Migration20241106085223	2026-03-10 11:57:17.812979+05:30
112	Migration20241129124827	2026-03-10 11:57:17.812979+05:30
113	Migration20241217162224	2026-03-10 11:57:17.812979+05:30
114	Migration20250326151554	2026-03-10 11:57:17.812979+05:30
115	Migration20250522181137	2026-03-10 11:57:17.812979+05:30
116	Migration20250702095353	2026-03-10 11:57:17.812979+05:30
117	Migration20250704120229	2026-03-10 11:57:17.812979+05:30
118	Migration20250910130000	2026-03-10 11:57:17.812979+05:30
119	Migration20251016160403	2026-03-10 11:57:17.812979+05:30
120	Migration20251016182939	2026-03-10 11:57:17.812979+05:30
121	Migration20251017155709	2026-03-10 11:57:17.812979+05:30
122	Migration20251114100559	2026-03-10 11:57:17.812979+05:30
123	Migration20251125164002	2026-03-10 11:57:17.812979+05:30
124	Migration20251210112909	2026-03-10 11:57:17.812979+05:30
125	Migration20251210112924	2026-03-10 11:57:17.812979+05:30
126	Migration20251225120947	2026-03-10 11:57:17.812979+05:30
127	Migration20250717162007	2026-03-10 11:57:17.933702+05:30
128	Migration20240205025928	2026-03-10 11:57:17.948757+05:30
129	Migration20240529080336	2026-03-10 11:57:17.948757+05:30
130	Migration20241202100304	2026-03-10 11:57:17.948757+05:30
131	Migration20240214033943	2026-03-10 11:57:17.980926+05:30
132	Migration20240703095850	2026-03-10 11:57:17.980926+05:30
133	Migration20241202103352	2026-03-10 11:57:17.980926+05:30
134	Migration20240311145700_InitialSetupMigration	2026-03-10 11:57:18.004522+05:30
135	Migration20240821170957	2026-03-10 11:57:18.004522+05:30
136	Migration20240917161003	2026-03-10 11:57:18.004522+05:30
137	Migration20241217110416	2026-03-10 11:57:18.004522+05:30
138	Migration20250113122235	2026-03-10 11:57:18.004522+05:30
139	Migration20250120115002	2026-03-10 11:57:18.004522+05:30
140	Migration20250822130931	2026-03-10 11:57:18.004522+05:30
141	Migration20250825132614	2026-03-10 11:57:18.004522+05:30
142	Migration20251114133146	2026-03-10 11:57:18.004522+05:30
143	Migration20240509083918_InitialSetupMigration	2026-03-10 11:57:18.063183+05:30
144	Migration20240628075401	2026-03-10 11:57:18.063183+05:30
145	Migration20240830094712	2026-03-10 11:57:18.063183+05:30
146	Migration20250120110514	2026-03-10 11:57:18.063183+05:30
147	Migration20251028172715	2026-03-10 11:57:18.063183+05:30
148	Migration20251121123942	2026-03-10 11:57:18.063183+05:30
149	Migration20251121150408	2026-03-10 11:57:18.063183+05:30
150	Migration20231228143900	2026-03-10 11:57:18.113155+05:30
151	Migration20241206101446	2026-03-10 11:57:18.113155+05:30
152	Migration20250128174331	2026-03-10 11:57:18.113155+05:30
153	Migration20250505092459	2026-03-10 11:57:18.113155+05:30
154	Migration20250819104213	2026-03-10 11:57:18.113155+05:30
155	Migration20250819110924	2026-03-10 11:57:18.113155+05:30
156	Migration20250908080305	2026-03-10 11:57:18.113155+05:30
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification (id, "to", channel, template, data, trigger_type, resource_id, resource_type, receiver_id, original_notification_id, idempotency_key, external_id, provider_id, created_at, updated_at, deleted_at, status, "from", provider_data) FROM stdin;
noti_01KN4PRR6N8YXXKC2X6JWV06EH		feed	admin-ui	{"file": {"url": "http://localhost:9000/static/private-1775053332622-1775053332621-product-exports.csv", "filename": "1775053332621-product-exports.csv", "mimeType": "text/csv"}, "title": "Product export", "description": "Product export completed successfully!"}	\N	\N	\N	\N	\N	\N	\N	local	2026-04-01 19:52:12.694+05:30	2026-04-01 19:52:12.709+05:30	\N	success	\N	\N
\.


--
-- Data for Name: notification_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification_provider (id, handle, name, is_enabled, channels, created_at, updated_at, deleted_at) FROM stdin;
local	local	local	t	{feed}	2026-03-10 11:57:20.297+05:30	2026-03-10 11:57:20.297+05:30	\N
\.


--
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."order" (id, region_id, display_id, customer_id, version, sales_channel_id, status, is_draft_order, email, currency_code, shipping_address_id, billing_address_id, no_notification, metadata, created_at, updated_at, deleted_at, canceled_at, custom_display_id, locale) FROM stdin;
\.


--
-- Data for Name: order_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_address (id, customer_id, company, first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_cart (order_id, cart_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_change; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_change (id, order_id, version, description, status, internal_note, created_by, requested_by, requested_at, confirmed_by, confirmed_at, declined_by, declined_reason, metadata, declined_at, canceled_by, canceled_at, created_at, updated_at, change_type, deleted_at, return_id, claim_id, exchange_id, carry_over_promotions) FROM stdin;
\.


--
-- Data for Name: order_change_action; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_change_action (id, order_id, version, ordering, order_change_id, reference, reference_id, action, details, amount, raw_amount, internal_note, applied, created_at, updated_at, deleted_at, return_id, claim_id, exchange_id) FROM stdin;
\.


--
-- Data for Name: order_claim; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_claim (id, order_id, return_id, order_version, display_id, type, no_notification, refund_amount, raw_refund_amount, metadata, created_at, updated_at, deleted_at, canceled_at, created_by) FROM stdin;
\.


--
-- Data for Name: order_claim_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_claim_item (id, claim_id, item_id, is_additional_item, reason, quantity, raw_quantity, note, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_claim_item_image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_claim_item_image (id, claim_item_id, url, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_credit_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_credit_line (id, order_id, reference, reference_id, amount, raw_amount, metadata, created_at, updated_at, deleted_at, version) FROM stdin;
\.


--
-- Data for Name: order_exchange; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_exchange (id, order_id, return_id, order_version, display_id, no_notification, allow_backorder, difference_due, raw_difference_due, metadata, created_at, updated_at, deleted_at, canceled_at, created_by) FROM stdin;
\.


--
-- Data for Name: order_exchange_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_exchange_item (id, exchange_id, item_id, quantity, raw_quantity, note, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_fulfillment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_fulfillment (order_id, fulfillment_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_item (id, order_id, version, item_id, quantity, raw_quantity, fulfilled_quantity, raw_fulfilled_quantity, shipped_quantity, raw_shipped_quantity, return_requested_quantity, raw_return_requested_quantity, return_received_quantity, raw_return_received_quantity, return_dismissed_quantity, raw_return_dismissed_quantity, written_off_quantity, raw_written_off_quantity, metadata, created_at, updated_at, deleted_at, delivered_quantity, raw_delivered_quantity, unit_price, raw_unit_price, compare_at_unit_price, raw_compare_at_unit_price) FROM stdin;
\.


--
-- Data for Name: order_line_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_line_item (id, totals_id, title, subtitle, thumbnail, variant_id, product_id, product_title, product_description, product_subtitle, product_type, product_collection, product_handle, variant_sku, variant_barcode, variant_title, variant_option_values, requires_shipping, is_discountable, is_tax_inclusive, compare_at_unit_price, raw_compare_at_unit_price, unit_price, raw_unit_price, metadata, created_at, updated_at, deleted_at, is_custom_price, product_type_id, is_giftcard) FROM stdin;
\.


--
-- Data for Name: order_line_item_adjustment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_line_item_adjustment (id, description, promotion_id, code, amount, raw_amount, provider_id, created_at, updated_at, item_id, deleted_at, is_tax_inclusive, version) FROM stdin;
\.


--
-- Data for Name: order_line_item_tax_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_line_item_tax_line (id, description, tax_rate_id, code, rate, raw_rate, provider_id, created_at, updated_at, item_id, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_payment_collection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_payment_collection (order_id, payment_collection_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_promotion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_promotion (order_id, promotion_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_shipping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_shipping (id, order_id, version, shipping_method_id, created_at, updated_at, deleted_at, return_id, claim_id, exchange_id) FROM stdin;
\.


--
-- Data for Name: order_shipping_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_shipping_method (id, name, description, amount, raw_amount, is_tax_inclusive, shipping_option_id, data, metadata, created_at, updated_at, deleted_at, is_custom_amount) FROM stdin;
\.


--
-- Data for Name: order_shipping_method_adjustment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_shipping_method_adjustment (id, description, promotion_id, code, amount, raw_amount, provider_id, created_at, updated_at, shipping_method_id, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_shipping_method_tax_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_shipping_method_tax_line (id, description, tax_rate_id, code, rate, raw_rate, provider_id, created_at, updated_at, shipping_method_id, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_summary; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_summary (id, order_id, version, totals, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_transaction (id, order_id, version, amount, raw_amount, currency_code, reference, reference_id, created_at, updated_at, deleted_at, return_id, claim_id, exchange_id) FROM stdin;
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment (id, amount, raw_amount, currency_code, provider_id, data, created_at, updated_at, deleted_at, captured_at, canceled_at, payment_collection_id, payment_session_id, metadata) FROM stdin;
\.


--
-- Data for Name: payment_collection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_collection (id, currency_code, amount, raw_amount, authorized_amount, raw_authorized_amount, captured_amount, raw_captured_amount, refunded_amount, raw_refunded_amount, created_at, updated_at, deleted_at, completed_at, status, metadata) FROM stdin;
pay_col_01KMYHPVE0C9Y7T3FMNNQKSR24	inr	299	{"value": "299", "precision": 20}	\N	\N	\N	\N	\N	\N	2026-03-30 10:28:20.992+05:30	2026-03-30 10:28:20.992+05:30	\N	\N	not_paid	\N
pay_col_01KMYHS90P51HEDZMMF7WQTVRN	inr	699	{"value": "699", "precision": 20}	\N	\N	\N	\N	\N	\N	2026-03-30 10:29:40.438+05:30	2026-03-30 10:34:13.442+05:30	\N	\N	not_paid	\N
\.


--
-- Data for Name: payment_collection_payment_providers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_collection_payment_providers (payment_collection_id, payment_provider_id) FROM stdin;
\.


--
-- Data for Name: payment_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_provider (id, is_enabled, created_at, updated_at, deleted_at) FROM stdin;
pp_system_default	t	2026-03-10 11:57:20.293+05:30	2026-03-10 11:57:20.293+05:30	\N
pp_razorpay_razorpay	t	2026-03-18 13:51:42.406+05:30	2026-03-18 13:51:42.406+05:30	\N
\.


--
-- Data for Name: payment_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_session (id, currency_code, amount, raw_amount, provider_id, data, context, status, authorized_at, payment_collection_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: price; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price (id, title, price_set_id, currency_code, raw_amount, rules_count, created_at, updated_at, deleted_at, price_list_id, amount, min_quantity, max_quantity, raw_min_quantity, raw_max_quantity) FROM stdin;
price_01KKGFHZRETSGPVVTH33BTKHKX	\N	pset_01KKGFHZRECH6NJ67B763BPCYT	eur	{"value": "232", "precision": 20}	0	2026-03-12 13:05:40.558+05:30	2026-03-12 13:05:40.558+05:30	\N	\N	232	\N	\N	\N	\N
price_01KKGG1ZY9RSJXGJWXKPKQVPNQ	\N	pset_01KKGG1ZY99X1555RKVHR1QH2K	eur	{"value": "999", "precision": 20}	0	2026-03-12 13:14:25.033+05:30	2026-03-12 13:14:25.033+05:30	\N	\N	999	\N	\N	\N	\N
price_01KKB6VT5Y29RHX5NG79PMZXRY	\N	pset_01KKB6VT5YPEDGRWFE8S0R5Z76	inr	{"value": "299", "precision": 20}	0	2026-03-10 11:57:33.183+05:30	2026-03-12 16:02:38.029+05:30	2026-03-12 16:02:38.027+05:30	\N	299	\N	\N	\N	\N
price_01KKB6VT86ZZZQWK6RKD0ENYJS	\N	pset_01KKB6VT86R9TQ73WRP5GCK4GK	inr	{"value": "899", "precision": 20}	0	2026-03-10 11:57:33.254+05:30	2026-03-12 16:02:40.98+05:30	2026-03-12 16:02:40.978+05:30	\N	899	\N	\N	\N	\N
price_01KKB6VT98V8JNTQCPWZKP2AEQ	\N	pset_01KKB6VT98JKKJ5M3E38DT431A	inr	{"value": "999", "precision": 20}	0	2026-03-10 11:57:33.288+05:30	2026-03-12 16:02:43.145+05:30	2026-03-12 16:02:43.141+05:30	\N	999	\N	\N	\N	\N
price_01KKB6VTAJ6ZTAAB7HM0J7X6Z9	\N	pset_01KKB6VTAJMR6W10Q248MXKEXY	inr	{"value": "899", "precision": 20}	0	2026-03-10 11:57:33.331+05:30	2026-03-12 16:02:45.859+05:30	2026-03-12 16:02:45.856+05:30	\N	899	\N	\N	\N	\N
price_01KKB6VTBJKVZASZCBQBX2M2JZ	\N	pset_01KKB6VTBJAAG9R6QSY42N65KR	inr	{"value": "999", "precision": 20}	0	2026-03-10 11:57:33.362+05:30	2026-03-12 16:02:48.985+05:30	2026-03-12 16:02:48.983+05:30	\N	999	\N	\N	\N	\N
price_01KKB6VTCF7CS54RWD6DF8VK6S	\N	pset_01KKB6VTCF190QVWVWB1CBMX1R	inr	{"value": "699", "precision": 20}	0	2026-03-10 11:57:33.391+05:30	2026-03-12 16:03:09.177+05:30	2026-03-12 16:03:09.174+05:30	\N	699	\N	\N	\N	\N
price_01KKGV82SE1FD88RW6PAS0Z6SD	\N	pset_01KKGT0Q3A7YEG81665WS3A9AW	eur	{"value": "333", "precision": 20}	0	2026-03-12 16:29:58.899+05:30	2026-03-12 16:29:58.899+05:30	\N	\N	333	\N	\N	\N	\N
price_01KKGVWKKGBBNA6Y2AN7QDN2Q4	\N	pset_01KKGT0Q3A7YEG81665WS3A9AW	inr	{"value": "899", "precision": 20}	0	2026-03-12 16:41:11.473+05:30	2026-03-12 16:41:11.473+05:30	\N	\N	899	\N	\N	\N	\N
price_01KKGV82SFFG7BMCQM3Z0EB14T	\N	pset_01KKGT0Q3A7YEG81665WS3A9AW	inr	{"value": "9990", "precision": 20}	1	2026-03-12 16:29:58.899+05:30	2026-03-12 16:41:30.408+05:30	\N	\N	9990	\N	\N	\N	\N
price_01KKTF6N80H8YM1G2H9D0MSRFG	\N	pset_01KKGFD3Z0AA9TS84EE4TJZ2DZ	inr	{"value": "1299", "precision": 20}	0	2026-03-16 10:11:53.666+05:30	2026-03-16 10:11:53.666+05:30	\N	\N	1299	\N	\N	\N	\N
price_01KKTF7KCG05SKV46YV2ZJDMZG	\N	pset_01KKGFEDQ80CPB3MQMX7AH9EY5	inr	{"value": "299", "precision": 20}	0	2026-03-16 10:12:24.53+05:30	2026-03-16 10:12:24.53+05:30	\N	\N	299	\N	\N	\N	\N
price_01KKTFB31J0S0PWE25DM0PFZF3	\N	pset_01KKGFHZRECH6NJ67B763BPCYT	inr	{"value": "999", "precision": 20}	0	2026-03-16 10:14:18.866+05:30	2026-03-16 10:14:18.866+05:30	\N	\N	999	\N	\N	\N	\N
price_01KKTFBYM3ARTVMER1CX6BPMBA	\N	pset_01KKGFQ2QQQPJQ7AKD8VXPJJRB	inr	{"value": "999", "precision": 20}	0	2026-03-16 10:14:47.108+05:30	2026-03-16 10:14:47.108+05:30	\N	\N	999	\N	\N	\N	\N
price_01KKTFCQNE3NFT2F52669RPDQZ	\N	pset_01KKGFS55XEJR6DQSE1AD8JTMN	inr	{"value": "999", "precision": 20}	0	2026-03-16 10:15:12.752+05:30	2026-03-16 10:15:12.752+05:30	\N	\N	999	\N	\N	\N	\N
price_01KKTFDCKEJ70BEVD93CXK5D47	\N	pset_01KKGG1ZY99X1555RKVHR1QH2K	inr	{"value": "599", "precision": 20}	0	2026-03-16 10:15:34.19+05:30	2026-03-16 10:15:34.19+05:30	\N	\N	599	\N	\N	\N	\N
price_01KKTFE0YWJW4B2SWD7BC9J653	\N	pset_01KKGGBWRR04B0V09J6JRBGR9E	inr	{"value": "1499", "precision": 20}	0	2026-03-16 10:15:55.037+05:30	2026-03-16 10:15:55.037+05:30	\N	\N	1499	\N	\N	\N	\N
price_01KKTFEPQH3701SPDPT6HNND97	\N	pset_01KKGGCYSZD6FPVW7A656K81GA	inr	{"value": "299", "precision": 20}	0	2026-03-16 10:16:17.331+05:30	2026-03-16 10:16:17.331+05:30	\N	\N	299	\N	\N	\N	\N
price_01KKTFFCH6C85JPYXW3KMYYEHV	\N	pset_01KKGGDSJ1EF1AP0XT83V82GVP	inr	{"value": "299", "precision": 20}	0	2026-03-16 10:16:39.655+05:30	2026-03-16 10:16:39.655+05:30	\N	\N	299	\N	\N	\N	\N
price_01KKTFG03FWGA5FFTND4TN37J3	\N	pset_01KKGGETKZX9YMBF0NWNR7EAJ4	inr	{"value": "299", "precision": 20}	0	2026-03-16 10:16:59.697+05:30	2026-03-16 10:16:59.697+05:30	\N	\N	299	\N	\N	\N	\N
price_01KKTFGHYBRM8J2R4WET531SWV	\N	pset_01KKGGGSA5GJ9RFCFB59H7ZXJE	inr	{"value": "2999", "precision": 20}	0	2026-03-16 10:17:17.965+05:30	2026-03-16 10:17:17.965+05:30	\N	\N	2999	\N	\N	\N	\N
price_01KKTFJ4FTZMDBZEZZE7VVMK0N	\N	pset_01KKGGSX7EC6X1H3CJPY04V5GK	inr	{"value": "1499", "precision": 20}	0	2026-03-16 10:18:09.723+05:30	2026-03-16 10:18:09.723+05:30	\N	\N	1499	\N	\N	\N	\N
price_01KKTFJN4DMAB2V057ZAWH8N56	\N	pset_01KKGGTJRVBPMNBPJQMPZEMS3X	inr	{"value": "499", "precision": 20}	0	2026-03-16 10:18:26.766+05:30	2026-03-16 10:18:26.766+05:30	\N	\N	499	\N	\N	\N	\N
price_01KKTFKAA3H1MJ64CR43CM21CM	\N	pset_01KKGH7HJJ4B1F9CA998A2A5ZB	inr	{"value": "1499", "precision": 20}	0	2026-03-16 10:18:48.453+05:30	2026-03-16 10:18:48.453+05:30	\N	\N	1499	\N	\N	\N	\N
price_01KKTFM1AMWNWBATV96D2WHACA	\N	pset_01KKGH86D7VJX9Y8THV8S4SDM3	inr	{"value": "499", "precision": 20}	0	2026-03-16 10:19:12.021+05:30	2026-03-16 10:19:12.021+05:30	\N	\N	499	\N	\N	\N	\N
price_01KKTFMTHDG1GD5X2KY42JM2R1	\N	pset_01KKGH9BDQTV7S85K4G7AVP2KX	inr	{"value": "699", "precision": 20}	0	2026-03-16 10:19:37.839+05:30	2026-03-16 10:19:37.839+05:30	\N	\N	699	\N	\N	\N	\N
price_01KKTFNH8BH586KJY9CFEV7AT1	\N	pset_01KKGHA01DGX2ZS08W6R70JZX2	inr	{"value": "999", "precision": 20}	0	2026-03-16 10:20:01.101+05:30	2026-03-16 10:20:01.101+05:30	\N	\N	999	\N	\N	\N	\N
price_01KKTFP92GA1RC2JFDYAS7362S	\N	pset_01KKGHBHKCD32VX7Q1155EXC6J	inr	{"value": "1499", "precision": 20}	0	2026-03-16 10:20:25.489+05:30	2026-03-16 10:20:25.489+05:30	\N	\N	1499	\N	\N	\N	\N
price_01KKTFVZBBA6684X9KY02VQP9K	\N	pset_01KKGHEGRRDBX41P4RZF5WGMFB	inr	{"value": "1499", "precision": 20}	0	2026-03-16 10:23:32.141+05:30	2026-03-16 10:23:32.141+05:30	\N	\N	1499	\N	\N	\N	\N
price_01KKTJ55QH4H1BNYA8RCM534NY	\N	pset_01KKGHGGHKB957PSJN4XGHX5SJ	inr	{"value": "599", "precision": 20}	0	2026-03-16 11:03:30.739+05:30	2026-03-16 11:03:30.739+05:30	\N	\N	599	\N	\N	\N	\N
price_01KKTJ5TJYGK63D7CXEWEHVJ6E	\N	pset_01KKGHGZ2YXETBK6H4PG7YMMT0	inr	{"value": "1499", "precision": 20}	0	2026-03-16 11:03:52.096+05:30	2026-03-16 11:03:52.096+05:30	\N	\N	1499	\N	\N	\N	\N
price_01KKTJ6E52GHM9568T514WA1SA	\N	pset_01KKGHHPXXWPYDYH8NZXPDWKR4	inr	{"value": "299", "precision": 20}	0	2026-03-16 11:04:12.131+05:30	2026-03-16 11:04:12.131+05:30	\N	\N	299	\N	\N	\N	\N
price_01KKTJG5HB91R1CV235XPNCA47	\N	pset_01KKGEV0WWTGNQDTXVECXSWYHD	inr	{"value": "599", "precision": 20}	0	2026-03-16 11:09:30.989+05:30	2026-03-16 11:09:30.989+05:30	\N	\N	599	\N	\N	\N	\N
price_01KKTJGZP7TPP0WD2EFN7SSASZ	\N	pset_01KKGF0K08AQ5G53G682WTQQJF	inr	{"value": "999", "precision": 20}	0	2026-03-16 11:09:57.768+05:30	2026-03-16 11:09:57.768+05:30	\N	\N	999	\N	\N	\N	\N
price_01KKTJK316K9111X8R5FWSFKV6	\N	pset_01KKGHC40SYJ1RNBQ7MZFE56QG	inr	{"value": "699", "precision": 20}	0	2026-03-16 11:11:06.728+05:30	2026-03-16 11:11:06.728+05:30	\N	\N	699	\N	\N	\N	\N
price_01KKTNFA4AM24Q2C2VTTFE3JTZ	\N	pset_01KKTNFA4AKA90RBEDX3FXGVGS	inr	{"value": "899", "precision": 20}	0	2026-03-16 12:01:28.65+05:30	2026-03-16 12:45:00.566+05:30	2026-03-16 12:45:00.561+05:30	\N	899	\N	\N	\N	\N
price_01KKTKY8PWFF6TDY4QAE9YQYVY	\N	pset_01KKK08Q8GJJ6R6ZZWV2W4RM31	inr	{"value": "499", "precision": 20}	0	2026-03-16 11:34:41.566+05:30	2026-03-16 12:47:39.997+05:30	2026-03-16 12:47:39.993+05:30	\N	499	\N	\N	\N	\N
price_01KKTQ8QS9KZ4WWV990N438TY7	\N	pset_01KKTQ8QS90E58VF9AMC6S304F	inr	{"value": "599", "precision": 20}	0	2026-03-16 12:32:50.409+05:30	2026-03-16 13:53:00.435+05:30	2026-03-16 13:53:00.429+05:30	\N	599	\N	\N	\N	\N
price_01KKTQC8398VPJ2AFRSNYPB8M2	\N	pset_01KKTQC839KYMWHRS6HJCCPAX8	inr	{"value": "1699", "precision": 20}	0	2026-03-16 12:34:45.417+05:30	2026-03-16 13:55:29.202+05:30	2026-03-16 13:55:29.199+05:30	\N	1699	\N	\N	\N	\N
price_01KKTNA7NSY4VZKJH3ENBC589X	\N	pset_01KKTNA7NSJX5KCYAYPCGGS6K9	inr	{"value": "899", "precision": 20}	0	2026-03-16 11:58:42.297+05:30	2026-03-16 14:54:58.151+05:30	2026-03-16 14:54:58.147+05:30	\N	899	\N	\N	\N	\N
price_01KKTWER1HTKCBMWKY7GKVCDSC	\N	pset_01KKTWER1HWDK1949ST4MM5J1V	inr	{"value": "499", "precision": 20}	0	2026-03-16 14:03:30.162+05:30	2026-03-16 14:03:30.162+05:30	\N	\N	499	\N	\N	\N	\N
price_01KKTR6NEK4VF1WGGCZRPP7MX9	\N	pset_01KKTR6NEK2DA8X2RQX8D8MFJE	inr	{"value": "1649", "precision": 20}	1	2026-03-16 12:49:11.059+05:30	2026-03-16 14:06:17.014+05:30	\N	\N	1649	\N	\N	\N	\N
price_01KKTX66N3832D6NK1695GDZZA	\N	pset_01KKTR6NEK2DA8X2RQX8D8MFJE	inr	{"value": "1649", "precision": 20}	0	2026-03-16 14:16:18.789+05:30	2026-03-16 14:16:18.789+05:30	\N	\N	1649	\N	\N	\N	\N
price_01KKTYFCQYBW1FY16VQGWM79EX	\N	pset_01KKTYFCQYNFG9SKWXJGMBPB1F	inr	{"value": "999", "precision": 20}	0	2026-03-16 14:38:48.511+05:30	2026-03-16 14:40:19.842+05:30	2026-03-16 14:40:19.83+05:30	\N	999	\N	\N	\N	\N
price_01KKTYNXX7M1XAQN89W9XDRMSF	\N	pset_01KKTYN1V0DSA87VB92R79ZSMN	inr	{"value": "599", "precision": 20}	0	2026-03-16 14:42:22.696+05:30	2026-03-16 14:46:32.031+05:30	2026-03-16 14:46:32.03+05:30	\N	599	\N	\N	\N	\N
price_01KKTZ7JQK81KT34DWF1NSA49Z	\N	pset_01KKTZ7JQMBYK90THA8TDMR1DK	inr	{"value": "999", "precision": 20}	1	2026-03-16 14:52:01.076+05:30	2026-03-16 14:52:01.076+05:30	\N	\N	999	\N	\N	\N	\N
price_01KKTZ937V7T74WWZX1TQP8K03	\N	pset_01KKTZ937W6ENYAZZPQBY583KZ	inr	{"value": "599", "precision": 20}	0	2026-03-16 14:52:50.748+05:30	2026-03-16 14:52:50.748+05:30	\N	\N	599	\N	\N	\N	\N
price_01KKTZGMNEEHHZCZZAM5RYCNDE	\N	pset_01KKTZGMNESN2XC94297D21PKK	inr	{"value": "1649", "precision": 20}	1	2026-03-16 14:56:57.967+05:30	2026-03-16 15:09:27.612+05:30	2026-03-16 15:09:27.609+05:30	\N	1649	\N	\N	\N	\N
price_01KKTZJP6R7FC8A563FWQ40YNE	\N	pset_01KKTZJP6RQ96VBDX2TGCWTGEQ	inr	{"value": "899", "precision": 20}	1	2026-03-16 14:58:05.08+05:30	2026-03-16 15:09:27.617+05:30	2026-03-16 15:09:27.609+05:30	\N	899	\N	\N	\N	\N
price_01KKV08VF65XJ8Q02RB8DYH1SV	\N	pset_01KKV08VF6RZ18D0FKBWJSHEN8	inr	{"value": "899", "precision": 20}	1	2026-03-16 15:10:11.367+05:30	2026-03-16 15:10:11.367+05:30	\N	\N	899	\N	\N	\N	\N
price_01KKV0BYQF2GV1E548JXR8HQMQ	\N	pset_01KKV0BYQFZ5SZD1DF9BMMXYFY	inr	{"value": "1649", "precision": 20}	1	2026-03-16 15:11:53.007+05:30	2026-03-16 15:11:53.007+05:30	\N	\N	1649	\N	\N	\N	\N
price_01KKV0J50DBPYD9JKBR5KG3D4X	\N	pset_01KKV0J50DWYZPPJDPV6KD7F4V	inr	{"value": "2398", "precision": 20}	1	2026-03-16 15:15:16.045+05:30	2026-03-16 15:15:16.045+05:30	\N	\N	2398	\N	\N	\N	\N
price_01KKV0KMG055B5KQSQT39VHZ75	\N	pset_01KKV0KMG059BFC3YV0KDA3VXX	inr	{"value": "1699", "precision": 20}	1	2026-03-16 15:16:04.672+05:30	2026-03-16 15:16:04.672+05:30	\N	\N	1699	\N	\N	\N	\N
price_01KMQ4W166NMWHD5WQHVX63A67	\N	pset_01KMQ4W166G1H3QH38VTZF639Z	inr	{"value": "0", "precision": 20}	0	2026-03-27 13:29:18.214+05:30	2026-03-27 13:29:18.214+05:30	\N	\N	0	\N	\N	\N	\N
price_01KMYGBJHAH7ZXHNRWAFYZYVAA	\N	pset_01KMYGBJHAZDWKS1MHRTYCNND4	inr	{"value": "0", "precision": 20}	0	2026-03-30 10:04:42.858+05:30	2026-03-30 10:04:42.858+05:30	\N	\N	0	\N	\N	\N	\N
\.


--
-- Data for Name: price_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_list (id, status, starts_at, ends_at, rules_count, title, description, type, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: price_list_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_list_rule (id, price_list_id, created_at, updated_at, deleted_at, value, attribute) FROM stdin;
\.


--
-- Data for Name: price_preference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_preference (id, attribute, value, is_tax_inclusive, created_at, updated_at, deleted_at) FROM stdin;
prpref_01KKB6VT317AGHZRY2V1P1FSAQ	currency_code	eur	f	2026-03-10 11:57:33.089+05:30	2026-03-10 11:57:33.089+05:30	\N
prpref_01KKGV0WTDHAJH0ZQWQFXGFKDW	currency_code	inr	f	2026-03-12 16:26:03.405+05:30	2026-03-12 16:26:03.405+05:30	\N
\.


--
-- Data for Name: price_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_rule (id, value, priority, price_id, created_at, updated_at, deleted_at, attribute, operator) FROM stdin;
prule_01KKGVX631V55Q44DK1GZREB52	reg_01KKB79PXYZ123	0	price_01KKGV82SFFG7BMCQM3Z0EB14T	2026-03-12 16:41:30.408+05:30	2026-03-12 16:41:30.408+05:30	\N	region_id	eq
prule_01KKTX66N3XA03BSV101PX2SBH	reg_01KKB79PXYZ123	0	price_01KKTR6NEK4VF1WGGCZRPP7MX9	2026-03-16 14:16:18.789+05:30	2026-03-16 14:16:18.789+05:30	\N	region_id	eq
prule_01KKTZ7JQKBVGEGS3TR1AE7VYA	reg_01KKB79PXYZ123	0	price_01KKTZ7JQK81KT34DWF1NSA49Z	2026-03-16 14:52:01.076+05:30	2026-03-16 14:52:01.076+05:30	\N	region_id	eq
prule_01KKTZGMNEZFHNETZXTR2Y9JSD	reg_01KKB79PXYZ123	0	price_01KKTZGMNEEHHZCZZAM5RYCNDE	2026-03-16 14:56:57.967+05:30	2026-03-16 15:09:27.614+05:30	2026-03-16 15:09:27.609+05:30	region_id	eq
prule_01KKTZJP6R64K932G5M4VW5HW5	reg_01KKB79PXYZ123	0	price_01KKTZJP6R7FC8A563FWQ40YNE	2026-03-16 14:58:05.08+05:30	2026-03-16 15:09:27.618+05:30	2026-03-16 15:09:27.609+05:30	region_id	eq
prule_01KKV08VF6QYT45NWJQ8EZEKHT	reg_01KKB79PXYZ123	0	price_01KKV08VF65XJ8Q02RB8DYH1SV	2026-03-16 15:10:11.367+05:30	2026-03-16 15:10:11.367+05:30	\N	region_id	eq
prule_01KKV0BYQFMAKFRPGXPT4J81RA	reg_01KKB79PXYZ123	0	price_01KKV0BYQF2GV1E548JXR8HQMQ	2026-03-16 15:11:53.007+05:30	2026-03-16 15:11:53.007+05:30	\N	region_id	eq
prule_01KKV0J50DKD6J27VYDQVJ1PW2	reg_01KKB79PXYZ123	0	price_01KKV0J50DBPYD9JKBR5KG3D4X	2026-03-16 15:15:16.046+05:30	2026-03-16 15:15:16.046+05:30	\N	region_id	eq
prule_01KKV0KMG0G05F75S6NWV44MRT	reg_01KKB79PXYZ123	0	price_01KKV0KMG055B5KQSQT39VHZ75	2026-03-16 15:16:04.672+05:30	2026-03-16 15:16:04.672+05:30	\N	region_id	eq
\.


--
-- Data for Name: price_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_set (id, created_at, updated_at, deleted_at) FROM stdin;
pset_01KKGEV0WWTGNQDTXVECXSWYHD	2026-03-12 12:53:08.06+05:30	2026-03-12 12:53:08.06+05:30	\N
pset_01KKGF0K08AQ5G53G682WTQQJF	2026-03-12 12:56:10.44+05:30	2026-03-12 12:56:10.44+05:30	\N
pset_01KKGFD3Z0AA9TS84EE4TJZ2DZ	2026-03-12 13:03:01.024+05:30	2026-03-12 13:03:01.024+05:30	\N
pset_01KKGFEDQ80CPB3MQMX7AH9EY5	2026-03-12 13:03:43.784+05:30	2026-03-12 13:03:43.784+05:30	\N
pset_01KKGFHZRECH6NJ67B763BPCYT	2026-03-12 13:05:40.558+05:30	2026-03-12 13:05:40.558+05:30	\N
pset_01KKGFQ2QQQPJQ7AKD8VXPJJRB	2026-03-12 13:08:27.447+05:30	2026-03-12 13:08:27.447+05:30	\N
pset_01KKGFS55XEJR6DQSE1AD8JTMN	2026-03-12 13:09:35.486+05:30	2026-03-12 13:09:35.486+05:30	\N
pset_01KKGG1ZY99X1555RKVHR1QH2K	2026-03-12 13:14:25.033+05:30	2026-03-12 13:14:25.033+05:30	\N
pset_01KKGGBWRR04B0V09J6JRBGR9E	2026-03-12 13:19:49.464+05:30	2026-03-12 13:19:49.464+05:30	\N
pset_01KKGGCYSZD6FPVW7A656K81GA	2026-03-12 13:20:24.319+05:30	2026-03-12 13:20:24.319+05:30	\N
pset_01KKGGDSJ1EF1AP0XT83V82GVP	2026-03-12 13:20:51.713+05:30	2026-03-12 13:20:51.713+05:30	\N
pset_01KKGGETKZX9YMBF0NWNR7EAJ4	2026-03-12 13:21:25.567+05:30	2026-03-12 13:21:25.567+05:30	\N
pset_01KKGGGSA5GJ9RFCFB59H7ZXJE	2026-03-12 13:22:29.765+05:30	2026-03-12 13:22:29.765+05:30	\N
pset_01KKGGSX7EC6X1H3CJPY04V5GK	2026-03-12 13:27:28.686+05:30	2026-03-12 13:27:28.686+05:30	\N
pset_01KKGGTJRVBPMNBPJQMPZEMS3X	2026-03-12 13:27:50.747+05:30	2026-03-12 13:27:50.747+05:30	\N
pset_01KKGH7HJJ4B1F9CA998A2A5ZB	2026-03-12 13:34:55.506+05:30	2026-03-12 13:34:55.506+05:30	\N
pset_01KKGH86D7VJX9Y8THV8S4SDM3	2026-03-12 13:35:16.839+05:30	2026-03-12 13:35:16.839+05:30	\N
pset_01KKGH9BDQTV7S85K4G7AVP2KX	2026-03-12 13:35:54.743+05:30	2026-03-12 13:35:54.743+05:30	\N
pset_01KKGHA01DGX2ZS08W6R70JZX2	2026-03-12 13:36:15.854+05:30	2026-03-12 13:36:15.854+05:30	\N
pset_01KKGHBHKCD32VX7Q1155EXC6J	2026-03-12 13:37:06.604+05:30	2026-03-12 13:37:06.604+05:30	\N
pset_01KKGHC40SYJ1RNBQ7MZFE56QG	2026-03-12 13:37:25.466+05:30	2026-03-12 13:37:25.466+05:30	\N
pset_01KKGHEGRRDBX41P4RZF5WGMFB	2026-03-12 13:38:44.056+05:30	2026-03-12 13:38:44.056+05:30	\N
pset_01KKGHGGHKB957PSJN4XGHX5SJ	2026-03-12 13:39:49.363+05:30	2026-03-12 13:39:49.363+05:30	\N
pset_01KKGHGZ2YXETBK6H4PG7YMMT0	2026-03-12 13:40:04.254+05:30	2026-03-12 13:40:04.254+05:30	\N
pset_01KKGHHPXXWPYDYH8NZXPDWKR4	2026-03-12 13:40:28.669+05:30	2026-03-12 13:40:28.669+05:30	\N
pset_01KKBDMEQMBYCVS6C3832CD7WX	2026-03-10 13:55:52.117+05:30	2026-03-12 16:02:32.64+05:30	2026-03-12 16:02:32.639+05:30
pset_01KKB6VT5YPEDGRWFE8S0R5Z76	2026-03-10 11:57:33.183+05:30	2026-03-12 16:02:38.027+05:30	2026-03-12 16:02:38.027+05:30
pset_01KKB6VT86R9TQ73WRP5GCK4GK	2026-03-10 11:57:33.254+05:30	2026-03-12 16:02:40.978+05:30	2026-03-12 16:02:40.978+05:30
pset_01KKB6VT98JKKJ5M3E38DT431A	2026-03-10 11:57:33.288+05:30	2026-03-12 16:02:43.141+05:30	2026-03-12 16:02:43.141+05:30
pset_01KKB6VTAJMR6W10Q248MXKEXY	2026-03-10 11:57:33.331+05:30	2026-03-12 16:02:45.856+05:30	2026-03-12 16:02:45.856+05:30
pset_01KKB6VTBJAAG9R6QSY42N65KR	2026-03-10 11:57:33.362+05:30	2026-03-12 16:02:48.984+05:30	2026-03-12 16:02:48.983+05:30
pset_01KKB937DEXCZKSFWR9YHA5BZX	2026-03-10 12:36:33.262+05:30	2026-03-12 16:02:51.644+05:30	2026-03-12 16:02:51.643+05:30
pset_01KKB6VTCF190QVWVWB1CBMX1R	2026-03-10 11:57:33.391+05:30	2026-03-12 16:03:09.174+05:30	2026-03-12 16:03:09.174+05:30
pset_01KKGT0Q3A7YEG81665WS3A9AW	2026-03-12 16:08:28.97+05:30	2026-03-12 16:08:28.97+05:30	\N
pset_01KKTNFA4AKA90RBEDX3FXGVGS	2026-03-16 12:01:28.65+05:30	2026-03-16 12:45:00.561+05:30	2026-03-16 12:45:00.561+05:30
pset_01KKK08Q8GJJ6R6ZZWV2W4RM31	2026-03-13 12:36:11.6+05:30	2026-03-16 12:47:39.993+05:30	2026-03-16 12:47:39.993+05:30
pset_01KKTR6NEK2DA8X2RQX8D8MFJE	2026-03-16 12:49:11.059+05:30	2026-03-16 12:49:11.059+05:30	\N
pset_01KKTQ8QS90E58VF9AMC6S304F	2026-03-16 12:32:50.409+05:30	2026-03-16 13:53:00.429+05:30	2026-03-16 13:53:00.429+05:30
pset_01KKTQC839KYMWHRS6HJCCPAX8	2026-03-16 12:34:45.417+05:30	2026-03-16 13:55:29.199+05:30	2026-03-16 13:55:29.199+05:30
pset_01KKTWER1HWDK1949ST4MM5J1V	2026-03-16 14:03:30.161+05:30	2026-03-16 14:03:30.161+05:30	\N
pset_01KKTYFCQYNFG9SKWXJGMBPB1F	2026-03-16 14:38:48.51+05:30	2026-03-16 14:40:19.83+05:30	2026-03-16 14:40:19.83+05:30
pset_01KKTYN1V0DSA87VB92R79ZSMN	2026-03-16 14:41:53.953+05:30	2026-03-16 14:46:32.03+05:30	2026-03-16 14:46:32.03+05:30
pset_01KKTZ7JQMBYK90THA8TDMR1DK	2026-03-16 14:52:01.076+05:30	2026-03-16 14:52:01.076+05:30	\N
pset_01KKTZ937W6ENYAZZPQBY583KZ	2026-03-16 14:52:50.748+05:30	2026-03-16 14:52:50.748+05:30	\N
pset_01KKTNA7NSJX5KCYAYPCGGS6K9	2026-03-16 11:58:42.297+05:30	2026-03-16 14:54:58.147+05:30	2026-03-16 14:54:58.147+05:30
pset_01KKTZGMNESN2XC94297D21PKK	2026-03-16 14:56:57.967+05:30	2026-03-16 15:09:27.609+05:30	2026-03-16 15:09:27.609+05:30
pset_01KKTZJP6RQ96VBDX2TGCWTGEQ	2026-03-16 14:58:05.08+05:30	2026-03-16 15:09:27.614+05:30	2026-03-16 15:09:27.609+05:30
pset_01KKV08VF6RZ18D0FKBWJSHEN8	2026-03-16 15:10:11.367+05:30	2026-03-16 15:10:11.367+05:30	\N
pset_01KKV0BYQFZ5SZD1DF9BMMXYFY	2026-03-16 15:11:53.007+05:30	2026-03-16 15:11:53.007+05:30	\N
pset_01KKV0J50DWYZPPJDPV6KD7F4V	2026-03-16 15:15:16.045+05:30	2026-03-16 15:15:16.045+05:30	\N
pset_01KKV0KMG059BFC3YV0KDA3VXX	2026-03-16 15:16:04.672+05:30	2026-03-16 15:16:04.672+05:30	\N
pset_01KMQ4W166G1H3QH38VTZF639Z	2026-03-27 13:29:18.214+05:30	2026-03-27 13:29:18.214+05:30	\N
pset_01KMYGBJHAZDWKS1MHRTYCNND4	2026-03-30 10:04:42.858+05:30	2026-03-30 10:04:42.858+05:30	\N
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (id, title, handle, subtitle, description, is_giftcard, status, thumbnail, weight, length, height, width, origin_country, hs_code, mid_code, material, collection_id, type_id, discountable, external_id, created_at, updated_at, deleted_at, metadata) FROM stdin;
prod_01KKGEV0T2SE3CBBTHBSCDX5S3	Tiger Eye Locket(self-esteem and confidence)	tiger-eye-locketself-esteem-and-confidence	₹599.00	\N	f	published	http://localhost:9000/static/1773300187949-1-22.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 12:53:07.973+05:30	2026-03-12 12:54:01.257+05:30	\N	\N
prod_01KKGF0JXXE36GBNN7GRRZ0J6F	Tiger Eye Natural Bracelet	tiger-eye-natural-bracelet			f	published	http://localhost:9000/static/1773300370343-1-23.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 12:56:10.37+05:30	2026-03-12 12:56:10.37+05:30	\N	\N
prod_01KKGFD3XJW2DF5NM4N9NH3BPB	MONEY PYRAMID & SELENITE (CHARGING) PLATE COMBO	money-pyramid-selenite-charging-plate-combo			f	published	http://localhost:9000/static/1773300780960-4.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:03:00.982+05:30	2026-03-12 13:03:00.982+05:30	\N	\N
prod_01KKGFEDP1B71M6E0VAXVCD132	PYRITE – MONEY KEYCHAIN ( 1 piece)- Assorted	pyrite-money-keychain-1-piece-assorted			f	published	http://localhost:9000/static/1773300823720-1-e1757322710183.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:03:43.746+05:30	2026-03-12 13:03:43.746+05:30	\N	\N
prod_01KKGFHZPZ4ZYDZ8DBZ5Q8CFF5	Amethyst natural Bracelett	amethyst-natural-bracelett			f	published	http://localhost:9000/static/1773300940495-2-21.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	2026-03-12 13:05:40.513+05:30	2026-03-12 13:05:40.513+05:30	\N	\N
prod_01KKGFQ2PBH10AEGGBY47EGDWD	Rose Quartz natural Bracelett	rose-quartz-natural-bracelett	₹999.00		f	published	http://localhost:9000/static/1773301107390-1-26.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:08:27.406+05:30	2026-03-12 13:08:27.406+05:30	\N	\N
prod_01KKGFS54N6JFJ00AN1X0B778M	Money Magnet	money-magnet	₹599.00	₹599.00	f	published	http://localhost:9000/static/1773301175433-2-3.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:09:35.447+05:30	2026-03-12 13:09:35.447+05:30	\N	\N
prod_01KKGG1ZW550D0X09AD05PFNJD	Crystal Charger – Selenite Plate	crystal-charger-selenite-plate			f	published	http://localhost:9000/static/1773301464931-1-27.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:14:24.967+05:30	2026-03-12 13:14:24.967+05:30	\N	\N
prod_01KKGGBWPWW603YYCM9QSA8M8F	Rose Quartz Pyramid	rose-quartz-pyramid			f	published	http://localhost:9000/static/1773301789385-3-3.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:19:49.408+05:30	2026-03-12 13:19:49.408+05:30	\N	\N
prod_01KKGGCYRS02FZPXSS5E81Z0VT	BLACK OBSIDIAN TUMBLES (Negativity/ Evil Eye)	black-obsidian-tumbles-negativity-evil-eye			f	published	http://localhost:9000/static/1773301824262-2-5.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:20:24.283+05:30	2026-03-12 13:20:24.283+05:30	\N	\N
prod_01KKGGDSGZAQA07E2W95SYWFJY	AMETHYST TUMBLES (Peace and Anxiety)	amethyst-tumbles-peace-and-anxiety			f	published	http://localhost:9000/static/1773301851661-1-6.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:20:51.681+05:30	2026-03-12 13:20:51.681+05:30	\N	\N
prod_01KKGGETJS4R9WWQDEZXVC6YKP	ROSE QUARTZ TUMBLES (LOVE/RELATIONSHIPS)	rose-quartz-tumbles-loverelationships			f	published	http://localhost:9000/static/1773301885501-1-7.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:21:25.531+05:30	2026-03-12 13:21:25.531+05:30	\N	\N
prod_01KKGGGS8V9GRPDY2RM0EX5T8V	Riche Rich	riche-rich			f	published	http://localhost:9000/static/1773301949707-photo-4.png	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:22:29.725+05:30	2026-03-12 13:22:29.725+05:30	\N	\N
prod_01KKGGSX663XAWMPZPXXZ152T0	Pyrite Natural Bracelet	pyrite-natural-bracelet			f	published	http://localhost:9000/static/1773302248632-3-8.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:27:28.647+05:30	2026-03-12 13:27:28.647+05:30	\N	\N
prod_01KKGGTJQV56K1RZXS5PVCR33Q	Sage sticks ( Negativity Removal)	sage-sticks-negativity-removal			f	published	http://localhost:9000/static/1773302270695-1-10.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:27:50.717+05:30	2026-03-12 13:27:50.717+05:30	\N	\N
prod_01KKGH7HHH2ZZC94E0HEP3N1PH	MASTER’S WISH BOX (Manifest all desires)	masters-wish-box-manifest-all-desires			f	published	http://localhost:9000/static/1773302695457-1-11.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:34:55.475+05:30	2026-03-12 13:34:55.475+05:30	\N	\N
prod_01KKGH86CCFJ4680NM1TTRZBBZ	GENIE BRACELET	genie-bracelet			f	published	http://localhost:9000/static/1773302716800-1-12.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:35:16.814+05:30	2026-03-12 13:35:16.814+05:30	\N	\N
prod_01KKGH9BC3KA041DVWQV1XACAK	Rose Quartz Pencil Locket(self-love and relationship)	rose-quartz-pencil-locketself-love-and-relationship			f	published	http://localhost:9000/static/1773302754679-photo-5.png	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:35:54.692+05:30	2026-03-12 13:35:54.692+05:30	\N	\N
prod_01KKGHA00514BHTAHQMFK1BXX5	Red Jasper natural Bracelet	red-jasper-natural-bracelet			f	published	http://localhost:9000/static/1773302775791-1-14.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:36:15.815+05:30	2026-03-12 13:36:15.815+05:30	\N	\N
prod_01KKGHBHJBDQTRSV188CTFDNR6	Pregnancy & Health Bracelet	pregnancy-health-bracelet			f	published	http://localhost:9000/static/1773302826560-1-15.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:37:06.572+05:30	2026-03-12 13:37:06.572+05:30	\N	\N
prod_01KKGHC3ZR2HTWW0GA4D777CPP	Black obsidian Pencil Locket(evil eye and Nazar)	black-obsidian-pencil-locketevil-eye-and-nazar			f	published	http://localhost:9000/static/1773302845418-2-14.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:37:25.434+05:30	2026-03-12 13:37:25.434+05:30	\N	\N
prod_01KKGHEGQWSYMSHDTKRG61JRV8	Black obsidian natural Bracelet	black-obsidian-natural-bracelet			f	published	http://localhost:9000/static/1773302924014-2-15.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:38:44.029+05:30	2026-03-12 13:38:44.029+05:30	\N	\N
prod_01KKGHGGGB544H7EA1GY5RZ1B3	7 Chakra Locket(overall health)	7-chakra-locketoverall-health			f	published	http://localhost:9000/static/1773302989305-1-19.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:39:49.325+05:30	2026-03-12 13:39:49.325+05:30	\N	\N
prod_01KKGHGZ1XN4KR4VXRSMX4N1N7	Black obsidian pyramid	black-obsidian-pyramid			f	published	http://localhost:9000/static/1773303004196-3-17.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:40:04.222+05:30	2026-03-12 13:40:04.222+05:30	\N	\N
prod_01KKGHHPWS4T4BEWQ85AZ3N4H7	Healing sea salt	healing-sea-salt			f	published	http://localhost:9000/static/1773303028619-2-18.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 13:40:28.634+05:30	2026-03-12 13:40:28.635+05:30	\N	\N
prod_01KKBDMEKJY42ZVZNDDP102XVQ	sharee	sharee	sharee	sharee	f	published	http://localhost:9000/static/1773131151964-SB-9001copy.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-10 13:55:51.998+05:30	2026-03-12 16:02:32.629+05:30	2026-03-12 16:02:32.626+05:30	\N
prod_01KKB6VT3TZZFRMNP201QPVDTK	Pyrite - MONEY KEYCHAIN (Assorted)	pyrite-money-keychain	\N	\N	f	published	https://theblissfulsoul.in/cdn/shop/files/pyrite-keychain.jpg	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-10 11:57:33.116+05:30	2026-03-12 16:02:38.012+05:30	2026-03-12 16:02:38.011+05:30	\N
prod_01KKB6VT6MG5P31Y6NH6W1KRZJ	MONEY PYRAMID	money-pyramid	\N	\N	f	published	https://theblissfulsoul.in/cdn/shop/files/money-pyramid.jpg	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-10 11:57:33.205+05:30	2026-03-12 16:02:40.971+05:30	2026-03-12 16:02:40.971+05:30	\N
prod_01KKB6VT8GE0JVDMNBMB5CRNTB	Amethyst Natural Bracelet	amethyst-natural-bracelet	\N	\N	f	published	https://theblissfulsoul.in/cdn/shop/files/amethyst-bracelet.jpg	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-10 11:57:33.265+05:30	2026-03-12 16:02:43.137+05:30	2026-03-12 16:02:43.137+05:30	\N
prod_01KKB6VT9V8NQCAT15G2AFEWG7	Rose Quartz Natural Bracelet	rose-quartz-natural-bracelet	\N	\N	f	published	https://theblissfulsoul.in/cdn/shop/files/rose-quartz-bracelet.jpg	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-10 11:57:33.307+05:30	2026-03-12 16:02:45.844+05:30	2026-03-12 16:02:45.844+05:30	\N
prod_01KKB6VTATHKEEE6MXR51QSD4T	Money Magnet Bracelet	money-magnet-bracelet	\N	\N	f	published	https://theblissfulsoul.in/cdn/shop/files/money-magnet.jpg	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-10 11:57:33.339+05:30	2026-03-12 16:02:48.971+05:30	2026-03-12 16:02:48.971+05:30	\N
prod_01KKB937AGFSC33DZ1PXMDP86M	testing	sdf	sdf	sdf	f	published	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-10 12:36:33.176+05:30	2026-03-12 16:02:51.639+05:30	2026-03-12 16:02:51.639+05:30	\N
prod_01KKB6VTBTDH1X31R50EC7Q1GB	Crystal Charger - Selenite Plate	selenite-charging-plate	\N	\N	f	published	https://theblissfulsoul.in/cdn/shop/files/selenite-plate.jpg	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-10 11:57:33.37+05:30	2026-03-12 16:03:09.166+05:30	2026-03-12 16:03:09.166+05:30	\N
prod_01KKGT0Q069BHJ6VP4P98TZEXB	Citrine Bracelet(money and growth)	citrine-braceletmoney-and-growth			f	published	http://localhost:9000/static/1773311908843-1-24.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-12 16:08:28.872+05:30	2026-03-12 16:10:20.054+05:30	\N	{"price": 9999}
prod_01KKK08Q66WYDN10VJ75BDQX47	Tarot Reading	tarot-reading			f	published	http://localhost:9000/static/1773385571504-6.png	\N	\N	\N	\N	\N	\N	\N	\N	\N	ptyp_01KKK18C4KW84N78TGBEJTCHK7	t	\N	2026-03-13 12:36:11.53+05:30	2026-03-16 12:47:39.978+05:30	2026-03-16 12:47:39.977+05:30	{"label": "Audio Session", "duration": "20 min"}
prod_01KKTNFA12ZYJMT053XBDDXXHX	Tarot Reading 2	tarot-reading-2			f	published	http://localhost:9000/static/1773642688458-WhatsApp-Image-2025-08-30-at-2.03.56-PM-1-scaled-e1756997216538.jpg	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-16 12:01:28.548+05:30	2026-03-16 12:45:00.554+05:30	2026-03-16 12:45:00.552+05:30	{"label": "Audio Session", "duration": "30 min"}
prod_01KKTQC820Z82HT7ZNZAPRENCW	All-in-1 Astrology	all-in-1-astrology			f	published	http://localhost:9000/static/1773644685358-Screenshot_1.png	\N	\N	\N	\N	\N	\N	\N	\N	\N	ptyp_01KKK18C4KW84N78TGBEJTCHK7	t	\N	2026-03-16 12:34:45.377+05:30	2026-03-16 13:57:19.451+05:30	\N	{"label": "audio session", "duration": "30 mint"}
prod_01KKTR6NCKGH4S7ZZKT8ESKT41	Tarot Reading	tarot-reading			f	published	http://localhost:9000/static/1773645550965-WhatsApp-Image-2025-08-30-at-2.03.56-PM-1-scaled-e1756997216538.jpg	\N	\N	\N	\N	\N	\N	\N	\N	\N	ptyp_01KKK18C4KW84N78TGBEJTCHK7	t	\N	2026-03-16 12:49:10.997+05:30	2026-03-16 14:11:05.318+05:30	\N	{"label": "audio session", "duration": "30 min"}
prod_01KKTQ8QPN5Y2K8ZAB53CHDB12	Therapy & Counselling Sessions	therapy-counselling-sessions			f	published	http://localhost:9000/static/1773644570135-Therapy-Counselling-Sessions.png	\N	\N	\N	\N	\N	\N	\N	\N	\N	ptyp_01KKK18C4KW84N78TGBEJTCHK7	t	\N	2026-03-16 12:32:50.329+05:30	2026-03-16 14:40:45.068+05:30	2026-03-16 14:40:45.067+05:30	{"label": "audio session", "duration": "30 mint"}
prod_01KKTYN1SKJF99NAKB81G9R1NX	Therapy & Counselling Sessions	therapy-counselling-sessions			f	published	http://localhost:9000/static/1773652313883-Therapy-Counselling-Sessions.png	\N	\N	\N	\N	\N	\N	\N	\N	\N	ptyp_01KKK18C4KW84N78TGBEJTCHK7	t	\N	2026-03-16 14:41:53.909+05:30	2026-03-16 14:46:31.955+05:30	2026-03-16 14:46:31.955+05:30	\N
prod_01KKTZ7JMM93QMPPSH61S8DP7K	Therapy & Counselling Sessions	therapy-counselling-sessions			f	published	http://localhost:9000/static/1773652920929-Therapy-Counselling-Sessions.png	\N	\N	\N	\N	\N	\N	\N	\N	\N	ptyp_01KKK18C4KW84N78TGBEJTCHK7	t	\N	2026-03-16 14:52:00.988+05:30	2026-03-16 14:52:00.988+05:30	\N	\N
prod_01KKTNA7JBNG7PVCK2D7VFVEG0	Kundali Session	kundali-session			f	published	http://localhost:9000/static/1773642522149-Kundli.png	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-03-16 11:58:42.189+05:30	2026-03-16 15:09:27.585+05:30	2026-03-16 15:09:27.583+05:30	{"label": "Audio Session", "duration": "30 min"}
prod_01KKV08VDQQ210Z466H8Z4P9NY	Kundali Session	kundali-session			f	published	http://localhost:9000/static/1773654011295-Kundli.png	\N	\N	\N	\N	\N	\N	\N	\N	\N	ptyp_01KKK18C4KW84N78TGBEJTCHK7	t	\N	2026-03-16 15:10:11.321+05:30	2026-03-16 15:10:11.321+05:30	\N	\N
\.


--
-- Data for Name: product_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_category (id, name, description, handle, mpath, is_active, is_internal, rank, parent_category_id, created_at, updated_at, deleted_at, metadata) FROM stdin;
pcat_01KKK1YYCVQNT54FPBQJ8RX8E1	Sessions		sessions	pcat_01KKK1YYCVQNT54FPBQJ8RX8E1	t	f	0	\N	2026-03-13 13:05:48.38+05:30	2026-03-13 13:05:48.38+05:30	\N	\N
pcat_01KKK4NQR2MR7PAN9GKD8HNMHM	Audio Sessions		audio-sessions	pcat_01KKK1YYCVQNT54FPBQJ8RX8E1.pcat_01KKK4NQR2MR7PAN9GKD8HNMHM	t	f	0	pcat_01KKK1YYCVQNT54FPBQJ8RX8E1	2026-03-13 13:53:12.386+05:30	2026-03-13 13:53:12.386+05:30	\N	\N
pcat_01KKK4NQRDNWVAEY0MXDY1YJVR	Video Sessions		video-sessions	pcat_01KKK1YYCVQNT54FPBQJ8RX8E1.pcat_01KKK4NQRDNWVAEY0MXDY1YJVR	t	f	1	pcat_01KKK1YYCVQNT54FPBQJ8RX8E1	2026-03-13 13:53:12.397+05:30	2026-03-13 13:53:12.397+05:30	\N	\N
pcat_01KKK4NQRHA11RNTJPB4SXDRM8	Top Services		top-services	pcat_01KKK1YYCVQNT54FPBQJ8RX8E1.pcat_01KKK4NQRHA11RNTJPB4SXDRM8	t	f	2	pcat_01KKK1YYCVQNT54FPBQJ8RX8E1	2026-03-13 13:53:12.401+05:30	2026-03-13 16:02:29.3+05:30	\N	\N
\.


--
-- Data for Name: product_category_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_category_product (product_id, product_category_id) FROM stdin;
prod_01KKK08Q66WYDN10VJ75BDQX47	pcat_01KKK4NQRHA11RNTJPB4SXDRM8
prod_01KKTNA7JBNG7PVCK2D7VFVEG0	pcat_01KKK4NQR2MR7PAN9GKD8HNMHM
prod_01KKTNA7JBNG7PVCK2D7VFVEG0	pcat_01KKK4NQRHA11RNTJPB4SXDRM8
prod_01KKTNFA12ZYJMT053XBDDXXHX	pcat_01KKK1YYCVQNT54FPBQJ8RX8E1
prod_01KKTNFA12ZYJMT053XBDDXXHX	pcat_01KKK4NQR2MR7PAN9GKD8HNMHM
prod_01KKTQ8QPN5Y2K8ZAB53CHDB12	pcat_01KKK1YYCVQNT54FPBQJ8RX8E1
prod_01KKTQ8QPN5Y2K8ZAB53CHDB12	pcat_01KKK4NQR2MR7PAN9GKD8HNMHM
prod_01KKTQC820Z82HT7ZNZAPRENCW	pcat_01KKK1YYCVQNT54FPBQJ8RX8E1
prod_01KKTQC820Z82HT7ZNZAPRENCW	pcat_01KKK4NQR2MR7PAN9GKD8HNMHM
prod_01KKTR6NCKGH4S7ZZKT8ESKT41	pcat_01KKK1YYCVQNT54FPBQJ8RX8E1
prod_01KKTR6NCKGH4S7ZZKT8ESKT41	pcat_01KKK4NQR2MR7PAN9GKD8HNMHM
prod_01KKTR6NCKGH4S7ZZKT8ESKT41	pcat_01KKK4NQRDNWVAEY0MXDY1YJVR
prod_01KKTYN1SKJF99NAKB81G9R1NX	pcat_01KKK1YYCVQNT54FPBQJ8RX8E1
prod_01KKTYN1SKJF99NAKB81G9R1NX	pcat_01KKK4NQRDNWVAEY0MXDY1YJVR
prod_01KKTYN1SKJF99NAKB81G9R1NX	pcat_01KKK4NQR2MR7PAN9GKD8HNMHM
prod_01KKTZ7JMM93QMPPSH61S8DP7K	pcat_01KKK1YYCVQNT54FPBQJ8RX8E1
prod_01KKTZ7JMM93QMPPSH61S8DP7K	pcat_01KKK4NQRDNWVAEY0MXDY1YJVR
prod_01KKTZ7JMM93QMPPSH61S8DP7K	pcat_01KKK4NQR2MR7PAN9GKD8HNMHM
prod_01KKTZ7JMM93QMPPSH61S8DP7K	pcat_01KKK4NQRHA11RNTJPB4SXDRM8
prod_01KKTNA7JBNG7PVCK2D7VFVEG0	pcat_01KKK1YYCVQNT54FPBQJ8RX8E1
prod_01KKV08VDQQ210Z466H8Z4P9NY	pcat_01KKK1YYCVQNT54FPBQJ8RX8E1
prod_01KKV08VDQQ210Z466H8Z4P9NY	pcat_01KKK4NQRDNWVAEY0MXDY1YJVR
prod_01KKV08VDQQ210Z466H8Z4P9NY	pcat_01KKK4NQR2MR7PAN9GKD8HNMHM
prod_01KKV08VDQQ210Z466H8Z4P9NY	pcat_01KKK4NQRHA11RNTJPB4SXDRM8
prod_01KKTQC820Z82HT7ZNZAPRENCW	pcat_01KKK4NQRDNWVAEY0MXDY1YJVR
prod_01KKTQC820Z82HT7ZNZAPRENCW	pcat_01KKK4NQRHA11RNTJPB4SXDRM8
\.


--
-- Data for Name: product_collection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_collection (id, title, handle, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: product_option; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_option (id, title, product_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
opt_01KKGEV0T5PPGXCXFPW79EFY7E	Default option	prod_01KKGEV0T2SE3CBBTHBSCDX5S3	\N	2026-03-12 12:53:07.974+05:30	2026-03-12 12:53:07.974+05:30	\N
opt_01KKGF0JY0PHAVYDEYM22Y7NSA	Default option	prod_01KKGF0JXXE36GBNN7GRRZ0J6F	\N	2026-03-12 12:56:10.371+05:30	2026-03-12 12:56:10.371+05:30	\N
opt_01KKGFD3XMWRSNVZ8D94Q5BP4N	Default option	prod_01KKGFD3XJW2DF5NM4N9NH3BPB	\N	2026-03-12 13:03:00.983+05:30	2026-03-12 13:03:00.983+05:30	\N
opt_01KKGFEDP2WQJ0SR0BT8KKERY9	Default option	prod_01KKGFEDP1B71M6E0VAXVCD132	\N	2026-03-12 13:03:43.747+05:30	2026-03-12 13:03:43.747+05:30	\N
opt_01KKGFHZQ065P1F8BH8CB2R720	Default option	prod_01KKGFHZPZ4ZYDZ8DBZ5Q8CFF5	\N	2026-03-12 13:05:40.513+05:30	2026-03-12 13:05:40.513+05:30	\N
opt_01KKGFQ2PDGF2WCX8QJBRZMV6N	Default option	prod_01KKGFQ2PBH10AEGGBY47EGDWD	\N	2026-03-12 13:08:27.406+05:30	2026-03-12 13:08:27.406+05:30	\N
opt_01KKGFS54P6CB6AY1A0CZVVYYC	Default option	prod_01KKGFS54N6JFJ00AN1X0B778M	\N	2026-03-12 13:09:35.447+05:30	2026-03-12 13:09:35.447+05:30	\N
opt_01KKGG1ZW6TFWTBDQHH3H6ZCF6	Default option	prod_01KKGG1ZW550D0X09AD05PFNJD	\N	2026-03-12 13:14:24.967+05:30	2026-03-12 13:14:24.967+05:30	\N
opt_01KKGGBWPZ5N1GKJY0GBEA656Y	Default option	prod_01KKGGBWPWW603YYCM9QSA8M8F	\N	2026-03-12 13:19:49.409+05:30	2026-03-12 13:19:49.409+05:30	\N
opt_01KKGGCYRT1TEND4J9ZYHY7KBE	Default option	prod_01KKGGCYRS02FZPXSS5E81Z0VT	\N	2026-03-12 13:20:24.283+05:30	2026-03-12 13:20:24.283+05:30	\N
opt_01KKGGDSH1DVNPMM9N69PKNB5P	Default option	prod_01KKGGDSGZAQA07E2W95SYWFJY	\N	2026-03-12 13:20:51.681+05:30	2026-03-12 13:20:51.681+05:30	\N
opt_01KKGGETJTJE6FS8QXE8NBENHS	Default option	prod_01KKGGETJS4R9WWQDEZXVC6YKP	\N	2026-03-12 13:21:25.531+05:30	2026-03-12 13:21:25.531+05:30	\N
opt_01KKGGGS8WCQVXXTQ7B4PNG7J5	Default option	prod_01KKGGGS8V9GRPDY2RM0EX5T8V	\N	2026-03-12 13:22:29.725+05:30	2026-03-12 13:22:29.725+05:30	\N
opt_01KKGGSX66J9RWZQAY3RMD6E8S	Default option	prod_01KKGGSX663XAWMPZPXXZ152T0	\N	2026-03-12 13:27:28.647+05:30	2026-03-12 13:27:28.647+05:30	\N
opt_01KKGGTJQWRHYY4GTMCFGZ2RJ5	Default option	prod_01KKGGTJQV56K1RZXS5PVCR33Q	\N	2026-03-12 13:27:50.717+05:30	2026-03-12 13:27:50.717+05:30	\N
opt_01KKGH7HHJZTFMW9GX1P0EX9NV	Default option	prod_01KKGH7HHH2ZZC94E0HEP3N1PH	\N	2026-03-12 13:34:55.475+05:30	2026-03-12 13:34:55.475+05:30	\N
opt_01KKGH86CD70V4YMVYBSXK4358	Default option	prod_01KKGH86CCFJ4680NM1TTRZBBZ	\N	2026-03-12 13:35:16.814+05:30	2026-03-12 13:35:16.814+05:30	\N
opt_01KKGH9BC44R6JQ3A1797FERMY	Default option	prod_01KKGH9BC3KA041DVWQV1XACAK	\N	2026-03-12 13:35:54.692+05:30	2026-03-12 13:35:54.692+05:30	\N
opt_01KKGHA0062850H14NWB9Z42FP	Default option	prod_01KKGHA00514BHTAHQMFK1BXX5	\N	2026-03-12 13:36:15.815+05:30	2026-03-12 13:36:15.815+05:30	\N
opt_01KKGHBHJC7XRFB92FR6JA5G9K	Default option	prod_01KKGHBHJBDQTRSV188CTFDNR6	\N	2026-03-12 13:37:06.572+05:30	2026-03-12 13:37:06.572+05:30	\N
opt_01KKGHC3ZT8B56ER9N9EFAKKXM	Default option	prod_01KKGHC3ZR2HTWW0GA4D777CPP	\N	2026-03-12 13:37:25.434+05:30	2026-03-12 13:37:25.434+05:30	\N
opt_01KKGHEGQXGKT3FAK1HRVRY17C	Default option	prod_01KKGHEGQWSYMSHDTKRG61JRV8	\N	2026-03-12 13:38:44.029+05:30	2026-03-12 13:38:44.029+05:30	\N
opt_01KKGHGGGCQEE8W54A133273PX	Default option	prod_01KKGHGGGB544H7EA1GY5RZ1B3	\N	2026-03-12 13:39:49.325+05:30	2026-03-12 13:39:49.325+05:30	\N
opt_01KKGHGZ1Y15WCCPX9EAHGABQ3	Default option	prod_01KKGHGZ1XN4KR4VXRSMX4N1N7	\N	2026-03-12 13:40:04.222+05:30	2026-03-12 13:40:04.222+05:30	\N
opt_01KKGHHPWTPNTTFK7HYS2V5M43	Default option	prod_01KKGHHPWS4T4BEWQ85AZ3N4H7	\N	2026-03-12 13:40:28.635+05:30	2026-03-12 13:40:28.635+05:30	\N
opt_01KKBDMEKWFYVQGXF7XJCVBMAZ	Default option	prod_01KKBDMEKJY42ZVZNDDP102XVQ	\N	2026-03-10 13:55:51.999+05:30	2026-03-12 16:02:32.641+05:30	2026-03-12 16:02:32.626+05:30
opt_01KKB6VT3VB4V34S119SCDP818	Title	prod_01KKB6VT3TZZFRMNP201QPVDTK	\N	2026-03-10 11:57:33.116+05:30	2026-03-12 16:02:38.022+05:30	2026-03-12 16:02:38.011+05:30
opt_01KKB6VT6MP3SAP66VVNK3DGFY	Title	prod_01KKB6VT6MG5P31Y6NH6W1KRZJ	\N	2026-03-10 11:57:33.205+05:30	2026-03-12 16:02:40.977+05:30	2026-03-12 16:02:40.971+05:30
opt_01KKB6VT8HQBJRW9W9CV4M0ZV4	Title	prod_01KKB6VT8GE0JVDMNBMB5CRNTB	\N	2026-03-10 11:57:33.265+05:30	2026-03-12 16:02:43.14+05:30	2026-03-12 16:02:43.137+05:30
opt_01KKB6VT9V1NQ5AQYDDPYPDGG0	Title	prod_01KKB6VT9V8NQCAT15G2AFEWG7	\N	2026-03-10 11:57:33.307+05:30	2026-03-12 16:02:45.856+05:30	2026-03-12 16:02:45.844+05:30
opt_01KKB6VTAVQ19EH3PKDHDTVEX4	Title	prod_01KKB6VTATHKEEE6MXR51QSD4T	\N	2026-03-10 11:57:33.339+05:30	2026-03-12 16:02:48.98+05:30	2026-03-12 16:02:48.971+05:30
opt_01KKB937AQSXGMF5WJAR41Q5YF	Default option	prod_01KKB937AGFSC33DZ1PXMDP86M	\N	2026-03-10 12:36:33.176+05:30	2026-03-12 16:02:51.641+05:30	2026-03-12 16:02:51.639+05:30
opt_01KKB6VTBTATWGDAYFXMAY4A4G	Title	prod_01KKB6VTBTDH1X31R50EC7Q1GB	\N	2026-03-10 11:57:33.37+05:30	2026-03-12 16:03:09.174+05:30	2026-03-12 16:03:09.166+05:30
opt_01KKGT0Q083PTNX1KMCBQ76CSV	Default option	prod_01KKGT0Q069BHJ6VP4P98TZEXB	\N	2026-03-12 16:08:28.874+05:30	2026-03-12 16:08:28.874+05:30	\N
opt_01KKTQC821M7N98Y6XY8ACSN08	Default option	prod_01KKTQC820Z82HT7ZNZAPRENCW	\N	2026-03-16 12:34:45.378+05:30	2026-03-16 12:34:45.378+05:30	\N
opt_01KKTNFA13FEKT5ZMHMYH4R127	Default option	prod_01KKTNFA12ZYJMT053XBDDXXHX	\N	2026-03-16 12:01:28.548+05:30	2026-03-16 12:45:00.563+05:30	2026-03-16 12:45:00.552+05:30
opt_01KKK08Q69P097PNHDA8EJFJ7A	Default option	prod_01KKK08Q66WYDN10VJ75BDQX47	\N	2026-03-13 12:36:11.53+05:30	2026-03-16 12:47:39.994+05:30	2026-03-16 12:47:39.977+05:30
opt_01KKTR6NCNY4C3S883J4KP935X	Tarot Reading	prod_01KKTR6NCKGH4S7ZZKT8ESKT41	\N	2026-03-16 12:49:10.998+05:30	2026-03-16 12:56:42.832+05:30	2026-03-16 12:56:42.831+05:30
opt_01KKTRSKC397PZDMKPNW99GYQY	Format	prod_01KKTR6NCKGH4S7ZZKT8ESKT41	\N	2026-03-16 12:59:31.524+05:30	2026-03-16 12:59:31.524+05:30	\N
opt_01KKTQ8QPQ5DQ171MDA71HVHYR	Default option	prod_01KKTQ8QPN5Y2K8ZAB53CHDB12	\N	2026-03-16 12:32:50.329+05:30	2026-03-16 14:40:45.072+05:30	2026-03-16 14:40:45.067+05:30
opt_01KKTYN1SM0WFRMRM0N5AG2YMN	Default option	prod_01KKTYN1SKJF99NAKB81G9R1NX	\N	2026-03-16 14:41:53.909+05:30	2026-03-16 14:46:32.003+05:30	2026-03-16 14:46:31.955+05:30
opt_01KKTZ7JMRMKB4PTNF4BVTF9MT	Therapy & Counselling Sessions	prod_01KKTZ7JMM93QMPPSH61S8DP7K	\N	2026-03-16 14:52:00.988+05:30	2026-03-16 14:52:00.988+05:30	\N
opt_01KKV08VDRF7DQ8G64EAFHME52	Default option	prod_01KKV08VDQQ210Z466H8Z4P9NY	\N	2026-03-16 15:10:11.321+05:30	2026-03-16 15:10:11.321+05:30	\N
opt_01KKV09Z8CG5S1QYWBP2Z4DQ63	Format	prod_01KKV08VDQQ210Z466H8Z4P9NY	\N	2026-03-16 15:10:48.012+05:30	2026-03-16 15:10:48.012+05:30	\N
opt_01KKTZCJZHN3RG8222FJM6ANQ1	Kundali Session	prod_01KKTNA7JBNG7PVCK2D7VFVEG0	\N	2026-03-16 14:54:45.169+05:30	2026-03-16 15:09:27.599+05:30	2026-03-16 15:09:27.583+05:30
opt_01KKTNA7JCJYGJ1XT07EFNM279	Default option	prod_01KKTNA7JBNG7PVCK2D7VFVEG0	\N	2026-03-16 11:58:42.189+05:30	2026-03-16 15:09:27.599+05:30	2026-03-16 15:09:27.583+05:30
opt_01KKTZFCHPN3N3TBS3T5NBEBQC	Format	prod_01KKTNA7JBNG7PVCK2D7VFVEG0	\N	2026-03-16 14:56:16.886+05:30	2026-03-16 15:09:27.599+05:30	2026-03-16 15:09:27.583+05:30
opt_01KKV0H2Y0Y9FEGRRBZ6YZG9SD	Formant	prod_01KKTQC820Z82HT7ZNZAPRENCW	\N	2026-03-16 15:14:41.152+05:30	2026-03-16 15:14:41.152+05:30	\N
\.


--
-- Data for Name: product_option_value; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_option_value (id, value, option_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
optval_01KKGEV0T42HZ63TK1EAZ5KRXP	Default option value	opt_01KKGEV0T5PPGXCXFPW79EFY7E	\N	2026-03-12 12:53:07.974+05:30	2026-03-12 12:53:07.974+05:30	\N
optval_01KKGF0JXZ5JSWFH4GYGE437F1	Default option value	opt_01KKGF0JY0PHAVYDEYM22Y7NSA	\N	2026-03-12 12:56:10.371+05:30	2026-03-12 12:56:10.371+05:30	\N
optval_01KKGFD3XMK8J7QYM6QB2K1NWM	Default option value	opt_01KKGFD3XMWRSNVZ8D94Q5BP4N	\N	2026-03-12 13:03:00.983+05:30	2026-03-12 13:03:00.983+05:30	\N
optval_01KKGFEDP2EAXZMNNNB8YTQD8D	Default option value	opt_01KKGFEDP2WQJ0SR0BT8KKERY9	\N	2026-03-12 13:03:43.747+05:30	2026-03-12 13:03:43.747+05:30	\N
optval_01KKGFHZQ0K9S5AMB0S7YY4D2T	Default option value	opt_01KKGFHZQ065P1F8BH8CB2R720	\N	2026-03-12 13:05:40.513+05:30	2026-03-12 13:05:40.513+05:30	\N
optval_01KKGFQ2PDZ9FP40V7GCK9RGYT	Default option value	opt_01KKGFQ2PDGF2WCX8QJBRZMV6N	\N	2026-03-12 13:08:27.406+05:30	2026-03-12 13:08:27.406+05:30	\N
optval_01KKGFS54PEBMJAK8SYKQ9Z693	Default option value	opt_01KKGFS54P6CB6AY1A0CZVVYYC	\N	2026-03-12 13:09:35.447+05:30	2026-03-12 13:09:35.447+05:30	\N
optval_01KKGG1ZW6KTPF340NEBBE8P2G	Default option value	opt_01KKGG1ZW6TFWTBDQHH3H6ZCF6	\N	2026-03-12 13:14:24.967+05:30	2026-03-12 13:14:24.967+05:30	\N
optval_01KKGGBWPYA1TS2KSTS4PFDCCW	Default option value	opt_01KKGGBWPZ5N1GKJY0GBEA656Y	\N	2026-03-12 13:19:49.409+05:30	2026-03-12 13:19:49.409+05:30	\N
optval_01KKGGCYRTH3VY59HRQM58YP0W	Default option value	opt_01KKGGCYRT1TEND4J9ZYHY7KBE	\N	2026-03-12 13:20:24.283+05:30	2026-03-12 13:20:24.283+05:30	\N
optval_01KKGGDSH0GX7N77Y61D29QTMZ	Default option value	opt_01KKGGDSH1DVNPMM9N69PKNB5P	\N	2026-03-12 13:20:51.681+05:30	2026-03-12 13:20:51.681+05:30	\N
optval_01KKGGETJTSGY29RK8P9ZW4JSG	Default option value	opt_01KKGGETJTJE6FS8QXE8NBENHS	\N	2026-03-12 13:21:25.531+05:30	2026-03-12 13:21:25.531+05:30	\N
optval_01KKGGGS8WPDYEMX7MABYMJZ15	Default option value	opt_01KKGGGS8WCQVXXTQ7B4PNG7J5	\N	2026-03-12 13:22:29.725+05:30	2026-03-12 13:22:29.725+05:30	\N
optval_01KKGGSX66S5F0FA6P7QHB332N	Default option value	opt_01KKGGSX66J9RWZQAY3RMD6E8S	\N	2026-03-12 13:27:28.647+05:30	2026-03-12 13:27:28.647+05:30	\N
optval_01KKGGTJQW7ZETRX6Y37ME5AG9	Default option value	opt_01KKGGTJQWRHYY4GTMCFGZ2RJ5	\N	2026-03-12 13:27:50.717+05:30	2026-03-12 13:27:50.717+05:30	\N
optval_01KKGH7HHJ9W6YAW0WQ6HWA9K0	Default option value	opt_01KKGH7HHJZTFMW9GX1P0EX9NV	\N	2026-03-12 13:34:55.475+05:30	2026-03-12 13:34:55.475+05:30	\N
optval_01KKGH86CD2HCYTB5GG2A558RE	Default option value	opt_01KKGH86CD70V4YMVYBSXK4358	\N	2026-03-12 13:35:16.814+05:30	2026-03-12 13:35:16.814+05:30	\N
optval_01KKGH9BC34D7Z793Z5NAS6CRJ	Default option value	opt_01KKGH9BC44R6JQ3A1797FERMY	\N	2026-03-12 13:35:54.692+05:30	2026-03-12 13:35:54.692+05:30	\N
optval_01KKGHA006G6EBMV0179EBGY4X	Default option value	opt_01KKGHA0062850H14NWB9Z42FP	\N	2026-03-12 13:36:15.815+05:30	2026-03-12 13:36:15.815+05:30	\N
optval_01KKGHBHJC673FDXFZ36EJ7TWM	Default option value	opt_01KKGHBHJC7XRFB92FR6JA5G9K	\N	2026-03-12 13:37:06.572+05:30	2026-03-12 13:37:06.572+05:30	\N
optval_01KKGHC3ZSKRNDWFZE2NXQ1NVM	Default option value	opt_01KKGHC3ZT8B56ER9N9EFAKKXM	\N	2026-03-12 13:37:25.434+05:30	2026-03-12 13:37:25.434+05:30	\N
optval_01KKGHEGQXVNYQ36PZR2EQSJTN	Default option value	opt_01KKGHEGQXGKT3FAK1HRVRY17C	\N	2026-03-12 13:38:44.029+05:30	2026-03-12 13:38:44.029+05:30	\N
optval_01KKGHGGGCMRFP93CEN6QE4K4M	Default option value	opt_01KKGHGGGCQEE8W54A133273PX	\N	2026-03-12 13:39:49.325+05:30	2026-03-12 13:39:49.325+05:30	\N
optval_01KKGHGZ1XTRZ93YE3VPRJ5SWB	Default option value	opt_01KKGHGZ1Y15WCCPX9EAHGABQ3	\N	2026-03-12 13:40:04.222+05:30	2026-03-12 13:40:04.222+05:30	\N
optval_01KKGHHPWTMV0YMQ8DF89K3X2R	Default option value	opt_01KKGHHPWTPNTTFK7HYS2V5M43	\N	2026-03-12 13:40:28.635+05:30	2026-03-12 13:40:28.635+05:30	\N
optval_01KKBDMEKWYGX0KYR4B5ZAHBE4	Default option value	opt_01KKBDMEKWFYVQGXF7XJCVBMAZ	\N	2026-03-10 13:55:51.999+05:30	2026-03-12 16:02:32.649+05:30	2026-03-12 16:02:32.626+05:30
optval_01KKB6VT3VA1HDMYS64KH13DYX	Default	opt_01KKB6VT3VB4V34S119SCDP818	\N	2026-03-10 11:57:33.116+05:30	2026-03-12 16:02:38.03+05:30	2026-03-12 16:02:38.011+05:30
optval_01KKB6VT6MZFX47P0T42HH805Q	Default	opt_01KKB6VT6MP3SAP66VVNK3DGFY	\N	2026-03-10 11:57:33.205+05:30	2026-03-12 16:02:40.979+05:30	2026-03-12 16:02:40.971+05:30
optval_01KKB6VT8GYMMH110GT87ADHN3	Default	opt_01KKB6VT8HQBJRW9W9CV4M0ZV4	\N	2026-03-10 11:57:33.265+05:30	2026-03-12 16:02:43.144+05:30	2026-03-12 16:02:43.137+05:30
optval_01KKB6VT9VA7675TP1VW1RC02W	Default	opt_01KKB6VT9V1NQ5AQYDDPYPDGG0	\N	2026-03-10 11:57:33.307+05:30	2026-03-12 16:02:45.859+05:30	2026-03-12 16:02:45.844+05:30
optval_01KKB6VTAVYR1WZ2F786HHCVE2	Default	opt_01KKB6VTAVQ19EH3PKDHDTVEX4	\N	2026-03-10 11:57:33.339+05:30	2026-03-12 16:02:48.986+05:30	2026-03-12 16:02:48.971+05:30
optval_01KKB937AQSTRWE113Q7C5ASZ9	Default option value	opt_01KKB937AQSXGMF5WJAR41Q5YF	\N	2026-03-10 12:36:33.177+05:30	2026-03-12 16:02:51.643+05:30	2026-03-12 16:02:51.639+05:30
optval_01KKB6VTBTXAFF21F84AJHG6M4	Default	opt_01KKB6VTBTATWGDAYFXMAY4A4G	\N	2026-03-10 11:57:33.37+05:30	2026-03-12 16:03:09.177+05:30	2026-03-12 16:03:09.166+05:30
optval_01KKGT0Q078YWX5MEQE1TYX7P6	Default option value	opt_01KKGT0Q083PTNX1KMCBQ76CSV	\N	2026-03-12 16:08:28.874+05:30	2026-03-12 16:08:28.874+05:30	\N
optval_01KKTQC820S8R612MGMBY2CABW	Default option value	opt_01KKTQC821M7N98Y6XY8ACSN08	\N	2026-03-16 12:34:45.378+05:30	2026-03-16 12:34:45.378+05:30	\N
optval_01KKTNFA13TKGSNWACDZ50RJ5D	Default option value	opt_01KKTNFA13FEKT5ZMHMYH4R127	\N	2026-03-16 12:01:28.548+05:30	2026-03-16 12:45:00.57+05:30	2026-03-16 12:45:00.552+05:30
optval_01KKK08Q6884K5JY872ZFGAHJK	Default option value	opt_01KKK08Q69P097PNHDA8EJFJ7A	\N	2026-03-13 12:36:11.53+05:30	2026-03-16 12:47:39.997+05:30	2026-03-16 12:47:39.977+05:30
optval_01KKTR6NCMVW42SADG640CZTH4	Red	opt_01KKTR6NCNY4C3S883J4KP935X	\N	2026-03-16 12:49:10.998+05:30	2026-03-16 12:56:42.845+05:30	2026-03-16 12:56:42.831+05:30
optval_01KKTRSKC39XHN4EK6VWXX4PDP	Audio	opt_01KKTRSKC397PZDMKPNW99GYQY	\N	2026-03-16 12:59:31.524+05:30	2026-03-16 12:59:31.524+05:30	\N
optval_01KKTRSKC3DYEYGHNNQ4XC19NE	Video	opt_01KKTRSKC397PZDMKPNW99GYQY	\N	2026-03-16 12:59:31.524+05:30	2026-03-16 12:59:31.524+05:30	\N
optval_01KKTQ8QPQQDQKRDVB6126QFJ3	Default option value	opt_01KKTQ8QPQ5DQ171MDA71HVHYR	\N	2026-03-16 12:32:50.329+05:30	2026-03-16 14:40:45.076+05:30	2026-03-16 14:40:45.067+05:30
optval_01KKTYN1SMBVWA1W87Z30A4K1A	Default option value	opt_01KKTYN1SM0WFRMRM0N5AG2YMN	\N	2026-03-16 14:41:53.909+05:30	2026-03-16 14:46:32.005+05:30	2026-03-16 14:46:31.955+05:30
optval_01KKTZ7JMRM0F7BYSP6G1TBE6A	video	opt_01KKTZ7JMRMKB4PTNF4BVTF9MT	\N	2026-03-16 14:52:00.988+05:30	2026-03-16 14:52:00.988+05:30	\N
optval_01KKTZ8FG3MC3FGWH8WQX4KQRR	audio	opt_01KKTZ7JMRMKB4PTNF4BVTF9MT	\N	2026-03-16 14:52:30.521462+05:30	2026-03-16 14:52:30.521462+05:30	\N
optval_01KKV09Z8CFY7QVW7YM7EQF2V6	audio	opt_01KKV09Z8CG5S1QYWBP2Z4DQ63	\N	2026-03-16 15:10:48.012+05:30	2026-03-16 15:10:48.012+05:30	\N
optval_01KKV09Z8CFB5C0SY3ADQ665R7	video	opt_01KKV09Z8CG5S1QYWBP2Z4DQ63	\N	2026-03-16 15:10:48.012+05:30	2026-03-16 15:10:48.012+05:30	\N
optval_01KKV0H2XZ7SK13B7VPYQCGCSP	video	opt_01KKV0H2Y0Y9FEGRRBZ6YZG9SD	\N	2026-03-16 15:14:41.152+05:30	2026-03-16 15:14:41.152+05:30	\N
optval_01KKV0H2XZ5VA63FQP42WBF5CF	audio	opt_01KKV0H2Y0Y9FEGRRBZ6YZG9SD	\N	2026-03-16 15:14:41.152+05:30	2026-03-16 15:14:41.152+05:30	\N
optval_01KKTZCJZGK77PZH9CX634WB9J	video	opt_01KKTZCJZHN3RG8222FJM6ANQ1	\N	2026-03-16 14:54:45.169+05:30	2026-03-16 15:09:27.608+05:30	2026-03-16 15:09:27.583+05:30
optval_01KKTZCT68283T3S508Z0M5VE9	audio	opt_01KKTZCJZHN3RG8222FJM6ANQ1	\N	2026-03-16 14:54:52.525341+05:30	2026-03-16 15:09:27.608+05:30	2026-03-16 15:09:27.583+05:30
optval_01KKTNA7JCMXXPXRKB0CYE4CRR	Default option value	opt_01KKTNA7JCJYGJ1XT07EFNM279	\N	2026-03-16 11:58:42.189+05:30	2026-03-16 15:09:27.608+05:30	2026-03-16 15:09:27.583+05:30
optval_01KKV03SAYA5RPFWEK8AG875JS	Audio	opt_01KKTZFCHPN3N3TBS3T5NBEBQC	\N	2026-03-16 15:07:25.333232+05:30	2026-03-16 15:09:27.608+05:30	2026-03-16 15:09:27.583+05:30
optval_01KKV03SAY349E6VMN2TJZB15W	Video	opt_01KKTZFCHPN3N3TBS3T5NBEBQC	\N	2026-03-16 15:07:25.333232+05:30	2026-03-16 15:09:27.608+05:30	2026-03-16 15:09:27.583+05:30
optval_01KKV08VDRSE39S52GBNGPXBBW	Default option value	opt_01KKV08VDRF7DQ8G64EAFHME52	\N	2026-03-16 15:10:11.321+05:30	2026-03-16 15:10:11.321+05:30	\N
\.


--
-- Data for Name: product_sales_channel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_sales_channel (product_id, sales_channel_id, id, created_at, updated_at, deleted_at) FROM stdin;
prod_01KKGEV0T2SE3CBBTHBSCDX5S3	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGEV0V96ABY362QBQ2KS379	2026-03-12 12:53:08.009409+05:30	2026-03-12 12:53:08.009409+05:30	\N
prod_01KKGF0JXXE36GBNN7GRRZ0J6F	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGF0JYP9D96BEJHQ3E1RKB9	2026-03-12 12:56:10.389792+05:30	2026-03-12 12:56:10.389792+05:30	\N
prod_01KKGFD3XJW2DF5NM4N9NH3BPB	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGFD3YAWH7512YNWJ3VKGMC	2026-03-12 13:03:01.002341+05:30	2026-03-12 13:03:01.002341+05:30	\N
prod_01KKGFEDP1B71M6E0VAXVCD132	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGFEDPFXKNSQS7QYBB6N14T	2026-03-12 13:03:43.758858+05:30	2026-03-12 13:03:43.758858+05:30	\N
prod_01KKGFHZPZ4ZYDZ8DBZ5Q8CFF5	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGFHZQFDQ3QWZCHRQMJBGZA	2026-03-12 13:05:40.527151+05:30	2026-03-12 13:05:40.527151+05:30	\N
prod_01KKGFQ2PBH10AEGGBY47EGDWD	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGFQ2PT5X125NMSSTEENESJ	2026-03-12 13:08:27.418575+05:30	2026-03-12 13:08:27.418575+05:30	\N
prod_01KKGFS54N6JFJ00AN1X0B778M	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGFS55536ZW86Q2HBAFDFJH	2026-03-12 13:09:35.461028+05:30	2026-03-12 13:09:35.461028+05:30	\N
prod_01KKGG1ZW550D0X09AD05PFNJD	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGG1ZWVY25TSG4E6AQ38HTZ	2026-03-12 13:14:24.987199+05:30	2026-03-12 13:14:24.987199+05:30	\N
prod_01KKGGBWPWW603YYCM9QSA8M8F	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGGBWQPG1EWRVEE2GJWAB0J	2026-03-12 13:19:49.430066+05:30	2026-03-12 13:19:49.430066+05:30	\N
prod_01KKGGCYRS02FZPXSS5E81Z0VT	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGGCYS6YWA2VKS6Z2AHMQ3Q	2026-03-12 13:20:24.293886+05:30	2026-03-12 13:20:24.293886+05:30	\N
prod_01KKGGDSGZAQA07E2W95SYWFJY	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGGDSHBF3H6HT0Q064KR9TQ	2026-03-12 13:20:51.691292+05:30	2026-03-12 13:20:51.691292+05:30	\N
prod_01KKGGETJS4R9WWQDEZXVC6YKP	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGGETK8FJYF1E7MGM3Z7R90	2026-03-12 13:21:25.543775+05:30	2026-03-12 13:21:25.543775+05:30	\N
prod_01KKGGGS8V9GRPDY2RM0EX5T8V	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGGGS9B5BCSEBMQA9V2NPRC	2026-03-12 13:22:29.739494+05:30	2026-03-12 13:22:29.739494+05:30	\N
prod_01KKGGSX663XAWMPZPXXZ152T0	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGGSX6P634Z0CTHRWT1H8KW	2026-03-12 13:27:28.661664+05:30	2026-03-12 13:27:28.661664+05:30	\N
prod_01KKGGTJQV56K1RZXS5PVCR33Q	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGGTJR5MJ0A0PK1F45VYC79	2026-03-12 13:27:50.725755+05:30	2026-03-12 13:27:50.725755+05:30	\N
prod_01KKGH7HHH2ZZC94E0HEP3N1PH	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGH7HHZP43QS9766Q2KQ7XX	2026-03-12 13:34:55.487355+05:30	2026-03-12 13:34:55.487355+05:30	\N
prod_01KKGH86CCFJ4680NM1TTRZBBZ	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGH86CN4TQDAP3NWARAY5N8	2026-03-12 13:35:16.821123+05:30	2026-03-12 13:35:16.821123+05:30	\N
prod_01KKGH9BC3KA041DVWQV1XACAK	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGH9BCH1RPDZVYNZZZ3M0XJ	2026-03-12 13:35:54.705392+05:30	2026-03-12 13:35:54.705392+05:30	\N
prod_01KKGHA00514BHTAHQMFK1BXX5	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGHA00JKJF0MJAFK367RGNC	2026-03-12 13:36:15.825919+05:30	2026-03-12 13:36:15.825919+05:30	\N
prod_01KKGHBHJBDQTRSV188CTFDNR6	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGHBHJRKSK42VAWJN6DR6DY	2026-03-12 13:37:06.584175+05:30	2026-03-12 13:37:06.584175+05:30	\N
prod_01KKGHC3ZR2HTWW0GA4D777CPP	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGHC401CW2EBTGZXT1S3WM7	2026-03-12 13:37:25.441223+05:30	2026-03-12 13:37:25.441223+05:30	\N
prod_01KKGHEGQWSYMSHDTKRG61JRV8	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGHEGR8BQZ44Q6M61HR75SB	2026-03-12 13:38:44.040565+05:30	2026-03-12 13:38:44.040565+05:30	\N
prod_01KKGHGGGB544H7EA1GY5RZ1B3	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGHGGGVQ137MK6RGFEF9D9B	2026-03-12 13:39:49.338891+05:30	2026-03-12 13:39:49.338891+05:30	\N
prod_01KKGHGZ1XN4KR4VXRSMX4N1N7	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGHGZ28KTM2XA2VHVHCFMBC	2026-03-12 13:40:04.232444+05:30	2026-03-12 13:40:04.232444+05:30	\N
prod_01KKGHHPWS4T4BEWQ85AZ3N4H7	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGHHPX8Y5VMAVBJ6Y7T42F2	2026-03-12 13:40:28.647365+05:30	2026-03-12 13:40:28.647365+05:30	\N
prod_01KKBDMEKJY42ZVZNDDP102XVQ	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKBDMEPMM5F1NDR3NVNNG2R8	2026-03-10 13:55:52.084605+05:30	2026-03-12 16:02:32.622+05:30	2026-03-12 16:02:32.613+05:30
prod_01KKB6VT3TZZFRMNP201QPVDTK	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKB6VT47JNMHV39B5WATQZBP	2026-03-10 11:57:33.127704+05:30	2026-03-12 16:02:38.019+05:30	2026-03-12 16:02:38.018+05:30
prod_01KKB6VT6MG5P31Y6NH6W1KRZJ	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKB6VT6X7ZW8MBY1R0H73YXD	2026-03-10 11:57:33.213748+05:30	2026-03-12 16:02:40.973+05:30	2026-03-12 16:02:40.973+05:30
prod_01KKB6VT8GE0JVDMNBMB5CRNTB	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKB6VT8P6FXP25176SF5Z9D9	2026-03-10 11:57:33.270301+05:30	2026-03-12 16:02:43.136+05:30	2026-03-12 16:02:43.136+05:30
prod_01KKB6VT9V8NQCAT15G2AFEWG7	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKB6VTA0DE9CX5BG1VA2MY6P	2026-03-10 11:57:33.312186+05:30	2026-03-12 16:02:45.843+05:30	2026-03-12 16:02:45.843+05:30
prod_01KKB6VTATHKEEE6MXR51QSD4T	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKB6VTAZJZDN0QD20TPRM4BQ	2026-03-10 11:57:33.343423+05:30	2026-03-12 16:02:48.974+05:30	2026-03-12 16:02:48.973+05:30
prod_01KKB937AGFSC33DZ1PXMDP86M	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKB937BYP69WG0GYPBBPJGX3	2026-03-10 12:36:33.213776+05:30	2026-03-12 16:02:51.641+05:30	2026-03-12 16:02:51.641+05:30
prod_01KKB6VTBTDH1X31R50EC7Q1GB	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKB6VTBY2SBMM5W36V9T2QHN	2026-03-10 11:57:33.374324+05:30	2026-03-12 16:03:09.167+05:30	2026-03-12 16:03:09.167+05:30
prod_01KKGT0Q069BHJ6VP4P98TZEXB	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKGT0Q1AYY3DZRJSWSC6EDCM	2026-03-12 16:08:28.902255+05:30	2026-03-12 16:08:28.902255+05:30	\N
prod_01KKTQC820Z82HT7ZNZAPRENCW	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKTQC82JCACEFSC5T3TEDFTA	2026-03-16 12:34:45.394607+05:30	2026-03-16 12:34:45.394607+05:30	\N
prod_01KKTNFA12ZYJMT053XBDDXXHX	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKTNFA34VKSX5SNF6TDVJ6T9	2026-03-16 12:01:28.611931+05:30	2026-03-16 12:45:00.557+05:30	2026-03-16 12:45:00.556+05:30
prod_01KKK08Q66WYDN10VJ75BDQX47	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKK08Q75XB1DEHFB4QD3S6R9	2026-03-13 12:36:11.556983+05:30	2026-03-16 12:47:39.984+05:30	2026-03-16 12:47:39.983+05:30
prod_01KKTR6NCKGH4S7ZZKT8ESKT41	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKTR6NDM5JGYKAKRJ49MFXFK	2026-03-16 12:49:11.028451+05:30	2026-03-16 12:49:11.028451+05:30	\N
prod_01KKTQ8QPN5Y2K8ZAB53CHDB12	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKTQ8QRERJ5V13QAV3ZFV7DD	2026-03-16 12:32:50.382381+05:30	2026-03-16 14:40:26.662+05:30	2026-03-16 14:40:26.661+05:30
prod_01KKTYN1SKJF99NAKB81G9R1NX	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKTYN1T853JFC6SD5DQW6FDC	2026-03-16 14:41:53.928556+05:30	2026-03-16 14:46:31.957+05:30	2026-03-16 14:46:31.957+05:30
prod_01KKTZ7JMM93QMPPSH61S8DP7K	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKTZ7JP2W8SW7RS7XVGQ2488	2026-03-16 14:52:01.025396+05:30	2026-03-16 14:52:01.025396+05:30	\N
prod_01KKTNA7JBNG7PVCK2D7VFVEG0	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKTNA7M437D25N5A0YW5YH2A	2026-03-16 11:58:42.243843+05:30	2026-03-16 15:09:27.6+05:30	2026-03-16 15:09:27.599+05:30
prod_01KKV08VDQQ210Z466H8Z4P9NY	sc_01KKB6VT2GA936E202BCVNT0DC	prodsc_01KKV08VEAA8T36CMAPKA9EVA5	2026-03-16 15:10:11.338337+05:30	2026-03-16 15:10:11.338337+05:30	\N
\.


--
-- Data for Name: product_shipping_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_shipping_profile (product_id, shipping_profile_id, id, created_at, updated_at, deleted_at) FROM stdin;
prod_01KKB6VT3TZZFRMNP201QPVDTK	sp_01KKB6VE1XDK6CBQ378CHJNVF3	prodsp_01KKB6VT4ESWB555YFV5B5E27S	2026-03-10 11:57:33.134009+05:30	2026-03-12 16:02:38.021+05:30	2026-03-12 16:02:38.02+05:30
prod_01KKB6VT6MG5P31Y6NH6W1KRZJ	sp_01KKB6VE1XDK6CBQ378CHJNVF3	prodsp_01KKB6VT71MK9CAYJV9GPMWMBG	2026-03-10 11:57:33.216908+05:30	2026-03-12 16:02:40.972+05:30	2026-03-12 16:02:40.972+05:30
prod_01KKB6VT8GE0JVDMNBMB5CRNTB	sp_01KKB6VE1XDK6CBQ378CHJNVF3	prodsp_01KKB6VT8SF7P6690R3QGGGPD5	2026-03-10 11:57:33.273303+05:30	2026-03-12 16:02:43.137+05:30	2026-03-12 16:02:43.137+05:30
prod_01KKB6VT9V8NQCAT15G2AFEWG7	sp_01KKB6VE1XDK6CBQ378CHJNVF3	prodsp_01KKB6VTA2DNDYDHH233GYZ7JX	2026-03-10 11:57:33.314663+05:30	2026-03-12 16:02:45.845+05:30	2026-03-12 16:02:45.845+05:30
prod_01KKB6VTATHKEEE6MXR51QSD4T	sp_01KKB6VE1XDK6CBQ378CHJNVF3	prodsp_01KKB6VTB18X77TEFTC64984WY	2026-03-10 11:57:33.345573+05:30	2026-03-12 16:02:48.978+05:30	2026-03-12 16:02:48.978+05:30
prod_01KKB6VTBTDH1X31R50EC7Q1GB	sp_01KKB6VE1XDK6CBQ378CHJNVF3	prodsp_01KKB6VTC1XKAMST95QB9ZQ8Z4	2026-03-10 11:57:33.377298+05:30	2026-03-12 16:03:09.169+05:30	2026-03-12 16:03:09.168+05:30
\.


--
-- Data for Name: product_tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_tag (id, value, metadata, created_at, updated_at, deleted_at) FROM stdin;
ptag_01KKK0XX2MQGDF3F6QV50T2HW5	session	\N	2026-03-13 12:47:45.684+05:30	2026-03-13 12:47:45.684+05:30	\N
ptag_01KKK3V5AM4ZCHNTK1WNWWFF3V	audio	\N	2026-03-13 13:38:41.556+05:30	2026-03-13 13:38:41.556+05:30	\N
ptag_01KKK3V5AVZ2WGV8137N5FSNM3	video	\N	2026-03-13 13:38:41.563+05:30	2026-03-13 13:38:41.563+05:30	\N
\.


--
-- Data for Name: product_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_tags (product_id, product_tag_id) FROM stdin;
prod_01KKTNA7JBNG7PVCK2D7VFVEG0	ptag_01KKK0XX2MQGDF3F6QV50T2HW5
prod_01KKTNFA12ZYJMT053XBDDXXHX	ptag_01KKK0XX2MQGDF3F6QV50T2HW5
prod_01KKTNFA12ZYJMT053XBDDXXHX	ptag_01KKK3V5AM4ZCHNTK1WNWWFF3V
prod_01KKTQ8QPN5Y2K8ZAB53CHDB12	ptag_01KKK0XX2MQGDF3F6QV50T2HW5
prod_01KKTQ8QPN5Y2K8ZAB53CHDB12	ptag_01KKK3V5AM4ZCHNTK1WNWWFF3V
prod_01KKTQC820Z82HT7ZNZAPRENCW	ptag_01KKK0XX2MQGDF3F6QV50T2HW5
prod_01KKTQC820Z82HT7ZNZAPRENCW	ptag_01KKK3V5AM4ZCHNTK1WNWWFF3V
prod_01KKTR6NCKGH4S7ZZKT8ESKT41	ptag_01KKK0XX2MQGDF3F6QV50T2HW5
prod_01KKTR6NCKGH4S7ZZKT8ESKT41	ptag_01KKK3V5AM4ZCHNTK1WNWWFF3V
prod_01KKTYN1SKJF99NAKB81G9R1NX	ptag_01KKK0XX2MQGDF3F6QV50T2HW5
prod_01KKTYN1SKJF99NAKB81G9R1NX	ptag_01KKK3V5AM4ZCHNTK1WNWWFF3V
prod_01KKTYN1SKJF99NAKB81G9R1NX	ptag_01KKK3V5AVZ2WGV8137N5FSNM3
prod_01KKTZ7JMM93QMPPSH61S8DP7K	ptag_01KKK0XX2MQGDF3F6QV50T2HW5
prod_01KKTZ7JMM93QMPPSH61S8DP7K	ptag_01KKK3V5AVZ2WGV8137N5FSNM3
prod_01KKTZ7JMM93QMPPSH61S8DP7K	ptag_01KKK3V5AM4ZCHNTK1WNWWFF3V
prod_01KKTNA7JBNG7PVCK2D7VFVEG0	ptag_01KKK3V5AVZ2WGV8137N5FSNM3
prod_01KKTNA7JBNG7PVCK2D7VFVEG0	ptag_01KKK3V5AM4ZCHNTK1WNWWFF3V
prod_01KKV08VDQQ210Z466H8Z4P9NY	ptag_01KKK0XX2MQGDF3F6QV50T2HW5
prod_01KKV08VDQQ210Z466H8Z4P9NY	ptag_01KKK3V5AM4ZCHNTK1WNWWFF3V
prod_01KKV08VDQQ210Z466H8Z4P9NY	ptag_01KKK3V5AVZ2WGV8137N5FSNM3
prod_01KKTQC820Z82HT7ZNZAPRENCW	ptag_01KKK3V5AVZ2WGV8137N5FSNM3
\.


--
-- Data for Name: product_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_type (id, value, metadata, created_at, updated_at, deleted_at) FROM stdin;
ptyp_01KKK18C4KW84N78TGBEJTCHK7	session	\N	2026-03-13 12:53:28.788+05:30	2026-03-13 12:53:28.788+05:30	\N
ptyp_01KKK191M4M8TNV49Z8R0WGZTR	product	\N	2026-03-13 12:53:50.789+05:30	2026-03-13 12:53:50.789+05:30	\N
\.


--
-- Data for Name: product_variant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant (id, title, sku, barcode, ean, upc, allow_backorder, manage_inventory, hs_code, origin_country, mid_code, material, weight, length, height, width, metadata, variant_rank, product_id, created_at, updated_at, deleted_at, thumbnail) FROM stdin;
variant_01KKBDMEQ86XYK4EHA438X4FPE	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKBDMEKJY42ZVZNDDP102XVQ	2026-03-10 13:55:52.104+05:30	2026-03-12 16:02:32.641+05:30	2026-03-12 16:02:32.626+05:30	\N
variant_01KKB6VT5DKHSAVZG3GTK1EK82	Standard	\N	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKB6VT3TZZFRMNP201QPVDTK	2026-03-10 11:57:33.165+05:30	2026-03-12 16:02:38.022+05:30	2026-03-12 16:02:38.011+05:30	\N
variant_01KKB6VT77404PJR2B233VB1H5	Standard	\N	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKB6VT6MG5P31Y6NH6W1KRZJ	2026-03-10 11:57:33.223+05:30	2026-03-12 16:02:40.977+05:30	2026-03-12 16:02:40.971+05:30	\N
variant_01KKB6VT90JFVKVR8BBDW3T2Q5	Standard	\N	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKB6VT8GE0JVDMNBMB5CRNTB	2026-03-10 11:57:33.28+05:30	2026-03-12 16:02:43.14+05:30	2026-03-12 16:02:43.137+05:30	\N
variant_01KKB6VTAAG6Y5EEBJ4BW6JPSP	Standard	\N	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKB6VT9V8NQCAT15G2AFEWG7	2026-03-10 11:57:33.322+05:30	2026-03-12 16:02:45.856+05:30	2026-03-12 16:02:45.844+05:30	\N
variant_01KKB6VTB8MCAKX2VP0ANPKYY6	Standard	\N	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKB6VTATHKEEE6MXR51QSD4T	2026-03-10 11:57:33.353+05:30	2026-03-12 16:02:48.98+05:30	2026-03-12 16:02:48.971+05:30	\N
variant_01KKB937CR02BK69WQ51KVHHHT	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKB937AGFSC33DZ1PXMDP86M	2026-03-10 12:36:33.241+05:30	2026-03-12 16:02:51.641+05:30	2026-03-12 16:02:51.639+05:30	\N
variant_01KKB6VTC6APWWPE9TRW04ZMEE	Standard	\N	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKB6VTBTDH1X31R50EC7Q1GB	2026-03-10 11:57:33.382+05:30	2026-03-12 16:03:09.174+05:30	2026-03-12 16:03:09.166+05:30	\N
variant_01KKGFQ2QDQK03XYWVGW9EWN0S	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGFQ2PBH10AEGGBY47EGDWD	2026-03-12 13:08:27.437+05:30	2026-03-12 13:08:27.437+05:30	\N	\N
variant_01KKGFS55KDRFYSF7WM6T7633W	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGFS54N6JFJ00AN1X0B778M	2026-03-12 13:09:35.475+05:30	2026-03-12 13:09:35.475+05:30	\N	\N
variant_01KKGG1ZXQB7M1RE5JM43RBN4R	Crystal Charger – Selenite Plate	\N	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGG1ZW550D0X09AD05PFNJD	2026-03-12 13:14:25.015+05:30	2026-03-12 13:14:25.015+05:30	\N	\N
variant_01KKGT0Q253GY122GAP6K9X9QD	Default variant	33	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGT0Q069BHJ6VP4P98TZEXB	2026-03-12 16:08:28.933+05:30	2026-03-12 16:08:28.933+05:30	\N	\N
variant_01KKGFD3YRQGBEMV90V5T59R6M	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGFD3XJW2DF5NM4N9NH3BPB	2026-03-12 13:03:01.016+05:30	2026-03-12 13:03:01.016+05:30	\N	\N
variant_01KKGFEDPX6Z128JHBGFKBJ9B1	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGFEDP1B71M6E0VAXVCD132	2026-03-12 13:03:43.773+05:30	2026-03-12 13:03:43.773+05:30	\N	\N
variant_01KKGFHZQW7J8EENXMY2ME3CSB	Default variant	\N	\N	\N	\N	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGFHZPZ4ZYDZ8DBZ5Q8CFF5	2026-03-12 13:05:40.54+05:30	2026-03-12 13:05:40.54+05:30	\N	\N
variant_01KKGGBWR83696XCJGNGETCHD1	Rose Quartz Pyramid	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGGBWPWW603YYCM9QSA8M8F	2026-03-12 13:19:49.448+05:30	2026-03-12 13:19:49.448+05:30	\N	\N
variant_01KKGGCYSKC8P1KX9A5K79C1XA	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGGCYRS02FZPXSS5E81Z0VT	2026-03-12 13:20:24.307+05:30	2026-03-12 13:20:24.307+05:30	\N	\N
variant_01KKGGDSHPVYQV4XJH1XN6DCF2	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGGDSGZAQA07E2W95SYWFJY	2026-03-12 13:20:51.702+05:30	2026-03-12 13:20:51.702+05:30	\N	\N
variant_01KKGGETKQ56DWSC48EG0T0AD2	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGGETJS4R9WWQDEZXVC6YKP	2026-03-12 13:21:25.559+05:30	2026-03-12 13:21:25.559+05:30	\N	\N
variant_01KKGGGS9VD4645FXR6KY0NMXD	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGGGS8V9GRPDY2RM0EX5T8V	2026-03-12 13:22:29.756+05:30	2026-03-12 13:22:29.756+05:30	\N	\N
variant_01KKGGSX74CRA0XSKSM7G1VQZ9	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGGSX663XAWMPZPXXZ152T0	2026-03-12 13:27:28.677+05:30	2026-03-12 13:27:28.677+05:30	\N	\N
variant_01KKGGTJRGETB5CRPK4EV3EV8Y	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGGTJQV56K1RZXS5PVCR33Q	2026-03-12 13:27:50.737+05:30	2026-03-12 13:27:50.737+05:30	\N	\N
variant_01KKGH7HJADS57RSD5DZQ0T04Q	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGH7HHH2ZZC94E0HEP3N1PH	2026-03-12 13:34:55.498+05:30	2026-03-12 13:34:55.498+05:30	\N	\N
variant_01KKGH86CZPWDZF8EPVJBXAJQY	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGH86CCFJ4680NM1TTRZBBZ	2026-03-12 13:35:16.831+05:30	2026-03-12 13:35:16.831+05:30	\N	\N
variant_01KKGH9BDF6JF8JQF19KRBVJ7X	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGH9BC3KA041DVWQV1XACAK	2026-03-12 13:35:54.735+05:30	2026-03-12 13:35:54.735+05:30	\N	\N
variant_01KKGHA0145Z4F7G7X77DZMBG9	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGHA00514BHTAHQMFK1BXX5	2026-03-12 13:36:15.845+05:30	2026-03-12 13:36:15.845+05:30	\N	\N
variant_01KKGHBHK3P08F3VPTF5CYV3TY	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGHBHJBDQTRSV188CTFDNR6	2026-03-12 13:37:06.595+05:30	2026-03-12 13:37:06.595+05:30	\N	\N
variant_01KKGHEGRJD2PWV0SK6B316JFY	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGHEGQWSYMSHDTKRG61JRV8	2026-03-12 13:38:44.051+05:30	2026-03-12 13:38:44.051+05:30	\N	\N
variant_01KKGHGGH9W0YJYQZ06NJGK1R2	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGHGGGB544H7EA1GY5RZ1B3	2026-03-12 13:39:49.353+05:30	2026-03-12 13:39:49.353+05:30	\N	\N
variant_01KKGHGZ2JQS1ECGZDTSF7XM8E	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGHGZ1XN4KR4VXRSMX4N1N7	2026-03-12 13:40:04.242+05:30	2026-03-12 13:40:04.242+05:30	\N	\N
variant_01KKGHHPXMKDFS9NQ7T1PHT94G	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGHHPWS4T4BEWQ85AZ3N4H7	2026-03-12 13:40:28.66+05:30	2026-03-12 13:40:28.66+05:30	\N	\N
variant_01KKGEV0WDZTHFH4Q1WY5T75VG	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGEV0T2SE3CBBTHBSCDX5S3	2026-03-12 12:53:08.045+05:30	2026-03-12 12:53:08.045+05:30	\N	\N
variant_01KKGF0JZ9APTJHS8W65E4FH5D	Default variant	999	\N	\N	\N	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGF0JXXE36GBNN7GRRZ0J6F	2026-03-12 12:56:10.409+05:30	2026-03-12 12:56:10.409+05:30	\N	\N
variant_01KKGHC40DXRH9RHMXXK7ZRE4V	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKGHC3ZR2HTWW0GA4D777CPP	2026-03-12 13:37:25.453+05:30	2026-03-12 13:37:25.453+05:30	\N	\N
variant_01KKTNFA3W0E5EP1XRYADW9F05	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKTNFA12ZYJMT053XBDDXXHX	2026-03-16 12:01:28.636+05:30	2026-03-16 12:45:00.563+05:30	2026-03-16 12:45:00.552+05:30	\N
variant_01KKK08Q7Z0Q14YMJJ05J2FG1R	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKK08Q66WYDN10VJ75BDQX47	2026-03-13 12:36:11.583+05:30	2026-03-16 12:47:39.994+05:30	2026-03-16 12:47:39.977+05:30	\N
variant_01KKTQC82ZV4FCCQ94ZAQFSJGC	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKTQC820Z82HT7ZNZAPRENCW	2026-03-16 12:34:45.408+05:30	2026-03-16 13:55:29.214+05:30	2026-03-16 13:55:29.213+05:30	\N
variant_01KKTYFCQAZC7BZA7DC17BQZ2N	Therapy & Counselling Sessions	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKTQ8QPN5Y2K8ZAB53CHDB12	2026-03-16 14:38:48.491+05:30	2026-03-16 14:40:45.072+05:30	2026-03-16 14:40:45.067+05:30	\N
variant_01KKTQ8QRX41CW1C8K6RX2DANP	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKTQ8QPN5Y2K8ZAB53CHDB12	2026-03-16 12:32:50.397+05:30	2026-03-16 14:40:45.072+05:30	2026-03-16 14:40:45.067+05:30	\N
variant_01KKTR6NE542E0SZ9AE5B56455	Tarot Reading	\N	\N	\N	\N	f	f	\N	in	\N	\N	\N	\N	\N	\N	{"label": "video session", "duration": "30 min"}	0	prod_01KKTR6NCKGH4S7ZZKT8ESKT41	2026-03-16 12:49:11.046+05:30	2026-03-16 12:49:11.046+05:30	\N	\N
variant_01KKTZ7JQ2DC3HB3E1XMTZ16QE	video	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	{"label": "video session", "duration": "40 mint"}	0	prod_01KKTZ7JMM93QMPPSH61S8DP7K	2026-03-16 14:52:01.058+05:30	2026-03-16 14:52:01.058+05:30	\N	\N
variant_01KKTYN1TPJFPA54NTVHD5HCX9	Therapy & Counselling Sessions	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	{"label": "audio session", "duration": "35 mint"}	0	prod_01KKTYN1SKJF99NAKB81G9R1NX	2026-03-16 14:41:53.942+05:30	2026-03-16 14:46:32.003+05:30	2026-03-16 14:46:31.955+05:30	\N
variant_01KKTZ937F2FVJ9GDW2J1GZH3A	Therapy & Counselling Sessions	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	{"label": "audio session", "duration": "35 mint"}	0	prod_01KKTZ7JMM93QMPPSH61S8DP7K	2026-03-16 14:52:50.735+05:30	2026-03-16 14:52:50.735+05:30	\N	\N
variant_01KKTNA7N6QGQ1HYA0NREATVNC	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KKTNA7JBNG7PVCK2D7VFVEG0	2026-03-16 11:58:42.278+05:30	2026-03-16 15:09:27.599+05:30	2026-03-16 15:09:27.583+05:30	\N
variant_01KKTZGMMWKJFCJV2TK71VPZMH	Format	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	{"label": "video session", "duration": "30 mint"}	0	prod_01KKTNA7JBNG7PVCK2D7VFVEG0	2026-03-16 14:56:57.948+05:30	2026-03-16 15:09:27.599+05:30	2026-03-16 15:09:27.583+05:30	\N
variant_01KKTZJP6BXQQJNR43WBC8MTFY	Format	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	{"label": "audio session", "duration": "30 mint"}	0	prod_01KKTNA7JBNG7PVCK2D7VFVEG0	2026-03-16 14:58:05.068+05:30	2026-03-16 15:09:27.599+05:30	2026-03-16 15:09:27.583+05:30	\N
variant_01KKV0BYPXF70HTGJK69AM4DMG	Kundali Session	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	{"label": "video session", "duration": "30 mint"}	0	prod_01KKV08VDQQ210Z466H8Z4P9NY	2026-03-16 15:11:52.989+05:30	2026-03-16 15:11:52.989+05:30	\N	\N
variant_01KKV08VEV9PWQH1RXH0FB4HGY	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	{"label": "audio session", "duration": "30 mint"}	0	prod_01KKV08VDQQ210Z466H8Z4P9NY	2026-03-16 15:10:11.355+05:30	2026-03-16 15:10:11.355+05:30	\N	\N
variant_01KKV0KMF9700JE362F2F9JP7R	All-in-1 Astrology	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	{"label": "audio-session", "duration": "40 mint"}	0	prod_01KKTQC820Z82HT7ZNZAPRENCW	2026-03-16 15:16:04.65+05:30	2026-03-16 15:16:04.65+05:30	\N	\N
variant_01KKV0J4ZYQP9QDQV1RKGGKW79	All-in-1 Astrology	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	{"label": "video session", "duration": "40 mint"}	0	prod_01KKTQC820Z82HT7ZNZAPRENCW	2026-03-16 15:15:16.031+05:30	2026-03-16 15:15:16.031+05:30	\N	\N
variant_01KKTWER0W0KP66KP7VJ8PXZ7H	Tarot Reading	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	{"label": "audio session", "cal_link": "kunal-risaanva-m3jown/video-session", "duration": "40 min"}	0	prod_01KKTR6NCKGH4S7ZZKT8ESKT41	2026-03-16 14:03:30.14+05:30	2026-03-16 14:03:30.14+05:30	\N	\N
\.


--
-- Data for Name: product_variant_inventory_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant_inventory_item (variant_id, inventory_item_id, id, required_quantity, created_at, updated_at, deleted_at) FROM stdin;
variant_01KKGF0JZ9APTJHS8W65E4FH5D	iitem_01KKGF0JZE35HM4ZZ5GZ6M8RBX	pvitem_01KKGF0JZQTREVT5DF467HB7SH	1	2026-03-12 12:56:10.423791+05:30	2026-03-12 12:56:10.423791+05:30	\N
variant_01KKGFHZQW7J8EENXMY2ME3CSB	iitem_01KKGFHZR28FB1F7RZTHGFK2TQ	pvitem_01KKGFHZRAMJ6S8RYKEQC60H18	1	2026-03-12 13:05:40.554146+05:30	2026-03-12 13:05:40.554146+05:30	\N
variant_01KKGG1ZXQB7M1RE5JM43RBN4R	iitem_01KKGG1ZXXAJASD66F24D0VGK0	pvitem_01KKGG1ZY5BS6YSS66EQKZG7QD	1	2026-03-12 13:14:25.029805+05:30	2026-03-12 13:14:25.029805+05:30	\N
variant_01KKB6VT5DKHSAVZG3GTK1EK82	iitem_01KKB6VT5M68DX6W4C944ZWQW4	pvitem_01KKB6VT5SQ0DAHX83EXRA32ES	1	2026-03-10 11:57:33.177404+05:30	2026-03-12 16:02:38.002+05:30	2026-03-12 16:02:38.002+05:30
variant_01KKB6VT77404PJR2B233VB1H5	iitem_01KKB6VT7EM9T7FHMWR0A28KTP	pvitem_01KKB6VT8049VEGEQ1MWE6H0AB	1	2026-03-10 11:57:33.236505+05:30	2026-03-12 16:02:40.968+05:30	2026-03-12 16:02:40.968+05:30
variant_01KKB6VT90JFVKVR8BBDW3T2Q5	iitem_01KKB6VT93GQGKX90VQY26ANJ7	pvitem_01KKB6VT97KQWMAEKQS117T48A	1	2026-03-10 11:57:33.287322+05:30	2026-03-12 16:02:43.131+05:30	2026-03-12 16:02:43.131+05:30
variant_01KKB6VTAAG6Y5EEBJ4BW6JPSP	iitem_01KKB6VTAETXHW429F59VMQFP5	pvitem_01KKB6VTAHN96FPPWB158KHRNQ	1	2026-03-10 11:57:33.329441+05:30	2026-03-12 16:02:45.839+05:30	2026-03-12 16:02:45.839+05:30
variant_01KKB6VTB8MCAKX2VP0ANPKYY6	iitem_01KKB6VTBCXVX1R04XE3N7TC3J	pvitem_01KKB6VTBGVDR2FGJ5K31FPA6C	1	2026-03-10 11:57:33.360734+05:30	2026-03-12 16:02:48.954+05:30	2026-03-12 16:02:48.954+05:30
variant_01KKB6VTC6APWWPE9TRW04ZMEE	iitem_01KKB6VTC953R7V5MK3KXD5X1B	pvitem_01KKB6VTCDY9DVMECA91F8N8PG	1	2026-03-10 11:57:33.389561+05:30	2026-03-12 16:03:09.158+05:30	2026-03-12 16:03:09.158+05:30
\.


--
-- Data for Name: product_variant_option; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant_option (variant_id, option_value_id) FROM stdin;
variant_01KKB6VT5DKHSAVZG3GTK1EK82	optval_01KKB6VT3VA1HDMYS64KH13DYX
variant_01KKB6VT77404PJR2B233VB1H5	optval_01KKB6VT6MZFX47P0T42HH805Q
variant_01KKB6VT90JFVKVR8BBDW3T2Q5	optval_01KKB6VT8GYMMH110GT87ADHN3
variant_01KKB6VTAAG6Y5EEBJ4BW6JPSP	optval_01KKB6VT9VA7675TP1VW1RC02W
variant_01KKB6VTB8MCAKX2VP0ANPKYY6	optval_01KKB6VTAVYR1WZ2F786HHCVE2
variant_01KKB6VTC6APWWPE9TRW04ZMEE	optval_01KKB6VTBTXAFF21F84AJHG6M4
variant_01KKB937CR02BK69WQ51KVHHHT	optval_01KKB937AQSTRWE113Q7C5ASZ9
variant_01KKBDMEQ86XYK4EHA438X4FPE	optval_01KKBDMEKWYGX0KYR4B5ZAHBE4
variant_01KKGEV0WDZTHFH4Q1WY5T75VG	optval_01KKGEV0T42HZ63TK1EAZ5KRXP
variant_01KKGF0JZ9APTJHS8W65E4FH5D	optval_01KKGF0JXZ5JSWFH4GYGE437F1
variant_01KKGFD3YRQGBEMV90V5T59R6M	optval_01KKGFD3XMK8J7QYM6QB2K1NWM
variant_01KKGFEDPX6Z128JHBGFKBJ9B1	optval_01KKGFEDP2EAXZMNNNB8YTQD8D
variant_01KKGFHZQW7J8EENXMY2ME3CSB	optval_01KKGFHZQ0K9S5AMB0S7YY4D2T
variant_01KKGFQ2QDQK03XYWVGW9EWN0S	optval_01KKGFQ2PDZ9FP40V7GCK9RGYT
variant_01KKGFS55KDRFYSF7WM6T7633W	optval_01KKGFS54PEBMJAK8SYKQ9Z693
variant_01KKGG1ZXQB7M1RE5JM43RBN4R	optval_01KKGG1ZW6KTPF340NEBBE8P2G
variant_01KKGGBWR83696XCJGNGETCHD1	optval_01KKGGBWPYA1TS2KSTS4PFDCCW
variant_01KKGGCYSKC8P1KX9A5K79C1XA	optval_01KKGGCYRTH3VY59HRQM58YP0W
variant_01KKGGDSHPVYQV4XJH1XN6DCF2	optval_01KKGGDSH0GX7N77Y61D29QTMZ
variant_01KKGGETKQ56DWSC48EG0T0AD2	optval_01KKGGETJTSGY29RK8P9ZW4JSG
variant_01KKGGGS9VD4645FXR6KY0NMXD	optval_01KKGGGS8WPDYEMX7MABYMJZ15
variant_01KKGGSX74CRA0XSKSM7G1VQZ9	optval_01KKGGSX66S5F0FA6P7QHB332N
variant_01KKGGTJRGETB5CRPK4EV3EV8Y	optval_01KKGGTJQW7ZETRX6Y37ME5AG9
variant_01KKGH7HJADS57RSD5DZQ0T04Q	optval_01KKGH7HHJ9W6YAW0WQ6HWA9K0
variant_01KKGH86CZPWDZF8EPVJBXAJQY	optval_01KKGH86CD2HCYTB5GG2A558RE
variant_01KKGH9BDF6JF8JQF19KRBVJ7X	optval_01KKGH9BC34D7Z793Z5NAS6CRJ
variant_01KKGHA0145Z4F7G7X77DZMBG9	optval_01KKGHA006G6EBMV0179EBGY4X
variant_01KKGHBHK3P08F3VPTF5CYV3TY	optval_01KKGHBHJC673FDXFZ36EJ7TWM
variant_01KKGHC40DXRH9RHMXXK7ZRE4V	optval_01KKGHC3ZSKRNDWFZE2NXQ1NVM
variant_01KKGHEGRJD2PWV0SK6B316JFY	optval_01KKGHEGQXVNYQ36PZR2EQSJTN
variant_01KKGHGGH9W0YJYQZ06NJGK1R2	optval_01KKGHGGGCMRFP93CEN6QE4K4M
variant_01KKGHGZ2JQS1ECGZDTSF7XM8E	optval_01KKGHGZ1XTRZ93YE3VPRJ5SWB
variant_01KKGHHPXMKDFS9NQ7T1PHT94G	optval_01KKGHHPWTMV0YMQ8DF89K3X2R
variant_01KKGT0Q253GY122GAP6K9X9QD	optval_01KKGT0Q078YWX5MEQE1TYX7P6
variant_01KKK08Q7Z0Q14YMJJ05J2FG1R	optval_01KKK08Q6884K5JY872ZFGAHJK
variant_01KKTNA7N6QGQ1HYA0NREATVNC	optval_01KKTNA7JCMXXPXRKB0CYE4CRR
variant_01KKTNFA3W0E5EP1XRYADW9F05	optval_01KKTNFA13TKGSNWACDZ50RJ5D
variant_01KKTQ8QRX41CW1C8K6RX2DANP	optval_01KKTQ8QPQQDQKRDVB6126QFJ3
variant_01KKTQC82ZV4FCCQ94ZAQFSJGC	optval_01KKTQC820S8R612MGMBY2CABW
variant_01KKTR6NE542E0SZ9AE5B56455	optval_01KKTRSKC3DYEYGHNNQ4XC19NE
variant_01KKTWER0W0KP66KP7VJ8PXZ7H	optval_01KKTRSKC39XHN4EK6VWXX4PDP
variant_01KKTYFCQAZC7BZA7DC17BQZ2N	optval_01KKTQ8QPQQDQKRDVB6126QFJ3
variant_01KKTYN1TPJFPA54NTVHD5HCX9	optval_01KKTYN1SMBVWA1W87Z30A4K1A
variant_01KKTZ7JQ2DC3HB3E1XMTZ16QE	optval_01KKTZ7JMRM0F7BYSP6G1TBE6A
variant_01KKTZ937F2FVJ9GDW2J1GZH3A	optval_01KKTZ8FG3MC3FGWH8WQX4KQRR
variant_01KKTZJP6BXQQJNR43WBC8MTFY	optval_01KKV03SAYA5RPFWEK8AG875JS
variant_01KKTZGMMWKJFCJV2TK71VPZMH	optval_01KKV03SAY349E6VMN2TJZB15W
variant_01KKV08VEV9PWQH1RXH0FB4HGY	optval_01KKV08VDRSE39S52GBNGPXBBW
variant_01KKV0BYPXF70HTGJK69AM4DMG	optval_01KKV09Z8CFB5C0SY3ADQ665R7
variant_01KKV0BYPXF70HTGJK69AM4DMG	optval_01KKV08VDRSE39S52GBNGPXBBW
variant_01KKV08VEV9PWQH1RXH0FB4HGY	optval_01KKV09Z8CFY7QVW7YM7EQF2V6
variant_01KKV0J4ZYQP9QDQV1RKGGKW79	optval_01KKTQC820S8R612MGMBY2CABW
variant_01KKV0J4ZYQP9QDQV1RKGGKW79	optval_01KKV0H2XZ7SK13B7VPYQCGCSP
variant_01KKV0KMF9700JE362F2F9JP7R	optval_01KKTQC820S8R612MGMBY2CABW
variant_01KKV0KMF9700JE362F2F9JP7R	optval_01KKV0H2XZ5VA63FQP42WBF5CF
\.


--
-- Data for Name: product_variant_price_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant_price_set (variant_id, price_set_id, id, created_at, updated_at, deleted_at) FROM stdin;
variant_01KKGEV0WDZTHFH4Q1WY5T75VG	pset_01KKGEV0WWTGNQDTXVECXSWYHD	pvps_01KKGEV0XAW7PSFVCCYGTMH9H1	2026-03-12 12:53:08.074327+05:30	2026-03-12 12:53:08.074327+05:30	\N
variant_01KKGF0JZ9APTJHS8W65E4FH5D	pset_01KKGF0K08AQ5G53G682WTQQJF	pvps_01KKGF0K0GA6KGTKGSMTDMMSPD	2026-03-12 12:56:10.448534+05:30	2026-03-12 12:56:10.448534+05:30	\N
variant_01KKGFD3YRQGBEMV90V5T59R6M	pset_01KKGFD3Z0AA9TS84EE4TJZ2DZ	pvps_01KKGFD3Z73Y3D07VKSMYKKMAG	2026-03-12 13:03:01.031421+05:30	2026-03-12 13:03:01.031421+05:30	\N
variant_01KKGFEDPX6Z128JHBGFKBJ9B1	pset_01KKGFEDQ80CPB3MQMX7AH9EY5	pvps_01KKGFEDQFSZSQE3ZWVNCETA2S	2026-03-12 13:03:43.79121+05:30	2026-03-12 13:03:43.79121+05:30	\N
variant_01KKGFHZQW7J8EENXMY2ME3CSB	pset_01KKGFHZRECH6NJ67B763BPCYT	pvps_01KKGFHZRY28S4C2FEX9BJ768H	2026-03-12 13:05:40.574513+05:30	2026-03-12 13:05:40.574513+05:30	\N
variant_01KKGFQ2QDQK03XYWVGW9EWN0S	pset_01KKGFQ2QQQPJQ7AKD8VXPJJRB	pvps_01KKGFQ2R7YST74J68FTS0RXER	2026-03-12 13:08:27.463259+05:30	2026-03-12 13:08:27.463259+05:30	\N
variant_01KKGFS55KDRFYSF7WM6T7633W	pset_01KKGFS55XEJR6DQSE1AD8JTMN	pvps_01KKGFS5664M790JQ6Y5JR4XNA	2026-03-12 13:09:35.494173+05:30	2026-03-12 13:09:35.494173+05:30	\N
variant_01KKGG1ZXQB7M1RE5JM43RBN4R	pset_01KKGG1ZY99X1555RKVHR1QH2K	pvps_01KKGG1ZYNY89DXGM06EVM14KT	2026-03-12 13:14:25.045629+05:30	2026-03-12 13:14:25.045629+05:30	\N
variant_01KKGGBWR83696XCJGNGETCHD1	pset_01KKGGBWRR04B0V09J6JRBGR9E	pvps_01KKGGBWRZK0S33NRG6EEX1NH9	2026-03-12 13:19:49.471497+05:30	2026-03-12 13:19:49.471497+05:30	\N
variant_01KKGGCYSKC8P1KX9A5K79C1XA	pset_01KKGGCYSZD6FPVW7A656K81GA	pvps_01KKGGCYT8SS14KKXRP7M1AMZN	2026-03-12 13:20:24.32805+05:30	2026-03-12 13:20:24.32805+05:30	\N
variant_01KKGGDSHPVYQV4XJH1XN6DCF2	pset_01KKGGDSJ1EF1AP0XT83V82GVP	pvps_01KKGGDSJ8E507S2Q80VDYD99W	2026-03-12 13:20:51.720618+05:30	2026-03-12 13:20:51.720618+05:30	\N
variant_01KKGGETKQ56DWSC48EG0T0AD2	pset_01KKGGETKZX9YMBF0NWNR7EAJ4	pvps_01KKGGETMAX99JKG4RJ18PBZN2	2026-03-12 13:21:25.578054+05:30	2026-03-12 13:21:25.578054+05:30	\N
variant_01KKGGGS9VD4645FXR6KY0NMXD	pset_01KKGGGSA5GJ9RFCFB59H7ZXJE	pvps_01KKGGGSAE5Q0WQWHWNM2H6JJY	2026-03-12 13:22:29.774323+05:30	2026-03-12 13:22:29.774323+05:30	\N
variant_01KKGGSX74CRA0XSKSM7G1VQZ9	pset_01KKGGSX7EC6X1H3CJPY04V5GK	pvps_01KKGGSX7PJ9873S1YWA3N07YD	2026-03-12 13:27:28.694776+05:30	2026-03-12 13:27:28.694776+05:30	\N
variant_01KKGGTJRGETB5CRPK4EV3EV8Y	pset_01KKGGTJRVBPMNBPJQMPZEMS3X	pvps_01KKGGTJS0EMSBWCDQV9TMZXMM	2026-03-12 13:27:50.752372+05:30	2026-03-12 13:27:50.752372+05:30	\N
variant_01KKGH7HJADS57RSD5DZQ0T04Q	pset_01KKGH7HJJ4B1F9CA998A2A5ZB	pvps_01KKGH7HJSFRN6MSH2S1RTA5KH	2026-03-12 13:34:55.513877+05:30	2026-03-12 13:34:55.513877+05:30	\N
variant_01KKGH86CZPWDZF8EPVJBXAJQY	pset_01KKGH86D7VJX9Y8THV8S4SDM3	pvps_01KKGH86DCP8ZPGS89V01VND3S	2026-03-12 13:35:16.844342+05:30	2026-03-12 13:35:16.844342+05:30	\N
variant_01KKGH9BDF6JF8JQF19KRBVJ7X	pset_01KKGH9BDQTV7S85K4G7AVP2KX	pvps_01KKGH9BE2PSSGR1RZH4NSK29X	2026-03-12 13:35:54.754396+05:30	2026-03-12 13:35:54.754396+05:30	\N
variant_01KKGHA0145Z4F7G7X77DZMBG9	pset_01KKGHA01DGX2ZS08W6R70JZX2	pvps_01KKGHA01QES1NKVMVRWPPX3HA	2026-03-12 13:36:15.863261+05:30	2026-03-12 13:36:15.863261+05:30	\N
variant_01KKGHBHK3P08F3VPTF5CYV3TY	pset_01KKGHBHKCD32VX7Q1155EXC6J	pvps_01KKGHBHKM7KKG4EE069VQRBKQ	2026-03-12 13:37:06.612429+05:30	2026-03-12 13:37:06.612429+05:30	\N
variant_01KKGHC40DXRH9RHMXXK7ZRE4V	pset_01KKGHC40SYJ1RNBQ7MZFE56QG	pvps_01KKGHC413ES9SEEE4YY3N8FT9	2026-03-12 13:37:25.475484+05:30	2026-03-12 13:37:25.475484+05:30	\N
variant_01KKGHEGRJD2PWV0SK6B316JFY	pset_01KKGHEGRRDBX41P4RZF5WGMFB	pvps_01KKGHEGRYKZY8G5EZ7F6QNMF7	2026-03-12 13:38:44.062165+05:30	2026-03-12 13:38:44.062165+05:30	\N
variant_01KKGHGGH9W0YJYQZ06NJGK1R2	pset_01KKGHGGHKB957PSJN4XGHX5SJ	pvps_01KKGHGGHVHVQXAQEY0E7G1DJJ	2026-03-12 13:39:49.371801+05:30	2026-03-12 13:39:49.371801+05:30	\N
variant_01KKGHGZ2JQS1ECGZDTSF7XM8E	pset_01KKGHGZ2YXETBK6H4PG7YMMT0	pvps_01KKGHGZ32AM82CZ75AYAWYMPB	2026-03-12 13:40:04.2588+05:30	2026-03-12 13:40:04.2588+05:30	\N
variant_01KKGHHPXMKDFS9NQ7T1PHT94G	pset_01KKGHHPXXWPYDYH8NZXPDWKR4	pvps_01KKGHHPY6SFVEH628Z673BZFX	2026-03-12 13:40:28.678477+05:30	2026-03-12 13:40:28.678477+05:30	\N
variant_01KKBDMEQ86XYK4EHA438X4FPE	pset_01KKBDMEQMBYCVS6C3832CD7WX	pvps_01KKBDMER3JH0WMFXZ0AGY0N87	2026-03-10 13:55:52.131206+05:30	2026-03-12 16:02:32.63+05:30	2026-03-12 16:02:32.63+05:30
variant_01KKB6VT5DKHSAVZG3GTK1EK82	pset_01KKB6VT5YPEDGRWFE8S0R5Z76	pvps_01KKB6VT6ER3J6DTRHH0CEKQ6F	2026-03-10 11:57:33.198058+05:30	2026-03-12 16:02:38.014+05:30	2026-03-12 16:02:38.014+05:30
variant_01KKB6VT77404PJR2B233VB1H5	pset_01KKB6VT86R9TQ73WRP5GCK4GK	pvps_01KKB6VT8BFD7CT39GCHXJE22N	2026-03-10 11:57:33.25949+05:30	2026-03-12 16:02:40.974+05:30	2026-03-12 16:02:40.974+05:30
variant_01KKB6VT90JFVKVR8BBDW3T2Q5	pset_01KKB6VT98JKKJ5M3E38DT431A	pvps_01KKB6VT9M1HBSNTG8NHNTSYBA	2026-03-10 11:57:33.300528+05:30	2026-03-12 16:02:43.136+05:30	2026-03-12 16:02:43.136+05:30
variant_01KKB6VTAAG6Y5EEBJ4BW6JPSP	pset_01KKB6VTAJMR6W10Q248MXKEXY	pvps_01KKB6VTAQFG797G7GDAXXKPPP	2026-03-10 11:57:33.334987+05:30	2026-03-12 16:02:45.845+05:30	2026-03-12 16:02:45.845+05:30
variant_01KKB6VTB8MCAKX2VP0ANPKYY6	pset_01KKB6VTBJAAG9R6QSY42N65KR	pvps_01KKB6VTBP4K0ZA1A2X70ZFZP1	2026-03-10 11:57:33.366836+05:30	2026-03-12 16:02:48.975+05:30	2026-03-12 16:02:48.975+05:30
variant_01KKB937CR02BK69WQ51KVHHHT	pset_01KKB937DEXCZKSFWR9YHA5BZX	pvps_01KKB937DXJXGZQYXYQD769592	2026-03-10 12:36:33.277296+05:30	2026-03-12 16:02:51.64+05:30	2026-03-12 16:02:51.64+05:30
variant_01KKB6VTC6APWWPE9TRW04ZMEE	pset_01KKB6VTCF190QVWVWB1CBMX1R	pvps_01KKB6VTCKYNDKJHHBX6Y9CY92	2026-03-10 11:57:33.395584+05:30	2026-03-12 16:03:09.168+05:30	2026-03-12 16:03:09.168+05:30
variant_01KKGT0Q253GY122GAP6K9X9QD	pset_01KKGT0Q3A7YEG81665WS3A9AW	pvps_01KKGT0Q3XSZS5MBZ3G90447T7	2026-03-12 16:08:28.989509+05:30	2026-03-12 16:08:28.989509+05:30	\N
variant_01KKTNFA3W0E5EP1XRYADW9F05	pset_01KKTNFA4AKA90RBEDX3FXGVGS	pvps_01KKTNFA4PK3KEY569M3C4WVVM	2026-03-16 12:01:28.662189+05:30	2026-03-16 12:45:00.556+05:30	2026-03-16 12:45:00.555+05:30
variant_01KKK08Q7Z0Q14YMJJ05J2FG1R	pset_01KKK08Q8GJJ6R6ZZWV2W4RM31	pvps_01KKK08Q8Y0RHNV765XCKD63W3	2026-03-13 12:36:11.614003+05:30	2026-03-16 12:47:39.985+05:30	2026-03-16 12:47:39.984+05:30
variant_01KKTR6NE542E0SZ9AE5B56455	pset_01KKTR6NEK2DA8X2RQX8D8MFJE	pvps_01KKTR6NF3PE558W6E1PZ0T5G4	2026-03-16 12:49:11.075113+05:30	2026-03-16 12:49:11.075113+05:30	\N
variant_01KKTQ8QRX41CW1C8K6RX2DANP	pset_01KKTQ8QS90E58VF9AMC6S304F	pvps_01KKTQ8QSQ2MSQFJDCRA43RQQZ	2026-03-16 12:32:50.423134+05:30	2026-03-16 13:53:00.42+05:30	2026-03-16 13:53:00.418+05:30
variant_01KKTQC82ZV4FCCQ94ZAQFSJGC	pset_01KKTQC839KYMWHRS6HJCCPAX8	pvps_01KKTQC83FYYHPHYG4DSKD7BWW	2026-03-16 12:34:45.423789+05:30	2026-03-16 13:55:29.196+05:30	2026-03-16 13:55:29.195+05:30
variant_01KKTWER0W0KP66KP7VJ8PXZ7H	pset_01KKTWER1HWDK1949ST4MM5J1V	pvps_01KKTWER2AVE5C4R90DTCFEY01	2026-03-16 14:03:30.185727+05:30	2026-03-16 14:03:30.185727+05:30	\N
variant_01KKTYFCQAZC7BZA7DC17BQZ2N	pset_01KKTYFCQYNFG9SKWXJGMBPB1F	pvps_01KKTYFCRCPNESMKT7H1HENRMZ	2026-03-16 14:38:48.524082+05:30	2026-03-16 14:40:19.809+05:30	2026-03-16 14:40:19.808+05:30
variant_01KKTYN1TPJFPA54NTVHD5HCX9	pset_01KKTYN1V0DSA87VB92R79ZSMN	pvps_01KKTYN1V9E5QAA6DD4V5AF22T	2026-03-16 14:41:53.961416+05:30	2026-03-16 14:46:31.954+05:30	2026-03-16 14:46:31.953+05:30
variant_01KKTZ7JQ2DC3HB3E1XMTZ16QE	pset_01KKTZ7JQMBYK90THA8TDMR1DK	pvps_01KKTZ7JR61DH0XB5TS3CGRP0Z	2026-03-16 14:52:01.094499+05:30	2026-03-16 14:52:01.094499+05:30	\N
variant_01KKTZ937F2FVJ9GDW2J1GZH3A	pset_01KKTZ937W6ENYAZZPQBY583KZ	pvps_01KKTZ93858RBH370ZV1T78X0S	2026-03-16 14:52:50.757592+05:30	2026-03-16 14:52:50.757592+05:30	\N
variant_01KKTNA7N6QGQ1HYA0NREATVNC	pset_01KKTNA7NSJX5KCYAYPCGGS6K9	pvps_01KKTNA7P8PT11W1KEDZJPFNQ3	2026-03-16 11:58:42.31228+05:30	2026-03-16 14:54:58.137+05:30	2026-03-16 14:54:58.134+05:30
variant_01KKTZGMMWKJFCJV2TK71VPZMH	pset_01KKTZGMNESN2XC94297D21PKK	pvps_01KKTZGMP1G5GPGYPADJZ17X67	2026-03-16 14:56:57.984746+05:30	2026-03-16 15:09:27.59+05:30	2026-03-16 15:09:27.59+05:30
variant_01KKTZJP6BXQQJNR43WBC8MTFY	pset_01KKTZJP6RQ96VBDX2TGCWTGEQ	pvps_01KKTZJP6YPMKE7EGS2BJ1ZV2N	2026-03-16 14:58:05.086649+05:30	2026-03-16 15:09:27.59+05:30	2026-03-16 15:09:27.59+05:30
variant_01KKV08VEV9PWQH1RXH0FB4HGY	pset_01KKV08VF6RZ18D0FKBWJSHEN8	pvps_01KKV08VFF46NBHE37243HZA1K	2026-03-16 15:10:11.375568+05:30	2026-03-16 15:10:11.375568+05:30	\N
variant_01KKV0BYPXF70HTGJK69AM4DMG	pset_01KKV0BYQFZ5SZD1DF9BMMXYFY	pvps_01KKV0BYQWF8CBJ0MS4PS4AZGZ	2026-03-16 15:11:53.020215+05:30	2026-03-16 15:11:53.020215+05:30	\N
variant_01KKV0J4ZYQP9QDQV1RKGGKW79	pset_01KKV0J50DWYZPPJDPV6KD7F4V	pvps_01KKV0J50ZG5MN4AB756YY6ZND	2026-03-16 15:15:16.063707+05:30	2026-03-16 15:15:16.063707+05:30	\N
variant_01KKV0KMF9700JE362F2F9JP7R	pset_01KKV0KMG059BFC3YV0KDA3VXX	pvps_01KKV0KMGBXD4DA49QGZ0YBER1	2026-03-16 15:16:04.683327+05:30	2026-03-16 15:16:04.683327+05:30	\N
\.


--
-- Data for Name: product_variant_product_image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant_product_image (id, variant_id, image_id, created_at, updated_at, deleted_at) FROM stdin;
pvpi_01KKTRWJTNX1TT9WX9MDS57779	variant_01KKTR6NE542E0SZ9AE5B56455	img_01KKTR6NCNQ9XCJ5VE8T2AGMAH	2026-03-16 13:01:09.27+05:30	2026-03-16 13:01:09.27+05:30	\N
\.


--
-- Data for Name: promotion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion (id, code, campaign_id, is_automatic, type, created_at, updated_at, deleted_at, status, is_tax_inclusive, "limit", used, metadata) FROM stdin;
\.


--
-- Data for Name: promotion_application_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_application_method (id, value, raw_value, max_quantity, apply_to_quantity, buy_rules_min_quantity, type, target_type, allocation, promotion_id, created_at, updated_at, deleted_at, currency_code) FROM stdin;
\.


--
-- Data for Name: promotion_campaign; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_campaign (id, name, description, campaign_identifier, starts_at, ends_at, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: promotion_campaign_budget; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_campaign_budget (id, type, campaign_id, "limit", raw_limit, used, raw_used, created_at, updated_at, deleted_at, currency_code, attribute) FROM stdin;
\.


--
-- Data for Name: promotion_campaign_budget_usage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_campaign_budget_usage (id, attribute_value, used, budget_id, raw_used, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: promotion_promotion_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_promotion_rule (promotion_id, promotion_rule_id) FROM stdin;
\.


--
-- Data for Name: promotion_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_rule (id, description, attribute, operator, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: promotion_rule_value; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_rule_value (id, promotion_rule_id, value, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: provider_identity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.provider_identity (id, entity_id, provider, auth_identity_id, user_metadata, provider_metadata, created_at, updated_at, deleted_at) FROM stdin;
01KKB74WW6YDYTBW4NXJ1CPA7R	admin@admin.com	emailpass	authid_01KKB74WW61QPK5144M9VB75GN	\N	{"password": "c2NyeXB0AA8AAAAIAAAAAYYt6r26YFjpBj6II4sfpVxq0wwjzpMGo5+cPBwGRmmTeGv7jFecyidNQ0bJCO2WwkxzJuj6i99pBxCcqn+pk065owNuEqkHd/ZVlXMZe98K"}	2026-03-10 12:02:30.854+05:30	2026-03-10 12:02:30.854+05:30	\N
01KKBNF62NXWJBTTB51HH4B76A	kunalrisaanva12@gmail.com	emailpass	authid_01KKBNF62Q3DX94KHR72XXH6HC	\N	{"password": "c2NyeXB0AA8AAAAIAAAAAUzt3EMb7jKBF781I4JNtmwP+9frOzil1RUhDaXIw4HkWY/fpodAnle2hewH8iw5X357eD2XueNlnYyVYqkpa6uvMt7Y5G1uGytZCgn3UqQP"}	2026-03-10 16:12:48.032+05:30	2026-03-10 16:12:48.032+05:30	\N
\.


--
-- Data for Name: publishable_api_key_sales_channel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.publishable_api_key_sales_channel (publishable_key_id, sales_channel_id, id, created_at, updated_at, deleted_at) FROM stdin;
apk_01KKB6VT37HNAW39V48A86KFN5	sc_01KKB6VT2GA936E202BCVNT0DC	pksc_01KKB6VT3CGHB4TQZYCXFNE5MR	2026-03-10 11:57:33.100134+05:30	2026-03-10 11:57:33.100134+05:30	\N
\.


--
-- Data for Name: refund; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refund (id, amount, raw_amount, payment_id, created_at, updated_at, deleted_at, created_by, metadata, refund_reason_id, note) FROM stdin;
\.


--
-- Data for Name: refund_reason; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refund_reason (id, label, description, metadata, created_at, updated_at, deleted_at, code) FROM stdin;
refr_01KKB6VB570Q289Z6PHKPE9VAC	Shipping Issue	Refund due to lost, delayed, or misdelivered shipment	\N	2026-03-10 11:57:17.763886+05:30	2026-03-10 11:57:17.763886+05:30	\N	shipping_issue
refr_01KKB6VB575ZNFMKD5YWB3GYT3	Customer Care Adjustment	Refund given as goodwill or compensation for inconvenience	\N	2026-03-10 11:57:17.763886+05:30	2026-03-10 11:57:17.763886+05:30	\N	customer_care_adjustment
refr_01KKB6VB570GNZ4FNPQ3KPTQMZ	Pricing Error	Refund to correct an overcharge, missing discount, or incorrect price	\N	2026-03-10 11:57:17.763886+05:30	2026-03-10 11:57:17.763886+05:30	\N	pricing_error
\.


--
-- Data for Name: region; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.region (id, name, currency_code, metadata, created_at, updated_at, deleted_at, automatic_taxes) FROM stdin;
reg_01KKB79PXYZ123	India	inr	\N	2026-03-10 12:07:24.892523+05:30	2026-03-10 12:07:24.892523+05:30	\N	t
\.


--
-- Data for Name: region_country; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.region_country (iso_2, iso_3, num_code, name, display_name, region_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
af	afg	004	AFGHANISTAN	Afghanistan	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
al	alb	008	ALBANIA	Albania	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
dz	dza	012	ALGERIA	Algeria	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
as	asm	016	AMERICAN SAMOA	American Samoa	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ad	and	020	ANDORRA	Andorra	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ao	ago	024	ANGOLA	Angola	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ai	aia	660	ANGUILLA	Anguilla	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
aq	ata	010	ANTARCTICA	Antarctica	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ag	atg	028	ANTIGUA AND BARBUDA	Antigua and Barbuda	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ar	arg	032	ARGENTINA	Argentina	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
am	arm	051	ARMENIA	Armenia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
aw	abw	533	ARUBA	Aruba	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
au	aus	036	AUSTRALIA	Australia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
at	aut	040	AUSTRIA	Austria	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
az	aze	031	AZERBAIJAN	Azerbaijan	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
bs	bhs	044	BAHAMAS	Bahamas	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
bh	bhr	048	BAHRAIN	Bahrain	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
bd	bgd	050	BANGLADESH	Bangladesh	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
bb	brb	052	BARBADOS	Barbados	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
by	blr	112	BELARUS	Belarus	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
be	bel	056	BELGIUM	Belgium	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
bz	blz	084	BELIZE	Belize	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
bj	ben	204	BENIN	Benin	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
bm	bmu	060	BERMUDA	Bermuda	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
bt	btn	064	BHUTAN	Bhutan	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
bo	bol	068	BOLIVIA	Bolivia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
bq	bes	535	BONAIRE, SINT EUSTATIUS AND SABA	Bonaire, Sint Eustatius and Saba	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ba	bih	070	BOSNIA AND HERZEGOVINA	Bosnia and Herzegovina	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
bw	bwa	072	BOTSWANA	Botswana	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
bv	bvd	074	BOUVET ISLAND	Bouvet Island	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
br	bra	076	BRAZIL	Brazil	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
io	iot	086	BRITISH INDIAN OCEAN TERRITORY	British Indian Ocean Territory	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
bn	brn	096	BRUNEI DARUSSALAM	Brunei Darussalam	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
bg	bgr	100	BULGARIA	Bulgaria	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
bf	bfa	854	BURKINA FASO	Burkina Faso	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
bi	bdi	108	BURUNDI	Burundi	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
kh	khm	116	CAMBODIA	Cambodia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
cm	cmr	120	CAMEROON	Cameroon	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ca	can	124	CANADA	Canada	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
cv	cpv	132	CAPE VERDE	Cape Verde	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ky	cym	136	CAYMAN ISLANDS	Cayman Islands	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
cf	caf	140	CENTRAL AFRICAN REPUBLIC	Central African Republic	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
td	tcd	148	CHAD	Chad	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
cl	chl	152	CHILE	Chile	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
cn	chn	156	CHINA	China	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
cx	cxr	162	CHRISTMAS ISLAND	Christmas Island	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
cc	cck	166	COCOS (KEELING) ISLANDS	Cocos (Keeling) Islands	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
co	col	170	COLOMBIA	Colombia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
km	com	174	COMOROS	Comoros	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
cg	cog	178	CONGO	Congo	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
cd	cod	180	CONGO, THE DEMOCRATIC REPUBLIC OF THE	Congo, the Democratic Republic of the	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ck	cok	184	COOK ISLANDS	Cook Islands	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
cr	cri	188	COSTA RICA	Costa Rica	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ci	civ	384	COTE D'IVOIRE	Cote D'Ivoire	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
hr	hrv	191	CROATIA	Croatia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
cu	cub	192	CUBA	Cuba	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
cw	cuw	531	CURAÇAO	Curaçao	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
cy	cyp	196	CYPRUS	Cyprus	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
cz	cze	203	CZECH REPUBLIC	Czech Republic	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
dk	dnk	208	DENMARK	Denmark	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
dj	dji	262	DJIBOUTI	Djibouti	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
dm	dma	212	DOMINICA	Dominica	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
do	dom	214	DOMINICAN REPUBLIC	Dominican Republic	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ec	ecu	218	ECUADOR	Ecuador	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
eg	egy	818	EGYPT	Egypt	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
sv	slv	222	EL SALVADOR	El Salvador	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
gq	gnq	226	EQUATORIAL GUINEA	Equatorial Guinea	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
er	eri	232	ERITREA	Eritrea	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ee	est	233	ESTONIA	Estonia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
et	eth	231	ETHIOPIA	Ethiopia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
fk	flk	238	FALKLAND ISLANDS (MALVINAS)	Falkland Islands (Malvinas)	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
fo	fro	234	FAROE ISLANDS	Faroe Islands	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
fj	fji	242	FIJI	Fiji	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
fi	fin	246	FINLAND	Finland	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
fr	fra	250	FRANCE	France	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
gf	guf	254	FRENCH GUIANA	French Guiana	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
pf	pyf	258	FRENCH POLYNESIA	French Polynesia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
tf	atf	260	FRENCH SOUTHERN TERRITORIES	French Southern Territories	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ga	gab	266	GABON	Gabon	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
gm	gmb	270	GAMBIA	Gambia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ge	geo	268	GEORGIA	Georgia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
de	deu	276	GERMANY	Germany	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
gh	gha	288	GHANA	Ghana	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
gi	gib	292	GIBRALTAR	Gibraltar	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
gr	grc	300	GREECE	Greece	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
gl	grl	304	GREENLAND	Greenland	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
gd	grd	308	GRENADA	Grenada	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
gp	glp	312	GUADELOUPE	Guadeloupe	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
gu	gum	316	GUAM	Guam	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
gt	gtm	320	GUATEMALA	Guatemala	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
gg	ggy	831	GUERNSEY	Guernsey	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
gn	gin	324	GUINEA	Guinea	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
gw	gnb	624	GUINEA-BISSAU	Guinea-Bissau	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
gy	guy	328	GUYANA	Guyana	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ht	hti	332	HAITI	Haiti	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
hm	hmd	334	HEARD ISLAND AND MCDONALD ISLANDS	Heard Island And Mcdonald Islands	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
va	vat	336	HOLY SEE (VATICAN CITY STATE)	Holy See (Vatican City State)	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
hn	hnd	340	HONDURAS	Honduras	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
hk	hkg	344	HONG KONG	Hong Kong	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
hu	hun	348	HUNGARY	Hungary	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
is	isl	352	ICELAND	Iceland	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
id	idn	360	INDONESIA	Indonesia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ir	irn	364	IRAN, ISLAMIC REPUBLIC OF	Iran, Islamic Republic of	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
iq	irq	368	IRAQ	Iraq	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ie	irl	372	IRELAND	Ireland	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
im	imn	833	ISLE OF MAN	Isle Of Man	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
il	isr	376	ISRAEL	Israel	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
it	ita	380	ITALY	Italy	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
jm	jam	388	JAMAICA	Jamaica	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
jp	jpn	392	JAPAN	Japan	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
je	jey	832	JERSEY	Jersey	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
jo	jor	400	JORDAN	Jordan	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
kz	kaz	398	KAZAKHSTAN	Kazakhstan	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ke	ken	404	KENYA	Kenya	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ki	kir	296	KIRIBATI	Kiribati	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
kp	prk	408	KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF	Korea, Democratic People's Republic of	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
kr	kor	410	KOREA, REPUBLIC OF	Korea, Republic of	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
xk	xkx	900	KOSOVO	Kosovo	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
kw	kwt	414	KUWAIT	Kuwait	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
kg	kgz	417	KYRGYZSTAN	Kyrgyzstan	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
la	lao	418	LAO PEOPLE'S DEMOCRATIC REPUBLIC	Lao People's Democratic Republic	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
lv	lva	428	LATVIA	Latvia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
lb	lbn	422	LEBANON	Lebanon	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ls	lso	426	LESOTHO	Lesotho	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
lr	lbr	430	LIBERIA	Liberia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ly	lby	434	LIBYA	Libya	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
li	lie	438	LIECHTENSTEIN	Liechtenstein	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
lt	ltu	440	LITHUANIA	Lithuania	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
lu	lux	442	LUXEMBOURG	Luxembourg	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
mo	mac	446	MACAO	Macao	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
mg	mdg	450	MADAGASCAR	Madagascar	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
mw	mwi	454	MALAWI	Malawi	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
my	mys	458	MALAYSIA	Malaysia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
mv	mdv	462	MALDIVES	Maldives	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ml	mli	466	MALI	Mali	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
mt	mlt	470	MALTA	Malta	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
mh	mhl	584	MARSHALL ISLANDS	Marshall Islands	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
mq	mtq	474	MARTINIQUE	Martinique	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
mr	mrt	478	MAURITANIA	Mauritania	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
mu	mus	480	MAURITIUS	Mauritius	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
yt	myt	175	MAYOTTE	Mayotte	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
mx	mex	484	MEXICO	Mexico	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
fm	fsm	583	MICRONESIA, FEDERATED STATES OF	Micronesia, Federated States of	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
md	mda	498	MOLDOVA, REPUBLIC OF	Moldova, Republic of	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
mc	mco	492	MONACO	Monaco	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
mn	mng	496	MONGOLIA	Mongolia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
me	mne	499	MONTENEGRO	Montenegro	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ms	msr	500	MONTSERRAT	Montserrat	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ma	mar	504	MOROCCO	Morocco	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
mz	moz	508	MOZAMBIQUE	Mozambique	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
mm	mmr	104	MYANMAR	Myanmar	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
na	nam	516	NAMIBIA	Namibia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
nr	nru	520	NAURU	Nauru	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
np	npl	524	NEPAL	Nepal	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
nl	nld	528	NETHERLANDS	Netherlands	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
nc	ncl	540	NEW CALEDONIA	New Caledonia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
nz	nzl	554	NEW ZEALAND	New Zealand	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ni	nic	558	NICARAGUA	Nicaragua	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ne	ner	562	NIGER	Niger	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ng	nga	566	NIGERIA	Nigeria	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
nu	niu	570	NIUE	Niue	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
nf	nfk	574	NORFOLK ISLAND	Norfolk Island	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
mk	mkd	807	NORTH MACEDONIA	North Macedonia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
mp	mnp	580	NORTHERN MARIANA ISLANDS	Northern Mariana Islands	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
no	nor	578	NORWAY	Norway	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
om	omn	512	OMAN	Oman	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
pk	pak	586	PAKISTAN	Pakistan	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
pw	plw	585	PALAU	Palau	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ps	pse	275	PALESTINIAN TERRITORY, OCCUPIED	Palestinian Territory, Occupied	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
pa	pan	591	PANAMA	Panama	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
pg	png	598	PAPUA NEW GUINEA	Papua New Guinea	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
py	pry	600	PARAGUAY	Paraguay	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
pe	per	604	PERU	Peru	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ph	phl	608	PHILIPPINES	Philippines	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
pn	pcn	612	PITCAIRN	Pitcairn	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
pl	pol	616	POLAND	Poland	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
pt	prt	620	PORTUGAL	Portugal	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
pr	pri	630	PUERTO RICO	Puerto Rico	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
qa	qat	634	QATAR	Qatar	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
re	reu	638	REUNION	Reunion	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ro	rom	642	ROMANIA	Romania	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ru	rus	643	RUSSIAN FEDERATION	Russian Federation	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
rw	rwa	646	RWANDA	Rwanda	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
bl	blm	652	SAINT BARTHÉLEMY	Saint Barthélemy	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
sh	shn	654	SAINT HELENA	Saint Helena	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
kn	kna	659	SAINT KITTS AND NEVIS	Saint Kitts and Nevis	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
lc	lca	662	SAINT LUCIA	Saint Lucia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
mf	maf	663	SAINT MARTIN (FRENCH PART)	Saint Martin (French part)	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
pm	spm	666	SAINT PIERRE AND MIQUELON	Saint Pierre and Miquelon	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
vc	vct	670	SAINT VINCENT AND THE GRENADINES	Saint Vincent and the Grenadines	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ws	wsm	882	SAMOA	Samoa	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
sm	smr	674	SAN MARINO	San Marino	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
st	stp	678	SAO TOME AND PRINCIPE	Sao Tome and Principe	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
sa	sau	682	SAUDI ARABIA	Saudi Arabia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
sn	sen	686	SENEGAL	Senegal	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
rs	srb	688	SERBIA	Serbia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
sc	syc	690	SEYCHELLES	Seychelles	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
sl	sle	694	SIERRA LEONE	Sierra Leone	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
sg	sgp	702	SINGAPORE	Singapore	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
sx	sxm	534	SINT MAARTEN	Sint Maarten	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
sk	svk	703	SLOVAKIA	Slovakia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
si	svn	705	SLOVENIA	Slovenia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
sb	slb	090	SOLOMON ISLANDS	Solomon Islands	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
so	som	706	SOMALIA	Somalia	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
za	zaf	710	SOUTH AFRICA	South Africa	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
gs	sgs	239	SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS	South Georgia and the South Sandwich Islands	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ss	ssd	728	SOUTH SUDAN	South Sudan	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
es	esp	724	SPAIN	Spain	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
lk	lka	144	SRI LANKA	Sri Lanka	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
sd	sdn	729	SUDAN	Sudan	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
sr	sur	740	SURINAME	Suriname	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
sj	sjm	744	SVALBARD AND JAN MAYEN	Svalbard and Jan Mayen	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
sz	swz	748	SWAZILAND	Swaziland	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
se	swe	752	SWEDEN	Sweden	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
ch	che	756	SWITZERLAND	Switzerland	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
sy	syr	760	SYRIAN ARAB REPUBLIC	Syrian Arab Republic	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
tw	twn	158	TAIWAN, PROVINCE OF CHINA	Taiwan, Province of China	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
tj	tjk	762	TAJIKISTAN	Tajikistan	\N	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
tz	tza	834	TANZANIA, UNITED REPUBLIC OF	Tanzania, United Republic of	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
th	tha	764	THAILAND	Thailand	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
tl	tls	626	TIMOR LESTE	Timor Leste	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
tg	tgo	768	TOGO	Togo	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
tk	tkl	772	TOKELAU	Tokelau	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
to	ton	776	TONGA	Tonga	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
tt	tto	780	TRINIDAD AND TOBAGO	Trinidad and Tobago	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
tn	tun	788	TUNISIA	Tunisia	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
tr	tur	792	TURKEY	Turkey	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
tm	tkm	795	TURKMENISTAN	Turkmenistan	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
tc	tca	796	TURKS AND CAICOS ISLANDS	Turks and Caicos Islands	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
tv	tuv	798	TUVALU	Tuvalu	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
ug	uga	800	UGANDA	Uganda	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
ua	ukr	804	UKRAINE	Ukraine	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
ae	are	784	UNITED ARAB EMIRATES	United Arab Emirates	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
gb	gbr	826	UNITED KINGDOM	United Kingdom	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
um	umi	581	UNITED STATES MINOR OUTLYING ISLANDS	United States Minor Outlying Islands	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
uy	ury	858	URUGUAY	Uruguay	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
uz	uzb	860	UZBEKISTAN	Uzbekistan	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
vu	vut	548	VANUATU	Vanuatu	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
ve	ven	862	VENEZUELA	Venezuela	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
vn	vnm	704	VIET NAM	Viet Nam	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
vg	vgb	092	VIRGIN ISLANDS, BRITISH	Virgin Islands, British	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
vi	vir	850	VIRGIN ISLANDS, U.S.	Virgin Islands, U.S.	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
wf	wlf	876	WALLIS AND FUTUNA	Wallis and Futuna	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
eh	esh	732	WESTERN SAHARA	Western Sahara	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
ye	yem	887	YEMEN	Yemen	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
zm	zmb	894	ZAMBIA	Zambia	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
zw	zwe	716	ZIMBABWE	Zimbabwe	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
ax	ala	248	ÅLAND ISLANDS	Åland Islands	\N	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
us	usa	840	UNITED STATES	United States	reg_01KKB79PXYZ123	\N	2026-03-10 11:57:20.29+05:30	2026-03-10 11:57:20.29+05:30	\N
in	ind	356	INDIA	India	reg_01KKB79PXYZ123	\N	2026-03-10 11:57:20.289+05:30	2026-03-10 11:57:20.289+05:30	\N
\.


--
-- Data for Name: region_payment_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.region_payment_provider (region_id, payment_provider_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: reservation_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservation_item (id, created_at, updated_at, deleted_at, line_item_id, location_id, quantity, external_id, description, created_by, metadata, inventory_item_id, allow_backorder, raw_quantity) FROM stdin;
\.


--
-- Data for Name: return; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return (id, order_id, claim_id, exchange_id, order_version, display_id, status, no_notification, refund_amount, raw_refund_amount, metadata, created_at, updated_at, deleted_at, received_at, canceled_at, location_id, requested_at, created_by) FROM stdin;
\.


--
-- Data for Name: return_fulfillment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return_fulfillment (return_id, fulfillment_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: return_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return_item (id, return_id, reason_id, item_id, quantity, raw_quantity, received_quantity, raw_received_quantity, note, metadata, created_at, updated_at, deleted_at, damaged_quantity, raw_damaged_quantity) FROM stdin;
\.


--
-- Data for Name: return_reason; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return_reason (id, value, label, description, metadata, parent_return_reason_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: sales_channel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_channel (id, name, description, is_disabled, metadata, created_at, updated_at, deleted_at) FROM stdin;
sc_01KKB6VT2GA936E202BCVNT0DC	Default Sales Channel	Created by Medusa	f	\N	2026-03-10 11:57:33.072+05:30	2026-03-10 11:57:33.072+05:30	\N
\.


--
-- Data for Name: sales_channel_stock_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_channel_stock_location (sales_channel_id, stock_location_id, id, created_at, updated_at, deleted_at) FROM stdin;
sc_01KKB6VT2GA936E202BCVNT0DC	sloc_01KMQ2C4Y3EYJDZ1G9RWFVQAB5	scloc_01KMQ2E3CTDJK9KVNDGY436NTS	2026-03-27 12:46:44.569451+05:30	2026-03-27 12:46:44.569451+05:30	\N
\.


--
-- Data for Name: script_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.script_migrations (id, script_name, created_at, finished_at) FROM stdin;
1	migrate-product-shipping-profile.js	2026-03-10 11:57:20.750613+05:30	2026-03-10 11:57:20.768676+05:30
2	migrate-tax-region-provider.js	2026-03-10 11:57:20.770736+05:30	2026-03-10 11:57:20.776428+05:30
\.


--
-- Data for Name: service_zone; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_zone (id, name, metadata, fulfillment_set_id, created_at, updated_at, deleted_at) FROM stdin;
serzo_01KMQ2KNE5MD69P6KVX8GTX0JJ	India Shipping	\N	fuset_01KMQ2GRFHF46DE7YV0YKCYXFJ	2026-03-27 12:49:46.886+05:30	2026-03-27 12:49:46.886+05:30	\N
serzo_01KMQ4TBQYYJTSQXDA2THYY07V	Default Zone	\N	fuset_01KMQ2FTWPXCYAYM88E94SV3A9	2026-03-27 13:28:23.487+05:30	2026-03-27 13:28:23.487+05:30	\N
\.


--
-- Data for Name: shipping_option; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_option (id, name, price_type, service_zone_id, shipping_profile_id, provider_id, data, metadata, shipping_option_type_id, created_at, updated_at, deleted_at) FROM stdin;
so_01KMQ4W15RZ7A2BD20QZPSFR56	Pay on Delivery	flat	serzo_01KMQ4TBQYYJTSQXDA2THYY07V	sp_01KKB6VE1XDK6CBQ378CHJNVF3	manual_manual	\N	\N	sotype_01KMQ4W15R6MD11E5Z6GK2PB9G	2026-03-27 13:29:18.201+05:30	2026-03-27 13:29:18.201+05:30	\N
so_01KMYGBJGWC35PVQPRQZ7CZ1GZ	Standard Delivery	flat	serzo_01KMQ2KNE5MD69P6KVX8GTX0JJ	sp_01KKB6VE1XDK6CBQ378CHJNVF3	manual_manual	\N	\N	sotype_01KMYGBJGW152JXYQNVJ4Y54MV	2026-03-30 10:04:42.845+05:30	2026-03-30 10:04:42.845+05:30	\N
\.


--
-- Data for Name: shipping_option_price_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_option_price_set (shipping_option_id, price_set_id, id, created_at, updated_at, deleted_at) FROM stdin;
so_01KMYGBJGWC35PVQPRQZ7CZ1GZ	pset_01KMYGBJHAZDWKS1MHRTYCNND4	sops_01KMYGBJHSSPFJQ71YQTS7C2Y8	2026-03-30 10:04:42.873463+05:30	2026-03-30 10:04:42.873463+05:30	\N
\.


--
-- Data for Name: shipping_option_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_option_rule (id, attribute, operator, value, shipping_option_id, created_at, updated_at, deleted_at) FROM stdin;
sorul_01KMQ4W15RBME3GFC3K90NZ8KG	region_id	eq	"reg_01KKB79PXYZ123"	so_01KMQ4W15RZ7A2BD20QZPSFR56	2026-03-27 13:29:18.201+05:30	2026-03-27 13:29:18.201+05:30	\N
sorul_01KMYGBJGWCV2SCHAP7NEPN2S0	enabled_in_store	eq	"true"	so_01KMYGBJGWC35PVQPRQZ7CZ1GZ	2026-03-30 10:04:42.845+05:30	2026-03-30 10:04:42.845+05:30	\N
\.


--
-- Data for Name: shipping_option_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_option_type (id, label, description, code, created_at, updated_at, deleted_at) FROM stdin;
sotype_01KMQ4W15R6MD11E5Z6GK2PB9G	Standard	Pay on delivery	standard	2026-03-27 13:29:18.2+05:30	2026-03-27 13:29:18.2+05:30	\N
sotype_01KMYGBJGW152JXYQNVJ4Y54MV	Standard Delivery	Standard delivery to your address	standard-delivery	2026-03-30 10:04:42.845+05:30	2026-03-30 10:04:42.845+05:30	\N
\.


--
-- Data for Name: shipping_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_profile (id, name, type, metadata, created_at, updated_at, deleted_at) FROM stdin;
sp_01KKB6VE1XDK6CBQ378CHJNVF3	Default Shipping Profile	default	\N	2026-03-10 11:57:20.765+05:30	2026-03-10 11:57:20.765+05:30	\N
\.


--
-- Data for Name: stock_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_location (id, created_at, updated_at, deleted_at, name, address_id, metadata) FROM stdin;
sloc_01KMQ2C4Y3EYJDZ1G9RWFVQAB5	2026-03-27 12:45:40.62+05:30	2026-03-27 12:45:40.621+05:30	\N	The Blissful Soul Warehouse	laddr_01KMQ2C4Y1PRX2KX143B20NHKQ	\N
\.


--
-- Data for Name: stock_location_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_location_address (id, created_at, updated_at, deleted_at, address_1, address_2, company, city, country_code, phone, province, postal_code, metadata) FROM stdin;
laddr_01KMQ2C4Y1PRX2KX143B20NHKQ	2026-03-27 12:45:40.617+05:30	2026-03-27 12:45:40.617+05:30	\N	Shakti Nagar			Delhi	in	+919811611341		110007	\N
\.


--
-- Data for Name: store; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store (id, name, default_sales_channel_id, default_region_id, default_location_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
store_01KKB6VT2QYJT1MRFKYN3AWWS4	Medusa Store	sc_01KKB6VT2GA936E202BCVNT0DC	reg_01KKB79PXYZ123	\N	\N	2026-03-10 11:57:33.078867+05:30	2026-03-10 11:57:33.078867+05:30	\N
\.


--
-- Data for Name: store_currency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_currency (id, currency_code, is_default, store_id, created_at, updated_at, deleted_at) FROM stdin;
stocur_01KKGVTYSNF2ZM6AKK4J6AHBCA	eur	f	store_01KKB6VT2QYJT1MRFKYN3AWWS4	2026-03-12 16:40:17.383929+05:30	2026-03-12 16:40:17.383929+05:30	\N
stocur_01KKGVTYSNQ64ZTBK8FBTB7WYX	inr	t	store_01KKB6VT2QYJT1MRFKYN3AWWS4	2026-03-12 16:40:17.383929+05:30	2026-03-12 16:40:17.383929+05:30	\N
\.


--
-- Data for Name: store_locale; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_locale (id, locale_code, store_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: tax_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_provider (id, is_enabled, created_at, updated_at, deleted_at) FROM stdin;
tp_system	t	2026-03-10 11:57:20.285+05:30	2026-03-10 11:57:20.285+05:30	\N
\.


--
-- Data for Name: tax_rate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_rate (id, rate, code, name, is_default, is_combinable, tax_region_id, metadata, created_at, updated_at, created_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: tax_rate_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_rate_rule (id, tax_rate_id, reference_id, reference, metadata, created_at, updated_at, created_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: tax_region; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_region (id, provider_id, country_code, province_code, parent_id, metadata, created_at, updated_at, created_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, first_name, last_name, email, avatar_url, metadata, created_at, updated_at, deleted_at) FROM stdin;
user_01KKB74WTDX61HPKGPNXZ0K7SA	\N	\N	admin@admin.com	\N	\N	2026-03-10 12:02:30.797+05:30	2026-03-10 12:02:30.797+05:30	\N
\.


--
-- Data for Name: user_preference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_preference (id, user_id, key, value, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: user_rbac_role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_rbac_role (user_id, rbac_role_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: view_configuration; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.view_configuration (id, entity, name, user_id, is_system_default, configuration, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: workflow_execution; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workflow_execution (id, workflow_id, transaction_id, execution, context, state, created_at, updated_at, deleted_at, retention_time, run_id) FROM stdin;
\.


--
-- Name: link_module_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.link_module_migrations_id_seq', 38, true);


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 156, true);


--
-- Name: order_change_action_ordering_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_change_action_ordering_seq', 1, false);


--
-- Name: order_claim_display_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_claim_display_id_seq', 1, false);


--
-- Name: order_display_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_display_id_seq', 1, false);


--
-- Name: order_exchange_display_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_exchange_display_id_seq', 1, false);


--
-- Name: return_display_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.return_display_id_seq', 1, false);


--
-- Name: script_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.script_migrations_id_seq', 2, true);


--
-- Name: account_holder account_holder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_holder
    ADD CONSTRAINT account_holder_pkey PRIMARY KEY (id);


--
-- Name: api_key api_key_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_key
    ADD CONSTRAINT api_key_pkey PRIMARY KEY (id);


--
-- Name: application_method_buy_rules application_method_buy_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_buy_rules
    ADD CONSTRAINT application_method_buy_rules_pkey PRIMARY KEY (application_method_id, promotion_rule_id);


--
-- Name: application_method_target_rules application_method_target_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_target_rules
    ADD CONSTRAINT application_method_target_rules_pkey PRIMARY KEY (application_method_id, promotion_rule_id);


--
-- Name: auth_identity auth_identity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_identity
    ADD CONSTRAINT auth_identity_pkey PRIMARY KEY (id);


--
-- Name: capture capture_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capture
    ADD CONSTRAINT capture_pkey PRIMARY KEY (id);


--
-- Name: cart_address cart_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_address
    ADD CONSTRAINT cart_address_pkey PRIMARY KEY (id);


--
-- Name: cart_line_item_adjustment cart_line_item_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item_adjustment
    ADD CONSTRAINT cart_line_item_adjustment_pkey PRIMARY KEY (id);


--
-- Name: cart_line_item cart_line_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item
    ADD CONSTRAINT cart_line_item_pkey PRIMARY KEY (id);


--
-- Name: cart_line_item_tax_line cart_line_item_tax_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item_tax_line
    ADD CONSTRAINT cart_line_item_tax_line_pkey PRIMARY KEY (id);


--
-- Name: cart_payment_collection cart_payment_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_payment_collection
    ADD CONSTRAINT cart_payment_collection_pkey PRIMARY KEY (cart_id, payment_collection_id);


--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- Name: cart_promotion cart_promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_promotion
    ADD CONSTRAINT cart_promotion_pkey PRIMARY KEY (cart_id, promotion_id);


--
-- Name: cart_shipping_method_adjustment cart_shipping_method_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method_adjustment
    ADD CONSTRAINT cart_shipping_method_adjustment_pkey PRIMARY KEY (id);


--
-- Name: cart_shipping_method cart_shipping_method_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method
    ADD CONSTRAINT cart_shipping_method_pkey PRIMARY KEY (id);


--
-- Name: cart_shipping_method_tax_line cart_shipping_method_tax_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method_tax_line
    ADD CONSTRAINT cart_shipping_method_tax_line_pkey PRIMARY KEY (id);


--
-- Name: credit_line credit_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_line
    ADD CONSTRAINT credit_line_pkey PRIMARY KEY (id);


--
-- Name: currency currency_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency
    ADD CONSTRAINT currency_pkey PRIMARY KEY (code);


--
-- Name: customer_account_holder customer_account_holder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_account_holder
    ADD CONSTRAINT customer_account_holder_pkey PRIMARY KEY (customer_id, account_holder_id);


--
-- Name: customer_address customer_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_address
    ADD CONSTRAINT customer_address_pkey PRIMARY KEY (id);


--
-- Name: customer_group_customer customer_group_customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_group_customer
    ADD CONSTRAINT customer_group_customer_pkey PRIMARY KEY (id);


--
-- Name: customer_group customer_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_group
    ADD CONSTRAINT customer_group_pkey PRIMARY KEY (id);


--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_address fulfillment_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_address
    ADD CONSTRAINT fulfillment_address_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_item fulfillment_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_item
    ADD CONSTRAINT fulfillment_item_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_label fulfillment_label_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_label
    ADD CONSTRAINT fulfillment_label_pkey PRIMARY KEY (id);


--
-- Name: fulfillment fulfillment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment
    ADD CONSTRAINT fulfillment_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_provider fulfillment_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_provider
    ADD CONSTRAINT fulfillment_provider_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_set fulfillment_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_set
    ADD CONSTRAINT fulfillment_set_pkey PRIMARY KEY (id);


--
-- Name: geo_zone geo_zone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geo_zone
    ADD CONSTRAINT geo_zone_pkey PRIMARY KEY (id);


--
-- Name: image image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_pkey PRIMARY KEY (id);


--
-- Name: inventory_item inventory_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_item
    ADD CONSTRAINT inventory_item_pkey PRIMARY KEY (id);


--
-- Name: inventory_level inventory_level_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_level
    ADD CONSTRAINT inventory_level_pkey PRIMARY KEY (id);


--
-- Name: invite invite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite
    ADD CONSTRAINT invite_pkey PRIMARY KEY (id);


--
-- Name: link_module_migrations link_module_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link_module_migrations
    ADD CONSTRAINT link_module_migrations_pkey PRIMARY KEY (id);


--
-- Name: link_module_migrations link_module_migrations_table_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link_module_migrations
    ADD CONSTRAINT link_module_migrations_table_name_key UNIQUE (table_name);


--
-- Name: location_fulfillment_provider location_fulfillment_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location_fulfillment_provider
    ADD CONSTRAINT location_fulfillment_provider_pkey PRIMARY KEY (stock_location_id, fulfillment_provider_id);


--
-- Name: location_fulfillment_set location_fulfillment_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location_fulfillment_set
    ADD CONSTRAINT location_fulfillment_set_pkey PRIMARY KEY (stock_location_id, fulfillment_set_id);


--
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


--
-- Name: notification_provider notification_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_provider
    ADD CONSTRAINT notification_provider_pkey PRIMARY KEY (id);


--
-- Name: order_address order_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_address
    ADD CONSTRAINT order_address_pkey PRIMARY KEY (id);


--
-- Name: order_cart order_cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_cart
    ADD CONSTRAINT order_cart_pkey PRIMARY KEY (order_id, cart_id);


--
-- Name: order_change_action order_change_action_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_change_action
    ADD CONSTRAINT order_change_action_pkey PRIMARY KEY (id);


--
-- Name: order_change order_change_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_change
    ADD CONSTRAINT order_change_pkey PRIMARY KEY (id);


--
-- Name: order_claim_item_image order_claim_item_image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_claim_item_image
    ADD CONSTRAINT order_claim_item_image_pkey PRIMARY KEY (id);


--
-- Name: order_claim_item order_claim_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_claim_item
    ADD CONSTRAINT order_claim_item_pkey PRIMARY KEY (id);


--
-- Name: order_claim order_claim_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_claim
    ADD CONSTRAINT order_claim_pkey PRIMARY KEY (id);


--
-- Name: order_credit_line order_credit_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_credit_line
    ADD CONSTRAINT order_credit_line_pkey PRIMARY KEY (id);


--
-- Name: order_exchange_item order_exchange_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_exchange_item
    ADD CONSTRAINT order_exchange_item_pkey PRIMARY KEY (id);


--
-- Name: order_exchange order_exchange_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_exchange
    ADD CONSTRAINT order_exchange_pkey PRIMARY KEY (id);


--
-- Name: order_fulfillment order_fulfillment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_fulfillment
    ADD CONSTRAINT order_fulfillment_pkey PRIMARY KEY (order_id, fulfillment_id);


--
-- Name: order_item order_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_pkey PRIMARY KEY (id);


--
-- Name: order_line_item_adjustment order_line_item_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item_adjustment
    ADD CONSTRAINT order_line_item_adjustment_pkey PRIMARY KEY (id);


--
-- Name: order_line_item order_line_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item
    ADD CONSTRAINT order_line_item_pkey PRIMARY KEY (id);


--
-- Name: order_line_item_tax_line order_line_item_tax_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item_tax_line
    ADD CONSTRAINT order_line_item_tax_line_pkey PRIMARY KEY (id);


--
-- Name: order_payment_collection order_payment_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_payment_collection
    ADD CONSTRAINT order_payment_collection_pkey PRIMARY KEY (order_id, payment_collection_id);


--
-- Name: order order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (id);


--
-- Name: order_promotion order_promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_promotion
    ADD CONSTRAINT order_promotion_pkey PRIMARY KEY (order_id, promotion_id);


--
-- Name: order_shipping_method_adjustment order_shipping_method_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping_method_adjustment
    ADD CONSTRAINT order_shipping_method_adjustment_pkey PRIMARY KEY (id);


--
-- Name: order_shipping_method order_shipping_method_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping_method
    ADD CONSTRAINT order_shipping_method_pkey PRIMARY KEY (id);


--
-- Name: order_shipping_method_tax_line order_shipping_method_tax_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping_method_tax_line
    ADD CONSTRAINT order_shipping_method_tax_line_pkey PRIMARY KEY (id);


--
-- Name: order_shipping order_shipping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping
    ADD CONSTRAINT order_shipping_pkey PRIMARY KEY (id);


--
-- Name: order_summary order_summary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_summary
    ADD CONSTRAINT order_summary_pkey PRIMARY KEY (id);


--
-- Name: order_transaction order_transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_transaction
    ADD CONSTRAINT order_transaction_pkey PRIMARY KEY (id);


--
-- Name: payment_collection_payment_providers payment_collection_payment_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_collection_payment_providers
    ADD CONSTRAINT payment_collection_payment_providers_pkey PRIMARY KEY (payment_collection_id, payment_provider_id);


--
-- Name: payment_collection payment_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_collection
    ADD CONSTRAINT payment_collection_pkey PRIMARY KEY (id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (id);


--
-- Name: payment_provider payment_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_provider
    ADD CONSTRAINT payment_provider_pkey PRIMARY KEY (id);


--
-- Name: payment_session payment_session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_session
    ADD CONSTRAINT payment_session_pkey PRIMARY KEY (id);


--
-- Name: price_list price_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_list
    ADD CONSTRAINT price_list_pkey PRIMARY KEY (id);


--
-- Name: price_list_rule price_list_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_list_rule
    ADD CONSTRAINT price_list_rule_pkey PRIMARY KEY (id);


--
-- Name: price price_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price
    ADD CONSTRAINT price_pkey PRIMARY KEY (id);


--
-- Name: price_preference price_preference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_preference
    ADD CONSTRAINT price_preference_pkey PRIMARY KEY (id);


--
-- Name: price_rule price_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_rule
    ADD CONSTRAINT price_rule_pkey PRIMARY KEY (id);


--
-- Name: price_set price_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_set
    ADD CONSTRAINT price_set_pkey PRIMARY KEY (id);


--
-- Name: product_category product_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_pkey PRIMARY KEY (id);


--
-- Name: product_category_product product_category_product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category_product
    ADD CONSTRAINT product_category_product_pkey PRIMARY KEY (product_id, product_category_id);


--
-- Name: product_collection product_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_collection
    ADD CONSTRAINT product_collection_pkey PRIMARY KEY (id);


--
-- Name: product_option product_option_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_option
    ADD CONSTRAINT product_option_pkey PRIMARY KEY (id);


--
-- Name: product_option_value product_option_value_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_option_value
    ADD CONSTRAINT product_option_value_pkey PRIMARY KEY (id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: product_sales_channel product_sales_channel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sales_channel
    ADD CONSTRAINT product_sales_channel_pkey PRIMARY KEY (product_id, sales_channel_id);


--
-- Name: product_shipping_profile product_shipping_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_shipping_profile
    ADD CONSTRAINT product_shipping_profile_pkey PRIMARY KEY (product_id, shipping_profile_id);


--
-- Name: product_tag product_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_tag
    ADD CONSTRAINT product_tag_pkey PRIMARY KEY (id);


--
-- Name: product_tags product_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_pkey PRIMARY KEY (product_id, product_tag_id);


--
-- Name: product_type product_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_type
    ADD CONSTRAINT product_type_pkey PRIMARY KEY (id);


--
-- Name: product_variant_inventory_item product_variant_inventory_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_inventory_item
    ADD CONSTRAINT product_variant_inventory_item_pkey PRIMARY KEY (variant_id, inventory_item_id);


--
-- Name: product_variant_option product_variant_option_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_option
    ADD CONSTRAINT product_variant_option_pkey PRIMARY KEY (variant_id, option_value_id);


--
-- Name: product_variant product_variant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT product_variant_pkey PRIMARY KEY (id);


--
-- Name: product_variant_price_set product_variant_price_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_price_set
    ADD CONSTRAINT product_variant_price_set_pkey PRIMARY KEY (variant_id, price_set_id);


--
-- Name: product_variant_product_image product_variant_product_image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_product_image
    ADD CONSTRAINT product_variant_product_image_pkey PRIMARY KEY (id);


--
-- Name: promotion_application_method promotion_application_method_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_application_method
    ADD CONSTRAINT promotion_application_method_pkey PRIMARY KEY (id);


--
-- Name: promotion_campaign_budget promotion_campaign_budget_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_campaign_budget
    ADD CONSTRAINT promotion_campaign_budget_pkey PRIMARY KEY (id);


--
-- Name: promotion_campaign_budget_usage promotion_campaign_budget_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_campaign_budget_usage
    ADD CONSTRAINT promotion_campaign_budget_usage_pkey PRIMARY KEY (id);


--
-- Name: promotion_campaign promotion_campaign_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_campaign
    ADD CONSTRAINT promotion_campaign_pkey PRIMARY KEY (id);


--
-- Name: promotion promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion
    ADD CONSTRAINT promotion_pkey PRIMARY KEY (id);


--
-- Name: promotion_promotion_rule promotion_promotion_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_promotion_rule
    ADD CONSTRAINT promotion_promotion_rule_pkey PRIMARY KEY (promotion_id, promotion_rule_id);


--
-- Name: promotion_rule promotion_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_rule
    ADD CONSTRAINT promotion_rule_pkey PRIMARY KEY (id);


--
-- Name: promotion_rule_value promotion_rule_value_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_rule_value
    ADD CONSTRAINT promotion_rule_value_pkey PRIMARY KEY (id);


--
-- Name: provider_identity provider_identity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provider_identity
    ADD CONSTRAINT provider_identity_pkey PRIMARY KEY (id);


--
-- Name: publishable_api_key_sales_channel publishable_api_key_sales_channel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publishable_api_key_sales_channel
    ADD CONSTRAINT publishable_api_key_sales_channel_pkey PRIMARY KEY (publishable_key_id, sales_channel_id);


--
-- Name: refund refund_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund
    ADD CONSTRAINT refund_pkey PRIMARY KEY (id);


--
-- Name: refund_reason refund_reason_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund_reason
    ADD CONSTRAINT refund_reason_pkey PRIMARY KEY (id);


--
-- Name: region_country region_country_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region_country
    ADD CONSTRAINT region_country_pkey PRIMARY KEY (iso_2);


--
-- Name: region_payment_provider region_payment_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region_payment_provider
    ADD CONSTRAINT region_payment_provider_pkey PRIMARY KEY (region_id, payment_provider_id);


--
-- Name: region region_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region
    ADD CONSTRAINT region_pkey PRIMARY KEY (id);


--
-- Name: reservation_item reservation_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_item
    ADD CONSTRAINT reservation_item_pkey PRIMARY KEY (id);


--
-- Name: return_fulfillment return_fulfillment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_fulfillment
    ADD CONSTRAINT return_fulfillment_pkey PRIMARY KEY (return_id, fulfillment_id);


--
-- Name: return_item return_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_item
    ADD CONSTRAINT return_item_pkey PRIMARY KEY (id);


--
-- Name: return return_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return
    ADD CONSTRAINT return_pkey PRIMARY KEY (id);


--
-- Name: return_reason return_reason_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_reason
    ADD CONSTRAINT return_reason_pkey PRIMARY KEY (id);


--
-- Name: sales_channel sales_channel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_channel
    ADD CONSTRAINT sales_channel_pkey PRIMARY KEY (id);


--
-- Name: sales_channel_stock_location sales_channel_stock_location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_channel_stock_location
    ADD CONSTRAINT sales_channel_stock_location_pkey PRIMARY KEY (sales_channel_id, stock_location_id);


--
-- Name: script_migrations script_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.script_migrations
    ADD CONSTRAINT script_migrations_pkey PRIMARY KEY (id);


--
-- Name: service_zone service_zone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_zone
    ADD CONSTRAINT service_zone_pkey PRIMARY KEY (id);


--
-- Name: shipping_option shipping_option_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_pkey PRIMARY KEY (id);


--
-- Name: shipping_option_price_set shipping_option_price_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option_price_set
    ADD CONSTRAINT shipping_option_price_set_pkey PRIMARY KEY (shipping_option_id, price_set_id);


--
-- Name: shipping_option_rule shipping_option_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option_rule
    ADD CONSTRAINT shipping_option_rule_pkey PRIMARY KEY (id);


--
-- Name: shipping_option_type shipping_option_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option_type
    ADD CONSTRAINT shipping_option_type_pkey PRIMARY KEY (id);


--
-- Name: shipping_profile shipping_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_profile
    ADD CONSTRAINT shipping_profile_pkey PRIMARY KEY (id);


--
-- Name: stock_location_address stock_location_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_location_address
    ADD CONSTRAINT stock_location_address_pkey PRIMARY KEY (id);


--
-- Name: stock_location stock_location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_location
    ADD CONSTRAINT stock_location_pkey PRIMARY KEY (id);


--
-- Name: store_currency store_currency_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_currency
    ADD CONSTRAINT store_currency_pkey PRIMARY KEY (id);


--
-- Name: store_locale store_locale_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_locale
    ADD CONSTRAINT store_locale_pkey PRIMARY KEY (id);


--
-- Name: store store_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_pkey PRIMARY KEY (id);


--
-- Name: tax_provider tax_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_provider
    ADD CONSTRAINT tax_provider_pkey PRIMARY KEY (id);


--
-- Name: tax_rate tax_rate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_rate
    ADD CONSTRAINT tax_rate_pkey PRIMARY KEY (id);


--
-- Name: tax_rate_rule tax_rate_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_rate_rule
    ADD CONSTRAINT tax_rate_rule_pkey PRIMARY KEY (id);


--
-- Name: tax_region tax_region_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_region
    ADD CONSTRAINT tax_region_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user_preference user_preference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preference
    ADD CONSTRAINT user_preference_pkey PRIMARY KEY (id);


--
-- Name: user_rbac_role user_rbac_role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_rbac_role
    ADD CONSTRAINT user_rbac_role_pkey PRIMARY KEY (user_id, rbac_role_id);


--
-- Name: view_configuration view_configuration_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.view_configuration
    ADD CONSTRAINT view_configuration_pkey PRIMARY KEY (id);


--
-- Name: workflow_execution workflow_execution_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_execution
    ADD CONSTRAINT workflow_execution_pkey PRIMARY KEY (workflow_id, transaction_id, run_id);


--
-- Name: IDX_account_holder_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_account_holder_deleted_at" ON public.account_holder USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_account_holder_id_5cb3a0c0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_account_holder_id_5cb3a0c0" ON public.customer_account_holder USING btree (account_holder_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_account_holder_provider_id_external_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_account_holder_provider_id_external_id_unique" ON public.account_holder USING btree (provider_id, external_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_api_key_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_api_key_deleted_at" ON public.api_key USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_api_key_redacted; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_api_key_redacted" ON public.api_key USING btree (redacted) WHERE (deleted_at IS NULL);


--
-- Name: IDX_api_key_revoked_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_api_key_revoked_at" ON public.api_key USING btree (revoked_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_api_key_token_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_api_key_token_unique" ON public.api_key USING btree (token);


--
-- Name: IDX_api_key_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_api_key_type" ON public.api_key USING btree (type);


--
-- Name: IDX_application_method_allocation; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_application_method_allocation" ON public.promotion_application_method USING btree (allocation);


--
-- Name: IDX_application_method_target_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_application_method_target_type" ON public.promotion_application_method USING btree (target_type);


--
-- Name: IDX_application_method_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_application_method_type" ON public.promotion_application_method USING btree (type);


--
-- Name: IDX_auth_identity_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_auth_identity_deleted_at" ON public.auth_identity USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_campaign_budget_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_campaign_budget_type" ON public.promotion_campaign_budget USING btree (type);


--
-- Name: IDX_capture_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_capture_deleted_at" ON public.capture USING btree (deleted_at);


--
-- Name: IDX_capture_payment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_capture_payment_id" ON public.capture USING btree (payment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_address_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_address_deleted_at" ON public.cart_address USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_billing_address_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_billing_address_id" ON public.cart USING btree (billing_address_id) WHERE ((deleted_at IS NULL) AND (billing_address_id IS NOT NULL));


--
-- Name: IDX_cart_credit_line_reference_reference_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_credit_line_reference_reference_id" ON public.credit_line USING btree (reference, reference_id) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_currency_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_currency_code" ON public.cart USING btree (currency_code);


--
-- Name: IDX_cart_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_customer_id" ON public.cart USING btree (customer_id) WHERE ((deleted_at IS NULL) AND (customer_id IS NOT NULL));


--
-- Name: IDX_cart_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_deleted_at" ON public.cart USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_id_-4a39f6c9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_id_-4a39f6c9" ON public.cart_payment_collection USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_id_-71069c16; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_id_-71069c16" ON public.order_cart USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_id_-a9d4a70b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_id_-a9d4a70b" ON public.cart_promotion USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_line_item_adjustment_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_adjustment_deleted_at" ON public.cart_line_item_adjustment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_line_item_adjustment_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_adjustment_item_id" ON public.cart_line_item_adjustment USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_line_item_cart_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_cart_id" ON public.cart_line_item USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_line_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_deleted_at" ON public.cart_line_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_line_item_tax_line_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_tax_line_deleted_at" ON public.cart_line_item_tax_line USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_line_item_tax_line_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_tax_line_item_id" ON public.cart_line_item_tax_line USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_region_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_region_id" ON public.cart USING btree (region_id) WHERE ((deleted_at IS NULL) AND (region_id IS NOT NULL));


--
-- Name: IDX_cart_sales_channel_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_sales_channel_id" ON public.cart USING btree (sales_channel_id) WHERE ((deleted_at IS NULL) AND (sales_channel_id IS NOT NULL));


--
-- Name: IDX_cart_shipping_address_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_address_id" ON public.cart USING btree (shipping_address_id) WHERE ((deleted_at IS NULL) AND (shipping_address_id IS NOT NULL));


--
-- Name: IDX_cart_shipping_method_adjustment_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_adjustment_deleted_at" ON public.cart_shipping_method_adjustment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_shipping_method_adjustment_shipping_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_adjustment_shipping_method_id" ON public.cart_shipping_method_adjustment USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_shipping_method_cart_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_cart_id" ON public.cart_shipping_method USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_shipping_method_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_deleted_at" ON public.cart_shipping_method USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_shipping_method_tax_line_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_tax_line_deleted_at" ON public.cart_shipping_method_tax_line USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_shipping_method_tax_line_shipping_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_tax_line_shipping_method_id" ON public.cart_shipping_method_tax_line USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_category_handle_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_category_handle_unique" ON public.product_category USING btree (handle) WHERE (deleted_at IS NULL);


--
-- Name: IDX_collection_handle_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_collection_handle_unique" ON public.product_collection USING btree (handle) WHERE (deleted_at IS NULL);


--
-- Name: IDX_credit_line_cart_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_credit_line_cart_id" ON public.credit_line USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_credit_line_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_credit_line_deleted_at" ON public.credit_line USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_address_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_address_customer_id" ON public.customer_address USING btree (customer_id);


--
-- Name: IDX_customer_address_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_address_deleted_at" ON public.customer_address USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_address_unique_customer_billing; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_customer_address_unique_customer_billing" ON public.customer_address USING btree (customer_id) WHERE (is_default_billing = true);


--
-- Name: IDX_customer_address_unique_customer_shipping; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_customer_address_unique_customer_shipping" ON public.customer_address USING btree (customer_id) WHERE (is_default_shipping = true);


--
-- Name: IDX_customer_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_deleted_at" ON public.customer USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_email_has_account_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_customer_email_has_account_unique" ON public.customer USING btree (email, has_account) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_group_customer_customer_group_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_group_customer_customer_group_id" ON public.customer_group_customer USING btree (customer_group_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_group_customer_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_group_customer_customer_id" ON public.customer_group_customer USING btree (customer_id);


--
-- Name: IDX_customer_group_customer_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_group_customer_deleted_at" ON public.customer_group_customer USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_group_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_group_deleted_at" ON public.customer_group USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_group_name_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_customer_group_name_unique" ON public.customer_group USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_id_5cb3a0c0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_id_5cb3a0c0" ON public.customer_account_holder USING btree (customer_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_deleted_at_-1d67bae40; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-1d67bae40" ON public.publishable_api_key_sales_channel USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-1e5992737; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-1e5992737" ON public.location_fulfillment_provider USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-31ea43a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-31ea43a" ON public.return_fulfillment USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-4a39f6c9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-4a39f6c9" ON public.cart_payment_collection USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-71069c16; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-71069c16" ON public.order_cart USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-71518339; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-71518339" ON public.order_promotion USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-a9d4a70b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-a9d4a70b" ON public.cart_promotion USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-e88adb96; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-e88adb96" ON public.location_fulfillment_set USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-e8d2543e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-e8d2543e" ON public.order_fulfillment USING btree (deleted_at);


--
-- Name: IDX_deleted_at_17a262437; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_17a262437" ON public.product_shipping_profile USING btree (deleted_at);


--
-- Name: IDX_deleted_at_17b4c4e35; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_17b4c4e35" ON public.product_variant_inventory_item USING btree (deleted_at);


--
-- Name: IDX_deleted_at_1c934dab0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_1c934dab0" ON public.region_payment_provider USING btree (deleted_at);


--
-- Name: IDX_deleted_at_20b454295; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_20b454295" ON public.product_sales_channel USING btree (deleted_at);


--
-- Name: IDX_deleted_at_26d06f470; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_26d06f470" ON public.sales_channel_stock_location USING btree (deleted_at);


--
-- Name: IDX_deleted_at_52b23597; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_52b23597" ON public.product_variant_price_set USING btree (deleted_at);


--
-- Name: IDX_deleted_at_5cb3a0c0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_5cb3a0c0" ON public.customer_account_holder USING btree (deleted_at);


--
-- Name: IDX_deleted_at_64ff0c4c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_64ff0c4c" ON public.user_rbac_role USING btree (deleted_at);


--
-- Name: IDX_deleted_at_ba32fa9c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_ba32fa9c" ON public.shipping_option_price_set USING btree (deleted_at);


--
-- Name: IDX_deleted_at_f42b9949; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_f42b9949" ON public.order_payment_collection USING btree (deleted_at);


--
-- Name: IDX_fulfillment_address_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_address_deleted_at" ON public.fulfillment_address USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_deleted_at" ON public.fulfillment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_id_-31ea43a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_id_-31ea43a" ON public.return_fulfillment USING btree (fulfillment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_id_-e8d2543e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_id_-e8d2543e" ON public.order_fulfillment USING btree (fulfillment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_item_deleted_at" ON public.fulfillment_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_item_fulfillment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_item_fulfillment_id" ON public.fulfillment_item USING btree (fulfillment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_item_inventory_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_item_inventory_item_id" ON public.fulfillment_item USING btree (inventory_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_item_line_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_item_line_item_id" ON public.fulfillment_item USING btree (line_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_label_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_label_deleted_at" ON public.fulfillment_label USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_label_fulfillment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_label_fulfillment_id" ON public.fulfillment_label USING btree (fulfillment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_location_id" ON public.fulfillment USING btree (location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_provider_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_provider_deleted_at" ON public.fulfillment_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_provider_id_-1e5992737; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_provider_id_-1e5992737" ON public.location_fulfillment_provider USING btree (fulfillment_provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_set_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_set_deleted_at" ON public.fulfillment_set USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_set_id_-e88adb96; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_set_id_-e88adb96" ON public.location_fulfillment_set USING btree (fulfillment_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_set_name_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_fulfillment_set_name_unique" ON public.fulfillment_set USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_shipping_option_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_shipping_option_id" ON public.fulfillment USING btree (shipping_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_geo_zone_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_geo_zone_city" ON public.geo_zone USING btree (city) WHERE ((deleted_at IS NULL) AND (city IS NOT NULL));


--
-- Name: IDX_geo_zone_country_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_geo_zone_country_code" ON public.geo_zone USING btree (country_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_geo_zone_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_geo_zone_deleted_at" ON public.geo_zone USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_geo_zone_province_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_geo_zone_province_code" ON public.geo_zone USING btree (province_code) WHERE ((deleted_at IS NULL) AND (province_code IS NOT NULL));


--
-- Name: IDX_geo_zone_service_zone_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_geo_zone_service_zone_id" ON public.geo_zone USING btree (service_zone_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_id_-1d67bae40; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-1d67bae40" ON public.publishable_api_key_sales_channel USING btree (id);


--
-- Name: IDX_id_-1e5992737; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-1e5992737" ON public.location_fulfillment_provider USING btree (id);


--
-- Name: IDX_id_-31ea43a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-31ea43a" ON public.return_fulfillment USING btree (id);


--
-- Name: IDX_id_-4a39f6c9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-4a39f6c9" ON public.cart_payment_collection USING btree (id);


--
-- Name: IDX_id_-71069c16; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-71069c16" ON public.order_cart USING btree (id);


--
-- Name: IDX_id_-71518339; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-71518339" ON public.order_promotion USING btree (id);


--
-- Name: IDX_id_-a9d4a70b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-a9d4a70b" ON public.cart_promotion USING btree (id);


--
-- Name: IDX_id_-e88adb96; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-e88adb96" ON public.location_fulfillment_set USING btree (id);


--
-- Name: IDX_id_-e8d2543e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-e8d2543e" ON public.order_fulfillment USING btree (id);


--
-- Name: IDX_id_17a262437; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_17a262437" ON public.product_shipping_profile USING btree (id);


--
-- Name: IDX_id_17b4c4e35; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_17b4c4e35" ON public.product_variant_inventory_item USING btree (id);


--
-- Name: IDX_id_1c934dab0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_1c934dab0" ON public.region_payment_provider USING btree (id);


--
-- Name: IDX_id_20b454295; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_20b454295" ON public.product_sales_channel USING btree (id);


--
-- Name: IDX_id_26d06f470; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_26d06f470" ON public.sales_channel_stock_location USING btree (id);


--
-- Name: IDX_id_52b23597; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_52b23597" ON public.product_variant_price_set USING btree (id);


--
-- Name: IDX_id_5cb3a0c0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_5cb3a0c0" ON public.customer_account_holder USING btree (id);


--
-- Name: IDX_id_64ff0c4c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_64ff0c4c" ON public.user_rbac_role USING btree (id);


--
-- Name: IDX_id_ba32fa9c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_ba32fa9c" ON public.shipping_option_price_set USING btree (id);


--
-- Name: IDX_id_f42b9949; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_f42b9949" ON public.order_payment_collection USING btree (id);


--
-- Name: IDX_image_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_image_deleted_at" ON public.image USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_image_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_image_product_id" ON public.image USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_inventory_item_deleted_at" ON public.inventory_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_inventory_item_id_17b4c4e35; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_inventory_item_id_17b4c4e35" ON public.product_variant_inventory_item USING btree (inventory_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_item_sku; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_inventory_item_sku" ON public.inventory_item USING btree (sku) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_level_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_inventory_level_deleted_at" ON public.inventory_level USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_inventory_level_inventory_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_inventory_level_inventory_item_id" ON public.inventory_level USING btree (inventory_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_level_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_inventory_level_location_id" ON public.inventory_level USING btree (location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_level_location_id_inventory_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_inventory_level_location_id_inventory_item_id" ON public.inventory_level USING btree (inventory_item_id, location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_invite_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_invite_deleted_at" ON public.invite USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_invite_email_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_invite_email_unique" ON public.invite USING btree (email) WHERE (deleted_at IS NULL);


--
-- Name: IDX_invite_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_invite_token" ON public.invite USING btree (token) WHERE (deleted_at IS NULL);


--
-- Name: IDX_line_item_adjustment_promotion_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_line_item_adjustment_promotion_id" ON public.cart_line_item_adjustment USING btree (promotion_id) WHERE ((deleted_at IS NULL) AND (promotion_id IS NOT NULL));


--
-- Name: IDX_line_item_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_line_item_product_id" ON public.cart_line_item USING btree (product_id) WHERE ((deleted_at IS NULL) AND (product_id IS NOT NULL));


--
-- Name: IDX_line_item_product_type_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_line_item_product_type_id" ON public.order_line_item USING btree (product_type_id) WHERE ((deleted_at IS NULL) AND (product_type_id IS NOT NULL));


--
-- Name: IDX_line_item_tax_line_tax_rate_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_line_item_tax_line_tax_rate_id" ON public.cart_line_item_tax_line USING btree (tax_rate_id) WHERE ((deleted_at IS NULL) AND (tax_rate_id IS NOT NULL));


--
-- Name: IDX_line_item_variant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_line_item_variant_id" ON public.cart_line_item USING btree (variant_id) WHERE ((deleted_at IS NULL) AND (variant_id IS NOT NULL));


--
-- Name: IDX_notification_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_notification_deleted_at" ON public.notification USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_notification_idempotency_key_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_notification_idempotency_key_unique" ON public.notification USING btree (idempotency_key) WHERE (deleted_at IS NULL);


--
-- Name: IDX_notification_provider_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_notification_provider_deleted_at" ON public.notification_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_notification_provider_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_notification_provider_id" ON public.notification USING btree (provider_id);


--
-- Name: IDX_notification_receiver_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_notification_receiver_id" ON public.notification USING btree (receiver_id);


--
-- Name: IDX_option_product_id_title_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_option_product_id_title_unique" ON public.product_option USING btree (product_id, title) WHERE (deleted_at IS NULL);


--
-- Name: IDX_option_value_option_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_option_value_option_id_unique" ON public.product_option_value USING btree (option_id, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_address_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_address_customer_id" ON public.order_address USING btree (customer_id);


--
-- Name: IDX_order_address_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_address_deleted_at" ON public.order_address USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_billing_address_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_billing_address_id" ON public."order" USING btree (billing_address_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_action_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_claim_id" ON public.order_change_action USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_action_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_deleted_at" ON public.order_change_action USING btree (deleted_at);


--
-- Name: IDX_order_change_action_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_exchange_id" ON public.order_change_action USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_action_order_change_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_order_change_id" ON public.order_change_action USING btree (order_change_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_action_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_order_id" ON public.order_change_action USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_action_ordering; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_ordering" ON public.order_change_action USING btree (ordering) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_action_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_return_id" ON public.order_change_action USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_change_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_change_type" ON public.order_change USING btree (change_type);


--
-- Name: IDX_order_change_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_claim_id" ON public.order_change USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_deleted_at" ON public.order_change USING btree (deleted_at);


--
-- Name: IDX_order_change_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_exchange_id" ON public.order_change USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_order_id" ON public.order_change USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_order_id_version" ON public.order_change USING btree (order_id, version);


--
-- Name: IDX_order_change_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_return_id" ON public.order_change USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_status" ON public.order_change USING btree (status) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_version" ON public.order_change USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_deleted_at" ON public.order_claim USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_display_id" ON public.order_claim USING btree (display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_item_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_item_claim_id" ON public.order_claim_item USING btree (claim_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_item_deleted_at" ON public.order_claim_item USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_item_image_claim_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_item_image_claim_item_id" ON public.order_claim_item_image USING btree (claim_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_item_image_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_item_image_deleted_at" ON public.order_claim_item_image USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_claim_item_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_item_item_id" ON public.order_claim_item USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_order_id" ON public.order_claim USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_return_id" ON public.order_claim USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_credit_line_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_credit_line_deleted_at" ON public.order_credit_line USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_credit_line_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_credit_line_order_id" ON public.order_credit_line USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_credit_line_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_credit_line_order_id_version" ON public.order_credit_line USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_currency_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_currency_code" ON public."order" USING btree (currency_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_custom_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_order_custom_display_id" ON public."order" USING btree (custom_display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_customer_id" ON public."order" USING btree (customer_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_deleted_at" ON public."order" USING btree (deleted_at);


--
-- Name: IDX_order_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_display_id" ON public."order" USING btree (display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_deleted_at" ON public.order_exchange USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_display_id" ON public.order_exchange USING btree (display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_item_deleted_at" ON public.order_exchange_item USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_item_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_item_exchange_id" ON public.order_exchange_item USING btree (exchange_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_item_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_item_item_id" ON public.order_exchange_item USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_order_id" ON public.order_exchange USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_return_id" ON public.order_exchange USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_id_-71069c16; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_id_-71069c16" ON public.order_cart USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_id_-71518339; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_id_-71518339" ON public.order_promotion USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_id_-e8d2543e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_id_-e8d2543e" ON public.order_fulfillment USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_id_f42b9949; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_id_f42b9949" ON public.order_payment_collection USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_is_draft_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_is_draft_order" ON public."order" USING btree (is_draft_order) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_item_deleted_at" ON public.order_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_item_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_item_item_id" ON public.order_item USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_item_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_item_order_id" ON public.order_item USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_item_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_item_order_id_version" ON public.order_item USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_line_item_adjustment_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_line_item_adjustment_item_id" ON public.order_line_item_adjustment USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_line_item_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_line_item_product_id" ON public.order_line_item USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_line_item_tax_line_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_line_item_tax_line_item_id" ON public.order_line_item_tax_line USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_line_item_variant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_line_item_variant_id" ON public.order_line_item USING btree (variant_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_region_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_region_id" ON public."order" USING btree (region_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_sales_channel_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_sales_channel_id" ON public."order" USING btree (sales_channel_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_address_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_address_id" ON public."order" USING btree (shipping_address_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_claim_id" ON public.order_shipping USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_shipping_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_deleted_at" ON public.order_shipping USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_shipping_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_exchange_id" ON public.order_shipping USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_shipping_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_item_id" ON public.order_shipping USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_method_adjustment_shipping_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_method_adjustment_shipping_method_id" ON public.order_shipping_method_adjustment USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_method_shipping_option_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_method_shipping_option_id" ON public.order_shipping_method USING btree (shipping_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_method_tax_line_shipping_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_method_tax_line_shipping_method_id" ON public.order_shipping_method_tax_line USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_order_id" ON public.order_shipping USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_order_id_version" ON public.order_shipping USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_return_id" ON public.order_shipping USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_shipping_shipping_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_shipping_method_id" ON public.order_shipping USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_summary_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_summary_deleted_at" ON public.order_summary USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_summary_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_summary_order_id_version" ON public.order_summary USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_claim_id" ON public.order_transaction USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_transaction_currency_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_currency_code" ON public.order_transaction USING btree (currency_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_exchange_id" ON public.order_transaction USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_transaction_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_order_id" ON public.order_transaction USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_order_id_version" ON public.order_transaction USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_reference_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_reference_id" ON public.order_transaction USING btree (reference_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_return_id" ON public.order_transaction USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_payment_collection_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_collection_deleted_at" ON public.payment_collection USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_payment_collection_id_-4a39f6c9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_collection_id_-4a39f6c9" ON public.cart_payment_collection USING btree (payment_collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_collection_id_f42b9949; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_collection_id_f42b9949" ON public.order_payment_collection USING btree (payment_collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_deleted_at" ON public.payment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_payment_payment_collection_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_payment_collection_id" ON public.payment USING btree (payment_collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_payment_session_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_payment_session_id" ON public.payment USING btree (payment_session_id);


--
-- Name: IDX_payment_payment_session_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_payment_payment_session_id_unique" ON public.payment USING btree (payment_session_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_provider_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_provider_deleted_at" ON public.payment_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_provider_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_provider_id" ON public.payment USING btree (provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_provider_id_1c934dab0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_provider_id_1c934dab0" ON public.region_payment_provider USING btree (payment_provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_session_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_session_deleted_at" ON public.payment_session USING btree (deleted_at);


--
-- Name: IDX_payment_session_payment_collection_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_session_payment_collection_id" ON public.payment_session USING btree (payment_collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_currency_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_currency_code" ON public.price USING btree (currency_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_deleted_at" ON public.price USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_list_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_deleted_at" ON public.price_list USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_list_id_status_starts_at_ends_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_id_status_starts_at_ends_at" ON public.price_list USING btree (id, status, starts_at, ends_at) WHERE ((deleted_at IS NULL) AND (status = 'active'::text));


--
-- Name: IDX_price_list_rule_attribute; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_rule_attribute" ON public.price_list_rule USING btree (attribute) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_list_rule_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_rule_deleted_at" ON public.price_list_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_list_rule_price_list_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_rule_price_list_id" ON public.price_list_rule USING btree (price_list_id) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_list_rule_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_rule_value" ON public.price_list_rule USING gin (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_preference_attribute_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_price_preference_attribute_value" ON public.price_preference USING btree (attribute, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_preference_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_preference_deleted_at" ON public.price_preference USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_price_list_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_price_list_id" ON public.price USING btree (price_list_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_price_set_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_price_set_id" ON public.price USING btree (price_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_attribute; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_attribute" ON public.price_rule USING btree (attribute) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_attribute_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_attribute_value" ON public.price_rule USING btree (attribute, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_attribute_value_price_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_attribute_value_price_id" ON public.price_rule USING btree (attribute, value, price_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_deleted_at" ON public.price_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_rule_operator; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_operator" ON public.price_rule USING btree (operator);


--
-- Name: IDX_price_rule_operator_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_operator_value" ON public.price_rule USING btree (operator, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_price_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_price_id" ON public.price_rule USING btree (price_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_price_id_attribute_operator_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_price_rule_price_id_attribute_operator_unique" ON public.price_rule USING btree (price_id, attribute, operator) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_set_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_set_deleted_at" ON public.price_set USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_set_id_52b23597; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_set_id_52b23597" ON public.product_variant_price_set USING btree (price_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_set_id_ba32fa9c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_set_id_ba32fa9c" ON public.shipping_option_price_set USING btree (price_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_category_parent_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_category_parent_category_id" ON public.product_category USING btree (parent_category_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_category_path; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_category_path" ON public.product_category USING btree (mpath) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_collection_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_collection_deleted_at" ON public.product_collection USING btree (deleted_at);


--
-- Name: IDX_product_collection_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_collection_id" ON public.product USING btree (collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_deleted_at" ON public.product USING btree (deleted_at);


--
-- Name: IDX_product_handle_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_product_handle_unique" ON public.product USING btree (handle) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_id_17a262437; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_id_17a262437" ON public.product_shipping_profile USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_id_20b454295; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_id_20b454295" ON public.product_sales_channel USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_image_rank; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_image_rank" ON public.image USING btree (rank) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_image_rank_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_image_rank_product_id" ON public.image USING btree (rank, product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_image_url; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_image_url" ON public.image USING btree (url) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_image_url_rank_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_image_url_rank_product_id" ON public.image USING btree (url, rank, product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_option_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_option_deleted_at" ON public.product_option USING btree (deleted_at);


--
-- Name: IDX_product_option_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_option_product_id" ON public.product_option USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_option_value_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_option_value_deleted_at" ON public.product_option_value USING btree (deleted_at);


--
-- Name: IDX_product_option_value_option_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_option_value_option_id" ON public.product_option_value USING btree (option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_status" ON public.product USING btree (status) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_tag_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_tag_deleted_at" ON public.product_tag USING btree (deleted_at);


--
-- Name: IDX_product_type_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_type_deleted_at" ON public.product_type USING btree (deleted_at);


--
-- Name: IDX_product_type_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_type_id" ON public.product USING btree (type_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_barcode_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_product_variant_barcode_unique" ON public.product_variant USING btree (barcode) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_deleted_at" ON public.product_variant USING btree (deleted_at);


--
-- Name: IDX_product_variant_ean_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_product_variant_ean_unique" ON public.product_variant USING btree (ean) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_id_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_id_product_id" ON public.product_variant USING btree (id, product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_product_id" ON public.product_variant USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_product_image_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_product_image_deleted_at" ON public.product_variant_product_image USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_product_image_image_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_product_image_image_id" ON public.product_variant_product_image USING btree (image_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_product_image_variant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_product_image_variant_id" ON public.product_variant_product_image USING btree (variant_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_sku_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_product_variant_sku_unique" ON public.product_variant USING btree (sku) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_upc_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_product_variant_upc_unique" ON public.product_variant USING btree (upc) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_application_method_currency_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_application_method_currency_code" ON public.promotion_application_method USING btree (currency_code) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_promotion_application_method_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_application_method_deleted_at" ON public.promotion_application_method USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_application_method_promotion_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_promotion_application_method_promotion_id_unique" ON public.promotion_application_method USING btree (promotion_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_campaign_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_promotion_campaign_budget_campaign_id_unique" ON public.promotion_campaign_budget USING btree (campaign_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_campaign_budget_deleted_at" ON public.promotion_campaign_budget USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_usage_attribute_value_budget_id_u; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_promotion_campaign_budget_usage_attribute_value_budget_id_u" ON public.promotion_campaign_budget_usage USING btree (attribute_value, budget_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_usage_budget_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_campaign_budget_usage_budget_id" ON public.promotion_campaign_budget_usage USING btree (budget_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_usage_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_campaign_budget_usage_deleted_at" ON public.promotion_campaign_budget_usage USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_campaign_identifier_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_promotion_campaign_campaign_identifier_unique" ON public.promotion_campaign USING btree (campaign_identifier) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_campaign_deleted_at" ON public.promotion_campaign USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_campaign_id" ON public.promotion USING btree (campaign_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_deleted_at" ON public.promotion USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_id_-71518339; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_id_-71518339" ON public.order_promotion USING btree (promotion_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_id_-a9d4a70b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_id_-a9d4a70b" ON public.cart_promotion USING btree (promotion_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_is_automatic; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_is_automatic" ON public.promotion USING btree (is_automatic) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_attribute; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_attribute" ON public.promotion_rule USING btree (attribute);


--
-- Name: IDX_promotion_rule_attribute_operator; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_attribute_operator" ON public.promotion_rule USING btree (attribute, operator) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_attribute_operator_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_attribute_operator_id" ON public.promotion_rule USING btree (operator, attribute, id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_deleted_at" ON public.promotion_rule USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_operator; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_operator" ON public.promotion_rule USING btree (operator);


--
-- Name: IDX_promotion_rule_value_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_value_deleted_at" ON public.promotion_rule_value USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_value_promotion_rule_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_value_promotion_rule_id" ON public.promotion_rule_value USING btree (promotion_rule_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_value_rule_id_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_value_rule_id_value" ON public.promotion_rule_value USING btree (promotion_rule_id, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_value_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_value_value" ON public.promotion_rule_value USING btree (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_status" ON public.promotion USING btree (status) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_type" ON public.promotion USING btree (type);


--
-- Name: IDX_provider_identity_auth_identity_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_provider_identity_auth_identity_id" ON public.provider_identity USING btree (auth_identity_id);


--
-- Name: IDX_provider_identity_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_provider_identity_deleted_at" ON public.provider_identity USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_provider_identity_provider_entity_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_provider_identity_provider_entity_id" ON public.provider_identity USING btree (entity_id, provider);


--
-- Name: IDX_publishable_key_id_-1d67bae40; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_publishable_key_id_-1d67bae40" ON public.publishable_api_key_sales_channel USING btree (publishable_key_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_rbac_role_id_64ff0c4c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_rbac_role_id_64ff0c4c" ON public.user_rbac_role USING btree (rbac_role_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_refund_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_refund_deleted_at" ON public.refund USING btree (deleted_at);


--
-- Name: IDX_refund_payment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_refund_payment_id" ON public.refund USING btree (payment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_refund_reason_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_refund_reason_deleted_at" ON public.refund_reason USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_refund_refund_reason_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_refund_refund_reason_id" ON public.refund USING btree (refund_reason_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_region_country_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_region_country_deleted_at" ON public.region_country USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_region_country_region_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_region_country_region_id" ON public.region_country USING btree (region_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_region_country_region_id_iso_2_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_region_country_region_id_iso_2_unique" ON public.region_country USING btree (region_id, iso_2);


--
-- Name: IDX_region_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_region_deleted_at" ON public.region USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_region_id_1c934dab0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_region_id_1c934dab0" ON public.region_payment_provider USING btree (region_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_reservation_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_reservation_item_deleted_at" ON public.reservation_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_reservation_item_inventory_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_reservation_item_inventory_item_id" ON public.reservation_item USING btree (inventory_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_reservation_item_line_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_reservation_item_line_item_id" ON public.reservation_item USING btree (line_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_reservation_item_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_reservation_item_location_id" ON public.reservation_item USING btree (location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_claim_id" ON public.return USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_return_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_display_id" ON public.return USING btree (display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_exchange_id" ON public.return USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_return_id_-31ea43a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_id_-31ea43a" ON public.return_fulfillment USING btree (return_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_item_deleted_at" ON public.return_item USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_item_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_item_item_id" ON public.return_item USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_item_reason_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_item_reason_id" ON public.return_item USING btree (reason_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_item_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_item_return_id" ON public.return_item USING btree (return_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_order_id" ON public.return USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_reason_parent_return_reason_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_reason_parent_return_reason_id" ON public.return_reason USING btree (parent_return_reason_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_reason_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_reason_value" ON public.return_reason USING btree (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_sales_channel_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sales_channel_deleted_at" ON public.sales_channel USING btree (deleted_at);


--
-- Name: IDX_sales_channel_id_-1d67bae40; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sales_channel_id_-1d67bae40" ON public.publishable_api_key_sales_channel USING btree (sales_channel_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_sales_channel_id_20b454295; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sales_channel_id_20b454295" ON public.product_sales_channel USING btree (sales_channel_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_sales_channel_id_26d06f470; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sales_channel_id_26d06f470" ON public.sales_channel_stock_location USING btree (sales_channel_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_service_zone_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_service_zone_deleted_at" ON public.service_zone USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_service_zone_fulfillment_set_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_service_zone_fulfillment_set_id" ON public.service_zone USING btree (fulfillment_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_service_zone_name_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_service_zone_name_unique" ON public.service_zone USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_method_adjustment_promotion_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_method_adjustment_promotion_id" ON public.cart_shipping_method_adjustment USING btree (promotion_id) WHERE ((deleted_at IS NULL) AND (promotion_id IS NOT NULL));


--
-- Name: IDX_shipping_method_option_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_method_option_id" ON public.cart_shipping_method USING btree (shipping_option_id) WHERE ((deleted_at IS NULL) AND (shipping_option_id IS NOT NULL));


--
-- Name: IDX_shipping_method_tax_line_tax_rate_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_method_tax_line_tax_rate_id" ON public.cart_shipping_method_tax_line USING btree (tax_rate_id) WHERE ((deleted_at IS NULL) AND (tax_rate_id IS NOT NULL));


--
-- Name: IDX_shipping_option_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_deleted_at" ON public.shipping_option USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_shipping_option_id_ba32fa9c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_id_ba32fa9c" ON public.shipping_option_price_set USING btree (shipping_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_provider_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_provider_id" ON public.shipping_option USING btree (provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_rule_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_rule_deleted_at" ON public.shipping_option_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_shipping_option_rule_shipping_option_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_rule_shipping_option_id" ON public.shipping_option_rule USING btree (shipping_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_service_zone_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_service_zone_id" ON public.shipping_option USING btree (service_zone_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_shipping_option_type_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_shipping_option_type_id" ON public.shipping_option USING btree (shipping_option_type_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_shipping_profile_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_shipping_profile_id" ON public.shipping_option USING btree (shipping_profile_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_type_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_type_deleted_at" ON public.shipping_option_type USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_shipping_profile_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_profile_deleted_at" ON public.shipping_profile USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_shipping_profile_id_17a262437; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_profile_id_17a262437" ON public.product_shipping_profile USING btree (shipping_profile_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_profile_name_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_shipping_profile_name_unique" ON public.shipping_profile USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_single_default_region; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_single_default_region" ON public.tax_rate USING btree (tax_region_id) WHERE ((is_default = true) AND (deleted_at IS NULL));


--
-- Name: IDX_stock_location_address_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_stock_location_address_deleted_at" ON public.stock_location_address USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_stock_location_address_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_stock_location_address_id_unique" ON public.stock_location USING btree (address_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_stock_location_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_stock_location_deleted_at" ON public.stock_location USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_stock_location_id_-1e5992737; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_stock_location_id_-1e5992737" ON public.location_fulfillment_provider USING btree (stock_location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_stock_location_id_-e88adb96; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_stock_location_id_-e88adb96" ON public.location_fulfillment_set USING btree (stock_location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_stock_location_id_26d06f470; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_stock_location_id_26d06f470" ON public.sales_channel_stock_location USING btree (stock_location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_store_currency_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_store_currency_deleted_at" ON public.store_currency USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_store_currency_store_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_store_currency_store_id" ON public.store_currency USING btree (store_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_store_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_store_deleted_at" ON public.store USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_store_locale_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_store_locale_deleted_at" ON public.store_locale USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_store_locale_store_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_store_locale_store_id" ON public.store_locale USING btree (store_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tag_value_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_tag_value_unique" ON public.product_tag USING btree (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_provider_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_provider_deleted_at" ON public.tax_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_rate_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_rate_deleted_at" ON public.tax_rate USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_tax_rate_rule_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_rate_rule_deleted_at" ON public.tax_rate_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_tax_rate_rule_reference_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_rate_rule_reference_id" ON public.tax_rate_rule USING btree (reference_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_rate_rule_tax_rate_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_rate_rule_tax_rate_id" ON public.tax_rate_rule USING btree (tax_rate_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_rate_rule_unique_rate_reference; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_tax_rate_rule_unique_rate_reference" ON public.tax_rate_rule USING btree (tax_rate_id, reference_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_rate_tax_region_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_rate_tax_region_id" ON public.tax_rate USING btree (tax_region_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_region_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_region_deleted_at" ON public.tax_region USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_tax_region_parent_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_region_parent_id" ON public.tax_region USING btree (parent_id);


--
-- Name: IDX_tax_region_provider_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_region_provider_id" ON public.tax_region USING btree (provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_region_unique_country_nullable_province; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_tax_region_unique_country_nullable_province" ON public.tax_region USING btree (country_code) WHERE ((province_code IS NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_tax_region_unique_country_province; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_tax_region_unique_country_province" ON public.tax_region USING btree (country_code, province_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_type_value_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_type_value_unique" ON public.product_type USING btree (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_unique_promotion_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_unique_promotion_code" ON public.promotion USING btree (code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_user_deleted_at" ON public."user" USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_user_email_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_user_email_unique" ON public."user" USING btree (email) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_id_64ff0c4c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_user_id_64ff0c4c" ON public.user_rbac_role USING btree (user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_preference_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_user_preference_deleted_at" ON public.user_preference USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_preference_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_user_preference_user_id" ON public.user_preference USING btree (user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_preference_user_id_key_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_user_preference_user_id_key_unique" ON public.user_preference USING btree (user_id, key) WHERE (deleted_at IS NULL);


--
-- Name: IDX_variant_id_17b4c4e35; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_variant_id_17b4c4e35" ON public.product_variant_inventory_item USING btree (variant_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_variant_id_52b23597; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_variant_id_52b23597" ON public.product_variant_price_set USING btree (variant_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_view_configuration_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_view_configuration_deleted_at" ON public.view_configuration USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_view_configuration_entity_is_system_default; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_view_configuration_entity_is_system_default" ON public.view_configuration USING btree (entity, is_system_default) WHERE (deleted_at IS NULL);


--
-- Name: IDX_view_configuration_entity_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_view_configuration_entity_user_id" ON public.view_configuration USING btree (entity, user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_view_configuration_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_view_configuration_user_id" ON public.view_configuration USING btree (user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_deleted_at" ON public.workflow_execution USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_id" ON public.workflow_execution USING btree (id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_retention_time_updated_at_state; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_retention_time_updated_at_state" ON public.workflow_execution USING btree (retention_time, updated_at, state) WHERE ((deleted_at IS NULL) AND (retention_time IS NOT NULL));


--
-- Name: IDX_workflow_execution_run_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_run_id" ON public.workflow_execution USING btree (run_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_state; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_state" ON public.workflow_execution USING btree (state) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_state_updated_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_state_updated_at" ON public.workflow_execution USING btree (state, updated_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_transaction_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_transaction_id" ON public.workflow_execution USING btree (transaction_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_updated_at_retention_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_updated_at_retention_time" ON public.workflow_execution USING btree (updated_at, retention_time) WHERE ((deleted_at IS NULL) AND (retention_time IS NOT NULL) AND ((state)::text = ANY ((ARRAY['done'::character varying, 'failed'::character varying, 'reverted'::character varying])::text[])));


--
-- Name: IDX_workflow_execution_workflow_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_workflow_id" ON public.workflow_execution USING btree (workflow_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_workflow_id_transaction_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_workflow_id_transaction_id" ON public.workflow_execution USING btree (workflow_id, transaction_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_workflow_id_transaction_id_run_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_workflow_execution_workflow_id_transaction_id_run_id_unique" ON public.workflow_execution USING btree (workflow_id, transaction_id, run_id) WHERE (deleted_at IS NULL);


--
-- Name: idx_script_name_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_script_name_unique ON public.script_migrations USING btree (script_name);


--
-- Name: tax_rate_rule FK_tax_rate_rule_tax_rate_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_rate_rule
    ADD CONSTRAINT "FK_tax_rate_rule_tax_rate_id" FOREIGN KEY (tax_rate_id) REFERENCES public.tax_rate(id) ON DELETE CASCADE;


--
-- Name: tax_rate FK_tax_rate_tax_region_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_rate
    ADD CONSTRAINT "FK_tax_rate_tax_region_id" FOREIGN KEY (tax_region_id) REFERENCES public.tax_region(id) ON DELETE CASCADE;


--
-- Name: tax_region FK_tax_region_parent_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_region
    ADD CONSTRAINT "FK_tax_region_parent_id" FOREIGN KEY (parent_id) REFERENCES public.tax_region(id) ON DELETE CASCADE;


--
-- Name: tax_region FK_tax_region_provider_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_region
    ADD CONSTRAINT "FK_tax_region_provider_id" FOREIGN KEY (provider_id) REFERENCES public.tax_provider(id) ON DELETE SET NULL;


--
-- Name: application_method_buy_rules application_method_buy_rules_application_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_buy_rules
    ADD CONSTRAINT application_method_buy_rules_application_method_id_foreign FOREIGN KEY (application_method_id) REFERENCES public.promotion_application_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: application_method_buy_rules application_method_buy_rules_promotion_rule_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_buy_rules
    ADD CONSTRAINT application_method_buy_rules_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id) REFERENCES public.promotion_rule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: application_method_target_rules application_method_target_rules_application_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_target_rules
    ADD CONSTRAINT application_method_target_rules_application_method_id_foreign FOREIGN KEY (application_method_id) REFERENCES public.promotion_application_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: application_method_target_rules application_method_target_rules_promotion_rule_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_target_rules
    ADD CONSTRAINT application_method_target_rules_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id) REFERENCES public.promotion_rule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: capture capture_payment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capture
    ADD CONSTRAINT capture_payment_id_foreign FOREIGN KEY (payment_id) REFERENCES public.payment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart cart_billing_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_billing_address_id_foreign FOREIGN KEY (billing_address_id) REFERENCES public.cart_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_line_item_adjustment cart_line_item_adjustment_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item_adjustment
    ADD CONSTRAINT cart_line_item_adjustment_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.cart_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_line_item cart_line_item_cart_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item
    ADD CONSTRAINT cart_line_item_cart_id_foreign FOREIGN KEY (cart_id) REFERENCES public.cart(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_line_item_tax_line cart_line_item_tax_line_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item_tax_line
    ADD CONSTRAINT cart_line_item_tax_line_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.cart_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart cart_shipping_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_shipping_address_id_foreign FOREIGN KEY (shipping_address_id) REFERENCES public.cart_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_shipping_method_adjustment cart_shipping_method_adjustment_shipping_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method_adjustment
    ADD CONSTRAINT cart_shipping_method_adjustment_shipping_method_id_foreign FOREIGN KEY (shipping_method_id) REFERENCES public.cart_shipping_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_shipping_method cart_shipping_method_cart_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method
    ADD CONSTRAINT cart_shipping_method_cart_id_foreign FOREIGN KEY (cart_id) REFERENCES public.cart(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_shipping_method_tax_line cart_shipping_method_tax_line_shipping_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method_tax_line
    ADD CONSTRAINT cart_shipping_method_tax_line_shipping_method_id_foreign FOREIGN KEY (shipping_method_id) REFERENCES public.cart_shipping_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: credit_line credit_line_cart_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_line
    ADD CONSTRAINT credit_line_cart_id_foreign FOREIGN KEY (cart_id) REFERENCES public.cart(id) ON UPDATE CASCADE;


--
-- Name: customer_address customer_address_customer_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_address
    ADD CONSTRAINT customer_address_customer_id_foreign FOREIGN KEY (customer_id) REFERENCES public.customer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: customer_group_customer customer_group_customer_customer_group_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_group_customer
    ADD CONSTRAINT customer_group_customer_customer_group_id_foreign FOREIGN KEY (customer_group_id) REFERENCES public.customer_group(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: customer_group_customer customer_group_customer_customer_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_group_customer
    ADD CONSTRAINT customer_group_customer_customer_id_foreign FOREIGN KEY (customer_id) REFERENCES public.customer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fulfillment fulfillment_delivery_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment
    ADD CONSTRAINT fulfillment_delivery_address_id_foreign FOREIGN KEY (delivery_address_id) REFERENCES public.fulfillment_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: fulfillment_item fulfillment_item_fulfillment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_item
    ADD CONSTRAINT fulfillment_item_fulfillment_id_foreign FOREIGN KEY (fulfillment_id) REFERENCES public.fulfillment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fulfillment_label fulfillment_label_fulfillment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_label
    ADD CONSTRAINT fulfillment_label_fulfillment_id_foreign FOREIGN KEY (fulfillment_id) REFERENCES public.fulfillment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fulfillment fulfillment_provider_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment
    ADD CONSTRAINT fulfillment_provider_id_foreign FOREIGN KEY (provider_id) REFERENCES public.fulfillment_provider(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: fulfillment fulfillment_shipping_option_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment
    ADD CONSTRAINT fulfillment_shipping_option_id_foreign FOREIGN KEY (shipping_option_id) REFERENCES public.shipping_option(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: geo_zone geo_zone_service_zone_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geo_zone
    ADD CONSTRAINT geo_zone_service_zone_id_foreign FOREIGN KEY (service_zone_id) REFERENCES public.service_zone(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: image image_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: inventory_level inventory_level_inventory_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_level
    ADD CONSTRAINT inventory_level_inventory_item_id_foreign FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notification notification_provider_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_provider_id_foreign FOREIGN KEY (provider_id) REFERENCES public.notification_provider(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order order_billing_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_billing_address_id_foreign FOREIGN KEY (billing_address_id) REFERENCES public.order_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_change_action order_change_action_order_change_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_change_action
    ADD CONSTRAINT order_change_action_order_change_id_foreign FOREIGN KEY (order_change_id) REFERENCES public.order_change(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_change order_change_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_change
    ADD CONSTRAINT order_change_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_credit_line order_credit_line_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_credit_line
    ADD CONSTRAINT order_credit_line_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_item order_item_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.order_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_item order_item_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_line_item_adjustment order_line_item_adjustment_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item_adjustment
    ADD CONSTRAINT order_line_item_adjustment_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.order_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_line_item_tax_line order_line_item_tax_line_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item_tax_line
    ADD CONSTRAINT order_line_item_tax_line_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.order_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_line_item order_line_item_totals_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item
    ADD CONSTRAINT order_line_item_totals_id_foreign FOREIGN KEY (totals_id) REFERENCES public.order_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order order_shipping_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_shipping_address_id_foreign FOREIGN KEY (shipping_address_id) REFERENCES public.order_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_shipping_method_adjustment order_shipping_method_adjustment_shipping_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping_method_adjustment
    ADD CONSTRAINT order_shipping_method_adjustment_shipping_method_id_foreign FOREIGN KEY (shipping_method_id) REFERENCES public.order_shipping_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_shipping_method_tax_line order_shipping_method_tax_line_shipping_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping_method_tax_line
    ADD CONSTRAINT order_shipping_method_tax_line_shipping_method_id_foreign FOREIGN KEY (shipping_method_id) REFERENCES public.order_shipping_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_shipping order_shipping_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping
    ADD CONSTRAINT order_shipping_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_summary order_summary_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_summary
    ADD CONSTRAINT order_summary_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_transaction order_transaction_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_transaction
    ADD CONSTRAINT order_transaction_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_collection_payment_providers payment_collection_payment_providers_payment_col_aa276_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_collection_payment_providers
    ADD CONSTRAINT payment_collection_payment_providers_payment_col_aa276_foreign FOREIGN KEY (payment_collection_id) REFERENCES public.payment_collection(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_collection_payment_providers payment_collection_payment_providers_payment_pro_2d555_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_collection_payment_providers
    ADD CONSTRAINT payment_collection_payment_providers_payment_pro_2d555_foreign FOREIGN KEY (payment_provider_id) REFERENCES public.payment_provider(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment payment_payment_collection_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_payment_collection_id_foreign FOREIGN KEY (payment_collection_id) REFERENCES public.payment_collection(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_session payment_session_payment_collection_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_session
    ADD CONSTRAINT payment_session_payment_collection_id_foreign FOREIGN KEY (payment_collection_id) REFERENCES public.payment_collection(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price_list_rule price_list_rule_price_list_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_list_rule
    ADD CONSTRAINT price_list_rule_price_list_id_foreign FOREIGN KEY (price_list_id) REFERENCES public.price_list(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price price_price_list_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price
    ADD CONSTRAINT price_price_list_id_foreign FOREIGN KEY (price_list_id) REFERENCES public.price_list(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price price_price_set_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price
    ADD CONSTRAINT price_price_set_id_foreign FOREIGN KEY (price_set_id) REFERENCES public.price_set(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price_rule price_rule_price_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_rule
    ADD CONSTRAINT price_rule_price_id_foreign FOREIGN KEY (price_id) REFERENCES public.price(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_category product_category_parent_category_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_parent_category_id_foreign FOREIGN KEY (parent_category_id) REFERENCES public.product_category(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_category_product product_category_product_product_category_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category_product
    ADD CONSTRAINT product_category_product_product_category_id_foreign FOREIGN KEY (product_category_id) REFERENCES public.product_category(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_category_product product_category_product_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category_product
    ADD CONSTRAINT product_category_product_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product product_collection_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_collection_id_foreign FOREIGN KEY (collection_id) REFERENCES public.product_collection(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_option product_option_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_option
    ADD CONSTRAINT product_option_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_option_value product_option_value_option_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_option_value
    ADD CONSTRAINT product_option_value_option_id_foreign FOREIGN KEY (option_id) REFERENCES public.product_option(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_tags product_tags_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_tags product_tags_product_tag_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_product_tag_id_foreign FOREIGN KEY (product_tag_id) REFERENCES public.product_tag(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product product_type_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_type_id_foreign FOREIGN KEY (type_id) REFERENCES public.product_type(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_variant_option product_variant_option_option_value_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_option
    ADD CONSTRAINT product_variant_option_option_value_id_foreign FOREIGN KEY (option_value_id) REFERENCES public.product_option_value(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_variant_option product_variant_option_variant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_option
    ADD CONSTRAINT product_variant_option_variant_id_foreign FOREIGN KEY (variant_id) REFERENCES public.product_variant(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_variant product_variant_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT product_variant_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_variant_product_image product_variant_product_image_image_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_product_image
    ADD CONSTRAINT product_variant_product_image_image_id_foreign FOREIGN KEY (image_id) REFERENCES public.image(id) ON DELETE CASCADE;


--
-- Name: promotion_application_method promotion_application_method_promotion_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_application_method
    ADD CONSTRAINT promotion_application_method_promotion_id_foreign FOREIGN KEY (promotion_id) REFERENCES public.promotion(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_campaign_budget promotion_campaign_budget_campaign_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_campaign_budget
    ADD CONSTRAINT promotion_campaign_budget_campaign_id_foreign FOREIGN KEY (campaign_id) REFERENCES public.promotion_campaign(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_campaign_budget_usage promotion_campaign_budget_usage_budget_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_campaign_budget_usage
    ADD CONSTRAINT promotion_campaign_budget_usage_budget_id_foreign FOREIGN KEY (budget_id) REFERENCES public.promotion_campaign_budget(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion promotion_campaign_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion
    ADD CONSTRAINT promotion_campaign_id_foreign FOREIGN KEY (campaign_id) REFERENCES public.promotion_campaign(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: promotion_promotion_rule promotion_promotion_rule_promotion_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_promotion_rule
    ADD CONSTRAINT promotion_promotion_rule_promotion_id_foreign FOREIGN KEY (promotion_id) REFERENCES public.promotion(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_promotion_rule promotion_promotion_rule_promotion_rule_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_promotion_rule
    ADD CONSTRAINT promotion_promotion_rule_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id) REFERENCES public.promotion_rule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_rule_value promotion_rule_value_promotion_rule_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_rule_value
    ADD CONSTRAINT promotion_rule_value_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id) REFERENCES public.promotion_rule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: provider_identity provider_identity_auth_identity_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provider_identity
    ADD CONSTRAINT provider_identity_auth_identity_id_foreign FOREIGN KEY (auth_identity_id) REFERENCES public.auth_identity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refund refund_payment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund
    ADD CONSTRAINT refund_payment_id_foreign FOREIGN KEY (payment_id) REFERENCES public.payment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: region_country region_country_region_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region_country
    ADD CONSTRAINT region_country_region_id_foreign FOREIGN KEY (region_id) REFERENCES public.region(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: reservation_item reservation_item_inventory_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_item
    ADD CONSTRAINT reservation_item_inventory_item_id_foreign FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: return_reason return_reason_parent_return_reason_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_reason
    ADD CONSTRAINT return_reason_parent_return_reason_id_foreign FOREIGN KEY (parent_return_reason_id) REFERENCES public.return_reason(id);


--
-- Name: service_zone service_zone_fulfillment_set_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_zone
    ADD CONSTRAINT service_zone_fulfillment_set_id_foreign FOREIGN KEY (fulfillment_set_id) REFERENCES public.fulfillment_set(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shipping_option shipping_option_provider_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_provider_id_foreign FOREIGN KEY (provider_id) REFERENCES public.fulfillment_provider(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: shipping_option_rule shipping_option_rule_shipping_option_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option_rule
    ADD CONSTRAINT shipping_option_rule_shipping_option_id_foreign FOREIGN KEY (shipping_option_id) REFERENCES public.shipping_option(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shipping_option shipping_option_service_zone_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_service_zone_id_foreign FOREIGN KEY (service_zone_id) REFERENCES public.service_zone(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shipping_option shipping_option_shipping_option_type_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_shipping_option_type_id_foreign FOREIGN KEY (shipping_option_type_id) REFERENCES public.shipping_option_type(id) ON UPDATE CASCADE;


--
-- Name: shipping_option shipping_option_shipping_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_shipping_profile_id_foreign FOREIGN KEY (shipping_profile_id) REFERENCES public.shipping_profile(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: stock_location stock_location_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_location
    ADD CONSTRAINT stock_location_address_id_foreign FOREIGN KEY (address_id) REFERENCES public.stock_location_address(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_currency store_currency_store_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_currency
    ADD CONSTRAINT store_currency_store_id_foreign FOREIGN KEY (store_id) REFERENCES public.store(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_locale store_locale_store_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_locale
    ADD CONSTRAINT store_locale_store_id_foreign FOREIGN KEY (store_id) REFERENCES public.store(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 635cpOC1P1nuwGi76j9HIrQ2HlfefbPa3cgYOtArgXrgDfbHdlQvvMwhcmhZez9

