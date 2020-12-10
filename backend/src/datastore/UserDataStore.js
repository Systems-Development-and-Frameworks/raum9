const {UserInputError, AuthenticationError} = require('apollo-server-errors');
const {DataSource} = require('apollo-datasource');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const neode = require('../database/NeodeConfiguration');

class User {
    constructor(id, name, email, password = null) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    static fromObject(data) {
        let object = new User(0, '', '');
        Object.assign(object, data);
        return object;
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
        this.driver = context.driver;
    }

    async getUserById(id) {
        const node = await neode.findById('User', parseInt(id));
        if (!node) return null;
        return User.fromObject({...node.properties(), node});
    }

    async getUserByMail(email) {
        const node = await neode.first('User', 'email', email);
        if (!node) return null;
        return User.fromObject({...node.properties(), node});
    }

    async allUsers() {
        const nodes = await neode.all('User');
        if (!nodes) return null;
        return nodes.map(node => User.fromObject({...node.properties(), node}));
    }

    async createUser(name, email, password) {
        await this.validateNewUserInput(email, password);

        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = new User(this.createNewUserId(), name, email, hashedPassword);

        let node = await neode.create('User', user);
        Object.assign(user, {...node.properties(), node});
        return user;
    }

    createNewUserId() {
        return Math.max(...this.users.map(user => user.id), 0) + 1;
    }

    async validateNewUserInput(mail, password) {
        if (!password.match(/.{8,}/)) {
            throw new UserInputError('Password too short');
        }

        if (await this.getUserByMail(mail)) {
            throw new UserInputError('Mail Address in use');
        }
    }

    async authenticateUser(email, password) {
        const user = await this.getUserByMail(email)
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