$(function() {

    // Models
    var Tweet = Backbone.Model.extend();

    // Collections
    var Tweets = Backbone.Collection.extend({
        model: Tweet,
        url: function() {
            return 'http://search.twitter.com/search.json?q=' + this.query + '&rpp=10&callback=?';
        },
        parse: function(response) {
            console.log('parsing...');
            return response.results;
        },
        query: 'downcityjs'
    });

    // Views
    var TestView = Backbone.View.extend({
        el: '.test',
        render: function() {
            this.$el.html('Foo bar');
        }
    });

    var SearchView = Backbone.View.extend({
        el: '#search',
        initialize: function() {
            this.render();
        },
        render: function() {
            var template = _.template( $("#search_template").html(), {} );
            this.$el.html( template );
        },
        events: {
            "click #getResults": "doSearch",
            "click #resetResults": "doReset"
        },
        doSearch: function( event ){
            tweetView.loadResults($("#appendedInputButton").val());
        },
        doReset: function( event ){
            tweetView.clearCollection();
        }
    });

    var TweetView = Backbone.View.extend({
        el: '#tweets',
        initialize: function() {
            this.tweets = new Tweets();
            this.loadResults('danriti');
            this.render();
        },
        render: function() {
            console.log('tweet render');
        },
        loadResults: function(query) {
            var that = this;
            this.tweets.query = query;
            this.tweets.fetch({
                success: function(tweets) {
                    $(that.el).append(_.template( $('#tweet_template').html(), {tweets: tweets.models, _:_})); 
                }
            });
        },
        clearCollection: function() {
            console.log('clear collection');
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
    var searchView = new SearchView();
    var tweetView = new TweetView();
    var router = new Router();

    router.on('route:home', function() {
        console.log('Load the home page!');
        testView.render();
    });

    // Let's get this party started!
    Backbone.history.start();

});
