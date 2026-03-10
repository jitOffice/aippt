"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yargsApplyLocallyCommand = void 0;
const shared_options_1 = require("../../yargs-utils/shared-options");
exports.yargsApplyLocallyCommand = {
    command: 'apply-locally [options]',
    describe: 'Applies a self-healing CI fix locally. This command is an alias for `nx-cloud apply-locally`.',
    builder: (yargs) => (0, shared_options_1.withVerbose)(yargs)
        .help(false)
        .showHelpOnFail(false)
        .option('help', { describe: 'Show help.', type: 'boolean' }),
    handler: async (args) => {
        process.exit(await (await Promise.resolve().then(() => require('./apply-locally'))).applyLocallyHandler(args));
    },
};
