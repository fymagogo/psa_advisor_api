const Pool = require('pg').Pool
const pool = new Pool({
    user:   'postgres',
    host:   'localhost',
    database:   'psa_advisor',
    password: 'postgres',
    port:   5432,
})

module.exports = {
    pool
}