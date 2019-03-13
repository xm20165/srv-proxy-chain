0.2.7 / 2018-02-19
===================
- Updated README

0.2.6 / 2018-12-27
===================
- Bugfix: Added `Host` header to `HTTP CONNECT` requests to upstream proxies

0.2.5 / 2018-09-10
===================
- Bugfix: Invalid request headers broke proxy chain connection. Now they will be skipped instead.

0.2.4 / 2018-07-27
===================
- Bugfix: large custom responses were not delivered completely because the socket was closed too early

0.2.3 / 2018-06-21
===================
- Bugfix: 'requestFailed' was emitting `{ request, err }` instead of `{ request, error }`

0.2.2 / 2018-06-19
===================
- BREAKING: The 'requestFailed' event now emits object `{ request, error }` instead of just `error`

0.1.35 / 2018-06-12
===================
- Bugfix: When target URL cannot be parsed instead of crashing, throw RequestError

0.1.34 / 2018-06-08
===================
- Minor improvement: HandlerBase.fail() now supports RequestError

0.1.33 / 2018-06-08
===================
- Renamed `customResponseFunc` to `customResponseFunction` and changed parameters for more clarity

0.1.32 / 2018-06-08
===================
- Added `customResponseFunc` option to `prepareRequestFunction` to support custom response to HTTP requests

0.1.31 / 2018-05-21
===================
- Updated project homepage in package.json

0.1.29 / 2018-04-15
===================
- Fix: anonymizeProxy() now supports upstream proxies with empty password

0.1.28 / 2018-03-27
===================
- Added `createTunnel()` function to create tunnels through HTTP proxies for arbitrary TCP network connections
  (eq. connection to mongodb/sql database through HTTP proxy)

0.1.27 / 2018-03-05
===================
- Better error messages for common network errors
- Pass headers from target socket in HTTPS tunnel chains

0.1.26 / 2018-02-14
===================
- If connection is denied because of authentication error, optionally "prepareRequestFunction" can provide error message.

0.1.25 / 2018-02-12
===================
- When connection is only through socket, close srcSocket when trgSocket ends

0.1.24 / 2018-02-09
===================
- Fixed incorrect closing of ServerResponse object which caused phantomjs to mark resource requests as errors.

0.1.23 / 2018-02-07
===================
- Fixed missing variable in "Incorrect protocol" error message.

0.1.22 / 2018-02-05
===================
- Renamed project's GitHub organization

0.1.21 / 2018-01-26
===================
- Added Server.getConnectionIds() function

0.1.20 / 2018-01-26
===================
- Fixed "TypeError: The header content contains invalid characters" bug

0.1.19 / 2018-01-25
===================
- fixed uncaught error events, code improved

0.1.18 / 2018-01-25
===================
- fixed a memory leak, improved logging and consolidated code

0.1.17 / 2018-01-23
===================
- added `connectionClosed` event to notify users about closed proxy connections

0.1.16 / 2018-01-09
===================
- added measuring of proxy stats - see `getConnectionStats()` function

0.1.14 / 2017-12-19
===================
- added support for multiple headers with the same name (thx shershennm)

0.0.1 / 2017-11-06
===================
- Project created
