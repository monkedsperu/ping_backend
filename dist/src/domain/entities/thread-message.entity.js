"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadMessage = void 0;
class ThreadMessage {
    constructor(props) {
        this.props = props;
    }
    static create(input) {
        const trimmed = input.message.trim();
        if (trimmed.length < 1) {
            throw new Error('El mensaje no puede estar vacío.');
        }
        if (trimmed.length > 500) {
            throw new Error('El mensaje es demasiado largo.');
        }
        return new ThreadMessage({
            id: input.id,
            threadId: input.threadId,
            senderId: input.senderId,
            message: trimmed,
            imageUrl: input.imageUrl,
            createdAt: input.now,
        });
    }
    static reconstitute(props) {
        return new ThreadMessage(props);
    }
    toProps() {
        return { ...this.props };
    }
}
exports.ThreadMessage = ThreadMessage;
