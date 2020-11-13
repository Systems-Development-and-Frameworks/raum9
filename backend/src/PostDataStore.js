const {DataSource} = require('apollo-datasource');

class PostDataStore extends DataSource {

    constructor() {
        super()

        this.posts = [
            {
                id: 1,
                title: "Message 1",
                votes: 3
            }
        ];
    }

    initialize({context}) {
    }

    allPosts() {
        return this.posts;
    }

    createPost(data) {
        let post = {
            id: Math.max(...this.items.map(item => item.id), 0) + 1,
            title: data,
            votes: 0
        }
        this.posts.add(post);
    }

    upvotePost(id, user) {

    }
}

module.exports = PostDataStore