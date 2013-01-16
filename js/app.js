$(function() {

    // Models
    var Tweet = Backbone.Model.extend();

    // Collections
    var Tweets = Backbone.Collection.extend({
        model: Tweet,
        url: 'http://search.twitter.com/search.json?q=Providence&rpp=5&callback=?',
        parse: function(response) {
            console.log('parsing...');
            return response.results
        }
    });

    // Views
    var TestView = Backbone.View.extend({
        el: '.page',
        render: function() {
            this.$el.html('Foo bar');
        },
    });

    var TweetView = Backbone.View.extend({
        el: 'tweets',
        initialize: function() {
            this.tweets = new Tweets();
            this.tweets.bind('reset', function(collection) {
                collection.each(function(tweet) {
                    console.log(tweet.get('text'));
                });
            });
            this.tweets.fetch();
        }
    });

    // Router
    var Router = Backbone.Router.extend({
        routes: {
            '' : 'home'
        }
    });

    // Instantiations.
    var testView = new TestView();
    var tweetView = new TweetView();
    var router = new Router();

    router.on('route:home', function() {
        console.log('Load the home page!');
        testView.render();
    });

    // Let's get this party started!
    Backbone.history.start();

});
