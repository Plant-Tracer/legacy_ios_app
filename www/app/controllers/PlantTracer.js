/*--------------------PLANT TRACER 2.0----------------------
    Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/
/**
 * PlantTracer handles the VideoPlayer view
 */
app.controller('PlantTracer', ['$rootScope', '$scope', '$http', 'DATAVAULT', 'GLOBAL', '$state', '$stateParams',
    function($rootScope, $scope, $http, DATAVAULT, GLOBAL, $state, $stateParams){
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
        // Trace Parameters
        $rootScope.distance             = 0;
        $rootScope.amplitudeDis         = 0;
        $rootScope.angle                = 0;
        $rootScope.rateDis              = 0;
        // Box marker Counters
        $rootScope.count_box1           = 0;
        $rootScope.count_box2           = 0;
        $rootScope.firstBox             = true;
        $rootScope.secondBox            = false;
        $rootScope.compareCount         = 0;


        var boxWidth                    = 20;
        var boxHeight                   = 20;
        // Set scale box, also change in CSS file
        var scaleboxWidth               = 10;
        var scaleboxHeight              = 10;

        var count;
        var range                       = [10,10];
        var image1;
        var image2;
        var templateRange;
        var image1Trans                 = [];
        var image2Trans                 = [];
        var judge                       = 0;
        var FPS                         = 20;
       
        var background                  = [];
        var inflectionCount             = 0;

        var video;
        var canvas;
        var context;
        var cw, ch;

        var replayVar;
        var isReplaying                 = false;
        
        $rootScope.$on("deviceReady", function(event, data){
            console.log("PT: DEVICE READY SIGNAL RECEIVED");
            init();
        });

        $rootScope.$on("ResetVariables", function(){
            video.currentTime           = $rootScope.startTime;
            boxWidth                    = 20;
            boxHeight                   = 20;
            // Set scale box, also change in CSS file
            scaleboxWidth               = 10;
            scaleboxHeight              = 10;

            count;
            range                       = [10,10];
            image1;
            image2;
            templateRange;
            image1Trans                 = [];
            image2Trans                 = [];
            judge                       = 0;
            FPS                         = 20;
           
            background                  = [];
            inflectionCount             = 0

            video;
            canvas;
            context;
            cw, ch;

            replayVar;
            isReplaying     = false;

            $scope.$destroy();

        });

        $scope.$on('$destroy', function() {
            $scope.track();
            $scope.connectApexInflect();
            $scope.drawLine();
            $scope.undoLine();
            $scope.apexMarker();
            $scope.inflectionMarker();
            $scope.replayVideo();
            $scope.refreshCanvas();
        });


        $scope.drawLine             = $rootScope.$on("drawLine", function(event, data){
            console.log("PT: DRAWING LINE");
            selectScaleBox();
        });

        $scope.undoLine             = $rootScope.$on("undoLine", function( event, data ){
            console.log("PT: UNDO LINE");
            undoScaleBox();
        });

        $scope.apexMarker           = $rootScope.$on("apexMarker", function( event, data ){
            console.log("PT: MARKING APEX");
            selectBox();           
        });

        $scope.inflectionMarker     = $rootScope.$on("inflectionMarker", function( event, data ){
            console.log("PT: MARKING INFLECTION");
           inflectionBox();         
        });

        $scope.replayVideo          = $rootScope.$on("replayVideo", function(){
            replayVideo();
        });

        $scope.connectApexInflect   = $rootScope.$on("connectApexInflection", function(){
            drawBoxLine();
        });

        $scope.track                = $rootScope.$on("trackPlant", function( event, data ){
            console.log("PT: TRACKING PLANT");
            
            startTrack();       
        });

        $scope.refreshCanvas        = $rootScope.$on("refreshCanvas", function(event, data){
            console.log("PT: REFRESH CANVAS SIGNAL RECEIVED");


            video.currentTime           =   $rootScope.startTime;
            if( !$rootScope.videoScaled ){
                $rootScope.videoW           =   $("video").width();
                $rootScope.videoH           =   $("video").height();
                $rootScope.ratio            =   $rootScope.videoW/$rootScope.videoH;
                $rootScope.videoDimension   =   GLOBAL.calculateAspectRatioFit(
                                                    $rootScope.videoW,
                                                    $rootScope.videoH,
                                                    window.innerWidth,
                                                    $rootScope.videoH
                                                );
                cw                          =   Math.floor(canvas.clientWidth / 100);
                ch                          =   Math.floor(canvas.clientHeight / 100);
                canvas.width                =   $rootScope.videoDimension.width;
                canvas.height               =   $rootScope.videoDimension.height;

                $rootScope.videoScaled      = true;
           }

            reloadImg();
        });



        function reloadImg(){
            console.log("Reloading image")
            context.drawImage(video,0,0,$rootScope.videoDimension.width, $rootScope.videoDimension.height);
        }

        function draw(v,c,w,h) {
            if(v.paused || v.ended) return false;
            c.drawImage(v,0,0,w,h);
            setTimeout(draw,20,v,c,w,h);
        }

        // Add listener for marking scalebox
        function selectScaleBox(){
            console.log("SelectScaleBox() invoked");

            canvas                                     = document.getElementById("canvas");
            $rootScope.count_box1                      = 0;
            $rootScope.count_box2                      = 0;

            video.currentTime                          = $rootScope.startTime;
            $("canvas").unbind("click")
            $("canvas").click( function(e){ getScaleBoxes(e); });
            $("#draw_input").css("background", "white");
            $("#draw_input").css("color", "#011500");

            reloadImg();
        }

        // Draw two scale box to set scale.
        function getScaleBoxes(event){
            console.log("getScaleBox1 invoked");
            
            if ( !canvas.getBoundingClientRect ){ alert("Fail!");}

            reloadImg();
            
            if( $rootScope.count_box1 > 0 ){  $rootScope.firstBox = false;  $rootScope.secondBox = true;}
            if( $rootScope.count_box2 > 0 ){  $rootScope.secondBox = false; }

            var rect        = canvas.getBoundingClientRect();
            var x           = event.clientX - rect.left;
            var y           = event.clientY - rect.top;

            //alert([rect, x, y ]);
            
            if (x < $rootScope.videoDimension.width && x > 0 && y > 0 && y < $rootScope.videoDimension.height ) {
                if( $rootScope.firstBox){ $rootScope.position_box1 = [x,y]; }
                if( $rootScope.secondBox){$rootScope.position_box2 = [x,y]; }  
            };

            if($rootScope.firstBox){
               // alert('firstbox')
                if ($rootScope.count_box1 === 0) {
                    var tempy                                               = $rootScope.position_box1[1]-$rootScope.videoDimension.height;
                    document.getElementById("scalebox1").style.display      = "block";
                    document.getElementById("scalebox1").style.marginTop    = tempy+'px';
                    document.getElementById("scalebox1").style.marginLeft   = $rootScope.position_box1[0]+'px';
                }else{
                    reloadImg();
                    var tempy                                               = $rootScope.position_box1[1]-$rootScope.videoDimension.height;
                    document.getElementById("scalebox1").style.display      = "block";
                    document.getElementById("scalebox1").style.marginTop    = tempy+'px';
                    document.getElementById("scalebox1").style.marginLeft   = $rootScope.position_box1[0]+'px';
                }

                $rootScope.count_box1++;

            }else if($rootScope.secondBox){
                 //alert('secondbox')
                if ($rootScope.count_box2 === 0) {
                    var tempy                                               = $rootScope.position_box2[1]-$rootScope.videoDimension.height;
                    document.getElementById("scalebox2").style.display      = "block";
                    document.getElementById("scalebox2").style.marginTop    = tempy+'px';
                    document.getElementById("scalebox2").style.marginLeft   = $rootScope.position_box2[0]+'px';
 
                }else{
                    reloadImg();
                    var tempy                                               = $rootScope.position_box2[1]-$rootScope.videoDimension.height;
                    document.getElementById("scalebox2").style.display      = "block";
                    document.getElementById("scalebox2").style.marginTop    = tempy+'px';
                    document.getElementById("scalebox2").style.marginLeft   = $rootScope.position_box2[0]+'px';

                }
                drawScaleLine();
                $(".actionButton div").fadeIn();
                $rootScope.count_box2++;

            }         
        }

        function drawScaleLine(){
            console.log("Drawing Line...")
            var startx                                                  = $rootScope.position_box1[0]+scaleboxWidth/2;
            var starty                                                  = $rootScope.position_box1[1]+scaleboxHeight;

            var endx                                                    = $rootScope.position_box2[0]+scaleboxWidth/2;
            var endy                                                    = $rootScope.position_box2[1]+scaleboxHeight;

            $rootScope.distance                                         = Math.sqrt(((endx-startx)*(endx-startx)) + ((endy-starty)*(endy-starty)));
            
            var c                                                       = document.getElementById("canvas");
            var ctx                                                     = c.getContext("2d");
            ctx.beginPath();
            ctx.moveTo(startx, starty);
            ctx.lineTo(endx,endy);
            ctx.lineWidth                                               = 1;
            ctx.strokeStyle                                             = "#f00";//"#d9e021";
            ctx.stroke();

            $("canvas").unbind("click");
        }

        // Clear scalebox and allow redo
        function undoScaleBox(){
            console.log("Undo")
            document.getElementById("scalebox1").style.display          = "none";
            document.getElementById("scalebox2").style.display          = "none";

            $(".actionButton div").fadeOut();


            $rootScope.firstBox                                         = true;
            $rootScope.secondBox                                        = false;
            $rootScope.count_box1                                       = 0;
            $rootScope.count_box2                                       = 0;
            $rootScope.position_box1                                    = [0, 0];
            $rootScope.position_box2                                    = [0, 0];

            reloadImg();
            selectScaleBox();

        }

         // Add listener for marking tracking box //Apex
        function selectBox(){
            //$("canvas").unbind("click");
            count = 0;
            //reloadImg();
            //canvas.addEventListener("mousedown", getCoordinates, false);
            $("#apex_input").css("background", "white");
            $("#apex_input").css("color", "#011500");

            document.getElementById("scalebox1").style.display          = "none";
            document.getElementById("scalebox2").style.display          = "none";
            reloadImg();

            $("canvas").unbind("click");
            video.currentTime = $rootScope.startTime;
            setTimeout(function(){reloadImg();},50);
            $("canvas").click( function(e){ getCoordinates(e); });

        }

        function getCoordinates(event){
            if ( !canvas.getBoundingClientRect){ alert("Fail!"); }
            //Reset Position
            $rootScope.position        = [-1,-1];

            var rect    = canvas.getBoundingClientRect();
            var x       = event.clientX - rect.left;
            var y       = event.clientY - rect.top;

           
            if ( x < $rootScope.videoDimension.width && x > 0 && y > 0 && y < $rootScope.videoDimension.height ) {
                $rootScope.position            = [x,y];
                $rootScope.position[0]         = Math.round($rootScope.position[0]);
                $rootScope.position[1]         = Math.round($rootScope.position[1]);
                $rootScope.savePositionForback = [$rootScope.position[0],$rootScope.position[1]];
            }

            if (count === 0) {
                drawBox();
            }else{
                redrawBox();
            }
            count++;

             

            $(".actionButton div").fadeIn();
        }

        function drawBox(){
            console.log( "drawBox()");
            var tempy                                                   = $rootScope.position[1]-$rootScope.videoDimension.height;
            document.getElementById("trackingbox").style.marginTop      = tempy + 'px';
            document.getElementById("trackingbox").style.marginLeft     = $rootScope.position[0]+'px';
            document.getElementById("trackingbox").style.display        = 'block';
        }

        function redrawBox(){
            console.log( "re-drawBox()");
            reloadImg();
            drawBox();  
        }

        //Inflection Marker
        function inflectionBox(){
            //alert("ib")
            $("canvas").unbind("click")
            $("#inflection_input").css("background", "white");
            $("#inflection_input").css("color", "#011500");
            inflectionCount = 0;
            //canvas.addEventListener("mousedown", getInflectCoordinates, false);
            $("canvas").unbind("click");
            $("canvas").click( function(e){ getInflectCoordinates(e); });
            inflectionCount++;
        }

        function getInflectCoordinates(event){

            var rect    = canvas.getBoundingClientRect();
            var x       = event.clientX - rect.left;
            var y       = event.clientY - rect.top;
            
            if (x < $rootScope.videoDimension.width && x > 0 && y > 0 && y < $rootScope.videoDimension.height ) {
                $rootScope.inflectionPos = [x,y];
            };

            //alert( inflectionPos )

            if(inflectionCount == 0){
                drawInflectionBox();
            }else{
               // alert("t")
                redrawBox();
                drawInflectionBox();
            }

           
            $(".actionButton div").fadeIn();

        }

        function drawInflectionBox(){
            console.log(" adding inflection point")
            var tempy = $rootScope.inflectionPos[1]-$rootScope.videoDimension.height;
            document.getElementById("inflectionbox").style.marginTop    = tempy+'px';
            document.getElementById("inflectionbox").style.marginLeft   = $rootScope.inflectionPos[0]+'px';
            document.getElementById("inflectionbox").style.display      = 'block';

        }

        function replayVideo(){
            var isDone = false;
            console.log("replaying")
            //UI/UX
            $("#replay_input").unbind('click');
            $("#replay_input").html("Replaying...");
            $("#replay_input").css("background", "white");
            $("#replay_input").css("color", "#011500");
            clearInterval(replayVar);
            video.currentTime = $rootScope.startTime;
            reloadImg();
            replayVar = setInterval(function(){
                video.currentTime = (video.currentTime+0.05).toFixed(2);
                //console.log([$rootScope.startTime, $rootScope.endTime, video.currentTime]);  
                reloadImg();

                //bug patch to fix duplicate invokation
                if(video.currentTime == 0 ){ clearInterval(replayVar); }

                if(video.currentTime >= $rootScope.endTime){
                    //UI/UX
                    $("#replay_input").click( function(){$rootScope.$broadcast("replayVideo");}); 
                    $("#replay_input").html("Replay");
                    $("#replay_input").css("background", "rgba( 255, 255, 255, .1 )");
                    $("#replay_input").css("color", "#fff");
                    
                    video.currentTime = $rootScope.startTime;
                    setTimeout(function(){reloadImg();},50);

                    clearInterval(replayVar);

                    
                }
              }, 50);
        }

        function drawBoxLine(){
            console.log("connecting Apex and Inflection with a line");
            $("#line_input").css("background", "white");
            $("#line_input").css("color", "#011500");

            $(".actionButton div").fadeIn();

            var ctx = canvas.getContext("2d");
            ctx.beginPath();
            ctx.moveTo($rootScope.position[0]+(boxWidth/2),$rootScope.position[1]+(boxHeight-5));
            ctx.lineTo($rootScope.inflectionPos[0]+(boxWidth/2),$rootScope.inflectionPos[1]+(boxHeight-5));
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#F00";//'#d9e021';
            ctx.stroke();
            
            $("#line_input").unbind('click');
        }

        //TRACKING 
        function startTrack(){
            //("start Tracking")
            //console.log("tracking started")
            //UIUX
            $("#track_input").unbind('click');
            $("#track_input").html("Tracing...");
            $("#track_input").css("background", "white");
            $("#track_input").css("color", "#011500");


            $rootScope.position             = [$rootScope.savePositionForback[0],$rootScope.savePositionForback[1]];
            $rootScope.saveMove             = [];
            $rootScope.frameSave            = [];
            $rootScope.frameNum             = 0;
            $rootScope.time_list            = [];
            $rootScope.diffy_list           = [];
            $rootScope.diffx_list           = [];
            $rootScope.position_list        = [];

           
            if($rootScope.position[0] == -1){
                return;
            }

            $("canvas").unbind("click");

            var save                       = [$rootScope.position[0],$rootScope.position[1],$rootScope.startTime];
            $rootScope.original_x          = $rootScope.position[0]+boxWidth/2;
            $rootScope.original_y          = $rootScope.position[1]+boxHeight/2;

            $rootScope.saveMove.push( save );

            $rootScope.compareCount        = 0;
            judge                          = 1;

            //if( $rootScope.currentView == "circumnutation"){
                readData();
           // }

            tracking();

        }

        function initialBackground(){
            console.log("initialBG");

            var ctx             = canvas.getContext("2d");

            for(var i = 0; i < M; i++){
                video.currentTime = (Math.round((0.05*i+$rootScope.startTime)*1000))/1000;
                $rootScope.frameSave.push(ctx.getImageData(0, 0, $rootScope.videoDimension.width, $rootScope.videoDimension.height).data);
            }

            for(var i = 1; i < $rootScope.frameSave[0].length; i += 4){
                var temp = 0;
                for(var j = 0; j < M; j++){
                    temp += $rootScope.frameSave[j][i];
                    temp /= M;
                }
                background.push(temp);
            }
            
            video.currentTime = $rootScope.startTime;
        }

        function updateBackground(){
            console.log("updateBackground() initiated")
            $rootScope.position[1]             = Math.round($rootScope.position[1]);
            var localsave           = video.currentTime;
            video.currentTime       = (Math.round((video.currentTime - 0.05)*1000))/1000;

            var ctx                 = canvas.getContext("2d");

            $rootScope.frameSave.shift();
            $rootScope.frameSave.push(ctx.getImageData(0, 0, $rootScope.videoDimension.width, $rootScope.videoDimension.height).data);

            background              = [];

            for(var i = 1; i < $rootScope.frameSave[0].length; i += 4){
                var temp = 0;
                for(var j = 0; j < M; j++){
                    temp += $rootScope.frameSave[j][i];
                    temp /= M;
                }
                background.push(temp);
            }
            video.currentTime = localsave;
        }

        function readData(){
            console.log("readData() launched")
            var ctx         = canvas.getContext("2d");
            image1          = ctx.getImageData($rootScope.position[0],$rootScope.position[1],boxWidth,boxHeight);
            var pix         = 1;

            // if( $rootScope.currentView == "circumnutation"){
            //     var oridata     = 0;
            //     $rootScope.position[1]     = Math.round($rootScope.position[1]);
            // }

            for (var i = 0; i < boxWidth; i++) {
                image1Trans[i]=[];
                for (var j = 0; j < boxHeight; j++) {
                    image1Trans[i][j] =0;
                };
            };

            // if( $rootScope.currentView == "circumnutation"){
            //     for (var j = 0; j < boxHeight; j++) {
            //         for (var i = 0; i < boxWidth; i++) {
            //             //image1Trans[i][j] = image1.data[pix];
            //             oridata = image1.data[pix];
            //             image1Trans[i][j] = oridata - background[$rootScope.videoDimension.width*($rootScope.position[1]+j)+i];
            //             if(image1Trans[i][j] < 20){
            //                 image1Trans[i][j] = 0;
            //             }
            //             pix += 4;
            //         };
            //     };
            // }else{
                //alert("grav")
                for (var j = 0; j < boxHeight; j++) {
                    for (var i = 0; i < boxWidth; i++) {
                        image1Trans[i][j] =image1.data[pix];
                        pix += 4;
                    };
                };
            //}
        }

        function tracking(){
            //console.log("Start tracking...")
           // alert("tracking");
            $rootScope.myVar = setTimeout(function(){ compareImg() }, 50);
        }

        function compareImg(){
           // console.log("comparing image");

            selectTemplate();

            video.currentTime = (Math.round((0.05+video.currentTime)*1000))/1000;
            
            reloadImg();

            

            if(video.currentTime >= $rootScope.endTime){
                //alert("stop")
                $("#track_input").html("Trace");
                $("#track_input").css("background", "rgba(255,255,255,.1)");
                $("#track_input").css("color", "white");
                $("#tracker").fadeOut( function(){
                    $(".actionButton div").fadeIn();
                });
                $("#track_input").click( function(){
                    startTrack();
                });

                

                clearTimeout($rootScope.myVar);
                drawAllDots();

                if($rootScope.currentView == "gravitropism"){ drawBoxLine(); }
                return;
            }

            if ($rootScope.position[0] == -1) {
                return;
            };


            
            var ctx         = canvas.getContext("2d");
            var imageData   = ctx.getImageData(templateRange[0],templateRange[1],templateRange[2],templateRange[3]);

            var pix         = 1;

            for (var i = 0; i < templateRange[2]; i++) {
                image2Trans[i] = [];
                for (var j = 0; j < templateRange[3]; j++) {
                    image2Trans[i][j] = 0;
                };
            };

            for (var j = 0; j < templateRange[3]; j++) {

                for (var i = 0; i < templateRange[2]; i++) {
                    image2Trans[i][j] = imageData.data[pix] ;
                    pix +=4;
                };
            };      

            var moveX;
            var moveY;
            var maxerror = boxWidth*boxHeight*1000;
            var error = 0;

            //console.log([maxerror, boxWidth, boxHeight, templateRange]);


            if($rootScope.currentView == "gravitropism"){
                for (var i = 0; i <= (templateRange[2]-boxWidth); i++) {
                    for (var j = 0; j <= (templateRange[3] - boxHeight) ;j++){
                        // var imageData = ctx.getImageData((templateRange[0] + i),(templateRange[1] + j),boxWidth,boxHeight);
                       
                        error1 = calculate(i,j);
                         //console.log("626 :)")
                        var previous_x  = $rootScope.saveMove[$rootScope.saveMove.length-1][0];
                        var previous_y  = $rootScope.saveMove[$rootScope.saveMove.length-1][1];
                        var current_x   = templateRange[0] + i;
                        var current_y   = templateRange[1] + j;
                        var error2      = Math.sqrt((previous_x-current_x)*(previous_x-current_x)+(previous_y-current_y)*(previous_y-current_y));
    
                        var error3;
    
                        //console.log([previous_x,previous_y,current_x,current_y,error2])
                        if($rootScope.compareCount < 3){
                        //  error2 = 0;
                            error3 = 0;
                        }
                        else{
                            var a1 = $rootScope.saveMove[$rootScope.saveMove.length-2][0];
                            var a2 = $rootScope.saveMove[$rootScope.saveMove.length-2][1];
                            var b1 = $rootScope.saveMove[$rootScope.saveMove.length-1][0];
                            var b2 = $rootScope.saveMove[$rootScope.saveMove.length-1][1];
                            var c1 = templateRange[0] + i;
                            var c2 = templateRange[1] + j;
                            var component1 = ((a1-b1)-(b1-c1))*((a1-b1)-(b1-c1));
                            var component2 = ((a2-b2)-(b2-c2))*((a2-b2)-(b2-c2));
                            error3 = Math.sqrt(component1+component2);
                        }
    
                        error = (0.6*error1 + 74*error2 + 36*error3)/100;
                        //if contains foreground in above 2X10, max error
    
                        if (error< maxerror && error !=0) {
                            $rootScope.position[0] = Math.round(templateRange[0] + i);
                            $rootScope.position[1] = Math.round(templateRange[1] + j);
                            moveX = i;
                            moveY = j;
                            maxerror = error;
                        }
                    }
                }
    
            }else{
                var src = cv.matFromImageData(imageData); //problem, something seems fulling , must have src.delete();
                var dst = new cv.Mat();
                //cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
                cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
                cv.threshold(src, dst, 90, 200, cv.THRESH_BINARY);

                console.log(dst.data);
                //var dst = src;

                //console.log(dst.data)

                //modified algorithm
                for (var i = 0; i <= (templateRange[2]-boxWidth); i++) {
                    for (var j = 0; j <= (templateRange[3] - boxHeight) ;j++){
                        // var imageData = ctx.getImageData((templateRange[0] + i),(templateRange[1] + j),boxWidth,boxHeight);
                        //var binary_x = Math.round(templateRange[0] + i);
                        //var binary_y = Math.round(templateRange[1] + j);
                        //var error1 = calculate(i,j);

                        var error1 = 0;
                        for(var xx = 0; xx < boxWidth; xx++){
                            for(var yy = 0; yy < boxHeight; yy++){
                                error1 += Math.abs(image1Trans[xx][yy] - image2Trans[xx+i][yy+j]);// * dst.data[(i+xx)*templateRange[2]+j+yy] / 200;
                            }
                        }
                         //console.log("626 :)")
                        var previous_x  = $rootScope.saveMove[$rootScope.saveMove.length-1][0];
                        var previous_y  = $rootScope.saveMove[$rootScope.saveMove.length-1][1];
                        var current_x   = templateRange[0] + i;
                        var current_y   = templateRange[1] + j;
                        //alert(current_x)
                        //alert(current_y)
                        var error2      = Math.sqrt((previous_x-current_x)*(previous_x-current_x)+(previous_y-current_y)*(previous_y-current_y));
    
                        var error3;


                        //alert(dst.data.length);

                        var summ = 0;
                        for (var ii = 0; ii<boxWidth; ii++) {
                            summ = summ + dst.data[i*templateRange[2]+j+ii] + dst.data[(i+1)*templateRange[2]+j+ii];  // top 2
                            summ = summ + dst.data[(i+ii)*templateRange[2]+j];  // left 1
                            summ = summ + dst.data[(i+ii+1)*templateRange[2]+j-1];  // right 1
                        }
                        if (summ > 100 ){
                            error1 = error1*999;
                        }
                        // else{
                        //     console.log(error1);
                        //     console.log(error2+error3);
                        // }


                        //console.log([previous_x,previous_y,current_x,current_y,error2])
                        if($rootScope.compareCount < 3){
                        //  error2 = 0;
                            error3 = 0;
                        }
                        else{
                            var a1 = $rootScope.saveMove[$rootScope.saveMove.length-2][0];
                            var a2 = $rootScope.saveMove[$rootScope.saveMove.length-2][1];
                            var b1 = $rootScope.saveMove[$rootScope.saveMove.length-1][0];
                            var b2 = $rootScope.saveMove[$rootScope.saveMove.length-1][1];
                            var c1 = templateRange[0] + i;
                            var c2 = templateRange[1] + j;
                            var component1 = ((a1-b1)-(b1-c1))*((a1-b1)-(b1-c1));
                            var component2 = ((a2-b2)-(b2-c2))*((a2-b2)-(b2-c2));
                            error3 = Math.sqrt(component1+component2);
                        }
    
                        error = (error1*10 + 40*error2 + 56*error3)/100;
                        //if contains foreground in above 2X10, max error
                        
    
                        if (error< maxerror && error !=0) {
                            $rootScope.position[0] = Math.round(templateRange[0] + i);
                            $rootScope.position[1] = Math.round(templateRange[1] + j);
                            moveX = i;
                            moveY = j;
                            maxerror = error;
                        }

                      
                     
                    }
                }
                console.log(maxerror);
                src.delete();
                dst.delete();
    
            }

            //alert(":)")
            

            var save = [$rootScope.position[0],$rootScope.position[1],video.currentTime];
            $rootScope.saveMove.push(save);

            var only_position = [Math.round($rootScope.position[0]+boxWidth/2), Math.round($rootScope.position[1]+boxHeight/2)];
            $rootScope.position_list.push(only_position);

            var temp = [];
            for (var i = 0; i < boxWidth; i++) {
                temp[i] = [];
                for (var j = 0; j < boxHeight; j++) {
                    temp[i][j] = image2Trans[i+moveX][j+moveY];
                };
            };

            //console.log( $rootScope.position_list )
            
            image1Trans = temp;
            // selectTemplate();
            drawBox();
            
            if($rootScope.currentView == "gravitropism"){
                drawInflectionBox();
                drawBoxLine();
            }
            
            drawAllDots();
            growList(only_position);
            // video.pause();
            $rootScope.compareCount += 1;

            setTimeout( arguments.callee, 50);
        }

        function selectTemplate(){
            console.log("SelectTemplate() invoked")
            var startPointX1    = Math.max(1,($rootScope.position[0] - range[0]));
            var startPointY1    = Math.max(1,($rootScope.position[1] -range[1]));
            var endPointX2      = Math.min(($rootScope.videoDimension.width - (range[0]+boxWidth)),($rootScope.position[0] + boxWidth + range[0]));
            var endPointY2      = Math.min(($rootScope.videoDimension.height - (range[1]+boxHeight)),($rootScope.position[1]+ boxHeight + range[1]));
            // var endPointX2   = Math.min((480 - (range[0]+boxWidth)),(position[0] + range[0]));
            // var endPointY2   = Math.min((360 - (range[1]+boxHeight)),(position[1] + range[1]));
            var rangeWidth      = endPointX2 - startPointX1;
            var rangeHeight     = endPointY2 - startPointY1;

            templateRange       = [startPointX1,startPointY1, rangeWidth, rangeHeight];

        }

        function drawAllDots(){
            console.log("drawAllDots() invoked")
            var ctx = canvas.getContext("2d");
            ctx.beginPath();
            ctx.strokeStyle         = "#28abe3";
            var i;
            for(i = 0; i < $rootScope.position_list.length-1; i++){
                ctx.fillRect($rootScope.position_list[i][0], $rootScope.position_list[i][1], 2, 2);
                ctx.moveTo($rootScope.position_list[i][0], $rootScope.position_list[i][1]);
                ctx.lineTo($rootScope.position_list[i+1][0], $rootScope.position_list[i+1][1]);
                ctx.lineWidth = 1;
            }
            ctx.stroke();
        }

        function growList(currentPosition){
            console.log("growList() init")
            $rootScope.diffx_list.push((currentPosition[0]-$rootScope.original_x)*$rootScope.distance);
            $rootScope.diffy_list.push(($rootScope.original_y-currentPosition[1])*$rootScope.distance);
            $rootScope.time_list.push( (video.currentTime * FPS) / $rootScope.framerate);
        }

        function calculate(i,j){
            //console.log("calculate() invoked ;)")
            var error = 0;
            //console.log([boxWidth,boxHeight])

            for(x = 0; x < boxWidth; x++){
                //console.log( "x "+x )
                for(y = 0; y < boxHeight; y++){
                    //console.log("y "+y)
                    error += Math.abs(image1Trans[x][y] - image2Trans[x+i][y+j]) * dst.data[(i+x)*templateRange[2]+j+y] / 200;
                    //console.log(error)
                }
            }

            return error;
        }

        var init = function(){
            if( $rootScope.planttracer_config.debugMode ){
                console.log("PLANT TRACER loaded")
            }

            video                           = document.getElementById('videoPlayer');
            canvas                          = document.getElementById("canvas");
            context                         = canvas.getContext('2d');
            context.imageSmoothingEnabled   = false;
            //$rootScope.startTime            = video.currentTime;
            //$rootScope.endTime              = video.duration;
        };

        if($rootScope.deviceLoaded){
            init();
        }
    }
]);
