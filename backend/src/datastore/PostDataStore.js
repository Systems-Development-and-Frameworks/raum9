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
        return this.posts
            .map(post => {
                post.author = this.userDataStore.getUserById(post.author_id);
                return post;
            })
            .filter(post => post.author !== undefined);
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