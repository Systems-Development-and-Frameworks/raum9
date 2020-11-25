const {UserInputError} = require('apollo-server-errors');
const {DataSource} = require('apollo-datasource');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

    getUserByMail(email) {
        return this.users.find(user => user.email === email);
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

    createUser(name, email, password) {
        this.validateNewUserInput(email, password);

        const hashedPassword = bcrypt.hashSync(password, 10); // TODO Maybe async

        const user = {
            id: this.createNewUserId(),
            name: name,
            email: email,
            password: hashedPassword
        };
        this.users.push(user);
        return user;
    }

    createNewUserId() {
        return Math.max(...this.users.map(user => user.id), 0) + 1;
    }

    validateNewUserInput(mail, password) {
        if (!password.match(/.{8,}/)) {
            throw new UserInputError('Password too short');
        }

        if (this.users.find(user => user.email === mail)) {
            throw new UserInputError('Mail Address in use');
        }
    }

    authenticateUser(email, password) {
        const user = this.getUserByMail(email)
        if (!user) {
            return null;
        }

        const isAuthenticated = bcrypt.compareSync(password, user.password);

        if (!isAuthenticated) {
            return null;
        }

        const secret = process.env.JWT_SECRET;
        if (secret === null || secret === '') {
            console.error('JWT_SECRET missing in env');
            return null;
        }

        return jwt.sign({uid: user.id}, secret);
    }
}

module.exports = UserDataStore