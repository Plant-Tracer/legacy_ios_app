/*--------------------PLANT TRACER 2.0----------------------
    Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/

/**
 * Footer handles the Footer
 */
app.controller('Footer', ['$rootScope', '$scope', '$http', 'DATAVAULT', 'GLOBAL', '$state', '$stateParams',
    function($rootScope, $scope, $http, DATAVAULT, GLOBAL, $state, $stateParams){

    	$rootScope.$on("deviceReady", function(event, data){
            console.log("Footer: DEVICE READY SIGNAL RECEIVED");
            init();
        });

    	$rootScope.$on("showFooter", function(event, data){
            console.log("Footer: SHOW SIGNAL RECEIVED");
            console.log("Showing footer")
            if(!$rootScope.isFooterUp){
            	 $("footer").animate({bottom : "+=100px"})
            	 $rootScope.isFooterUp = true;
            }
        });

        $rootScope.$on("hideFooter", function(event, data){
            console.log("Footer: HIDE SIGNAL RECEIVED");
            console.log("Hiding footer");
            if($rootScope.isFooterUp){
            	 $("footer").animate({bottom : "-=100px"});
            	 $rootScope.isFooterUp = false;
            }
           
        });

        var eventMgr = function(){
        	resetEvents();

        	$(".footer_step").click( function(){
        		//alert($(this).attr("name"))
        		

        		// switch($(this).attr("name")){
        		// 	case "1":
        		// 		if($rootScope.step1Complete){$rootScope.stepID = $(this).attr("name"); $rootScope.$broadcast("updateState");}
        		// 		break;
        		// 	case "2":
        		// 		if($rootScope.step2Complete){$rootScope.stepID = $(this).attr("name"); $rootScope.$broadcast("updateState");}
        		// 		break;
        		// 	case "3":
        		// 		if($rootScope.step3Complete){$rootScope.stepID = $(this).attr("name"); $rootScope.$broadcast("updateState");}
        		// 		break;
        		// 	case "5":
        		// 		if($rootScope.step5Complete){$rootScope.stepID = $(this).attr("name"); $rootScope.$broadcast("updateState");}
        		// 		break;
        		// 	case "6":
        		// 		if($rootScope.step6Complete){$rootScope.stepID = $(this).attr("name"); $rootScope.$broadcast("updateState");}
        		// 		break;
        		// 	case "7":
        		// 		if($rootScope.step7Complete){$rootScope.stepID = $(this).attr("name"); $rootScope.$broadcast("updateState");}
        		// 		break;
        		// }

        		


        	});
        }

        var resetEvents = function(){
        	$(".footer_step").unbind("click")
        }
        


        var init = function(){
            if( $rootScope.footer_config.debugMode ){
                console.log("Footer loaded")
            }
            $("#footer").css("top", "-100px");

            eventMgr();

            if( $rootScope.currentView == "circumnutation"){
                $("#inflection").parent().hide();
            }
        }

        if($rootScope.deviceLoaded){
            init();
        }

    }

]);
