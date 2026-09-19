export interface ThreadMessageProps {
    id: string;
    threadId: string;
    senderId: string;
    message: string;
    imageUrl?: string;
    createdAt: Date;
}
export declare class ThreadMessage {
    private props;
    private constructor();
    static create(input: {
        id: string;
        threadId: string;
        senderId: string;
        message: string;
        imageUrl?: string;
        now: Date;
    }): ThreadMessage;
    static reconstitute(props: ThreadMessageProps): ThreadMessage;
    toProps(): Readonly<ThreadMessageProps>;
}
