var mysql = require('mysql')

var pool = mysql.createPool({
    connectionLimit: 50,
    host: 'localhost',
    user: 'kianluke3202',
    password: 'pass123',
    database: 'stingedb'
})

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }

    if (connection) connection.release()

    return
})

module.exports = pool