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
        required: true
    }
};
