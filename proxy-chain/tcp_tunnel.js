//import Promise from 'bluebird';
//import net from 'net';
//import HandlerTunnelTcpChain from './handler_tunnel_tcp_chain';
//import { parseUrl, findFreePort } from './tools';

const Promise = require ( 'bluebird' );
const net = require ( 'net' );
const HandlerTunnelTcpChain = require ( './handler_tunnel_tcp_chain' );
const parseUrl = require ( './tools').parseUrl;
const findFreePort = require ( './tools').findFreePort;

const runningServers = {};

//export function createTunnel(proxyUrl, targetHost, providedOptions = {}, callback) {
function createTunnel(proxyUrl, targetHost, providedOptions = {}, callback) {
    // TODO: More and better validations - yeah, make sure targetHost is really a hostname
    const [trgHostname, trgPort] = targetHost.split(':');
    if (!trgHostname || !trgPort) throw new Error('target needs to include both hostname and port.');

    const parsedProxyUrl = parseUrl(proxyUrl);
    if (!parsedProxyUrl.hostname) throw new Error('proxyUrl needs to include atleast hostname');
    if (parsedProxyUrl.scheme !== 'http') throw new Error('Currently only "http" scheme is supported');

    const options = {
        verbose: false,
        hostname: 'localhost',
        port: null,
        ...providedOptions,
    };

    return new Promise((resolve, reject) => {
        if (options.port) return resolve(options.port);
        findFreePort().then(resolve).catch(reject);
    }).then((port) => {
        const server = net.createServer();

        const log = (...args) => {
            if (options.verbose) console.log(...args);
        };

        server.on('connection', (srcSocket) => {
            runningServers[port].connections = srcSocket;
            const remoteAddress = `${srcSocket.remoteAddress}:${srcSocket.remotePort}`;
            log('new client connection from %s', remoteAddress);

            srcSocket.pause();

            const tunnel = new HandlerTunnelTcpChain({
                srcSocket,
                upstreamProxyUrlParsed: parsedProxyUrl,
                trgParsed: {
                    hostname: trgHostname,
                    port: trgPort,
                },
                log,
            });

            tunnel.run();

            srcSocket.on('data', onConnData);
            srcSocket.once('close', onConnClose);
            srcSocket.on('error', onConnError);

            function onConnData(d) {
                log('connection data from %s: %j', remoteAddress, d);
            }

            function onConnClose() {
                log('connection from %s closed', remoteAddress);
            }

            function onConnError(err) {
                log('Connection %s error: %s', remoteAddress, err.message);
            }
        });

        return new Promise((resolve) => {
            server.listen(port, (err) => {
                if (err) return reject(err);
                log('server listening to ', server.address());
                runningServers[port] = { server, connections: [] };
                resolve(`${options.hostname}:${port}`);
            });
        });
    })
    .nodeify(callback);
}

//export function closeTunnel(serverPath, closeConnections, callback) {
function closeTunnel(serverPath, closeConnections, callback) {
    const [hostname, port] = serverPath.split(':');
    if (!hostname) throw new Error('serverPath must contain hostname');
    if (!port) throw new Error('serverPath must contain port');

    return new Promise((resolve) => {
        if (!runningServers[port]) return resolve(false);
        if (!closeConnections) return resolve();
        runningServers[port].connections.forEach(connection => connection.destroy());
        resolve();
    })
    .then(serverExists => new Promise((resolve) => {
        if (!serverExists) return resolve(false);
        runningServers[port].close(() => {
            delete runningServers[port];
            resolve(true);
        });
    }))
    .nodeify(callback);
}

module.exports = {createTunnel ,  closeTunnel};
