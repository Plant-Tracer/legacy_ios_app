/*--------------------PLANT TRACER 2.0----------------------
    Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/
/**
 * Welcome handles the Welcome screen
 */
app.controller('Welcome', ['$rootScope', '$scope', '$http', 'DATAVAULT', 'GLOBAL', '$state', '$stateParams',
    function($rootScope, $scope, $http, DATAVAULT, GLOBAL, $state, $stateParams){

        $rootScope.$on("deviceReady", function(event, data){
            console.log("deviceReady SIGNAL RECEIVED");
            init();
        });

        $scope.loadView = function(x){
            console.log( "Loading "+ x )
            //$rootScope.$broadcast("loadMenu")
            $state.go( x );
        }

        var init = function(){
            if( $rootScope.welcome_config.debugMode ){
                console.log("Welcome loaded")
            }
            $rootScope.$broadcast("hideMessenger");
        }
    }
]);
