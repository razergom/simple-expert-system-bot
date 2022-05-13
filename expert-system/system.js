class ExpertSystem {
    constructor(table, stateMessages, helpMessages) {
        this.table = table;
        this.stateMessages = stateMessages;
        this.helpMessages = helpMessages;

        this.state = -1;
        this.helpState = -1;
    }

    start() {
        this.state = 0;
        this.helpState = 0;
    }

    getStartQuestion() {
        const current = this.stateMessages.find(({ currentState }) => currentState === 0);

        if (!current) {
            return null;
        }

        return current.message;
    }

    process(message) {
        const current =
            this.table.find(({ currentState, question }) => currentState === this.state && question === message)

        if (!current) {
            return null;
        }

        const { nextState, isFinal } = current;

        const answer = this.stateMessages.find(({ currentState }) => currentState === nextState);

        if (!answer) {
            return null;
        }

        this.helpState = nextState;
        this.state = isFinal ? -1 : nextState;

        return answer.message;
    }

    getHelp() {
        const current = this.helpMessages.find(({ currentState }) => currentState === this.helpState);

        if (!current) {
            return null;
        }

        this.helpState = -1;

        return current.message;
    }

    static createState(currentState, nextState, isFinal, question) {
        return { currentState, nextState, isFinal, question };
    }

    static createStateMessage(currentState, message) {
        return { currentState, message };
    }
}

module.exports = ExpertSystem;