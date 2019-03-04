/*--------------------PLANT TRACER 2.0----------------------
	Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/
var app = angular.module("PLANTTRACER", ['ui.router','ngResource']);


app.config( function( $stateProvider, $httpProvider, $urlRouterProvider, $urlServiceProvider ){
    $stateProvider.state('home',{
       url 			    : '/home',
       templateUrl	: 'partials/home.html',
       controller 	: 'Home'
    }).state('welcome',{
       url 			    : '/welcome',
       templateUrl	: 'partials/welcome.html',
       controller 	: 'Welcome'
    }).state('menu',{
       url 			    : '/menu',
       templateUrl	: 'partials/menu.html',
       controller 	: 'Menu'
    }).state('circumnutation',{
       url 			    : '/circumnutation',
       templateUrl	: 'partials/circumnutation.html',
       controller 	: 'Circumnutation'
    }).state('gravitropism',{
       url 		     	: '/gravitropism',
       templateUrl	: 'partials/gravitropism.html',
       controller 	: 'Gravitropism'
    }).state('analysis',{
       url          : '/data',
       templateUrl  : 'partials/data.html',
       controller   : 'Data'
    }).state('literacy',{
       url          : '/literacy',
       templateUrl  : 'partials/literacy.html',
       controller   : 'Literacy'
    }).state('tutorial',{
       url          : '/tutorial',
       templateUrl  : 'partials/tutorial.html',
       controller   : 'Tutorial'
    })
});

app.run(function($state){
   $state.go('menu');
});


