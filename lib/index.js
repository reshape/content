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
      const opt = intersectKeys(options, node.attrs)[0]
      // If we get a match, add it to the node, we'll need it later
      if (opt) { node.contentKey = opt }
      return opt
    }, (node) => {
      // Grab the relevant key name
      const key = node.contentKey

      // Remove the attribute from the tag, it's just a marker
      // Also remove the saved contentKey, we have it already
      delete node.attrs[node.contentKey]
      delete node.contentKey

      // Now for each entry in the node's content, we run the user-provided
      // function, which can be a promise or not. We take the results and
      // assign them back to the node, then return the modified node
      return W.map(node.content, (c) => options[key](c.content)).then((res) => {
        // TODO: the location is getting messed up here, needs an "offset"
        // option into the parser
        node.content = parser(res.join(''), {}, opts)
        return node
      })
    })
  }
}
