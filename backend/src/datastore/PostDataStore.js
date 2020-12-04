const {DataSource} = require('apollo-datasource');
const {UserInputError, AuthenticationError} = require('apollo-server-errors');

class PostDataStore extends DataSource {

    constructor(userDataStore, posts = null) {
        super()

        this.userDataStore = userDataStore;
        this.posts = posts ?? [
            {
                id: 1,
                title: 'Message 1',
                votes: new Map(),
                author_id: 1
            },
            {
                id: 2,
                title: 'Message 2',
                votes: new Map([[1, true]]),
                author_id: 2
            }

        ];
    }

    initialize({context}) {
        this.currentUser = context.user?.uid;
    }

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
        let post = {
            id: Math.max(...this.posts.map(post => post.id), 0) + 1,
            title: title,
            votes: [],
            author_id: this.currentUser
        }
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

module.exports = PostDataStore