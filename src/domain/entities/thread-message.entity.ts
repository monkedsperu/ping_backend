export interface ThreadMessageProps {
  id: string;
  threadId: string;
  senderId: string;
  message: string;
  imageUrl?: string;
  createdAt: Date;
}

export class ThreadMessage {
  private constructor(private props: ThreadMessageProps) {}

  static create(input: {
    id: string;
    threadId: string;
    senderId: string;
    message: string;
    imageUrl?: string;
    now: Date;
  }): ThreadMessage {
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

  static reconstitute(props: ThreadMessageProps): ThreadMessage {
    return new ThreadMessage(props);
  }

  toProps(): Readonly<ThreadMessageProps> {
    return { ...this.props };
  }
}
