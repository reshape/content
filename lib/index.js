const W = require('when')
const parser = require('reshape-parser')
const intersectKeys = require('./intersectKeys')
const {modifyNodes} = require('reshape-plugin-util')

module.exports = function ReshapeContent (options = {}) {
  return function contentPlugin (tree, ctx, opts) {
    return modifyNodes(tree, (node) => {
      // if the node doesn't have attributes, it's not what we're looking for
      if (!node.attrs) { return false }

      // This function cross-checks to see if any of the attribute keys match
      // any of the keys in the user config.
      // If we get a match, add it to the node, we'll need it later
      node.contentKeys = intersectKeys(options, node.attrs)
      return node.contentKeys
    }, (node) => {
      // Grab the relevant key names
      const keys = node.contentKeys

      // Remove the attribute from the tag, it's just a marker
      // Also remove the saved contentKeys, we have it already
      keys.forEach((key) => delete node.attrs[key])
      delete node.contentKeys

      // Now for each entry in the node's content, we run the user-provided
      // functions, which can be a promise or not. We take the results and
      // assign them back to the node, then return the modified node
      return W.map(node.content, (c) => {
        let content = c.content
        keys.forEach((key) => { content = options[key](content) })
        return content
      }).then((res) => {
        // TODO: the location is getting messed up here, needs an "offset"
        // option into the parser
        node.content = parser(res.join(''), {}, opts)
        return node
      })
    })
  }
}
