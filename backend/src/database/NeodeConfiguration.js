const Neode = require('neode');

const dir = `${__dirname}/model`;
// eslint-disable-next-line new-cap
const instance = new Neode(process.env.NEO4J_URL, process.env.NEO4J_USER, process.env.NEO4J_PASSWORD).withDirectory(dir);
module.exports = instance;
