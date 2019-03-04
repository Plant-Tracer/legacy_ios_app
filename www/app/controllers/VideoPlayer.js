/*--------------------PLANT TRACER 2.0----------------------
    Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/
/**
 * VideoPlayer handles the VideoPlayer view
 */
app.controller('VideoPlayer', ['$rootScope', '$scope', '$http', 'DATAVAULT', 'GLOBAL', '$state', '$stateParams',
    function($rootScope, $scope, $http, DATAVAULT, GLOBAL, $state, $stateParams){

        $rootScope.$on("deviceReady", function(event, data){
            console.log("VP: DEVICE READY SIGNAL RECEIVED");
            init();
        });

        $rootScope.$on("updateState", function(event, data){
            console.log("VP: UPDATING STATE " + $rootScope.stepID );
            switch( $rootScope.stepID ){
                case 0:
                    //where user uploads video and previews video                    
                    break;
                case 1:
                    //user has just uploaded the video and select start and end time
                    video.pause();
                    $rootScope.$broadcast("refreshCanvas");
                    break;
                case 2:
                    //User picks FPS
                    $rootScope.$broadcast("refreshCanvas");
                    break;
                case 3:
                    // User needs to tap and makes a line
                    $("video").hide();

                    $("#canvasDiv").show();  
                    setTimeout(function(){
                        $rootScope.$broadcast("refreshCanvas"); 
                        // $rootScope.$broadcast("undoLine");
                    }, 1000)
                    break;
                case 4:
                    // User enters pixDistance
                    
                    break;
                case 5:
                    // User taps in apex marker
                    $("#scalebox1").hide();
                    $("#scalebox2").hide();
                    break;
                case 6:

                    break;
                case 10:
                    $("video").hide();
                    $("#canvasDiv").hide();  
                    break;
            }
        });


    	var init = function(){
            if( $rootScope.videoplayer_config.debugMode ){
                console.log("Data View loaded")
            }
        };

        if($rootScope.deviceLoaded){
            init();
        }
    }
]);
