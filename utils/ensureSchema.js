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

async function ensureJsonColumns() {
  const [categoryOptions] = await database.seq.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'options'
  `)

  if (categoryOptions.length === 0) {
    await database.seq.query(`
      ALTER TABLE "categories"
      ADD COLUMN "options" JSONB DEFAULT '[]'::jsonb;
    `)
    console.log('categories.options column added')
  }

  const [productOptions] = await database.seq.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'option_values'
  `)

  if (productOptions.length === 0) {
    await database.seq.query(`
      ALTER TABLE "products"
      ADD COLUMN "option_values" JSONB DEFAULT '{}'::jsonb;
    `)
    console.log('products.option_values column added')
  }
}

async function ensureCategoryParentColumn() {
  const [parentColumn] = await database.seq.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'parent_id'
  `)

  if (parentColumn.length === 0) {
    await database.seq.query(`
      ALTER TABLE "categories"
      ADD COLUMN "parent_id" INTEGER REFERENCES "categories"("id") ON DELETE SET NULL;
    `)
    console.log('categories.parent_id column added')
  }
}

module.exports = { ensureProductTypeColumn, ensureJsonColumns, ensureCategoryParentColumn }
