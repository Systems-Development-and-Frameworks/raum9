const neo4j = require('neo4j-driver');

if (!process.env.NEO4J_URL || !process.env.NEO4J_USER || !process.env.NEO4J_PASSWORD) {
    throw new Error('NEO4J Configuration missing');
}

const driver = neo4j.driver(
    process.env.NEO4J_URL,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

module.exports = driver;
