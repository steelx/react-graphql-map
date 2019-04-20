const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();// needed to access process.env

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const {findOrCreateUser} = require("./controllers/UserController");

mongoose
    .connect(process.env.MONGO_URI, {useNewUrlParser: true})
    .then(() => console.log("DB connected"))
    .catch(console.error);


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
        let authToken, currentUser = null;
        try {
            authToken = req.headers.authorization;
            if (authToken) {
                currentUser = await findOrCreateUser(authToken)
            }
        } catch (err) {
            console.error(`Unable to authenticate user with token ${authToken}`)
        }

        return {currentUser};
    }
});

server.listen().then(({url}) => console.log("Server running at ", url));


