"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadCloudClientHandler = downloadCloudClientHandler;
const nx_json_1 = require("../../../config/nx-json");
const update_manager_1 = require("../../../nx-cloud/update-manager");
const get_cloud_options_1 = require("../../../nx-cloud/utilities/get-cloud-options");
const nx_cloud_utils_1 = require("../../../utils/nx-cloud-utils");
const handle_errors_1 = require("../../../utils/handle-errors");
const output_1 = require("../../../utils/output");
const utils_1 = require("../utils");
function downloadCloudClientHandler(args) {
    if (!(0, nx_cloud_utils_1.isNxCloudUsed)((0, nx_json_1.readNxJson)())) {
        (0, utils_1.warnNotConnectedToCloud)();
        return Promise.resolve(1);
    }
    return (0, handle_errors_1.handleErrors)(args.verbose, async () => {
        const options = (0, get_cloud_options_1.getCloudOptions)();
        const result = await (0, update_manager_1.verifyOrUpdateNxCloudClient)(options);
        if (result) {
            output_1.output.success({
                title: 'Nx Cloud client downloaded successfully',
                bodyLines: [`Version: ${result.version}`],
            });
        }
    });
}
