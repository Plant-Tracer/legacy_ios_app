/*--------------------PLANT TRACER 2.0----------------------
    Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/
/**
 * ActionPanel handles the ActionPanel view
 */
app.controller('ActionPanel', ['$rootScope', '$scope', '$http', 'DATAVAULT', 'GLOBAL', '$state', '$stateParams',
    function($rootScope, $scope, $http, DATAVAULT, GLOBAL, $state, $stateParams){

        var stepCount = $rootScope.totalSteps;
        
        $rootScope.$on("deviceReady", function(event, data){
            console.log("ActionPanel: DEVICE READY SIGNAL RECEIVED");
            init();
        });

        $rootScope.$on("showActionPanel", function(event, data){
            console.log("ActionPanel: SHOW SIGNAL RECEIVED");
            console.log("Showing panel")
            $(".actionPanel").fadeIn();
        });

        $rootScope.$on("hideActionPanel", function(event, data){
            console.log("ActionPanel: HIDE SIGNAL RECEIVED");
            console.log("Hiding panel");
            $(".actionPanel").fadeOut();
        });

        $rootScope.$on("resetEvents", function(){
            //alert("action panel: reset events")
            resetEvents();
        });

        $rootScope.$on('rebindEvents', function(){
            eventMgr();
        })

        function takeScreenShot(){
            navigator.screenshot.save(function(error,res){
                if(error){
                    alert("Sorry, something went wrong saving your screeshot")
                   // console.error(error);
                }else{
                    //alert("try to save")
                   // console.log('ok',res.filePath);
                    window.cordova.plugins.imagesaver.saveImageToGallery(res.filePath, shotSaveSuccess, shotSaveFail);
                }
            });
        }

        function shotSaveSuccess(message){
            alert("Screen Shot successfully saved to your Photo Gallery!");
            console.log(message);
        }
        function shotSaveFail(message){
            alert("Something Wrong, please try again!");
            console.log(message);
        }

        var eventMgr = function(){
           // alert("action events")
            resetEvents();

            $("#framerate_input").keyup(function(e){    

                if( ! isNaN(parseFloat($(this).val())) && $(this).val() != "" ){
                    $(".actionButton div").fadeIn();
                }else{
                    $(".actionButton div").fadeOut();
                }


            });

            $("#distance_input").keyup(function(e){    
                if( ! isNaN(parseInt($(this).val())) && $(this).val() != "" ){
                    $(".actionButton div").fadeIn();
                }else{
                    $(".actionButton div").fadeOut();
                }
            });

            $("#draw_input").click( function(){
                console.log("Drawing line...");
                $rootScope.$broadcast("drawLine");
            });

            $("#undo_input").click( function(){
                console.log("Undoing...");
                $rootScope.$broadcast("undoLine");
            });

            $("#apex_input").click( function(){
                console.log("adding Apex mark");
                $rootScope.$broadcast("apexMarker");
            });

            $("#inflection_input").click( function(){
                console.log("inflection mark");
                $rootScope.$broadcast("inflectionMarker"); 
            });

            $("#replay_input").click( function(){
                console.log("replay")
                $rootScope.$broadcast("replayVideo");
            }); 

            $("#line_input").click( function(){
                //console.log("Connecting apex with inflection");
                $rootScope.$broadcast("connectApexInflection");
            });

            $("#track_input").click( function(){
                console.log("Start Tracking")
                $rootScope.$broadcast("trackPlant");
            });

            // $("#save_input").click( function(){
            //     //alert("saving...");
            //     var filename = prompt("Enter a file name:");
            //     DATAVAULT.saveTrackingData( filename );
            //     DATAVAULT.uploadDatatoDatabase("User0", "Al", "AABB", "geneName", "geneID", $rootScope.currentView, $rootScope.rateDis, $rootScope.amplitudeDis, $rootScope.angle, "video", [$rootScope.time_list, $rootScope.diffx_list, $rootScope.diffy_list], "trace");
            // });

            $("#share_input").click( function(){
                 //alert("sharing...");
                 $rootScope.$broadcast("openNotebook");
            });

            $("#finish_input").click( function(){
                 //alert("snapping...");
                //DATAVAULT.takeScreenShot();
                //if( x == 'menu'){
                    $rootScope.$broadcast("ResetVariables");
                //}
                $state.transitionTo( "menu", {}, {location:true, notify:true, reload:true});
            });

            $("#snap_input").click(function(){
               takeScreenShot()
            });

            $("#range").on("change", function(){
                
                var range               = $(this).val();
                var Ranges              = range.split(';'); 

                if($rootScope.startTime == Ranges[0]){
                    //alert("moving end time")
                    video.currentTime = $rootScope.endTime;
                    $(".actionButton div").fadeIn();
                }else{
                    //alert("moving start time")
                    video.currentTime   = $rootScope.startTime;
                    $(".actionButton div").fadeIn();
                }
                $rootScope.startTime    = Ranges[0];
                $rootScope.endTime      = Ranges[1];
                //$rootScope.$broadcast("refreshCanvas");

            });

            $(".actionButton").click( function(){

                if( $rootScope.stepID == 2){
                    var fps = $("#framerate_input").val();
                    if( fps != "" && !isNaN(fps) ){

                        $rootScope.framerate = fps;

                        if( $rootScope.stepID == stepCount ){
                            $rootScope.stepID  = 0;
                        }else{
                            $rootScope.stepID++; 
                        }
                        $rootScope.$broadcast("updateState");

                    }else{
                        alert("Please enter a number");
                        $("#framerate_input").focus();
                    }
                }else if( $rootScope.stepID == 4 ){
                    
                    var pixDistance = parseFloat( $("#distance_input").val() );

                    if(pixDistance != "" && !isNaN(pixDistance)){


                        //alert([parseFloat(pixDistance),parseFloat(pixDistance.toFixed(2))])
                        ////pixDistance is the number user entered in step 4 (ruler calibration). Now pixDistance is the parameter which is ready to multiply
                       
                        $rootScope.distance = pixDistance/$rootScope.distance.toFixed(2);
                       // alert($rootScope.distance)

                        if( $rootScope.stepID == stepCount ){
                            $rootScope.stepID  = 0;
                        }else{
                            $rootScope.stepID++; 
                        }
                        $rootScope.$broadcast("updateState");
                    }else{
                        $rootScope.distance = 0;
                        alert("Please enter a number");
                        $("#distance_input").focus();
                    }
                }else{
                    if( $rootScope.stepID == stepCount ){
                        $rootScope.stepID  = 0;
                    }else{
                        $rootScope.stepID++; 
                    }
                    $rootScope.$broadcast("updateState");
                }
                       
            });
        }

        var resetEvents = function(){
           // alert("action reset events")
            $(".actionButton").unbind("click");
            $("#range").unbind("change");
            $("#draw_input").unbind("click");
            $("#undo_input").unbind("click");
            $("#apex_input").unbind("click");
            $("#inflection_input").unbind("click");
            $("#line_input").unbind("click");
            $("#replay_input").unbind("click");
            $("#track_input").unbind("click");
            $("#save_input").unbind("click");
            $("#share_input").unbind("click");
            $("#snap_input").unbind("click");
        }



       
    	var init = function(){
            //alert("actionPanel init")
            if( $rootScope.actionpanel_config.debugMode ){
                console.log("ActionPanel View loaded");
            }
            video               = document.getElementById('videoPlayer');
            canvas              = document.getElementById("canvas");
            video.currentTime   = 0;

            eventMgr();
        };

        if($rootScope.deviceLoaded){
            //alert("Device already loaded");
            init();
        }
    }
]);
