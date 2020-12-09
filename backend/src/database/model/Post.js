module.exports = {
    id: {
        type: 'int',
        primary: true
    },
    title: {
        type: 'string',
        required: true
    },
    text: 'string',
    wrote: {
        type: 'relationship',
        target: 'User',
        relationship: 'WROTE',
        direction: 'in'
    }
};
