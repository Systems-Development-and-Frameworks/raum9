const jwt = require('jsonwebtoken');
const driver = require('./database/Neo4jDriver')

module.exports = function ({req}) {
    const token = req.headers?.authorization?.replace('Bearer ', '');
    try {
        const user = jwt.decode(token, process.env.JWT_SECRET);
        return {user, driver};
    } catch (e) {
        return {};
    }
};
