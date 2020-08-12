const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');

const mongoose = require('mongoose');
const config = require('./config');

const User = require('./models/User');
const Post = require('./models/Post');

const typesDef = gql`

    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
    }

    type Query {
        getPosts: [Post]
    }
`

// process the logic
const resolvers = {
    Query: {
        async getPosts() {
            try {
                const posts = Post.find();
                return posts;
            } catch (error) {
                throw new Error(error);
            }
        }
    }
}

// creating the server
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