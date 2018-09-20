# fastify-gql-plugin

A GraphQL plugins based on [Hapi-graphql-2](https://github.com/skarpdev/hapi-graphql-2) and [Express-graphql](https://github.com/graphql/express-graphql)

# Installation

Using npm:

```bash
npm i --save fastify-gql-plugin
```

Using yarn:
```bash
yarn add fastify-gql-plugin
```

# Usage

*Please checkout `__mock__` folder to have more info on schema*

```javascript
const fastifyGQLPlugin = require("fastify-gql-plugin");
const Fastify = require("fastify");

/**....**/

const fastify = Fastify();
    fastify.register(fastifyGQLPlugin, {
        query: {
            schema: SCHEMA, // executableSchema made from typeDefs and resolvers
            graphiql: true, // options to have Graphiql 
        },
        route: {
            path: "/graphql", // defined route
        },
    });

fastify.listen()

/**....**/

```