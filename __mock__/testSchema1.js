const { join } = require("path");
const { makeExecutableSchema } = require("graphql-tools");
const { importSchema } = require("graphql-import");

const typeDefs = importSchema(join(__dirname, "./testSchema1.graphql"));

const resolvers = {
    Query: {
        foo: () => "hello world"
    }
}

module.exports = makeExecutableSchema({
    typeDefs,
    resolvers,
});