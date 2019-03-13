//import net from 'net';
//import HandlerBase from './handler_base';
const net = require ( 'net' );
const HandlerBase = require ( './handler_base' );

/**
 * Represents a proxied connection from source to the target HTTPS server.
 */
//export default class HandlerTunnelDirect extends HandlerBase {
class HandlerTunnelDirect extends HandlerBase {
    constructor(options) {
        super(options);

        this.bindHandlersToThis(['onTrgSocketConnect']);
    }

    run() {
        this.log(`Connecting to target ${this.trgParsed.hostname}:${this.trgParsed.port}`);

        const socket = net.createConnection(this.trgParsed.port, this.trgParsed.hostname);
        socket.once('connect', this.onTrgSocketConnect);

        this.onTrgSocket(socket);
    }

    onTrgSocketConnect(response, socket, head) {
        if (this.isClosed) return;
        this.log('Connected');

        this.srcGotResponse = true;

        this.srcResponse.removeListener('finish', this.onSrcResponseFinish);
        this.srcResponse.writeHead(200, 'Connection established');

        // HACK: force a flush of the HTTP header. This is to ensure 'head' is empty to avoid
        // assert at https://github.com/request/tunnel-agent/blob/master/index.js#L160
        // See also https://github.com/nodejs/node/blob/master/lib/_http_outgoing.js#L217
        this.srcResponse._send('');

        // Relinquish control of the socket from the ServerResponse instance
        this.srcResponse.detachSocket(this.srcSocket);

        // ServerResponse is no longer needed
        this.srcResponse = null;

        // Forward pre-parsed parts of the first packets (if any)
        if (head && head.length > 0) {
            this.srcSocket.write(head);
        }
        if (this.srcHead && this.srcHead.length > 0) {
            this.trgSocket.write(this.srcHead);
        }

        // Setup bi-directional tunnel
        this.trgSocket.pipe(this.srcSocket);
        this.srcSocket.pipe(this.trgSocket);
    }
}
module.exports = HandlerTunnelDirect;
