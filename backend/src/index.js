const dotenv = require('dotenv');
const server = require('./server');

dotenv.config();

// The `listen` method launches a web server.
server().listen().then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});
