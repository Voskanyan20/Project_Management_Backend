const database = require('../conf/db_config')

async function ensureProductTypeColumn() {
  const [columns] = await database.seq.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'product_type'
  `)

  if (columns.length > 0) {
    console.log('product_type column already exists')
    return
  }

  await database.seq.query(`
    DO $$ BEGIN
      CREATE TYPE "enum_products_product_type" AS ENUM ('online', 'local');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await database.seq.query(`
    ALTER TABLE "products"
    ADD COLUMN "product_type" "enum_products_product_type" NOT NULL DEFAULT 'local';
  `)

  console.log('product_type column added')
}

module.exports = { ensureProductTypeColumn }
