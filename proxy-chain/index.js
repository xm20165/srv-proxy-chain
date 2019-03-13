//import { Server, RequestError } from './server.js';
//import { parseUrl, redactUrl, redactParsedUrl } from './tools';
//import { anonymizeProxy, closeAnonymizedProxy } from './anonymize_proxy';
//import { createTunnel, closeTunnel } from './tcp_tunnel';

const Server = require ( './server.js' ).Server;
const RequestError = require ( './server.js' ).RequestError;
const parseUrl = require ( './tools' ).parseUrl;
const redactUrl = require ( './tools' ).redactUrl;
const redactParsedUrl = require ( './tools' ).redactParsedUrl;
const anonymizeProxy = require ( './anonymize_proxy').anonymizeProxy;
const closeAnonymizedProxy = require ( './anonymize_proxy').closeAnonymizedProxy;
const createTunnel = require ( './tcp_tunnel' ).createTunnel;
const closeTunnel = require ( './tcp_tunnel' ).closeTunnel;

/* globals module */

// Publicly exported functions and classes
const ProxyChain = {
    Server,
    RequestError,
    parseUrl,
    redactUrl,
    redactParsedUrl,
    anonymizeProxy,
    closeAnonymizedProxy,
    createTunnel,
    closeTunnel,
};

module.exports = ProxyChain;
