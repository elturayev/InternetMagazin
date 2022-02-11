import { ApolloServer } from 'apollo-server-express';
import { 
    ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { graphqlUploadExpress} from 'graphql-upload'
import config from '../config.js'
import schema from './modules/index.js'
import context from './context.js'

;(async function startApolloServer() {
    const app = express();
    app.use(graphqlUploadExpress())
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        introspection: true,
        schema,
        context,
        plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground(),
        ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();
    server.applyMiddleware({ app });
    await new Promise(resolve => httpServer.listen({ port: process.env.PORT || 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
})()