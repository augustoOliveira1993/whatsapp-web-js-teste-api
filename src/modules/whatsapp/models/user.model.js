class User {
    constructor(id, name, phoneNumber) {
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getPhoneNumber() {
        return this.phoneNumber;
    }

    static createUser(id, name, phoneNumber) {
        return new User(id, name, phoneNumber);
    }
}

module.exports = User;
