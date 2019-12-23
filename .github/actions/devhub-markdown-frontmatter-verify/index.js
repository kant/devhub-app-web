const core = require('@actions/core');
const github = require('@actions/github');

const CONTENTS_QUERY = `
query { 
  repository(name: $repo, owner: $owner) {
    id
    object(expression: "$branch:$path") {
      ...on Tree {
        entries {
          name
          ...on TreeEntry {
            object {
              id
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

const reduceContentsResults = results => {
  return results;
}
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
        const response = await octokit.graphql(CONTENTS_QUERY, {
          repo: 'devhub-app-web',
          owner: 'bcgov',
          branch: ref,
          path: 'app-web/topicRegistry'
        });
        console.log('found the response')
      })
      return response
    } catch(e) {
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
