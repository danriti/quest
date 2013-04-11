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

    var Doubler = Backbone.Model.extend({
        defaults: {
            'value': 0
        }
    });

    // Views
    var TestView = Backbone.View.extend({
        el: '.container',
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
            this.doubler = new Doubler();

            // dependency: counter <- timer
            this.counter.on('change:value', function(model, value) {
                self.timer.set('value', value);
                $('#counter', self.el).html('Counter: ' + self.counter.get('value'));
                $('#timer', self.el).html('Timer: ' + self.timer.getTime());
            });

            // dependency: timer <- doubler
            this.timer.on('change:value', function(model, value) {
                self.doubler.set('value', value * 2);
                $('#doubler', self.el).html('Doubler: ' + self.doubler.get('value'));
            });
        },
        render: function() {
            var template = _.template( $("#control_template").html(), {} );
            this.$el.append( template );
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
