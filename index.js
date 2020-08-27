const { ApolloServer } = require('apollo-server');

const mongoose = require('mongoose');
const config = require('./config');

const typesDef = require('./graphql/typeDefs');
const resolvers = require("./graphql/resolvers");



// creating the server
// when create an apollo server you need typeDef and Resolvers
// typedefs basically types related to graphql
// resolvers are like controllers for adding the mutation logic for get the work done
const server = new ApolloServer({
    typeDefs: typesDef,
    resolvers: resolvers
})

// @ connect to database
mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true } , () => {
    console.log('Mongodb is connected...');
})


server.listen({port: 5000})
    .then(res => {
        console.log(`Server is running on port ${res.url}`)
    })