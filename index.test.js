"use strict";

const test = require("tap").test;

const plugin = require("./");

const { request } = require("graphql-request");
const Fastify = require("fastify");

const testSchema1 = require("./__mock__/testSchema1");

const testCases = [
    {
        name: "response from request",
        url: "/graphql",
        query: "{ foo }",
        variables: "",
        expected: {
            foo: "hello world",
        },
    },
];

const fastify = Fastify();

fastify.listen(process.env.PORT || 5000, "0.0.0.0");

test("response from request", t => {
    t.plan(testCases.length);

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

    fastify.listen(0, function() {
        const BASE_URL = `http://localhost:${fastify.server.address().port}`;
        const testRequests = [];
        testCases.forEach(function(testCase) {
            t.test(testCase.name, t => {
                t.plan(1);
                testRequests.push(
                    request(`${BASE_URL}${testCase.url}`, testCase.query)
                        .then(data => {
                            t.strictSame(data, testCase.expected);
                            t.end();
                        })
                        .catch(err => {
                            t.error(err);
                        })
                );
            });
        });
        Promise.all(testRequests).then(() => process.exit(1));
    });
    fastify.server.unref();
});
