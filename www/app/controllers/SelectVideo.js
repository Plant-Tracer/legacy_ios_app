/*--------------------PLANT TRACER 2.0----------------------
    Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/

/**
 * SelectVideo handles the Video Selection
 */
app.controller('SelectVideo', ['$rootScope', '$scope', '$http', 'DATAVAULT', 'GLOBAL', '$state', '$stateParams',
    function($rootScope, $scope, $http, DATAVAULT, GLOBAL, $state, $stateParams){

    	$rootScope.$on("deviceReady", function(event, data){
            console.log("DEVICE READY SIGNAL RECEIVED");
            init();
        });



        var eventMgr = function(){
            resetEvents();

            $("#circumnutation_sample").click( function(){
                 $("#videoSelector").css("display", "none");
                 selectSampleVideo();
            });

            $("#gravitropism_sample").click( function(){
                 $("#videoSelector").css("display", "none");
                 selectSampleVideo();
            });
        }

        var selectSampleVideo = function(){
            $rootScope.startTime            = 0;
            $rootScope.endTime              = 0;
            video.style.display             = 'block';
            if($rootScope.currentView == "gravitropism"){
               video.src                    = 'video/gravitropism_sample.mov';
            }else{
                video.src                   = 'video/circumnutation_sample.mp4';
            }
            $rootScope.videoSrc             = video.src;


            //Set Range Selector
            setTimeout( function(){
                   // alert("resetting sliders")
              $("#range").ionRangeSlider({
                  hide_min_max    : true,
                  keyboard        : true,
                  min             : 0,
                  max             : video.duration,
                  from            : 0,
                  to              : video.duration,
                  type            : 'int',
                  step            : 0.01,
                  prefix          : "",
                  postfix         : " seconds",
                  grid            : true
              });

              video.play();
              $rootScope.$broadcast("refreshCanvas");
              //show next
              $rootScope.$broadcast("showActionPanel");
              $rootScope.$broadcast("showFooter");
              $rootScope.videoLoaded = true;
              //alert("vid loaded")
              $(".actionButton div").fadeIn();

            }, 250 );
        }

        var resetEvents = function(){
           $("#circumnutation_sample").unbind("click");
           $("#gravitropism_sample").unbind("click");
        }


        var init = function(){
            if( $rootScope.selectVideo_config.debugMode ){
                console.log("Video Selector loaded");
            }
            eventMgr();

            video               = document.getElementById('videoPlayer');
            canvas              = document.getElementById("canvas");


            if($rootScope.currentView == "gravitropism"){
                $("#circumnutation_sample").hide();
                $("#gravitropism_sample").show();
            }else{
                $("#circumnutation_sample").show();
                $("#gravitropism_sample").hide();
            }


        }



        if( $rootScope.deviceLoaded ){
            init();
        }

    }

]);
