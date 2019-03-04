/*--------------------PLANT TRACER 2.0----------------------
    Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/
/**
 * DATA handles the Data view
 */
app.controller('Data', ['$rootScope', '$scope', '$http', 'DATAVAULT', 'GLOBAL', '$state', '$stateParams',
    function($rootScope, $scope, $http, DATAVAULT, GLOBAL, $state, $stateParams){

        $rootScope.$on("deviceReady", function(event, data){
            console.log("DEVICE READY SIGNAL RECEIVED")
        });

        $scope.loadView = function(x){
            //console.log( "Loading "+ x )
            $state.transitionTo( x, {}, {location:true, notify:true, reload:true});
        }


    	var init = function(){
            if( $rootScope.data_config.debugMode ){
                console.log("Data View loaded")
            }

        }();
    }
]);
