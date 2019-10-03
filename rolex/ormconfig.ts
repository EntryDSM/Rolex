const path = require('path');
const {DB_HOST, DB_PASSWORD, DB_PORT, DB_USER, ROLEX, AVENGERS} = process.env;

const baseOptions = {
    type: "mysql",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    entities: [
        path.join(__dirname, "src/entity/**/*.ts")
    ],
}

const rolexConfig = Object.assign({
    name: "rolex",
    database: ROLEX,
}, baseOptions);

const avengersConfig = Object.assign({
    name: "avengers",
    database: AVENGERS,
}, baseOptions);

module.exports = [ rolexConfig, avengersConfig ];