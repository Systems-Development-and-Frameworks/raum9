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
                    'Max Mustermann'
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

    createPost(title, author_id) {
        let post = {
            id: Math.max(...this.posts.map(post => post.id), 0) + 1,
            title: title,
            votes: [],
            author_id: author_id
        }
        this.posts.push(post);
        this.userDataStore.createIfNotExists(author_id);
        return post;
    }

    upvotePost(id) {
        let post = this.posts.find(post => post.id === parseInt(id));

        if (post !== undefined) {
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