function normalizeOptionValue(value) {
  if (typeof value === 'string') {
    const label = value.trim()
    return label ? { label, price: 0, cost_price: 0 } : null
  }

  const label = String(value?.label || '').trim()
  if (!label) return null

  const price = Number(value?.price)
  const costPrice = Number(value?.cost_price)

  return {
    label,
    price: Number.isFinite(price) ? price : 0,
    cost_price: Number.isFinite(costPrice) ? costPrice : 0,
  }
}

function normalizeOptions(options) {
  if (!options) return []

  let parsed = options
  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed)
    } catch {
      return []
    }
  }

  if (!Array.isArray(parsed)) return []

  return parsed
    .map((option) => {
      const name = String(option?.name || '').trim()
      const values = (Array.isArray(option?.values) ? option.values : [])
        .map(normalizeOptionValue)
        .filter(Boolean)

      if (!name || values.length === 0) return null
      return { name, values }
    })
    .filter(Boolean)
}

function normalizeOptionValues(optionValues) {
  if (!optionValues || typeof optionValues !== 'object' || Array.isArray(optionValues)) {
    return {}
  }

  return Object.entries(optionValues).reduce((acc, [key, value]) => {
    const name = String(key).trim()
    const label = String(value ?? '').trim()
    if (name && label) acc[name] = label
    return acc
  }, {})
}

function getPricingFromOptions(categoryOptions, optionValues) {
  const options = normalizeOptions(categoryOptions)
  const selected = normalizeOptionValues(optionValues)

  return options.reduce(
    (totals, option) => {
      const label = selected[option.name]
      if (!label) return totals

      const value = option.values.find((item) => item.label === label)
      if (!value) return totals

      return {
        price: totals.price + value.price,
        cost_price: totals.cost_price + value.cost_price,
      }
    },
    { price: 0, cost_price: 0 }
  )
}

function validateOptionValues(categoryOptions, optionValues) {
  const options = normalizeOptions(categoryOptions)
  const normalized = normalizeOptionValues(optionValues)

  if (options.length === 0) {
    return { valid: true, optionValues: {} }
  }

  for (const option of options) {
    const selected = normalized[option.name]
    if (!selected) {
      return {
        valid: false,
        message: `Select a value for "${option.name}"`,
      }
    }

    const allowed = option.values.map((value) => value.label)
    if (!allowed.includes(selected)) {
      return {
        valid: false,
        message: `Invalid value "${selected}" for "${option.name}"`,
      }
    }
  }

  return { valid: true, optionValues: normalized }
}

module.exports = {
  normalizeOptions,
  normalizeOptionValues,
  getPricingFromOptions,
  validateOptionValues,
}
