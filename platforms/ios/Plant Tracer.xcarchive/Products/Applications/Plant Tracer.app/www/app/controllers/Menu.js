/*--------------------PLANT TRACER 2.0----------------------
    Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/
/**
 * Home handles the Home
 */
app.controller('Menu', ['$rootScope', '$scope', '$http', 'DATAVAULT', 'GLOBAL', '$state', '$stateParams',
    function($rootScope, $scope, $http, DATAVAULT, GLOBAL, $state, $stateParams){

        $rootScope.$on("deviceReady", function(event, data){
            console.log("DEVICE READY SIGNAL RECEIVED")
        });

        $scope.loadView = function(x){
            console.log( "Loading "+ x );
            $rootScope.currentView = x;

            //if( x == "circumnutation"  || x == "gravitropism" ){
                //$state.transitionTo( x, {}, {location:true, notify:true, reload:true});
                $state.go( x );
            //}
            
        }

    	var init = function(){
            if( $rootScope.menu_config.debugMode ){
                console.log("Menu loaded")
            }
            $rootScope.isFooterUp = false;
             $("#messenger").hide();

        }();


    }

]);
