/*--------------------PLANT TRACER 2.0----------------------
    Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/
/**
 * Circumnutation handles the Circumnutation view
 */
app.controller('Circumnutation', ['$rootScope', '$scope', '$http', 'DATAVAULT', 'GLOBAL', '$state', '$stateParams',
    function($rootScope, $scope, $http, DATAVAULT, GLOBAL, $state, $stateParams){

        $rootScope.$on("deviceReady", function(event, data){
            console.log("DEVICE READY SIGNAL RECEIVED");
            init();
        });
       
        $scope.loadView = function(x){
            //console.log( "Loading "+ x )
            //
            // if( x == 'menu'){
            //     $rootScope.$broadcast("ResetVariables");
            // }
            // $state.transitionTo( x, {}, {location:true, notify:true, reload:true});
        }

    	var init = function(){
            if( $rootScope.circumnutation_config.debugMode ){
                console.log("Circumnutation View loaded")
            }

            setTimeout( function(){

               $rootScope.$broadcast("showMessenger");
            }, 500)
            
            $rootScope.stepID = 0;
        };

        if($rootScope.deviceLoaded){
            console.log("Device already loaded")
            init();
        }
    }
]);
