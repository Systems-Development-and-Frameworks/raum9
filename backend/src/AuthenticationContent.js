const jwt = require('jsonwebtoken');

module.exports = function ({req}) {
    const token = req.headers?.authorization?.replace('Bearer ', '');
    try {
        const decodedJwt = jwt.decode(token, process.env.JWT_SECRET);
        return {decodedJwt};
    } catch (e) {
        return {};
    }
};