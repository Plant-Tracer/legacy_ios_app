/*--------------------PLANT TRACER 2.0----------------------
    Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/
/**
 * Gravitropism handles the Gravitopism view
 */
app.controller('Gravitropism', ['$rootScope', '$scope', '$http', 'DATAVAULT', 'GLOBAL', '$state', '$stateParams',
    function($rootScope, $scope, $http, DATAVAULT, GLOBAL, $state, $stateParams){

        $rootScope.$on("deviceReady", function(event, data){
            console.log("DEVICE READY SIGNAL RECEIVED")
        });

        $scope.loadView = function(x){
            //console.log( "Loading "+ x );
            // if( x == 'menu'){
            //     $rootScope.$broadcast("ResetVariables");
            // }
            // $state.transitionTo( x, {}, {location:true, notify:true, reload:true});
        }


    	var init = function(){
            if( $rootScope.gravitropism_config.debugMode ){
                console.log("Gravitropism View loaded")
            }

            setTimeout( function(){

               $rootScope.$broadcast("showMessenger");
            }, 500)
            
            $rootScope.stepID = 0;

        }();
    }
]);
