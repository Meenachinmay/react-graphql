const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');

const typesDef = gql`
    type Query {
        sayHi: String!
    }
`

// process the logic
const resolvers = {
    Query: {
        sayHi: () => 'Hello world'
    }
}

// creating the server
const server = new ApolloServer({
    typeDefs: typesDef,
    resolvers: resolvers
})

server.listen({port: 5000})
    .then(res => {
        console.log(`Server is running on port ${res.url}`)
    })