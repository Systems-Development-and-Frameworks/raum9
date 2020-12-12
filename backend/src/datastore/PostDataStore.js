const {DataSource} = require('apollo-datasource');
const {UserInputError, AuthenticationError} = require('apollo-server-errors');
const neode = require('../database/NeodeConfiguration');
const {User} = require('../datastore/UserDataStore');

class Post {
    constructor({id, title, author}) {
        this.id = id
        this.title = title
        this.author = author
    }

    static fromObject(data) {
        let author = User.fromObject(data.node.get('wrote').startNode().properties())
        return new Post({id: data.id, title: data.title, author: author});
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
        const node = await neode.findById('Post', parseInt(id));
        if (!node) return null;
        return Post.fromObject({...node.properties(), node});
    }

    getVoteCount(post) {
        return Array.from(post.votes).map(([_, count]) => count ? 1 : -1).reduce((a, b) => a + b, 0)
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