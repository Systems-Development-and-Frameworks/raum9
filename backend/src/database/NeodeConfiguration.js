const Neode = require('neode');

const instance = new Neode(process.env.NEO4J_URL, process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
    .withDirectory(`${__dirname}/model`);
module.exports = instance;
