const {DataSource} = require('apollo-datasource');

class UserDataStore extends DataSource {

    constructor(users = null) {
        super()

        this.users = users ?? [
            {
                name: 'Max Mustermann',
            },
            {
                name: 'Max Mustermann2',
            }
        ]
    }

    initialize({context}) {
    }

    getUserById(name) {
        return this.users.find(user => user.name === name);
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