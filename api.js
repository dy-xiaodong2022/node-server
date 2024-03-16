const http = require('http');

function create(port, pages) {
    const server = http.createServer((req, res) => {
        // wait sending data
        let chunks = [];
        req.on('data', chunk => {
            chunks.push(chunk);
        });
        req.on('end', () => {
            let data = Buffer.concat(chunks).toString();
            // try to parse the data
            try {
                data = JSON.parse(data);
            } catch (e) {}

            // find the page
            let url = req.url.split('?')[0];
            let page = pages[url];
            if (page) {
                // call the page
                page({
                    req,
                    res,
                    data,
                    sendJson: data => sendJson(res, data),
                    sendError: (code, message) => sendError(res, code, message)
                });
            } else {
                // page not found
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Page not found');
            }
        });
    })

    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
    })

    return server;
}

function sendJson(res, data) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

function sendError(res, code, message) {
    res.writeHead(code, { 'Content-Type': 'text/plain' });
    res.end(message);
}

module.exports = {
    create,
    sendJson,
    sendError
}