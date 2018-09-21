const test = require("tap").test;

const plugin = require("./");

const { request } = require("graphql-request");
const Fastify = require("fastify");

const testSchema1 = require("./__mock__/testSchema1");

const validDataTestCases = [
    {
        name: "response from valid request 1",
        url: "/graphql",
        query: "{ foo }",
        variables: "",
        expected: {
            foo: "hello world",
        },
    },
    {
        name: "response from valid request 2",
        url: "/graphql",
        query: "{ foo }",
        variables: "{ a: 1 }",
        expected: {
            foo: "hello world",
        },
    },
];

const invalidDataTestCases = [
    {
        name: "response from invalid request 1",
        url: "/graphql",
        query: "{ foo ",
        variables: "",
    },
    {
        name: "response from invalid request 2",
        url: "/graphql",
        query: null,
        variables: "",
    },
    {
        name: "response from invalid request 3",
        url: "/graphql",
        query: null,
        variables: "asfasf",
    },
];

const validOptions = [
    {
        name: "valid option with graphiql",
        options: {
            query: {
                schema: testSchema1,
                graphiql: true,
            },
            route: {
                path: "/graphql",
            },
        },
    },
    {
        name: "valid option without graphiql",
        options: {
            query: {
                schema: testSchema1,
                graphiql: true,
            },
            route: {
                path: "/graphql",
            },
        },
    },
    {
        name: "valid option with no route",
        options: {
            query: {
                schema: testSchema1,
                graphiql: true,
            },
        },
    },
    {
        name: "valid option with no route",
        options: () => ({
            query: {
                schema: testSchema1,
                graphiql: true,
            },
        }),
    },
];

const invalidOptions = [
    {
        name: "empty options",
        options: undefined,
    },
    {
        name: "null options",
        options: null,
    },
    {
        name: "invalid options type",
        options: request => {
            return request;
        },
    },
    {
        name: "invalid options type",
        options: () => "foo",
    },
    {
        name: "invalid options with no query",
        options: {
            route: {
                path: "/graphql",
            },
        },
    },
];

test("Initialization with good params", async t => {
    await validOptions.forEach(async testCase => {
        await t.test(testCase.name, async t => {
            const fastify = Fastify();
            try {
                fastify.register(plugin, testCase.options);
                await fastify.listen();
                t.pass("server initialized");
            } catch (err) {
                t.error(err);
            }
            fastify.server.unref();
        });
    });
});

test("Initialization with bad params", async t => {
    await invalidOptions.forEach(async testCase => {
        await t.test(testCase.name, async t => {
            const fastify = Fastify();
            try {
                await fastify.register(plugin, testCase.options);
                await fastify.listen();
            } catch (err) {
                t.ok(err);
                t.pass("Server uninitialized");
            }
            fastify.server.unref();
        });
    });
});

test("Response from requests", t => {
    t.plan(validDataTestCases.length + invalidDataTestCases.length + 1);
    const fastify = Fastify();
    fastify.register(plugin, {
        query: {
            schema: testSchema1,
            graphiql: true,
        },
        route: {
            path: "/graphql",
        },
    });
    fastify.listen(0, err => {
        t.error(err);
        const BASE_URL = `http://localhost:${fastify.server.address().port}`;
        validDataTestCases.forEach(testCase => {
            t.test(testCase.name, t => {
                t.plan(1);
                request(`${BASE_URL}${testCase.url}`, testCase.query)
                    .then(data => {
                        t.strictSame(data, testCase.expected);
                    })
                    .catch(err => {
                        t.error(err);
                    });
            });
        });
        invalidDataTestCases.forEach(testCase => {
            t.test(testCase.name, t => {
                t.plan(1);
                request(`${BASE_URL}${testCase.url}`, testCase.query)
                    .then(data => {
                        t.error(data);
                    })
                    .catch(() => {
                        t.pass("error found");
                    });
            });
        });
    });
    t.tearDown(() => fastify.close());
    fastify.server.unref();
});
