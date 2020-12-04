const {DataSource} = require('apollo-datasource');
const {UserInputError, AuthenticationError} = require('apollo-server-errors');

class Post {
    constructor(id, title, author_id, votes = new Map()) {
        this.id = id
        this.title = title
        this.author_id = author_id
        this.votes = votes
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
    }

    /**
     * Get all Posts.
     * @returns Post[]
     */
    allPosts() {
        return this.posts;
    }

    getPost(id) {
        return this.posts.find(post => post.id === parseInt(id));
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

    deletePost(id) {
        let post = this.getPost(id);
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