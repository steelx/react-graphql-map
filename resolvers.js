const user = {
    _id: "1",
    name: "Ajinkya",
    email: "ajinkya@gmail.com",
    picture: "https://cloudinary.com/xyz"
};

module.exports = {
    Query: {
        me: () => user
    }
}