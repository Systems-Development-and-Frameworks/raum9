const {UserInputError, AuthenticationError} = require('apollo-server-errors');
const {DataSource} = require('apollo-datasource');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class User {
    constructor(id, name, email, password = null) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

class UserDataStore extends DataSource {

    constructor(users = null) {
        super()

        this.users = users ?? [
            new User(1, 'Max Mustermann', 'max@mustermann.de'),
            new User(2, 'Max Mustermann2', 'max@mustermann2.de'),
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

    createUser(name, email, password) {
        this.validateNewUserInput(email, password);

        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = new User(this.createNewUserId(), name, email, hashedPassword);

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
            throw new AuthenticationError('User not found');
        }

        const isAuthenticated = bcrypt.compareSync(password, user.password);

        if (!isAuthenticated) {
            throw new AuthenticationError('must authenticate');
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET missing in env');
            return null;
        }

        return jwt.sign({uid: user.id}, secret);
    }
}

module.exports = {UserDataStore, User}