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
                author_id: 'Max Mustermann'
            },
            {
                id: 2,
                title: 'Message 2',
                votes: [
                    'Max Mustermann'
                ],
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
            votes: [],
            author_id: author_id
        }
        this.posts.push(post);
        this.userDataStore.createIfNotExists(author_id);
        return post;
    }

    upvotePost(id, user) {
        let post = this.posts.find(post => post.id === parseInt(id));
        if (post !== undefined) {
            if (!post.votes.includes(user)) {
                post.votes.push(user);
            }
            return post;
        }
        return null
    }
}

module.exports = PostDataStore