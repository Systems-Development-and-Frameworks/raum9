const {DataSource} = require('apollo-datasource');
const {UserInputError, AuthenticationError} = require('apollo-server-errors');
const neode = require('../database/NeodeConfiguration');

class Post {
    constructor(id, title, author_id, votes = new Map()) {
        this.id = id
        this.title = title
        this.author_id = author_id
        this.votes = votes
    }

    static fromObject(data) {
        let object = new Post(0, '', 0);
        Object.assign(object, data);
        return object;
    }
}

class PostDataStore extends DataSource {

    constructor(userDataStore, posts = null) {
        super()

        this.userDataStore = userDataStore;
        this.posts = posts ?? [
            new Post(1, 'Message 1', 1),
            new Post(2, 'Message 2', 2, new Map([[1, true]]))
        ];
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
        const node = await neode.findById('Post', parseInt(id));
        if (!node) return null;
        return Post.fromObject({...node.properties(), node});
    }

    getVoteCount(post) {
        return Array.from(post.votes).map(([_, count]) => count ? 1 : -1).reduce((a, b) => a + b, 0)
    }

    createPost(title) {
        let post = new Post(Math.max(...this.posts.map(post => post.id), 0) + 1, title, this.currentUser)
        this.posts.push(post);
        return post;
    }

    upvotePost(id) {
        return this.#vote(id, true);
    }

    downvotePost(id) {
        return this.#vote(id, false);
    }

    /**
     * A generic function for upvote and downvote of a post.
     * @param id id of the post
     * @param state a boolean value (true: upvote, false: downvote)
     * @returns {Post|null}
     */
    #vote(id, state) {
        let post = this.posts.find(post => post.id === parseInt(id));

        if (post) {
            post.votes.set(this.currentUser, state);
            return post;
        }
        throw new UserInputError('Post not found');
    }

    async deletePost(id) {
        let post = await this.getPost(id);
        if (!post) {
            throw new UserInputError('Post not found for id ' + id);
        }

        if (post.author_id !== this.currentUser) {
            throw new AuthenticationError('You are not the author of the post');
        }

        this.posts = this.posts.filter(post => post.id !== id);
        return post;
    }
}

module.exports = {PostDataStore, Post}