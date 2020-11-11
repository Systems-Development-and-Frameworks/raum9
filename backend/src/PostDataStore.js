const {DataSource} = require('apollo-datasource');

class PostDataStore extends DataSource {

    constructor() {
        super();

        this.posts = [
            {
                id: 1,
                title: "Start Message",
                votes: 1
            }
        ]
    }

    async getPosts() {
        return this.posts;
    }
}

module.exports = PostDataStore