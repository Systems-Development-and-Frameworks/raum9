const {DataSource} = require('apollo-datasource');

class PostDataStore extends DataSource {

    constructor(userDataStore, posts = null) {
        super()

        this.userDataStore = userDataStore;
        this.posts = posts ?? [
            {
                id: 1,
                title: 'Message 1',
                votes: [],
                author_id: 1
            },
            {
                id: 2,
                title: 'Message 2',
                votes: [
                    1
                ],
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
        let post = this.posts.find(post => post.id === parseInt(id));

        if (post) {
            if (this.currentUser &&
                !post.votes.includes(this.currentUser)) {
                post.votes.push(this.currentUser);
            }
            return post;
        }
        return null
    }
}

module.exports = PostDataStore