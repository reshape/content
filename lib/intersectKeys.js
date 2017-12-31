module.exports = function intersectKeys (options, attrs) {
  // Find matching keys
  const matches = Object.keys(options).filter(k => k in attrs)

  // Reorder matches by order of attrs
  let keys = []
  Object.keys(attrs).forEach((key) => {
    if (matches.indexOf(key) > -1) keys.push(key)
  })

  // Return found keys, or false
  return keys.length > 0 ? keys : false
}
