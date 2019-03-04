/*--------------------PLANT TRACER 2.0----------------------
    Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/
/**
 * Graph handles the graph view
 */
app.controller('Graph', ['$rootScope', '$scope', '$http', 'DATAVAULT', 'GLOBAL', '$state', '$stateParams',
    function($rootScope, $scope, $http, DATAVAULT, GLOBAL, $state, $stateParams){

        var FPS             = 20;
        $rootScope.rateDis  = 0;;
        $rootScope.amplitudeDis = 0;
        
        $rootScope.$on("deviceReady", function(event, data){
            console.log("VP: DEVICE READY SIGNAL RECEIVED");
            init();
        });

        $rootScope.$on("showResults", function(event, data){
            
             $("#graph").show();
             showResult()
        });

        $("#close_graph_btn").click( function(){
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

        // function showResult(){
        //     var title = '';
        //     if($rootScope.currentView == 'gravitropism'){title = "Gravitropism";
        //     }else{title = "Circumnutation";}

        //     $("#result_graph_title1").html("X-axis ("+title+")");
        //     $("#result_graph_title2").html("Y-axis ("+title+")");

        //     if($rootScope.currentView == "gravitropism"){


        //         var minValue = $rootScope.saveMove[0][1];
        //         var maxValue = $rootScope.saveMove[$rootScope.saveMove.length-1][1];
        //         var minTime = $rootScope.saveMove[0][2];
        //         var maxTime = $rootScope.saveMove[$rootScope.saveMove.length-1][2];
        //         var minXValue = $rootScope.saveMove[0][0];
        //         var maxXValue = $rootScope.saveMove[$rootScope.saveMove.length-1][0];

        //         var b = Math.sqrt((minXValue - $rootScope.inflectionPos[0])*(minXValue - $rootScope.inflectionPos[0])+ (minValue - $rootScope.inflectionPos[1])*(minValue - $rootScope.inflectionPos[1]));
        //         var c = Math.sqrt((maxXValue - $rootScope.inflectionPos[0])*(maxXValue - $rootScope.inflectionPos[0])+ (maxValue - $rootScope.inflectionPos[1])*(maxValue - $rootScope.inflectionPos[1]));
        //         var a = Math.sqrt((maxXValue - minXValue)*(maxXValue - minXValue)+  (maxValue - minValue)* (maxValue - minValue));

        //         var cosAngle = (b*b + c*c - a*a)/2/b/c;
        //         //alert(cosAngle);
        //         angle = (Math.acos(cosAngle) * 180 / Math.PI).toFixed(4);
        //         var angleStr = "Angle: " + angle + " degree";
        //         //alert(angle)

        //         $rootScope.angle        = angle;
        //         var timeRate            = Math.abs(maxTime - minTime);
        //         var actualTime          = timeRate * FPS / $rootScope.framerate;
        //         // max amplitude = movement = last - first 
        //         var maxAmplitude        = Math.sqrt(($rootScope.saveMove[$rootScope.saveMove.length-1][1]-$rootScope.saveMove[0][1])*($rootScope.saveMove[$rootScope.saveMove.length-1][1]-$rootScope.saveMove[0][1])+($rootScope.saveMove[$rootScope.saveMove.length-1][0]-$rootScope.saveMove[0][0])*($rootScope.saveMove[$rootScope.saveMove.length-1][0]-$rootScope.saveMove[0][0]));
        //       //  ($rootScope.saveMove[$rootScope.saveMove.length-1][1]-$rootScope.saveMove[0][1])*($rootScope.saveMove[$rootScope.saveMove.length-1][1]-$rootScope.saveMove[0][1])
        //       //  +($rootScope.saveMove[$rootScope.saveMove.length-1][2]-$rootScope.saveMove[0][2])*($rootScope.saveMove[$rootScope.saveMove.length-1][2]-$rootScope.saveMove[0][2])

        //     }else{
        //         $rootScope.angle = 0;



        //   //  alert($rootScope.saveMove)

        //     for (var i = 0; i < $rootScope.saveMove.length; i++) {
        //         if($rootScope.saveMove[i][0] < minXValue){
        //          //   minValue        = $rootScope.saveMove[i][1];
        //             minTime         = $rootScope.saveMove[i][2];
        //             minXValue       = $rootScope.saveMove[i][0];
        //         }
        //         if($rootScope.saveMove[i][0] > maxXValue){
        //          //   maxValue        = $rootScope.saveMove[i][1];
        //             maxTime         = $rootScope.saveMove[i][2];
        //             maxXValue       = $rootScope.saveMove[i][0];
        //         }
        //     }

        //     //alert([maxValue, minValue, maxValue - minValue, $rootScope.framerate])
        //     var maxAmplitude        = maxXValue - minXValue;
        //     var timeRate            = Math.abs(maxTime - minTime);
        //    // alert([maxAmplitude,timeRate])
        //     //20 is defined
        //     var actualTime          = timeRate * FPS / $rootScope.framerate;
        //         // max amplitude here or above
        //         // average amplitude here
        //     }
        //     //canvas.style.display    = "";
        //     $("#graph").show();
        //     //document.getElementById("graph").style.display = "";
        //    // alert($rootScope.distance)
        //     if( $rootScope.distance == 0){
                
        //         var ratePixel       = (maxAmplitude/ actualTime.toFixed(2)).toFixed(4);
        //         var ratePixel       = "Rate: " + ratePixel+ " pixel/min";

        //         if($rootScope.currentView == "gravitropism"){
        //             var amplitudeDisStr    = "Distance: " + maxAmplitude + " pixel";
        //             document.getElementById("result_amplitude").innerHTML   = amplitudeDisStr + "; "+rateDisStr + "; "+angleStr;
        //         }else{
        //             var amplitudeDisStr    = "Max Amplitude: " + maxAmplitude + " pixel";
        //             document.getElementById("result_amplitude").innerHTML   = amplitudeDisStr + "; "+rateDisStr;
        //         }
        //         //document.getElementById("result_rate").innerHTML        = ratePixel;
        //         //alert();
        //          //alert(ratePixel);
        //     }else{
        //       // alert($rootScope.distance)
        //         $rootScope.amplitudeDis         = (maxAmplitude * $rootScope.distance).toFixed(4);
        //         $rootScope.rateDis              = ($rootScope.amplitudeDis/ actualTime.toFixed(2)).toFixed(4);
        //         var rateDisStr                  = "Rate: " + $rootScope.rateDis + " mm/min";

        //        // alert([ $rootScope.amplitudeDis,$rootScope.rateDis ])
        //         if($rootScope.currentView == "gravitropism"){
        //             var amplitudeDisStr             = "Distance: " + $rootScope.amplitudeDis + " mm";
        //             document.getElementById("result_amplitude").innerHTML   = amplitudeDisStr + "; <br> "+rateDisStr+ "; <br> "+angleStr+ "; <br><br> ";
        //         }else{
        //             var amplitudeDisStr             = "Max Amplitude: " + $rootScope.amplitudeDis + " mm";
        //             document.getElementById("result_amplitude").innerHTML   = amplitudeDisStr + "; <br> "+rateDisStr+ "; <br><br> ";
        //         }
        //         //document.getElementById("result_rate").innerHTML        = rateDisStr;
        //         //alert(rateDisStr);
        //         //alert(amplitudeDisStr);
        //     }

        //     drawCharts();

        // }
        function showResult(){
            console.log("showing results");
           // controlIcon(6);

           var title = '';
            if($rootScope.currentView == 'gravitropism'){title = "Gravitropism";}else{title = "Circumnutation";}

            $("#result_graph_title1").html("X-axis ("+title+")");
            $("#result_graph_title2").html("Y-axis ("+title+")");
            if($rootScope.currentView == "gravitropism"){
                var minValue = $rootScope.saveMove[0][1];
                var maxValue = $rootScope.saveMove[$rootScope.saveMove.length-1][1];
                var minTime = $rootScope.saveMove[0][2];
                var maxTime = $rootScope.saveMove[$rootScope.saveMove.length-1][2];
                var minXValue = $rootScope.saveMove[0][0];
                var maxXValue = $rootScope.saveMove[$rootScope.saveMove.length-1][0];

                var b = Math.sqrt((minXValue - $rootScope.inflectionPos[0])*(minXValue - $rootScope.inflectionPos[0])+ (minValue - $rootScope.inflectionPos[1])*(minValue - $rootScope.inflectionPos[1]));
                var c = Math.sqrt((maxXValue - $rootScope.inflectionPos[0])*(maxXValue - $rootScope.inflectionPos[0])+ (maxValue - $rootScope.inflectionPos[1])*(maxValue - $rootScope.inflectionPos[1]));
                var a = Math.sqrt((maxXValue - minXValue)*(maxXValue - minXValue)+  (maxValue - minValue)* (maxValue - minValue));

                var cosAngle = (b*b + c*c - a*a)/2/b/c;
                //alert(cosAngle);
                angle = (Math.acos(cosAngle) * 180 / Math.PI).toFixed(1);
                var angleStr = "Angle: " + angle + " degree";
                //alert(angle)

                $rootScope.angle = angle;
                var timeRate            = Math.abs(maxTime - minTime);
                var actualTime          = timeRate * FPS / $rootScope.framerate;
                // max amplitude = movement = last - first 
                var maxAmplitude = Math.sqrt(($rootScope.saveMove[$rootScope.saveMove.length-1][1]-$rootScope.saveMove[0][1])*($rootScope.saveMove[$rootScope.saveMove.length-1][1]-$rootScope.saveMove[0][1])+($rootScope.saveMove[$rootScope.saveMove.length-1][0]-$rootScope.saveMove[0][0])*($rootScope.saveMove[$rootScope.saveMove.length-1][0]-$rootScope.saveMove[0][0]));
              //  ($rootScope.saveMove[$rootScope.saveMove.length-1][1]-$rootScope.saveMove[0][1])*($rootScope.saveMove[$rootScope.saveMove.length-1][1]-$rootScope.saveMove[0][1])
              //  +($rootScope.saveMove[$rootScope.saveMove.length-1][2]-$rootScope.saveMove[0][2])*($rootScope.saveMove[$rootScope.saveMove.length-1][2]-$rootScope.saveMove[0][2])

            }else{
                $rootScope.angle = 0;
                var minValue = 100000;
                var maxValue = 0;
                var minTime = 0;
                var maxTime = 0;

            console.log($rootScope.saveMove)

            for (var i = 0; i < $rootScope.saveMove.length; i++) {
                if($rootScope.saveMove[i][0] < minValue){
                    minTime         = $rootScope.saveMove[i][2];
                    minValue       = $rootScope.saveMove[i][0];
                }
                if($rootScope.saveMove[i][0] > maxValue){
                 //   maxValue        = $rootScope.saveMove[i][1];
                    maxTime         = $rootScope.saveMove[i][2];
                    maxValue       = $rootScope.saveMove[i][0];
                }
            }

            //alert([maxValue, minValue, maxValue - minValue, $rootScope.framerate])
            var maxAmplitude        = maxValue - minValue;
            var timeRate            = Math.abs(maxTime - minTime);

            //20 is defined
            var actualTime          = timeRate * FPS / $rootScope.framerate;
                // max amplitude here or above
                // average amplitude here
            }
            //canvas.style.display    = "";
            $("#graph").show();
            //document.getElementById("graph").style.display = "";

            if( $rootScope.distance == 0){
                
                var ratePixel       = (maxAmplitude/ actualTime.toFixed(2)).toFixed(1);
                var ratePixel       = "Rate: " + ratePixel+ " pixel/min";

                if($rootScope.currentView == "gravitropism"){
                    var amplitudeDisStr    = "Distance: " + maxAmplitude + " pixel";
                    document.getElementById("result_amplitude").innerHTML   = amplitudeDisStr + "; <br> "+rateDisStr + "; <br>"+angleStr+ "; <br><br> ";
                }else{
                    var amplitudeDisStr    = "Max Amplitude: " + maxAmplitude + " pixel";
                    document.getElementById("result_amplitude").innerHTML   = amplitudeDisStr + "; <br>"+rateDisStr+ "; <br><br> ";
                }
                //document.getElementById("result_rate").innerHTML        = ratePixel;
                //alert();
                 //alert(ratePixel);
            }else{
               // alert($rootScope.distance)
                $rootScope.amplitudeDis         = (maxAmplitude * $rootScope.distance).toFixed(1);
                $rootScope.rateDis              = ($rootScope.amplitudeDis/ actualTime.toFixed(2)).toFixed(1);
                var rateDisStr                  = "Rate: " + $rootScope.rateDis + " mm/min";

                if($rootScope.currentView == "gravitropism"){
                    var amplitudeDisStr             = "Distance: " + $rootScope.amplitudeDis + " mm";
                    document.getElementById("result_amplitude").innerHTML   = amplitudeDisStr + "; <br>"+rateDisStr+ "; <br>"+angleStr+ "; <br><br> ";
                }else{
                    var amplitudeDisStr             = "Max Amplitude: " + $rootScope.amplitudeDis + " mm";
                    document.getElementById("result_amplitude").innerHTML   = amplitudeDisStr + ";<br> "+rateDisStr+ "; <br><br> "
                }
                //document.getElementById("result_rate").innerHTML        = rateDisStr;
                //alert(rateDisStr);
                //alert(amplitudeDisStr);
            }

            drawCharts();

        }

        function drawCharts(){

            var i;
            for(i = 0; i < $rootScope.time_list.length; i++){
                $rootScope.original_time[i] = $rootScope.time_list[i];
            }

            var stepSize        = parseInt($rootScope.time_list.length / 10);

            for(i = 0; i < $rootScope.time_list.length; i++){
                if(i % stepSize != 0){ 
                    $rootScope.time_list[i] = '';
                 }else{ 
                    console.log($rootScope.time_list[i])
                    $rootScope.time_list[i] = $rootScope.time_list[i].toFixed(2);
                }
            }
            drawXChart();
            drawYChart();
            //alert($rootScope.time_list)
        }

        function drawXChart(){

            var screenwidth = screen.width;
            var data = {
                labels: $rootScope.time_list,
                series: [
                    $rootScope.diffx_list
                ]
            };
            var options ={
                chartPadding: {
                    left:7
                },
                width: screenwidth*0.92,
                height: screenwidth*0.5625,
                showPoint: false,
                plugins: [
                            Chartist.plugins.ctAxisTitle({
                                axisX: {
                                    axisTitle: 'Time (mins)',
                                    axisClass: 'ct-axis-title',
                                    offset: {
                                        x: 0,
                                        y: 30
                                    },
                                    textAnchor: 'middle'
                                },
                                axisY: {
                                    axisTitle: 'Distance(mm)',
                                    axisClass: 'ct-axis-title',
                                    offset: {
                                        x: 0,
                                        y: -2
                                    },
                                    flipTitle: false,
                                    textAnchor: 'middle'
                                }
                            })
                        ]
            }
            new Chartist.Line('.ct-chart_x', data, options);
        }
        function drawYChart(){
            var screenwidth = screen.width;
            var data = {
                labels: $rootScope.time_list,
                series: [
                    $rootScope.diffy_list
                ]
            };
            var options ={
                chartPadding: {
                    left:7
                },
                width: screenwidth*0.92,
                height: screenwidth*0.5625,
                showPoint: false,
                plugins: [
                            Chartist.plugins.ctAxisTitle({
                                axisX: {
                                    axisTitle: 'Time (mins)',
                                    axisClass: 'ct-axis-title',
                                    offset: {
                                        x: 0,
                                        y: 30
                                    },
                                    textAnchor: 'middle'
                                },
                                axisY: {
                                    axisTitle: 'Distance(mm)',
                                    axisClass: 'ct-axis-title',
                                    offset: {
                                        x: 0,
                                        y: -2
                                    },
                                    flipTitle: false,
                                    textAnchor: 'middle'
                                }
                            })
                        ]
            }
            new Chartist.Line('.ct-chart_y', data, options);
            // alert("FINISH");
        }

    	var init = function(){
            if( $rootScope.graph_config.debugMode ){
                console.log("GRAPH LOADED")
            }
           // video                           = document.getElementById('videoPlayer');
            //canvas                          = document.getElementById("canvas");
            //context                         = canvas.getContext('2d');
            //context.imageSmoothingEnabled   = false;
        };

        if($rootScope.deviceLoaded){
            init();
        }
    }
]);
