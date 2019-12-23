const wait = require('./wait');
const process = require('process');
const cp = require('child_process');
const path = require('path');
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
test.skip('throws invalid number', async() => {
    await expect(wait('foo')).rejects.toThrow('milleseconds not a number');
});

test.skip('wait 500 ms', async() => {
    const start = new Date();
    await wait(500);
    const end = new Date();
    var delta = Math.abs(end - start);
    expect(delta).toBeGreaterThan(450);
});

// shows how the runner will run a javascript action with env / stdout protocol
test.skip('test runs', () => {
    process.env['GITHUB_TOKEN'] = 500;
    const ip = path.join(__dirname, 'index.js');
    console.log(cp.execSync(`node ${ip}`).toString());
})
