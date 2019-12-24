
const process = require('process');
const path = require('path');
const cp = require('child_process');
const { reduceContentsResults } = require('./utils');
require('babel-polyfill');
const nock = require('nock')
nock.disableNetConnect()

const TOPICS_FIXTURE = {
    "repository": {
        "id": "MDEwOlJlcG9zaXRvcnkxNDg2Nzk1OTQ=",
        "name": "devhub-app-web",
        "object": {
        "entries": [
            {
                "name": "topic1.json",
                "object": {
                    "text": "{\n  \"name\": \"Agile Delivery Process\",\n  \"description\": \"An agile process for teams to deliver digital services\",\n  \"sourceProperties\": {\n    \"sources\": [\n      {\n        \"sourceType\": \"github\",\n        \"sourceProperties\": {\n          \"url\": \"https://github.com/bcgov/Agile-Delivery-Process\",\n          \"owner\": \"bcgov\",\n          \"repo\": \"Agile-Delivery-Process\",\n          \"files\": [\n            \"README.md\",\n            \"01_Alignment.md\",\n            \"02_Discovery.md\",\n            \"03_Alpha.md\",\n            \"04_Beta.md\",\n            \"05_Live.md\"\n          ]\n        }\n      }\n    ]\n  },\n  \"attributes\": {\n    \"labels\": [\n      \"Documentation\",\n      \"Repository\"\n    ],\n    \"personas\": [\n      \"Designer\",\n      \"Developer\",\n      \"Product Owner\"\n    ]\n  },\n  \"resourceType\": \"Documentation\"\n}\n"
                }
            },
            {
                "name": "topic2.json",
                "object": {
                    "text": "{\n  \"name\": \"Agile Delivery Process\",\n  \"description\": \"An agile process for teams to deliver digital services\",\n  \"sourceProperties\": {\n    \"sources\": [\n      {\n        \"sourceType\": \"github\",\n        \"sourceProperties\": {\n          \"url\": \"https://github.com/bcgov/Agile-Delivery-Process\",\n          \"owner\": \"bcgov\",\n          \"repo\": \"Agile-Delivery-Process\",\n          \"files\": [\n            \"README.md\",\n            \"01_Alignment.md\",\n            \"02_Discovery.md\",\n            \"03_Alpha.md\",\n            \"04_Beta.md\",\n            \"05_Live.md\"\n          ]\n        }\n      }\n    ]\n  },\n  \"attributes\": {\n    \"labels\": [\n      \"Documentation\",\n      \"Repository\"\n    ],\n    \"personas\": [\n      \"Designer\",\n      \"Developer\",\n      \"Product Owner\"\n    ]\n  },\n  \"resourceType\": \"Documentation\"\n}\n"
                }
            },
        ]
        }
    }
}
const JOURNEYS_FIXTURE = {
    "repository": {
    "id": "MDEwOlJlcG9zaXRvcnkxNDg2Nzk1OTQ=",
    "name": "devhub-app-web",
    "object": {
    "entries": [
        {
            "name": "journey1.json",
            "object": {
                "text": "{\n  \"name\": \"Beginner Guide to Developing on the Platform\",\n  \"description\": \"An overview on Openshift, Development Best Practices, and Troubleshooting\",\n  \"sourceProperties\": {\n    \"stops\": [\n      { \n        \"sourceType\": \"github\",\n        \"sourceProperties\":\n          { \n            \"file\": \"resources/community/new-developer.md\",\n            \"url\": \"https://github.com/bcgov/devhub-resources\", \n            \"owner\": \"bcgov\", \n            \"repo\": \"devhub-resources\"\n           }\n      },\n      { \n        \"sourceType\": \"github\",\n        \"sourceProperties\":\n          { \n            \"file\": \"resources/community/what-is-openshift.md\",\n            \"url\": \"https://github.com/bcgov/devhub-resources\", \n            \"owner\": \"bcgov\", \n            \"repo\": \"devhub-resources\"\n           }\n      },\n      { \n        \"sourceType\": \"github\",\n        \"sourceProperties\":\n          { \n            \"file\": \"resources/community/openshift101.md\",\n            \"url\": \"https://github.com/bcgov/devhub-resources\", \n            \"owner\": \"bcgov\", \n            \"repo\": \"devhub-resources\"\n           }\n      },\n      { \n        \"sourceType\": \"github\",\n        \"sourceProperties\":\n          { \n            \"file\": \"resources/community/openshift201.md\",\n            \"url\": \"https://github.com/bcgov/devhub-resources\", \n            \"owner\": \"bcgov\", \n            \"repo\": \"devhub-resources\"\n           }\n      },\n      { \n        \"sourceType\": \"github\",\n        \"sourceProperties\":\n          { \n            \"file\": \"resources/community/rocketchat.md\",\n            \"url\": \"https://github.com/bcgov/devhub-resources\", \n            \"owner\": \"bcgov\", \n            \"repo\": \"devhub-resources\"\n           }\n      },\n      { \n        \"sourceType\": \"github\",\n        \"sourceProperties\":\n          { \n            \"file\": \"README.md\",\n            \"url\": \"https://github.com/bcgov/BC-Policy-Framework-For-GitHub\", \n            \"owner\": \"bcgov\", \n            \"repo\": \"BC-Policy-Framework-For-GitHub\"\n           }\n      },\n      { \n        \"sourceType\": \"github\",\n        \"sourceProperties\":\n          { \n            \"file\": \"resources/community/best-practices-for-app-development.md\",\n            \"url\": \"https://github.com/bcgov/devhub-resources\", \n            \"owner\": \"bcgov\", \n            \"repo\": \"devhub-resources\"\n           }\n      },\n      { \n        \"sourceType\": \"github\",\n        \"sourceProperties\":\n          { \n            \"file\": \"resources/community/finding-resources.md\",\n            \"url\": \"https://github.com/bcgov/devhub-resources\", \n            \"owner\": \"bcgov\", \n            \"repo\": \"devhub-resources\"\n           }\n      },\n      { \n        \"sourceType\": \"github\",\n        \"sourceProperties\":\n          { \n            \"file\": \"resources/community/npm-publishing.md\",\n            \"url\": \"https://github.com/bcgov/devhub-resources\", \n            \"owner\": \"bcgov\", \n            \"repo\": \"devhub-resources\"\n           }\n      },\n      { \n        \"sourceType\": \"github\",\n        \"sourceProperties\":\n          { \n            \"file\": \"resources/security/security-for-beginners.md\", \n            \"url\": \"https://github.com/bcgov/devhub-resources\", \n            \"owner\": \"bcgov\", \n            \"repo\": \"devhub-resources\"\n          }\n      }\n    ]\n  },\n  \"attributes\": {\n    \"personas\": [\n      \"Designer\",\n      \"Developer\",\n      \"Product Owner\"\n    ]\n  },\n  \"resourceType\": \"Documentation\"\n}\n",
            }
        },
        {
            "name": "journey2.json",
            "object": {
                "text": "{\n  \"name\": \"Beginner Guide to Developing on the Platform\",\n  \"description\": \"An overview on Openshift, Development Best Practices, and Troubleshooting\",\n  \"sourceProperties\": {\n    \"stops\": [\n      { \n        \"sourceType\": \"github\",\n        \"sourceProperties\":\n          { \n            \"file\": \"resources/community/new-developer.md\",\n            \"url\": \"https://github.com/bcgov/devhub-resources\", \n            \"owner\": \"bcgov\", \n            \"repo\": \"devhub-resources\"\n           }\n      },\n      { \n        \"sourceType\": \"github\",\n        \"sourceProperties\":\n          { \n            \"file\": \"resources/community/what-is-openshift.md\",\n            \"url\": \"https://github.com/bcgov/devhub-resources\", \n            \"owner\": \"bcgov\", \n            \"repo\": \"devhub-resources\"\n           }\n      },\n      { \n        \"sourceType\": \"github\",\n        \"sourceProperties\":\n          { \n            \"file\": \"resources/community/openshift101.md\",\n            \"url\": \"https://github.com/bcgov/devhub-resources\", \n            \"owner\": \"bcgov\", \n            \"repo\": \"devhub-resources\"\n           }\n      },\n      { \n        \"sourceType\": \"github\",\n        \"sourceProperties\":\n          { \n            \"file\": \"resources/community/openshift201.md\",\n            \"url\": \"https://github.com/bcgov/devhub-resources\", \n            \"owner\": \"bcgov\", \n            \"repo\": \"devhub-resources\"\n           }\n      },\n      { \n        \"sourceType\": \"github\",\n        \"sourceProperties\":\n          { \n            \"file\": \"resources/community/rocketchat.md\",\n            \"url\": \"https://github.com/bcgov/devhub-resources\", \n            \"owner\": \"bcgov\", \n            \"repo\": \"devhub-resources\"\n           }\n      },\n      { \n        \"sourceType\": \"github\",\n        \"sourceProperties\":\n          { \n            \"file\": \"README.md\",\n            \"url\": \"https://github.com/bcgov/BC-Policy-Framework-For-GitHub\", \n            \"owner\": \"bcgov\", \n            \"repo\": \"BC-Policy-Framework-For-GitHub\"\n           }\n      },\n      { \n        \"sourceType\": \"github\",\n        \"sourceProperties\":\n          { \n            \"file\": \"resources/community/best-practices-for-app-development.md\",\n            \"url\": \"https://github.com/bcgov/devhub-resources\", \n            \"owner\": \"bcgov\", \n            \"repo\": \"devhub-resources\"\n           }\n      },\n      { \n        \"sourceType\": \"github\",\n        \"sourceProperties\":\n          { \n            \"file\": \"resources/community/finding-resources.md\",\n            \"url\": \"https://github.com/bcgov/devhub-resources\", \n            \"owner\": \"bcgov\", \n            \"repo\": \"devhub-resources\"\n           }\n      },\n      { \n        \"sourceType\": \"github\",\n        \"sourceProperties\":\n          { \n            \"file\": \"resources/community/npm-publishing.md\",\n            \"url\": \"https://github.com/bcgov/devhub-resources\", \n            \"owner\": \"bcgov\", \n            \"repo\": \"devhub-resources\"\n           }\n      },\n      { \n        \"sourceType\": \"github\",\n        \"sourceProperties\":\n          { \n            \"file\": \"resources/security/security-for-beginners.md\", \n            \"url\": \"https://github.com/bcgov/devhub-resources\", \n            \"owner\": \"bcgov\", \n            \"repo\": \"devhub-resources\"\n          }\n      }\n    ]\n  },\n  \"attributes\": {\n    \"personas\": [\n      \"Designer\",\n      \"Developer\",\n      \"Product Owner\"\n    ]\n  },\n  \"resourceType\": \"Documentation\"\n}\n"
            }
        },
    ]
    }
}}

