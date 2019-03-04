/*--------------------PLANT TRACER 2.0----------------------
    Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/
/**
 * Literacy handles the Literacy view
 */
app.controller('Literacy', ['$rootScope', '$scope', '$http', 'DATAVAULT', 'GLOBAL', '$state', '$stateParams',
    function($rootScope, $scope, $http, DATAVAULT, GLOBAL, $state, $stateParams){

        $rootScope.$on("deviceReady", function(event, data){
            console.log("DEVICE READY SIGNAL RECEIVED")
        });

        $scope.loadView = function(x){
            //console.log( "Loading "+ x )
            $state.transitionTo( x, {}, {location:true, notify:true, reload:true});
        }


    	var init = function(){
            if( $rootScope.literacy_config.debugMode ){
                console.log("Literacy View loaded")
            }

        }();
    }
]);
