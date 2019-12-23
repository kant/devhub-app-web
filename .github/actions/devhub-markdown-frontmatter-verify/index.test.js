
const process = require('process');
const { reduceContentsResults } = require('./index');

test('Reducing Github GraphQL Contents', () => {
    const graphql1 = {
            "repository": {
                "id": "MDEwOlJlcG9zaXRvcnkxNDg2Nzk1OTQ=",
                "name": "devhub-app-web",
                "object": {
                "entries": [
                    {
                        "name": "topic1.json",
                        "object": {
                            "text": "foo"
                        }
                    },
                    {
                        "name": "topic2.json",
                        "object": {
                            "text": "foo"
                        }
                    },
                ]
                }
            }
    }
    const expected = [
        {
            path: 'app-web/topic1.json',
            contents: "foo"
        },
        {
            path: 'app-web/topic2.json',
            contents: "foo"
        }
    ]

    expect(reduceContentsResults('app-web', graphql1)).toEqual(expected);
})
