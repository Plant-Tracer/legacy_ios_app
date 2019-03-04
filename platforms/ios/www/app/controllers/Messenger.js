/*--------------------PLANT TRACER 2.0----------------------
    Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/
/**
 * Messenger handles the Messenger
 */
app.controller('Messenger', ['$rootScope', '$scope', '$http', 'DATAVAULT', 'GLOBAL', '$state', '$stateParams',
    function($rootScope, $scope, $http, DATAVAULT, GLOBAL, $state, $stateParams){
        var fpath           = "plant_tracer_record.txt";   //file that saves which prompt is set to "Don't show me again"
        var size            = 5 * 1024 * 1024;
        var deviceLoaded    = false;
        var initialStatestr;

        $rootScope.dontshowagainUpdated = false;

        $scope.id           = $rootScope.stepID;

        if( $rootScope.currentView == "gravitropism"){
            //alert("gravitropism")
                
                $rootScope.notifications   = [
                {
                    "id"        : 0,
                    "icon"      : "img/ui/icons/Icon_video_green.svg",
                    "mainMsg"   : "Click on the video icon to upload a video from your photo library",
                    "subMsg"    : "Re-upload/change by clicking <br> on video icon again"
                },
                {
                    "id"        : 1,
                    "icon"      : "img/dialog/Tut_Boxes_-19.png",
                    "mainMsg"   : "Use the sliders to determine the beginning and end of your video.",
                    "subMsg"    : "You can use the tool to trim the length by removing unwanted frames."
                },
                {
                    "id"        : 2,
                    "icon"      : "img/dialog/Tut_Boxes_-20.png",
                    "mainMsg"   : "Specify the capture interval; frames per minute.",
                    "subMsg"    : ""
                },
                {
                    "id"        : 3,
                    "icon"      : "img/dialog/Tut_Boxes_-21.png",
                    "mainMsg"   : "How fast is this baby?",
                    "subMsg"    : "To set the scale, use your finger to draw a line across a known distance."
                },
                {
                    "id"        : 4,
                    "icon"      : "img/dialog/Tut_Boxes_-21.png",
                    "mainMsg"   : "Calibration",
                    "subMsg"    : "To set the scale, enter the length of the line in millimeters."
                },
                {
                    "id"        : 5,
                    "icon"      : "img/dialog/Tut_Boxes_-22.png",
                    "mainMsg"   : "Tap to tag a tracking marker on the organ of interest.",
                    "subMsg"    : "You can only place one marker in the diagram."
                },
                {
                    "id"        : 6,
                    "icon"      : "img/dialog/Tut_Boxes_-23.png",
                    "mainMsg"   : "Place a marker on the inflection point.",
                    "subMsg"    : "You can only place one inflection marker in the diagram"
                },
                {
                    "id"        : 7,
                    "icon"      : "img/dialog/Tut_Boxes_-24.png",
                    "mainMsg"   : "Let's draw the line between Apex and Inflection points.",
                    "subMsg"    : "Once the line has been drawn, it will follow the bending stem."
                },
                {
                    "id"        : 8,
                    "icon"      : "img/dialog/Tut_Boxes_-24.png",
                    "mainMsg"   : "The time has come to draw the line.",
                    "subMsg"    : "Once the line has been drawn, it will follow the bending stem."
                }
             ];
        }else if( $rootScope.currentView == "circumnutation"){
                $rootScope.notifications   = [
                    {
                        "id"        : 0,
                        "icon"      : "img/ui/icons/Icon_video_green.svg",
                        "mainMsg"   : "Click on the video icon to upload a video from your photo library",
                        "subMsg"    : "Re-upload/change by clicking <br> on video icon again"
                    },
                    {
                        "id"        : 1,
                        "icon"      : "img/dialog/Tut_Boxes_-19.png",
                        "mainMsg"   : "Use the sliders to determine the beginning and end of your video.",
                        "subMsg"    : "You can use the tool to trim the length by removing unwanted frames."
                    },
                    {
                        "id"        : 2,
                        "icon"      : "img/dialog/Tut_Boxes_-20.png",
                        "mainMsg"   : "Specify the capture interval; frames per minute.",
                        "subMsg"    : ""
                    },
                    {
                        "id"        : 3,
                        "icon"      : "img/dialog/Tut_Boxes_-21.png",
                        "mainMsg"   : "How fast is this baby?",
                        "subMsg"    : "To set the scale, use your finger to draw a line across a known distance."
                    },
                    {
                        "id"        : 4,
                        "icon"      : "img/dialog/Tut_Boxes_-21.png",
                        "mainMsg"   : "Calibration",
                        "subMsg"    : "To set the scale, enter the length of the line in millimeters."
                    },
                    {
                        "id"        : 5,
                        "icon"      : "img/dialog/Tut_Boxes_-22.png",
                        "mainMsg"   : "Tap to tag a tracking marker on the organ of interest.",
                        "subMsg"    : "You can only place one marker in the diagram."
                    }
                ];
        }

        $scope.$on('$destroy', function() { 

            $scope.deviceReady();
            $scope.fileread();
            $scope.updateState();
            $scope.showMessenger();
            $scope.hideMessenger();
        });
        
        $rootScope.$on("ResetVariables", function(){
            $scope.$destroy();
        });

        $scope.deviceReady = $rootScope.$on("deviceReady", function(event, data){
            console.log("MESSENGER: DEVICE READY SIGNAL RECEIVED MESSENGER");
            deviceLoaded = true
            init();
        });

        $scope.fileread = $rootScope.$on("fileread", function(event, data){
            console.log("MESSENGER: File// Read");
            $rootScope.deviceLoaded = true;
            deviceLoaded = true;
            displayMessage($rootScope.stepID);
        });

        $scope.updateState = $rootScope.$on("updateState", function(event, data){
            console.log("MESSENGER: UPDATING STATE" + $rootScope.stepID);

            if( $rootScope.stepID < $rootScope.notifications.length ){
               // if(notifications[$rootScope.stepID] != null ){
                    $(".message_icon img").attr("src", $rootScope.notifications[$rootScope.stepID].icon);
                    $(".message_main").html( $scope.mainMessage  = $rootScope.notifications[$rootScope.stepID].mainMsg );
                    $(".message_sub").html( $rootScope.notifications[$rootScope.stepID].subMsg);

                    displayMessage($rootScope.stepID);
                //}
               
            }
        });

        $scope.showMessenger = $rootScope.$on("showMessenger", function(event, data){
            console.log("Displaying Messenger")
            init();
            //if(notifications[$rootScope.stepID] != null ){
                $(".message_icon img").attr("src", $rootScope.notifications[$rootScope.stepID].icon);
                $(".message_main").html( $scope.mainMessage  = $rootScope.notifications[$rootScope.stepID].mainMsg );
                $(".message_sub").html( $rootScope.notifications[$rootScope.stepID].subMsg);
                displayMessage($rootScope.stepID);
            //}
            //checkStatus("show");
            //
            
        });

        $scope.hideMessenger = $rootScope.$on("hideMessenger", function(event, data){
            console.log("DEVICE READY SIGNAL RECEIVED");
             $("#messenger").hide();
             //displayMessage($rootScope.stepID);
        });

           

        $scope.loadView = function(x){
            console.log( "Loading "+ x )
            $state.transitionTo( x, {}, {location:true, notify:true, reload:true});
        }

        

        var errorCallback =  function(error){
            console.error("ERROR: "+error);
        }

        var checkStatus = function( messageID ){
           // console.log( [$rootScope.initialStatestr, $rootScope.initialStatestr[$rootScope.stepID], $rootScope.stepID] )
            var response = false;
            if($rootScope.initialStatestr[$rootScope.stepID] == 1){
                console.log("show")
                response = true;
            }else{
                console.log("hide")
                response = false;
            }
            return response;
        }

        var displayMessage = function(x){
            //alert(x)
            //alert(checkStatus(x))
            if(checkStatus(x)){
                $("#messenger").show();
            }else{
                $("#messenger").hide();
            }

            eventMgr();
        }

        var resetEvents = function(){
            $("#close_messenger").unbind("click");
            $(".do_not_show_again").unbind("click");
        }

        var eventMgr = function(){
            resetEvents();
             $("#close_messenger").click( function(){
                $rootScope.$broadcast("hideMessenger");
            });   

            // Call this function to set that hint "Don's show again"
            // The state is saved into "plant_tracer_record.txt"
            $(".do_not_show_again").click( function(){
                //alert( id )
                $rootScope.initialStatestr = $rootScope.initialStatestr.substr(0, $rootScope.stepID)+"0"+$rootScope.initialStatestr.substr($rootScope.stepID+1);
                
                window.requestFileSystem(LocalFileSystem.PERSISTENT, size, function(fileSystem){

                        fileSystem.root.getFile(fpath, { create: false }, function(fileEntry){
                            
                            fileEntry.createWriter(function(fileWriter) {
                                // Write is asyncronize
                                fileWriter.onwriteend = function(e) {
                                    //clickHintDisappear(id);
                                    $rootScope.$broadcast("hideMessenger");
                                };

                                fileWriter.onerror = function(e) {
                                    alert('Write failed: ' + e.toString());
                                };
                                //var blob = new Blob([""], {type: 'text/plain'});
                                var blob = new Blob([$rootScope.initialStatestr], {type: 'text/plain'});
                                fileWriter.write(blob);

                                $rootScope.dontshowagainUpdated = true;
                            });

                        }, function(err){errorCallBack(err);});
                        
                    }, function(err){errorCallBack(err);});
            });
        }

    	var init = function(){
            if( $rootScope.messenger_config.debugMode ){
                console.log("Messenger loaded")
            }

            //console.warn([$rootScope.initialStateLoaded,$rootScope.dontshowagainUpdated])

            if(!$rootScope.initialStateLoaded || $rootScope.dontshowagainUpdated){
                DATAVAULT.readFile(fpath);
                setTimeout(function(){
                    
                },500)
                
            }else{
                //displayMessage($rootScope.stepID);
            }




           //if(notifications[$rootScope.stepID] != null ){
                
            //}

            setTimeout(function(){
                //alert(notifications[$rootScope.stepID].icon)
                $(".message_icon img").attr("src", $rootScope.notifications[$rootScope.stepID].icon);
                $(".message_main").html( $scope.mainMessage  = $rootScope.notifications[$rootScope.stepID].mainMsg );
                $(".message_sub").html( $rootScope.notifications[$rootScope.stepID].subMsg);
            },500);

        }

        if($rootScope.deviceLoaded){
            init();
            //alert($rootScope.stepID)
            //displayMessage($rootScope.stepID);
        }
    }
]);
