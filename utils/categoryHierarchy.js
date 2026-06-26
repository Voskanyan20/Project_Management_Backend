function normalizeParentId(value) {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

async function validateParentCategory(parentId, categoryId = null) {
  const database = require('../conf/db_config')
  const normalizedParentId = normalizeParentId(parentId)

  if (!normalizedParentId) {
    return { valid: true, parent_id: null }
  }

  if (categoryId && normalizedParentId === Number(categoryId)) {
    return {
      valid: false,
      message: 'Category cannot be its own parent',
    }
  }

  const parent = await database.categories.findByPk(normalizedParentId)

  if (!parent) {
    return {
      valid: false,
      message: 'Parent category not found',
    }
  }

  if (parent.parent_id) {
    return {
      valid: false,
      message: 'Subcategories cannot have another subcategory as parent',
    }
  }

  if (categoryId) {
    const childCount = await database.categories.count({
      where: { parent_id: categoryId },
    })

    if (childCount > 0 && normalizedParentId) {
      return {
        valid: false,
        message: 'Parent categories with subcategories cannot become subcategories',
      }
    }
  }

  return { valid: true, parent_id: normalizedParentId }
}

module.exports = {
  normalizeParentId,
  validateParentCategory,
}
