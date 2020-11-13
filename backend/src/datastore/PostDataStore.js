const {DataSource} = require('apollo-datasource');

class PostDataStore extends DataSource {

    constructor(userDataStore, posts = null) {
        super()

        this.userDataStore = userDataStore;
        this.posts = posts ?? [
            {
                id: 1,
                title: 'Message 1',
                votes: 3,
                author_id: 'Max Mustermann'
            },
            {
                id: 2,
                title: 'Message 2',
                votes: 3,
                author_id: 'Max Mustermann2'
            }

        ];
    }

    initialize({context}) {
    }

    allPosts() {
        return this.posts;
    }

    createPost(title, author_id) {
        let post = {
            id: Math.max(...this.posts.map(post => post.id), 0) + 1,
            title: title,
            votes: 0,
            author_id: author_id
        }
        this.posts.push(post);
        return post;
    }

    upvotePost(id, user) {

    }
}

module.exports = PostDataStore