test('The action runs', () => {


    
});


test('Reducing Github GraphQL Contents', () => {

    const expected = [
        {
            path: 'app-web/topic1.json',
            contents: "{\n  \"name\": \"Agile Delivery Process\",\n  \"description\": \"An agile process for teams to deliver digital services\",\n  \"sourceProperties\": {\n    \"sources\": [\n      {\n        \"sourceType\": \"github\",\n        \"sourceProperties\": {\n          \"url\": \"https://github.com/bcgov/Agile-Delivery-Process\",\n          \"owner\": \"bcgov\",\n          \"repo\": \"Agile-Delivery-Process\",\n          \"files\": [\n            \"README.md\",\n            \"01_Alignment.md\",\n            \"02_Discovery.md\",\n            \"03_Alpha.md\",\n            \"04_Beta.md\",\n            \"05_Live.md\"\n          ]\n        }\n      }\n    ]\n  },\n  \"attributes\": {\n    \"labels\": [\n      \"Documentation\",\n      \"Repository\"\n    ],\n    \"personas\": [\n      \"Designer\",\n      \"Developer\",\n      \"Product Owner\"\n    ]\n  },\n  \"resourceType\": \"Documentation\"\n}\n"
        },
        {
            path: 'app-web/topic2.json',
            contents: "{\n  \"name\": \"Agile Delivery Process\",\n  \"description\": \"An agile process for teams to deliver digital services\",\n  \"sourceProperties\": {\n    \"sources\": [\n      {\n        \"sourceType\": \"github\",\n        \"sourceProperties\": {\n          \"url\": \"https://github.com/bcgov/Agile-Delivery-Process\",\n          \"owner\": \"bcgov\",\n          \"repo\": \"Agile-Delivery-Process\",\n          \"files\": [\n            \"README.md\",\n            \"01_Alignment.md\",\n            \"02_Discovery.md\",\n            \"03_Alpha.md\",\n            \"04_Beta.md\",\n            \"05_Live.md\"\n          ]\n        }\n      }\n    ]\n  },\n  \"attributes\": {\n    \"labels\": [\n      \"Documentation\",\n      \"Repository\"\n    ],\n    \"personas\": [\n      \"Designer\",\n      \"Developer\",\n      \"Product Owner\"\n    ]\n  },\n  \"resourceType\": \"Documentation\"\n}\n"
        }
    ]

    expect(reduceContentsResults('app-web', TOPICS_FIXTURE)).toEqual(expected);
})


// shows how the runner will run a javascript action with env / stdout protocol
test('it can fetch and process', async () => {
    // setting up github server mock
    nock('https://api.github.com')
    .post('/graphql')
    .once()
    .reply(200, { data: TOPICS_FIXTURE })

    nock('https://api.github.com')
    .post('/graphql')
    .once()
    .reply(200, { data: JOURNEYS_FIXTURE })
    process.env['GITHUB_TOKEN'] = 500;
    try {
        // TODO 
        // we still need the run to flatten sources from the expanded regsitry same as in githubRaw.js
        // this should require the fetchGithubFiles function to be broken up
        // i should also write unit tests for those smaller functions for code cov
         await require('./run.js')();
    } catch(e) {
        console.log(e);
        console.error(e);
    }
})
