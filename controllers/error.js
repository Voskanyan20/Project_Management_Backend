function customOnError (req, res, errorMessage) {
  res.statusCode = 400
  res.json({
    error: 'Bad request or nothing found',
    description: errorMessage !== undefined ? errorMessage : ''
  })
}

module.exports = customOnError