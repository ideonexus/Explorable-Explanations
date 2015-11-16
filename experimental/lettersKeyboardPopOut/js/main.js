requirejs.config({
	baseUrl: 'js/',
	paths: {
		'jquery': 'vendor/jquery',
	},
	shim: {
       'vendor/underscore': {
            exports: '_'
        },
        'vendor/backbone': {
            deps: ['vendor/underscore', 'jquery'],
            exports: 'Backbone'
        }
    },
	waitSeconds: 4,
});

require(['letters'], function ( Letters ) {
	var letters = new Letters({
		el: $('#letters'),
		raw: letterList
	});

});