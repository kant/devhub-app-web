/**
 * reduces the result from the contents graphql query into a list
 * @param {String} path the raw contents query
 * @param {Array} results the raw contents query
 * @returns {Array} [{...fileContents}] 
 */
const reduceContentsResults = (path, results) => results.repository.object.entries.map(entry => ({
  contents: entry.object.text,
  path: `${path}/${entry.name}`
}));

const reduceResultsToData = results => results.map(r => {
  console.log('reducing path', r.path);
  return JSON.parse(r.contents)
})

module.exports = {
  reduceContentsResults,
  reduceResultsToData,
}