const {DataSource} = require('apollo-datasource');

class UserDataStore extends DataSource {

    constructor(users = null) {
        super()

        this.users = users ?? [
            {
                id: 1,
                name: 'Max Mustermann',
                email: 'max@mustermann.de'
            },
            {
                id: 2,
                name: 'Max Mustermann2',
                email: 'max@mustermann2.de'
            }
        ]
    }

    initialize({context}) {
    }

    getUserById(id) {
        return this.users.find(user => user.id === id);
    }

    allUsers() {
        return this.users;
    }

    createIfNotExists(name) {
        if (this.getUserById(name) === undefined) {
            this.users.push({
                name: name
            });
        }
    }
}

module.exports = UserDataStore