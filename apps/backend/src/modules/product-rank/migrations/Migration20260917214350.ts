import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260917214350 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "product_rank" drop constraint if exists "product_rank_rank_unique";`);
    this.addSql(`alter table if exists "product_rank" drop constraint if exists "product_rank_product_id_unique";`);
    this.addSql(`create table if not exists "product_rank" ("id" text not null, "product_id" text not null, "rank" integer not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_rank_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_rank_deleted_at" ON "product_rank" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_product_rank_product_id_unique" ON "product_rank" ("product_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_product_rank_rank_unique" ON "product_rank" ("rank") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "product_rank" cascade;`);
  }

}
