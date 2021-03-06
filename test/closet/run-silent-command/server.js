'use strict';

const Hapi = require('hapi');

exports.deployment = async () => {

    const server = Hapi.server();

    const register = (srv, options) => {

        srv.expose('commands', {
            someCommand: {
                // Make hpal silent before and after the command is run
                noDefaultOutput: true,
                command: (rootServer, args, root, ctx) => {

                    ctx.options.cmd = [rootServer, args, root, ctx];

                    const stop = rootServer.stop;
                    rootServer.stop = async () => {

                        rootServer.stop = stop;

                        await rootServer.stop();

                        rootServer.stopped = true;
                    };
                }
            }
        });
    };

    const plugin = {
        name: 'x',
        register
    };

    await server.register(plugin);

    return server;
};
