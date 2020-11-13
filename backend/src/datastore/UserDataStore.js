const {DataSource} = require('apollo-datasource');

class UserDataStore extends DataSource {

    constructor(users = null) {
        super()

        this.users = users ?? [
            {
                name: 'Max Mustermann',
            }
        ]
    }

    initialize({context}) {
    }

    allUsers() {
        return this.users;
    }
}

module.exports = UserDataStore