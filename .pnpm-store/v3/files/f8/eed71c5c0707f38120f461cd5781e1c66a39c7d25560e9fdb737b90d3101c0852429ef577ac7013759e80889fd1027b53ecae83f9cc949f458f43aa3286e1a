"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPluginWorkerMessage = isPluginWorkerMessage;
exports.isPluginWorkerResult = isPluginWorkerResult;
exports.consumeMessage = consumeMessage;
exports.sendMessageOverSocket = sendMessageOverSocket;
const consume_messages_from_socket_1 = require("../../../utils/consume-messages-from-socket");
// =============================================================================
// TYPE GUARDS
// =============================================================================
const MESSAGE_TYPES = [
    'load',
    'createNodes',
    'createDependencies',
    'createMetadata',
    'preTasksExecution',
    'postTasksExecution',
];
const RESULT_TYPES = [
    'loadResult',
    'createNodesResult',
    'createDependenciesResult',
    'createMetadataResult',
    'preTasksExecutionResult',
    'postTasksExecutionResult',
];
function isPluginWorkerMessage(message) {
    return (typeof message === 'object' &&
        message !== null &&
        'type' in message &&
        typeof message.type === 'string' &&
        MESSAGE_TYPES.includes(message.type));
}
function isPluginWorkerResult(message) {
    return (typeof message === 'object' &&
        message !== null &&
        'type' in message &&
        typeof message.type === 'string' &&
        RESULT_TYPES.includes(message.type));
}
// =============================================================================
// MESSAGE HANDLING
// =============================================================================
/**
 * Consumes a message and dispatches to the appropriate handler.
 * If the handler returns a value, it's automatically wrapped in a result message
 * with the correct type and transaction ID.
 *
 * Handlers return just the result payload - the infrastructure handles wrapping.
 */
async function consumeMessage(socket, raw, handlers) {
    const message = raw;
    const type = message.type;
    const handler = handlers[type];
    // Type widening for dynamic dispatch - safe because types guarantee
    // message.type always indexes into the matching handler
    const resultPayload = await handler(message.payload);
    if (resultPayload !== undefined && resultPayload !== null) {
        sendMessageOverSocket(socket, {
            type: `${type}Result`,
            payload: resultPayload,
            tx: message.tx,
        });
    }
}
/**
 * Sends a message over the socket with proper formatting.
 */
function sendMessageOverSocket(socket, message) {
    socket.write(JSON.stringify(message) + consume_messages_from_socket_1.MESSAGE_END_SEQ);
}
