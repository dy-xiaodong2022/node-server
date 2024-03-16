const sql = require("mysql")

let connection

// config: host, user, password, database
function connect(config) {
    return new Promise((resolve, reject) => {
        connection = sql.createConnection(config)

        // Handle error & auto reconnect
        connection.connect(e => {
            if (e) {
                console.error("MySQL error when connecting: " + e);
                reject(e)
            }
            else {
                console.log("MySQL connected");
                resolve(connection)
            }
        })
        connection.on("error", err => {
            console.log("MySQL error: " + err)
            console.log("Reconnecting...")
            connection = connect(config).then(() => {
                console.log("Reconnected")
            })
        })
    })
}

function exec(command, params) {
    if (connection instanceof Promise) return new Promise((resolve, reject) => {
        connection.then(() => {
            exec(command, params).then(resolve).catch(reject)
        })
    })

    return new Promise((resolve, reject) => {
        connection.query(command, params, (err, result) => {
            console.log("exec", command)
            console.log("result", result);
            if (err) {
                reconnect()
                reject(err)
            }
            else resolve(result)
        })
    })
}

// Reconnect func
function reconnect() {
    console.log("Reconnecting...")
    connection = connect(connection.config)
}

module.exports = {
    connect,
    exec,
    connection
}