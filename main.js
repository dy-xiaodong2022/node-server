const { connect, exec } = require("./mysql")
const { create, sendError, sendJson } = require("./api")

const mysql = {
    setup(config) {
        return connect({
            host: config.host || "localhost", // Default
            user: config.user || "root", // Default
            ...config
        })
    },
    exec(command, params) {
        return exec(command, params)
    },
    select(table, where) {
        return exec(`SELECT * FROM ${table} WHERE ?`, where)
    }
}

const api = {
    /**
     * @param {number} port 
     * @param {{[key: string]: (req: any, res: any, data: any, sendJson: (data: any) => void, sendError: (code: number, message: string) => void)}} pages 
     */
    setup(port, pages) {
        return create(port, pages)
    },
    sendError,
    sendJson
}

module.exports = {
    mysql,
    api
}