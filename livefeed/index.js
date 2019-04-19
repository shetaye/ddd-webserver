const io = require('socket.io')();
module.exports = {
    attach() {
        // PORT
        const port = parseInt(process.env.socketport || '1023', 10);
        io.attach(port);
    },
    getNamespace(id) {
        if(!io) {
            console.log('Initialize first!');
            return undefined;
        }
        return io.of(`/${id}`);
    },
    sendEventTo(ns, id, event) {
        if(!io) {
            console.log('Initialize first!');
            return undefined;
        }
        io.of(`/${ns}/${id}`)
        .emit(event);
        console.log(`Sent ${event} to /${id}`);
    },
};