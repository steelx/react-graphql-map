const { AuthenticationError } = require("apollo-server");

const authenticated = (next) => (root, args, ctx, info) => {
    if(!ctx) {
        return new AuthenticationError("Authentication Error");
    }

    return next(root, args, ctx, info);
}

module.exports = {
    Query: {
        me: authenticated((root, args, ctx) => ctx.currentUser)
    }
}