class Message {
    constructor(sender, receiver, content) {
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
    }

    getSender() {
        return this.sender;
    }

    getReceiver() {
        return this.receiver;
    }

    getContent() {
        return this.content;
    }

    static createMessage(sender, receiver, content) {
        return new Message(sender, receiver, content);
    }
}

module.exports = Message;
