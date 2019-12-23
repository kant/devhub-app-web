const core = require('@actions/core');
const github = require('@actions/github');
const process = require('process');
const CONTENTS_QUERY = `
query getRegistryContents($owner: String!, $repo: String!, $path: String!) { 
  repository(name:$repo, owner:$owner) {
    object(expression:$path) {
      ...on Tree {
        entries {
          name
          ...on TreeEntry {
            object {
              ...on Blob {
                text
              }
            }
          }
        }
      }
    }
  }  
}`

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

// most @actions toolkit packages have async methods
async function run() {
  try { 
    // This should be a token with access to your repository scoped in as a secret.
    // The YML workflow will need to set myToken with the GitHub Secret Token
    // myToken: ${{ secrets.GITHUB_TOKEN }}
    // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret
    const token = process.env.GITHUB_TOKEN;
    const octokit = new github.GitHub(token);
    const { ref } = github.context;
    core.debug(`Fetching contents from ${ref}`);
    try {
      
      const result = await core.group('Fetching topic and journey registries', async () => {
        const topicsRegistry = await octokit.graphql(CONTENTS_QUERY, {
          repo: 'devhub-app-web',
          owner: 'bcgov',
          path: `${ref}:app-web/topicRegistry`,
        });
        const journeyRegistry = await octokit.graphql(CONTENTS_QUERY, {
          repo: 'devhub-app-web',
          owner: 'bcgov',
          path: `${ref}:app-web/journeyRegistry`,
        });
        core.debug(topicsRegistry.repository)
        core.debug(topicsRegistry.repository.object)
        core.debug(topicsRegistry.repository.object.entries)
        core.debug(`Fetching contents from ${topicsRegistry}`);
        return reduceContentsResults(topicsRegistry).concat(journeyRegistry)
      });

      console.log(result);
    } catch(e) {
      core.debug(e.message);
      core.error(e);
      core.setFailed('Action failed with above error:(');
    }
    // core.debug((new Date()).toTimeString())
    // wait(parseInt(ms));
    // core.debug((new Date()).toTimeString())
    // core.setOutput('time', new Date().toTimeString());
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()

module.exports = {
  reduceContentsResults
}