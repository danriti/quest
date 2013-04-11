$(function() {

    // Models
    var Counter = Backbone.Model.extend({
        defaults: {
            'value': 0,
            'interval': 0
        },
        increment: function() {
            var value = this.get('value');
            this.set('value', ++value);
        },
        reset: function() {
            this.set('value', 0);
        }
    });

    var Timer = Backbone.Model.extend({
        defaults: {
            'value': 0
        },
        getTime: function() {
            var count = this.get('value') || 0;

            // Calculate seconds and minutes.
            var seconds = count % 60;
            var minutes = Math.floor(count / 60);

            // Pad the left side (i.e. 09 instead of 9) of the seconds
            // and minutes.
            var secondsStr = _.string.pad(seconds, 2, '0');
            var minutesStr = _.string.pad(minutes, 2, '0');

            return minutesStr + ':' + secondsStr;
        }
    });

    // Views
    var TestView = Backbone.View.extend({
        el: '.test',
        events: {
            'click button#start': 'start',
            'click button#stop': 'stop',
            'click button#reset': 'reset'
        },
        initialize: function() {
            _.bindAll(this, 'render', 'increment', 'start', 'stop', 'reset');
            var self = this;

            // models
            this.counter = new Counter();
            this.timer = new Timer();

            // dependency: counter <- timer
            this.counter.on('change:value', function(model, value) {
                self.timer.set('value', value);
                $('#counter', self.el).html('Counter: ' + self.counter.get('value'));
                $('#timer', self.el).html('Timer: ' + self.timer.getTime());
            });
        },
        render: function() {
            $(this.el).append("<button id='start'>Start</button>");
            $(this.el).append("<button id='stop'>Stop</button>");
            $(this.el).append("<button id='reset'>Reset</button>");
            $(this.el).append("<div id='counter'></div>");
            $(this.el).append("<div id='timer'></div>");
            return this;
        },
        start: function() {
            this.counter.set('interval', setInterval(this.increment, 1000));
        },
        stop: function() {
            clearInterval(this.counter.get('interval'));
        },
        reset: function() {
            this.counter.reset();
        },
        increment: function() {
            this.counter.increment();
        }
    });

    //var SearchView = Backbone.View.extend({
    //    el: '#search',
    //    initialize: function() {
    //        this.render();
    //    },
    //    render: function() {
    //        var template = _.template( $("#search_template").html(), {} );
    //        this.$el.html( template );
    //    },
    //    events: {
    //        "click #getResults": "doSearch",
    //        "click #resetResults": "doReset"
    //    },
    //    doSearch: function( event ){
    //        tweetView.loadResults($("#appendedInputButton").val());
    //    },
    //    doReset: function( event ){
    //        tweetView.clearCollection();
    //    }
    //});

    //var TweetView = Backbone.View.extend({
    //    el: '#tweets',
    //    initialize: function() {
    //        this.tweets = new Tweets();
    //        this.loadResults('danriti');
    //        this.render();
    //    },
    //    render: function() {
    //        console.log('tweet render');
    //    },
    //    loadResults: function(query) {
    //        var that = this;
    //        this.tweets.query = query;
    //        this.tweets.fetch({
    //            success: function(tweets) {
    //                $(that.el).append(_.template( $('#tweet_template').html(), {tweets: tweets.models, _:_}));
    //            }
    //        });
    //    },
    //    clearCollection: function() {
    //        console.log('clear collection');
    //    }
    //});

    // Router
    var Router = Backbone.Router.extend({
        routes: {
            '' : 'home'
        }
    });

    // Instantiations.
    var testView = new TestView();
    //var searchView = new SearchView();
    //var tweetView = new TweetView();
    var router = new Router();

    router.on('route:home', function() {
        console.log('Load the home page!');
        testView.render();
    });

    // Let's get this party started!
    Backbone.history.start();

});
