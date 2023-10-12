/*--------------------PLANT TRACER 2.0----------------------
    Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/
/**
 * Global handles the Global variables
 */
app.controller('Global', ['$rootScope', '$scope', '$http', 'DATAVAULT', 'GLOBAL', '$state', '$stateParams',
    function($rootScope, $scope, $http, DATAVAULT, GLOBAL, $state, $stateParams){

        //console.log("Global Controller initiated...");
        $rootScope.emailSender          = "Plant Tracer  <no-reply@app.com>";
        $rootScope.userType             = false;
        $rootScope.me                   = false;
        $rootScope.loggedIn             = false;
        $rootScope.delay                = 50;
        $rootScope.debugMode            = true;
        $rootScope.connectionType       = false;
        $rootScope.online               = false;
        $rootScope.offline              = false;
        $rootScope.stepID               = 0;
        $rootScope.totalSteps           = 11;
        $rootScope.initialStateLoaded   = false;
        $rootScope.isFooterUp           = false;
        var db                          = false;
        $rootScope.videoLoaded          = false;
        $rootScope.currentView          = false;
        $rootScope.videoScaled          = false;

        $rootScope.step1Complete        = false;
        $rootScope.step2Complete        = false;
        $rootScope.step3Complete        = false;
        $rootScope.step4Complete        = false;
        $rootScope.step5Complete        = false;
        $rootScope.step6Complete        = false;
        $rootScope.step7Complete        = false;
        $rootScope.step8Complete        = false;
        $rootScope.step9Complete        = false;


        //$rootScope.uniqueID             = 666;

        
        $rootScope.startTime            = 0;
        $rootScope.endTime              = 0;


        $rootScope.screenSize   = {
                screenWidth     : $(window).width(),
                screenHeight    : $(window).height()
        }

        $rootScope.nav_config = {
            debugMode   : false
        }

        $rootScope.home_config = {
            debugMode   : false
        }

        $rootScope.logout_config = {
            debugMode   : false
        }

        $rootScope.selectVideo_config = {
            debugMode   : false
        }

        $rootScope.login_config = {
            debugMode   : true,
            userType    : false,
            userScreen  : $rootScope.screenSize.screenWidth +" x "+$rootScope.screenSize.screenHeight
        }

        $rootScope.register_config = {
            debugMode   : true,
            autoLogin   : true,
            emailWelcome: false,
            emailVerify : false,
            emailSender : $rootScope.emailSender,
            userType    : $rootScope.userType,
            userScreen  : $rootScope.screenSize.screenWidth +" x "+$rootScope.screenSize.screenHeight
        }

        $rootScope.resetpw_config = {
            debugMode   : true,
            emailSender : $rootScope.emailSender,
            emailAuth   : true,
            emailConfirm: true,
            emailReset  : true
        }

        $rootScope.mturk_config = {
            debugMode   : true
        }

        $rootScope.home_config = {
            debugMode   : false
        }

        $rootScope.welcome_config = {
            debugMode   : true
        }

        $rootScope.menu_config = {
            debugMode   : false
        }

        $rootScope.circumnutation_config = {
            debugMode   : true
        }

        $rootScope.gravitropism_config = {
            debugMode   : true
        }

        $rootScope.data_config = {
            debugMode   : true
        }

        $rootScope.literacy_config = {
            debugMode   : true
        }

        $rootScope.tutorial_config = {
            debugMode   : true
        }

        $rootScope.header_config = {
            debugMode   : false
        }

        $rootScope.footer_config = {
            debugMode   : false
        }

        $rootScope.messenger_config = {
            debugMode   : true
        }

        $rootScope.videouploader_config = {
            debugMode   : true
        }

        $rootScope.videoplayer_config = {
            debugMode   : true
        }

        $rootScope.actionpanel_config = {
            debugMode   : true
        }

        $rootScope.planttracer_config = {
            debugMode   : true
        }

        $rootScope.graph_config = {
            debugMode   : true
        }

        document.addEventListener("offline", onOffline, false);
        document.addEventListener("online", onOnline, false);

        function onOnline(){
            console.warn("Device is online");
            $rootScope.online     = true;
            $rootScope.offline    = false;
        }
        function onOffline(){
            console.warn("Device is offline");
            $rootScope.online     = false
            $rootScope.offline    = true;
        }    

        var init = function(){
            $rootScope.connectionType   = GLOBAL.checkConnection();
            $rootScope.tech             = GLOBAL.techDetect();
            $rootScope.db               = DATAVAULT.createDatabase();
            $rootScope.tapDelay         = GLOBAL.removeTapDelay();
            $rootScope.deviceLoaded     = true;
  //          $rootScope.uploader         = FileTransferManager.init();

            $rootScope.framerate        = 0;

            DATAVAULT.checkIfFileExists("plant_tracer_record.txt")
            DATAVAULT.checkIfFileListExists("data_file_list.txt");
            DATAVAULT.checkDataDirectory("DataSaves");
            $rootScope.$broadcast("deviceReady");

            if(window.cordova && window.cordova.plugins.Keyboard) {
              window.cordova.plugins.Keyboard.disableScroll(true);
            }

            window.plugins.uniqueDeviceID.get(success_uuid, fail_uuid);
            //$rootScope.uniqueID = device.uuid;
           
            if (window.cordovaHTTP) {
                window.cordovaHTTP.enableSSLPinning(true, function() {
                    console.warn('enableSSLPinning success!');
                }, function() {
                    console.warn('enableSSLPinning error :(');
                });
            }
        }

        function success_uuid(uuid)
        {
            //alert(device.uuid);
            console.log(uuid);
            $rootScope.uniqueID = device.uuid;
        };

        function fail_uuid()
        {
            console.log('unique device id failed.');
            $rootScope.uniqueID = 'Unknown';
        };

        $rootScope.$on("csvfileready", function(event, data){
            console.log("csvfileready SIGNAL RECEIVED");
            $rootScope.currentView  = "menu";
            //$state.transitionTo( 'menu', {}, {location:true, notify:true, reload:true});
            $state.go("menu")
        });

        $rootScope.$on("firstTimeUser", function(event, data){
            console.log("First Time User SIGNAL RECEIVED");
            //$rootScope.currentView = "welcome";
            //$state.transitionTo( 'welcome', {}, {location:true, notify:true, reload:true});
            $state.go("menu");
        });
        
        $rootScope.$on("ResetVariables", function(){
            //alert("resetting app");
            $rootScope.currentView          = 'menu';
            $rootScope.isFooterUp           = false;
            $rootScope.deviceLoaded         = true;
            $rootScope.dontshowagainUpdated = false;
            $rootScope.stepID               = 0;
            $rootScope.videoLoaded          = false;
            $rootScope.videoScaled          = false;
            $rootScope.notifications        = [];


            // Positions
            $rootScope.position             = [-1,-1];
            $rootScope.position_box1        = [0, 0];
            $rootScope.position_box2        = [0, 0];
            $rootScope.savePositionForback  = [-1, -1];
            $rootScope.inflectionPos        = [-1,-1];
            $rootScope.position_list        = [];
            $rootScope.original_x           = 0;
            $rootScope.original_y           = 0;
            // These three list are for graph drawing
            $rootScope.diffx_list           = [];
            $rootScope.diffy_list           = [];
            $rootScope.time_list            = [];
            $rootScope.saveMove             = [];
            $rootScope.original_time        = [];
            // Video parameters
            $rootScope.startTime            = 0;
            $rootScope.endTime              = 0;
            $rootScope.framerate            = 0;
            $rootScope.frameNum             = 0;
            $rootScope.frameSave            = [];
             // Box marker Counters
            $rootScope.count_box1           = 0;
            $rootScope.count_box2           = 0;
            $rootScope.firstBox             = true;
            $rootScope.secondBox            = false;
            // Trace Parameters
            $rootScope.distance             = 0;
            $rootScope.amplitudeDis         = 0;
            $rootScope.angle                = 0;
            $rootScope.rateDis              = 0;
            $rootScope.compareCount         = 0;

            $rootScope.myVar                = false;

            $rootScope.step1Complete        = false;
            $rootScope.step2Complete        = false;
            $rootScope.step3Complete        = false;
            $rootScope.step4Complete        = false;
            $rootScope.step5Complete        = false;
            $rootScope.step6Complete        = false;
            $rootScope.step7Complete        = false;
            $rootScope.step8Complete        = false;
            $rootScope.step9Complete        = false;


            $rootScope.$broadcast("resetEvents");
        });

        $rootScope.$on("ResetVariablesOnly", function(){
           // alert("resetting app");
            $rootScope.currentView          = 'menu';
            $rootScope.isFooterUp           = false;
            $rootScope.deviceLoaded         = true;
            $rootScope.dontshowagainUpdated = false;
            $rootScope.stepID               = 0;
            $rootScope.videoLoaded          = false;
            $rootScope.videoScaled          = false;
            $rootScope.notifications        = [];
            

            // Positions
            $rootScope.position             = [-1,-1];
            $rootScope.position_box1        = [0, 0];
            $rootScope.position_box2        = [0, 0];
            $rootScope.savePositionForback  = [-1, -1];
            $rootScope.inflectionPos        = [-1,-1];
            $rootScope.position_list        = [];
            $rootScope.original_x           = 0;
            $rootScope.original_y           = 0;
            // These three list are for graph drawing
            $rootScope.diffx_list           = [];
            $rootScope.diffy_list           = [];
            $rootScope.time_list            = [];
            $rootScope.saveMove             = [];
            $rootScope.original_time        = [];
            // Video parameters
            $rootScope.startTime            = 0;
            $rootScope.endTime              = 0;
            $rootScope.framerate            = 0;
            $rootScope.frameNum             = 0;
            $rootScope.frameSave            = [];
             // Box marker Counters
            $rootScope.count_box1           = 0;
            $rootScope.count_box2           = 0;
            $rootScope.firstBox             = true;
            $rootScope.secondBox            = false;
            // Trace Parameters
            $rootScope.distance             = 0;
            $rootScope.amplitudeDis         = 0;
            $rootScope.angle                = 0;
            $rootScope.rateDis              = 0;
            $rootScope.compareCount         = 0;

            $rootScope.myVar                = false;

            $rootScope.step1Complete        = false;
            $rootScope.step2Complete        = false;
            $rootScope.step3Complete        = false;
            $rootScope.step4Complete        = false;
            $rootScope.step5Complete        = false;
            $rootScope.step6Complete        = false;
            $rootScope.step7Complete        = false;
            $rootScope.step8Complete        = false;
            $rootScope.step9Complete        = false;

            //$rootScope.$broadcast("resetEvents");
        });

        $rootScope.$on("updateState", function(event, data){
            //alert( $rootScope.stepID )
                $("#nav_screentitle").html( "STEP " + $rootScope.stepID )

            if( $rootScope.currentView == "gravitropism"){

                $rootScope.totalSteps           = 11;

                switch( $rootScope.stepID ){
                    case 0:
                        //upload
                        //where user uploads video and previews video 
                        $("header").show();
                        $("#nav_screentitle").html("Upload Video");
                        $("#selectVideo").fadeIn();
                        //Action Panel
                        $("#nav_back").hide();
                        $("#rangeSelector").hide();
                        $("#framerateSelector").hide();
                        $("#measureSelector").hide();
                        $("#pixDistance").hide();
                        $("#apex_selector").hide();
                        $("#inflection_selector").hide();
                        $("#tracker").hide();
                        $("#line_selector").hide();
                        $("#results").hide();
                        // Footer
                        $("#cut").parent().removeClass("complete");
                        $("#framerate").parent().removeClass("complete");
                        $("#measure").parent().removeClass("complete");
                        $("#apex").parent().removeClass("complete");
                        $("#chart").parent().removeClass("complete");

                        $("#cut").attr("src", "img/ui/footer/cut_static_box.png");
                        $("#framerate").attr("src", "img/ui/footer/framerate_static_box.png");
                        $("#measure").attr("src", "img/ui/footer/measure_static_box.png");
                        $("#apex").attr("src", "img/ui/footer/apex_static_box.png");
                        $("#inflection").attr("src", "img/ui/footer/inflection_static_box.png");
                        $("#chart").attr("src", "img/ui/footer/draw_static_box.png");

                        

                        if($rootScope.videoLoaded){
                           /// alert("vid loaded from updatestate")
                            $(".actionButton div").fadeIn();
                        }

                        break;
                    case 1:
                        // sliders
                        //user has just uploaded the video and select start and end time
                        
                        $("#nav_back").show();
                        $("#selectVideo").fadeOut();
                        $(".actionButton div").hide();
                        $(".actionPanel").css("height", "20vh");
                        $(".actionPanel").css("bottom", "30px");
                        //Action Panel                        
                        $("#rangeSelector").show();
                        $("#framerateSelector").hide();
                        $("#measureSelector").hide();
                        $("#pixDistance").hide();
                        $("#apex_selector").hide();
                        $("#inflection_selector").hide();
                        $("#line_selector").hide();
                        $("#tracker").hide();
                        $("#results").hide();
                        // Footer
                        $("#cut").parent().removeClass("complete");
                        $("#cut").attr("src", "img/ui/footer/cut_active_box.png");


                        $("video").show();
                        $("#canvasDiv").hide();

                        if($rootScope.videoLoaded && $rootScope.step1Complete ){
                           /// alert("vid loaded from updatestate")
                            $(".actionButton div").fadeIn();
                        }
                        break;
                    case 2:
                        $rootScope.step1Complete        = true;
                        //fps
                        //User picks FPS
                        
                        $(".actionButton div").hide();
                        $(".actionPanel").css("height", "20vh");
                        $(".actionPanel").css("bottom", "30px");
                        //Action Panel
                        $("#rangeSelector").hide();
                        $("#framerateSelector").show();
                        $("#measureSelector").hide();
                        $("#pixDistance").hide();
                        $("#apex_selector").hide();
                        $("#inflection_selector").hide();
                        $("#line_selector").hide();
                         $("#tracker").hide();
                        $("#results").hide();
                        // Footer
                        $("#cut").parent().addClass("complete");
                        $("#framerate").parent().removeClass("complete");
                        $("#cut").attr("src", "img/ui/footer/cut_complete_box.png");
                        $("#framerate").attr("src", "img/ui/footer/framerate_active_box.png");

                        if($rootScope.videoLoaded && $rootScope.step2Complete ){
                           /// alert("vid loaded from updatestate")
                            $(".actionButton div").fadeIn();
                        }

                        //$rootScope.$broadcast("refreshCanvas");
                        break;
                    case 3:
                        $rootScope.$broadcast('rebindEvents');
                        $rootScope.step2Complete        = true;
                        // Line:  Distance
                         // User needs to tap and make a line
                         
                        $("#draw_input").css("background", "rgba(255,255,255,.1)");
                        $("#draw_input").css("color", "white");

                         //Action Panel
                        $(".actionPanel").css("height", "20vh");
                        $(".actionPanel").css("bottom", "30px");
                        $(".actionButton div").hide();

                        $("#rangeSelector").hide();
                        $("#framerateSelector").hide();

                        $("#measureSelector").show();

                        $("#pixDistance").hide();
                        $("#apex_selector").hide();
                        $("#inflection_selector").hide();
                        $("#line_selector").hide();
                         $("#tracker").hide();
                        $("#results").hide();
                        // Footer
                        $("#framerate").parent().addClass("complete");
                        $("#measure").parent().removeClass("complete");
                        $("#framerate").attr("src", "img/ui/footer/framerate_complete_box.png");
                        $("#measure").attr("src", "img/ui/footer/measure_active_box.png");

                        if($rootScope.videoLoaded & $rootScope.step3Complete){
                           /// alert("vid loaded from updatestate")
                            $(".actionButton div").fadeIn();
                        }

                        //$rootScope.$broadcast("refreshCanvas");
                        break;
                    case 4:
                        $rootScope.step3Complete        = true;
                        $rootScope.$broadcast('rebindEvents');
                        // Distance User input
                        // User enters pixDistance
                        // 
                        

                        //Action Panel
                        $(".actionPanel").css("height", "20vh");
                        $(".actionPanel").css("bottom", "30px");
                        $(".actionButton div").hide();
                        $("#rangeSelector").hide();
                        $("#framerateSelector").hide();
                        $("#measureSelector").hide();
                        $("#pixDistance").show();
                        $("#inflection_selector").hide();
                        $("#line_selector").hide();
                        $("#apex_selector").hide();
                        $("#tracker").hide();
                        $("#results").hide();
                        // Footer
                        
                        if($rootScope.videoLoaded & $rootScope.step4Complete){
                           /// alert("vid loaded from updatestate")
                            $(".actionButton div").fadeIn();
                        }
                        break;
                    case 5:
                        $rootScope.step4Complete        = true;
                        $rootScope.$broadcast('rebindEvents');
                        //$rootScope.step3Complete        = true;
                        // User taps in apex marker
                        //Action Panel
                        $(".actionPanel").css("height", "20vh");
                        $(".actionPanel").css("bottom", "30px");
                        $(".actionButton div").hide();
                        $("#rangeSelector").hide();
                        $("#framerateSelector").hide();
                        $("#measureSelector").hide();
                        $("#pixDistance").hide();  
                        $("#apex_selector").show();
                        $("#inflection_selector").hide();
                        $("#line_selector").hide();
                        $("#tracker").hide();
                        $("#results").hide();
                        // Footer
                        $("#measure").parent().addClass("complete");
                        $("#apex").parent().removeClass("complete");
                        $("#measure").attr("src", "img/ui/footer/measure_complete_box.png");
                        $("#apex").attr("src", "img/ui/footer/apex_active_box.png");

                        if($rootScope.videoLoaded & $rootScope.step5Complete){
                           /// alert("vid loaded from updatestate")
                            $(".actionButton div").fadeIn();
                        }

                        break;
                    case 6:
                        $rootScope.step5Complete        = true;
                        $rootScope.$broadcast('rebindEvents');
                        //$rootScope.step5Complete        = true;
                        //
                        $("#apex_input").css("background", "rgba(255,255,255,.1)");
                        $("#apex_input").css("color", "white");
                        // Inflection Marker
                        // User taps in inflection marker
                        // ActionPanel
                        $(".actionPanel").css("height", "20vh");
                        $(".actionPanel").css("bottom", "30px");
                        $(".actionButton div").hide();
                        $("#rangeSelector").hide();
                        $("#framerateSelector").hide();
                        $("#measureSelector").hide();
                        $("#pixDistance").hide();  
                        $("#apex_selector").hide();
                        $("#inflection_selector").show();
                        $("#line_selector").hide();
                        $("#tracker").hide();
                        $("#results").hide();

                        if($rootScope.videoLoaded & $rootScope.step6Complete ){
                           /// alert("vid loaded from updatestate")
                            $(".actionButton div").fadeIn();
                        }


                        $("canvas").unbind("click");

                        
                        //Footer
                        $("#apex").parent().addClass("complete");
                        $("#inflection").parent().removeClass("complete");
                        $("#apex").attr("src", "img/ui/footer/apex_complete_box.png");
                        $("#inflection").attr("src", "img/ui/footer/inflection_active_box.png");
                        break;
                    case 7:
                        $rootScope.step6Complete        = true;
                        // Draw line between Apex and Inflection
                        
                        $rootScope.$broadcast('rebindEvents');

                        $("#inflection_input").css("background", "rgba(255,255,255,.1)");
                        $("#inflection_input").css("color", "white");
                         $("#line_input").css("background", "rgba(255,255,255,.1)");
                        $("#line_input").css("color", "white");


                        $(".actionPanel").css("height", "20vh"); 
                        $(".actionPanel").css("bottom", "30px");
                        $(".actionButton div").hide();
                        $("#rangeSelector").hide();
                        $("#framerateSelector").hide();
                        $("#measureSelector").hide();
                        $("#pixDistance").hide();  
                        $("#apex_selector").hide();
                        $("#inflection_selector").hide();
                        $("#tracker").hide();
                        $("#line_selector").show();

                        $("#results").hide();

                        $("canvas").unbind("click");

                        if($rootScope.videoLoaded && $rootScope.step7Complete ){
                           /// alert("vid loaded from updatestate")
                            $(".actionButton div").fadeIn();
                        }

                        //Footer
                        $("#inflection").parent().addClass("complete");
                        $("#chart").parent().removeClass("complete");
                        $("#inflection").attr("src", "img/ui/footer/inflection_complete_box.png");
                        $("#chart").attr("src", "img/ui/footer/draw_active_box.png");
                        break;
                    case 8:
                        $rootScope.$broadcast('rebindEvents');
                        $rootScope.step7Complete        = true;
                        $("#line_input").css("background", "rgba(255,255,255,.1)");
                        $("#line_input").css("color", "white");
                        // Draw Line 
                        //Action Panel
                        $(".actionPanel").css("height", "20vh");
                        $(".actionPanel").css("bottom", "30px");
                        $(".actionButton div").hide();
                        $("#rangeSelector").hide();
                        $("#framerateSelector").hide();
                        $("#measureSelector").hide();
                        $("#apex_selector").hide();
                        $("#inflection_selector").hide();
                        $("#line_selector").hide();
                        $("#pixDistance").hide();
                        $("#tracker").show();
                        $("#results").hide();
                        // Footer
                        $("footer").show();
                        $("header").show();
                        $("#nav_back").show();
                        //Video Player
                        $("video").hide();
                        $("#canvasDiv").show();
                        $("#graph").hide();
                        

                        if($rootScope.videoLoaded && $rootScope.step8Complete){
                           /// alert("vid loaded from updatestate")
                            $(".actionButton div").fadeIn();
                        }
                        
                        break;
                    case 9:
                        $rootScope.step8Complete        = true;
                        //Action Panel
                        $(".actionPanel").css("height", "50px"); 
                        $(".actionPanel").css("bottom", "0px");
                        $("#nav_back").hide();
                        $("#rangeSelector").hide();
                        $("#framerateSelector").hide();
                        $("#measureSelector").hide();
                        $("#apex_selector").hide();
                        $("#inflection_selector").hide();
                        $("#line_selector").hide();
                        $("#pixDistance").hide();
                        $("#tracker").hide();
                        $("#results").css("display","flex");
                        $(".actionButton div").hide();

                        //$("#share_input").show();

                       // $("#nav_back").show();
                        //Video Player
                        $("video").hide();
                        $("#canvasDiv").hide();
                        //Graph
                        $("#graph").show();
                        
                        $("header").hide();

                        $("#nav_screentitle").html("RESULTS");

                        $rootScope.$broadcast("showResults");
                        // Footer
                        $("#apex").parent().addClass("complete");
                        $("#chart").parent().removeClass("complete");
                        $("#apex").attr("src", "img/ui/footer/apex_complete_box.png");
                        //$("#chart").attr("src", "img/ui/footer/draw_active_box.png");
                        $("#chart").parent().addClass("complete");
                        $("#chart").attr("src", "img/ui/footer/draw_complete_box.png");
                        $("footer").hide();
                        break;
                    case 10:
                        //Footer
                        $("#chart").parent().addClass("complete");
                        $("#chart").attr("src", "img/ui/footer/draw_complete_box.png");
                        break;
                }
            }else if( $rootScope.currentView == "circumnutation"){

                $rootScope.totalSteps           = 9;

                switch( $rootScope.stepID ){
                    case 0:
                        //upload
                        //where user uploads video and previews video 
                        $("header").show();
                        $("#nav_screentitle").html("Upload Video");
                        $("#selectVideo").fadeIn();
                        //
                        $("#nav_back").hide();
                        //Action Panel
                        if($rootScope.videoLoaded){
                            $(".actionButton div").fadeIn();
                        }else{
                            $(".actionButton div").hide();
                        }
                        $("#rangeSelector").hide();
                        $("#framerateSelector").hide();
                        $("#measureSelector").hide();
                        $("#pixDistance").hide();
                        $("#apex_selector").hide();
                        $("#inflection_selector").hide();
                        $("#tracker").hide();
                        $("#line_selector").hide();
                        $("#results").hide();

                        // Footer
                        $("#cut").parent().removeClass("complete");
                        $("#framerate").parent().removeClass("complete");
                        $("#measure").parent().removeClass("complete");
                        $("#apex").parent().removeClass("complete");
                        $("#chart").parent().removeClass("complete");

                        $("#cut").attr("src", "img/ui/footer/cut_static_box.png");
                        $("#framerate").attr("src", "img/ui/footer/framerate_static_box.png");
                        $("#measure").attr("src", "img/ui/footer/measure_static_box.png");
                        $("#apex").attr("src", "img/ui/footer/apex_static_box.png");
                        $("#inflection").attr("src", "img/ui/footer/inflection_static_box.png");
                        $("#chart").attr("src", "img/ui/footer/draw_static_box.png");

                        if($rootScope.videoLoaded){
                           /// alert("vid loaded from updatestate")
                            $(".actionButton div").fadeIn();
                        }

                        break;
                    case 1:
                        // sliders
                        //user has just uploaded the video and select start and end time
                        $("#nav_back").show();
                        $("#selectVideo").fadeOut();
                        //Action Panel   
                        $(".actionPanel").css("height", "20vh");
                        $(".actionPanel").css("bottom", "30px");
                        $(".actionButton div").hide();                     
                        $("#rangeSelector").show();
                        $("#framerateSelector").hide();
                        $("#measureSelector").hide();
                        $("#pixDistance").hide();
                        $("#apex_selector").hide();
                        $("#inflection_selector").hide();
                        $("#line_selector").hide();
                        $("#tracker").hide();
                        $("#results").hide();

                        $("video").show();
                        $("#canvasDiv").hide();

                        // Footer
                        $("#cut").parent().removeClass("complete");
                        $("#cut").attr("src", "img/ui/footer/cut_active_box.png");

                        if($rootScope.videoLoaded && $rootScope.step1Complete ){
                           /// alert("vid loaded from updatestate")
                            $(".actionButton div").fadeIn();
                        }
                        break;
                    case 2:
                        $rootScope.step1Complete        = true;
                        //fps
                        //User picks FPS
                        $("#nav_back").show();
                        //Action Panel
                        $(".actionPanel").css("height", "20vh");
                        $(".actionPanel").css("bottom", "30px");
                        $(".actionButton div").hide();
                        $("#rangeSelector").hide();
                        $("#framerateSelector").show();
                        $("#measureSelector").hide();
                        $("#pixDistance").hide();
                        $("#apex_selector").hide();
                        $("#inflection_selector").hide();
                        $("#line_selector").hide();
                         $("#tracker").hide();
                        $("#results").hide();
                        // Footer
                        $("#cut").parent().addClass("complete");
                        $("#framerate").parent().removeClass("complete");
                        $("#cut").attr("src", "img/ui/footer/cut_complete_box.png");
                        $("#framerate").attr("src", "img/ui/footer/framerate_active_box.png");
                        $rootScope.$broadcast("refreshCanvas");

                        if($rootScope.videoLoaded && $rootScope.step2Complete ){
                           /// alert("vid loaded from updatestate")
                            $(".actionButton div").fadeIn();
                        }
                        break;
                    case 3:
                        $rootScope.step2Complete        = true;
                        // Line:  Distance
                         // User needs to tap and make a line
                         // 
                        $("#nav_back").show();
                         //Action Panel
                        $(".actionPanel").css("height", "20vh");
                        $(".actionPanel").css("bottom", "30px");
                        $(".actionButton div").hide();
                        $("#rangeSelector").hide();
                        $("#framerateSelector").hide();

                        $("#measureSelector").show();

                        $("#pixDistance").hide();
                        $("#apex_selector").hide();
                        $("#inflection_selector").hide();
                        $("#line_selector").hide();
                        $("#tracker").hide();
                        $("#results").hide();
                        // Footer
                        $("#framerate").parent().addClass("complete");
                        $("#measure").parent().removeClass("complete");
                        $("#framerate").attr("src", "img/ui/footer/framerate_complete_box.png");
                        $("#measure").attr("src", "img/ui/footer/measure_active_box.png");
                        $rootScope.$broadcast("refreshCanvas");

                        $("#draw_input").css("background", "rgba(255,255,255,.1)");
                        $("#draw_input").css("color", "white");

                        if($rootScope.videoLoaded && $rootScope.step3Complete ){
                           /// alert("vid loaded from updatestate")
                            $(".actionButton div").fadeIn();
                        }
                        break;
                    case 4:
                        $("#nav_back").show();
                        $rootScope.step3Complete        = true;
                        // Distance User input
                        // User enters pixDistance
                        //Action Panel
                        $(".actionPanel").css("height", "20vh");
                        $(".actionPanel").css("bottom", "30px");
                        $(".actionButton div").hide();
                        $("#rangeSelector").hide();
                        $("#framerateSelector").hide();
                        $("#measureSelector").hide();
                        $("#pixDistance").show();
                        $("#inflection_selector").hide();
                        $("#line_selector").hide();
                        $("#apex_selector").hide();
                        $("#tracker").hide();
                        $("#results").hide();
                        // Footer
                        if($rootScope.videoLoaded && $rootScope.step4Complete ){
                           /// alert("vid loaded from updatestate")
                            $(".actionButton div").fadeIn();
                        }
                        break;
                    case 5:
                        $("#nav_back").show();
                        $rootScope.step4Complete        = true;
                        // User taps in apex marker
                        //Action Panel
                        $(".actionPanel").css("height", "20vh");
                        $(".actionPanel").css("bottom", "30px");
                        $(".actionButton div").hide();
                        $("#rangeSelector").hide();
                        $("#framerateSelector").hide();
                        $("#measureSelector").hide();
                        $("#pixDistance").hide();  
                        $("#apex_selector").show();
                        $("#inflection_selector").hide();
                        $("#line_selector").hide();
                        $("#tracker").hide();
                        $("#results").hide();
                        // Footer
                        $("#measure").parent().addClass("complete");
                        $("#apex").parent().removeClass("complete");
                        $("#measure").attr("src", "img/ui/footer/measure_complete_box.png");
                        $("#apex").attr("src", "img/ui/footer/apex_active_box.png");
                        if($rootScope.videoLoaded && $rootScope.step5Complete ){
                           /// alert("vid loaded from updatestate")
                            $(".actionButton div").fadeIn();
                        }
                        $("#apex_input").css("background", "rgba(255,255,255,.1)");
                        $("#apex_input").css("color", "white");
                        break;
                    case 6:
                         $rootScope.step5Complete        = true;
                        $("#nav_back").show();

                        //$rootScope.step7Complete        = true;
                        // Draw Line 
                        $("#line_input").css("background", "rgba(255,255,255,.1)");
                        $("#line_input").css("color", "white");
                        //Action Panel
                        $(".actionPanel").css("height", "20vh");
                        $(".actionPanel").css("bottom", "30px");
                        $(".actionButton").show();
                        $(".actionButton div").hide();
                        $("#rangeSelector").hide();
                        $("#framerateSelector").hide();
                        $("#measureSelector").hide();
                        $("#apex_selector").hide();
                        $("#inflection_selector").hide();
                        $("#line_selector").hide();
                        $("#pixDistance").hide();
                        $("#tracker").show();
                        $("#results").hide();
                        // Footer
                        $("header").show();
                        $("footer").show();
                        $("#nav_back").show();
                        //Video Player
                        $("video").hide();
                        $("#canvasDiv").show();
                        $("#graph").hide();
                        if($rootScope.videoLoaded && $rootScope.step6Complete ){
                           /// alert("vid loaded from updatestate")
                            $(".actionButton div").fadeIn();
                        }
                        break;
                   
                    case 7:
                        $rootScope.step6Complete        = true;
                        //Action Panel
                        $(".actionPanel").css("height", "50px");
                        $(".actionPanel").css("bottom", "0px");
                        
                        $(".actionButton div").hide();
                        $("#rangeSelector").hide();
                        $("#framerateSelector").hide();
                        $("#measureSelector").hide();
                        $("#apex_selector").hide();
                        $("#inflection_selector").hide();
                        $("#line_selector").hide();
                        $("#pixDistance").hide();
                        $("#tracker").hide();
                        $("#results").css("display","flex");
                        $(".actionButton").hide();

                       // $("#share_input").show();
                        //$("#nav_back").show();
                        $("#nav_back").hide();
                        $("header").hide();
                        //Video Player
                        $("video").hide();
                        $("#canvasDiv").hide();
                        //Graph
                        $("#graph").show();
                        

                        $rootScope.$broadcast("showResults");
                        $("#nav_screentitle").html("RESULTS")
                        // Footer
                        $("#apex").parent().addClass("complete");
                        $("#chart").parent().removeClass("complete");
                        $("#apex").attr("src", "img/ui/footer/apex_complete_box.png");
                        //$("#chart").attr("src", "img/ui/footer/draw_active_box.png");
                         $("#chart").parent().addClass("complete");
                        $("#chart").attr("src", "img/ui/footer/draw_complete_box.png");
                        $("footer").hide();

                        break;
                    case 8:
                        //Footer
                        $(".actionButton div").hide();
                        $("#chart").parent().addClass("complete");
                        $("#chart").attr("src", "img/ui/footer/draw_complete_box.png");
                        break;
                }
            }
        });
    
        $rootScope.$on("goingBack", function(event, data){
            if($rootScope.videoLoaded){
                $(".actionButton div").fadeIn();
            }else{
                $(".actionButton div").hide();
            }
        });
        

        document.addEventListener("deviceready", init, false); 
    }
]);