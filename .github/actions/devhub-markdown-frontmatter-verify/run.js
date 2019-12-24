const core = require('@actions/core');
const github = require('@actions/github');
const process = require('process');
const { reduceJourneyRegistryToTopic, expandRegistry, getGitUrlFromSource } = require('../../../app-web/gatsby/utils/githubRaw');
const { reduceContentsResults, reduceResultsToData } = require('./utils');

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
        const topicPath = 'app-web/topicRegistry';
        const journeyPath = 'app-web/journeyRegistry';
        const topicBranchPath = `${ref}:${topicPath}`;
        const journeyBranchPath = `${ref}:${journeyPath}`;
        core.debug(`Fetching topic registries at ${topicBranchPath}`);
        
        const topicsRegistry = await octokit.graphql(CONTENTS_QUERY, {
          repo: 'devhub-app-web',
          owner: 'bcgov',
          path: topicBranchPath,
        });

        core.debug(`Fetching journey registries at ${journeyBranchPath}`);
        const journeyRegistry = await octokit.graphql(CONTENTS_QUERY, {
          repo: 'devhub-app-web',
          owner: 'bcgov',
          path: journeyBranchPath,
        });

        core.debug('Reducing fetch calls to a list of registry files');
        const topics = reduceResultsToData(reduceContentsResults(topicPath, topicsRegistry));
        core.debug('topics reduced');
        const journeys = reduceResultsToData(reduceContentsResults(journeyPath, journeyRegistry))
        core.debug('journeys reduced');
        
        core.debug('exiting group');
        return {
          topics,
          journeys
        }
      });
      core.debug('reducing journeys to match shape of topics');
      const journeyMappedAsTopic = reduceJourneyRegistryToTopic(result.journeys);
      const registry = journeyMappedAsTopic.concat(result.topics);
      
      core.debug('reducing all registry items to flatten their source property structure');
      const expandedRegistry = expandRegistry(registry);
      
      core.debug('removing non-git sources from registry');
      const gitOnlySource = expandedRegistry.filter(s => s.sourceProperties.sourceType !== 'github');
      
      core.debug('retrieving list of git urls to verify markdown frontmatter');

      const files = gitOnlySource.map(getGitUrlFromSource);
      console.log(files);

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

module.exports = run;