const { AuthenticationError } = require("apollo-server");
const Pin = require("./models/Pin");

const authenticated = (next) => (root, args, ctx, info) => {
    if(!ctx) {
        return new AuthenticationError("Authentication Error");
    }

    return next(root, args, ctx, info);
}

module.exports = {
    Query: {
        me: authenticated((root, args, ctx) => ctx.currentUser),
        getPins: async (root, args, ctx) => {
            const pins = await Pin.find({}).populate("author").populate("comments.author");
            return pins;
        }
    },
    Mutation: {
        createPin: authenticated(async (root, args, ctx) => {
            const _Pin = await new Pin({
                ...args.input,
                author: ctx.currentUser._id
            }).save();
            const pinAdded = await Pin.populate(_Pin, "author");
            return pinAdded;
        })
    }
}
