module.exports = {
    id: {
        type: 'int',
        primary: true
    },
    title: {
        type: 'string',
        required: true
    },
    wrote: {
        type: 'relationship',
        target: 'User',
        relationship: 'WROTE',
        direction: 'in',
        eager: true
    },
    votes: {
        type: 'relationships',
        target: 'User',
        relationship: 'VOTE',
        direction: 'in',
        eager: true,
        properties: {
            count: 'int'
        }
    }
};
