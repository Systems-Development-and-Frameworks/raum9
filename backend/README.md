# News backend

## Installation steps

1. Run a neo4j database (e.g. in a docker container) [Further information](https://hub.docker.com/_/neo4j)
2. Configure the database connection settings. Add the following to `.env`
```
NEO4J_URL=bolt://<ip|domain>:<port>
NEO4J_USER=<username>
NEO4J_PASSWORD=<password>
```
3. Add a jwt secret to the `.env` file:
```
JWT_SECRET=<ypur secret>
```

## Build Setup

``` bash
npm install
```

# Start server

To run the server:

```bash
npm run server
```

# Run linter

```bash
npm run lint
```

# Task 1: Architektur

Wir haben uns für "Neo4J and neo4j-graphql-js" entschieden, um neo4j besser zu lernen. Also aus pedagogischen Gründen.
