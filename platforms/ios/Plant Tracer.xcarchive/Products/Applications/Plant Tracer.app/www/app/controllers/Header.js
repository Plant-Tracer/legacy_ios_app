/*--------------------PLANT TRACER 2.0----------------------
    Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/

/**
 * Header handles the Header
 */
app.controller('Header', ['$rootScope', '$scope', '$http', 'DATAVAULT', 'GLOBAL', '$state', '$stateParams',
    function($rootScope, $scope, $http, DATAVAULT, GLOBAL, $state, $stateParams){

    	$rootScope.$on("deviceReady", function(event, data){
            console.log("DEVICE READY SIGNAL RECEIVED");
            init();
        });

        

        var eventMgr = function(){
            resetEvents();

            //alert("attaching header events");

            $("#nav_back").click( function(){
                //alert( $rootScope.stepID )
                if( $rootScope.stepID > 0 ){
                    $rootScope.stepID--;
                    $rootScope.$broadcast("updateState");
                    $rootScope.$broadcast("goingBack");
                }else{
                    $rootScope.$broadcast("ResetVariables");
                    $state.transitionTo( 'menu', {}, {location:true, notify:true, reload:true});
                }
                //alert( $rootScope.stepID )
            });

            $("#nav_home").click( function(){
                $rootScope.$broadcast("ResetVariables");
                $state.transitionTo( 'menu', {}, {location:true, notify:true, reload:true});
            });

            $("#selectVideo").click( function(){
                //alert("loading video selection")
                $rootScope.$broadcast("hideMessenger");
                $("#videoSelector").css("display", "flex");
            });
        }

        var resetEvents = function(){
            $("#nav_back").unbind("click");
            $("#nav_home").unbind("click");
        }

       
        var init = function(){
            if( $rootScope.header_config.debugMode ){
                console.log("Header loaded");
            }

           
            eventMgr();
        }

        if( $rootScope.deviceLoaded ){
            init();
        }

    }

]);
