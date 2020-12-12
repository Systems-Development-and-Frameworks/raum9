const {DataSource} = require('apollo-datasource');
const {UserInputError, AuthenticationError} = require('apollo-server-errors');
const neode = require('../database/NeodeConfiguration');
const {User} = require('../datastore/UserDataStore');

class Post {
    constructor({id, title, author, node = null}) {
        this.id = id
        this.title = title
        this.author = author
        this.node = node;
    }

    static fromObject(data) {
        let author = User.fromObject(data.node.get('wrote').startNode().properties())
        return new Post({id: data.id, title: data.title, author: author, node: data.node});
    }
}

class PostDataStore extends DataSource {

    constructor(userDataStore) {
        super()
        this.userDataStore = userDataStore;
    }

    initialize({context}) {
        this.currentUser = context.user?.uid;
        this.driver = context.driver;
    }

    /**
     * Get all Posts.
     * @returns Post[]
     */
    async allPosts() {
        const nodes = await neode.all('Post');
        if (!nodes) return null;
        return nodes.map(node => Post.fromObject({...node.properties(), node}));
    }

    async getPost(id) {
        const node = await neode.first('Post', 'id', parseInt(id));
        if (!node) return null;
        return Post.fromObject({...node.properties(), node});
    }

    getVoteCount(post) {
        let votes = post.node.get('votes')
        return votes.map(vote => vote.properties().count).reduce((a, b) => a + b, 0);
    }

    async createPosts(posts) {
        for (const post of posts) {
            await this.createPost(post.id, post.title, post.author)
        }
    }

    async createPost(id, title, authorNode) {
        let post = new Post({id: id, title: title, author: authorNode})

        const node = await neode.create('Post', post);
        await node.relateTo(post.author.node, 'wrote');
        Object.assign(post, {...node.properties(), node});
        return post;
    }

    async createPostForCurrentUser(title) {
        let authorNode = await this.userDataStore.getUserById(this.currentUser);
        let nextPostId = await PostDataStore.#nextPostId();
        return this.createPost(nextPostId, title, authorNode);
    }

    static async #nextPostId() {
        let currentMaxId = await neode.cypher('MATCH (post:Post) RETURN post.id ORDER BY post.id DESC LIMIT 1');
        if (currentMaxId.records.length === 0) {
            return 1;
        }
        return parseInt(currentMaxId.records[0].get('post.id')) + 1;
    }

    async upvotePost(id) {
        let user = await this.userDataStore.getUserById(this.currentUser);
        return this.vote(id, 1, user);
    }

    async downvotePost(id) {
        let user = await this.userDataStore.getUserById(this.currentUser);
        return this.vote(id, -1, user);
    }

    /**
     * A generic function for upvote and downvote of a post.
     * @param id id of the post
     * @param count a number value of vote weight
     * @param user a user class object that represents the voted user
     * @returns {Post|null}
     */
    async vote(id, count, user) {
        let post = await this.getPost(id);

        if (post) {
            await post.node.relateTo(user.node, 'votes', {count: count})
            return await this.getPost(id);
        }
        throw new UserInputError('Post not found');
    }

    async deletePost(id) {
        let post = await this.getPost(id);
        if (!post) {
            throw new UserInputError('Post not found for id ' + id);
        }

        if (post.author.id !== this.currentUser) {
            throw new AuthenticationError('You are not the author of the post');
        }

        await neode.delete(post.node);
        return post;
    }
}

module.exports = {PostDataStore, Post}