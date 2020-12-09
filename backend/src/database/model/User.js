module.exports = {
    id: {
        type: 'int',
        primary: true
    },
    email: {
        type: 'string',
        unique: true,
        required: true
    },
    password: {
        type: 'string',
        strip: true
    },
    hashedPassword: {
        type: 'string',
        required: true
    }
};
