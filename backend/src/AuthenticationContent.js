const jwt = require('jsonwebtoken');

module.exports = function ({req}) {
    const token = req.headers?.authorization?.replace('Bearer ', '');
    try {
        const user = jwt.decode(token, process.env.JWT_SECRET);
        return {user};
    } catch (e) {
        return {};
    }
};
