/*--------------------PLANT TRACER 2.0----------------------
    Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/
/**
 * VideoUploader handles the VideoUploader view
 */
app.controller('VideoUploader', ['$rootScope', '$scope', '$http', 'DATAVAULT', 'GLOBAL', '$state', '$stateParams',
    function($rootScope, $scope, $http, DATAVAULT, GLOBAL, $state, $stateParams){

      var pictureSource;      // picture source
      var destinationType;    // set the format of returned value
      var firstTimer = false;

      $rootScope.$on("deviceReady", function(event, data){
          console.log("DEVICE READY SIGNAL RECEIVED");
          init();
      });

      $rootScope.$on("loadVideo", function(event, data){
          console.log("DEVICE READY SIGNAL RECEIVED");
         // init();
      });

      $("#uploadVideo").click(function(){
         console.log("Loading Video");

         $rootScope.$broadcast("hideMessenger");
         //$rootScope.$broadcast("ResetVariablesOnly");
         getPhoto(pictureSource.SAVEDPHOTOALBUM)
      });

       var signalUpload = function(){

              if(!$rootScope.videoLoaded){
                  clearTimeout(firstTimer)
                       setTimeout( function(){ 

                              $("#selectVideo").fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500, function(){
                             
                              firstTimer = setTimeout( function(){
                                signalUpload();
                              }, 3000);
                           

                           });
                   }, 1500 );
              }else{
                $("#selectVideo").hide();
              }
        }

      // Called when a photo is successfully retrieved
      function onPhotoURISuccess(imageURI) {

        $("#videoSelector").css("display", "none");
        
        $rootScope.startTime            = 0;
        $rootScope.endTime              = 0;
        video.style.display             = 'block';
        video.src                       = imageURI;
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

      // Retrieve image file location from specified source
      function getPhoto(source) {
        navigator.camera.getPicture(
                                      onPhotoURISuccess, 
                                      onFail, 
                                      { quality         : 100,
                                        destinationType : destinationType.FILE_URI,
                                        mediaType       : Camera.MediaType.VIDEO,
                                        sourceType      : source 
                                      }
                                    );
      }

      function onFail(message) {
          alert('Failed because: ' + message);
      }

      function calculateStats() {
 
        var decodedFrames = 0,
                droppedFrames = 0,
                startTime = new Date().getTime(),
                initialTime = new Date().getTime();
              i = 0;
        window.setInterval(function(){

            //see if webkit stats are available; exit if they aren't
            if (!video.webkitDecodedFrameCount){
                console.log("Video FPS calcs not supported");
                return;
            }
            //get the stats
            else{
                var currentTime         = new Date().getTime();
                var deltaTime           = (currentTime - startTime) / 1000;
                var totalTime           = (currentTime - initialTime) / 1000;
                startTime               =  currentTime;

                // Calculate decoded frames per sec.
                var currentDecodedFPS   = (video.webkitDecodedFrameCount - decodedFrames) / deltaTime;
                var decodedFPSavg       =  video.webkitDecodedFrameCount / totalTime;
                decodedFrames           =  video.webkitDecodedFrameCount;

                // Calculate dropped frames per sec.
                var currentDroppedFPS   = (video.webkitDroppedFrameCount - droppedFrames) / deltaTime;
                var droppedFPSavg       =  video.webkitDroppedFrameCount / totalTime;
                droppedFrames           =  video.webkitDroppedFrameCount;

                //write the results to a table
                $("#stats")[0].innerHTML =
                        "<table><tr><th>Type</th><th>Total</th><th>Avg</th><th>Current</th></tr>" +
                        "<tr><td>Decoded</td><td>" + decodedFrames + "</td><td>" + decodedFPSavg.toFixed() + "</td><td>" + currentDecodedFPS.toFixed()+ "</td></tr>" +
                        "<tr><td>Dropped</td><td>" + droppedFrames + "</td><td>" + droppedFPSavg.toFixed() + "</td><td>" + currentDroppedFPS.toFixed() + "</td></tr>" +
                        "<tr><td>All</td><td>" + (decodedFrames + droppedFrames) + "</td><td>" + (decodedFPSavg + droppedFPSavg).toFixed() + "</td><td>" + (currentDecodedFPS + currentDroppedFPS).toFixed() + "</td></tr></table>" +
                        "Camera resolution: " + video.videoWidth + " x " + video.videoHeight;
            }
            //i++;
            //console.log(i)
        }, 1000);
      }

    	var init = function(){
            if( $rootScope.videouploader_config.debugMode ){
              console.log("Data View loaded")
            }

            pictureSource       = navigator.camera.PictureSourceType;
            destinationType     = navigator.camera.DestinationType;
            
            signalUpload();
            
            video               = document.getElementById('videoPlayer');
            canvas              = document.getElementById("canvas");
            
        };

        if($rootScope.deviceLoaded){init();}
    }
]);
