/*--------------------PLANT TRACER 2.0----------------------
    Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/
/**
 * Home handles the Home
 */
app.controller('Home', ['$rootScope', '$scope', '$http', 'DATAVAULT', 'GLOBAL', '$state', '$stateParams',
    function($rootScope, $scope, $http, DATAVAULT, GLOBAL, $state, $stateParams){

        $rootScope.$on("deviceReady", function(event, data){
            console.log("DEVICE READY SIGNAL RECEIVED");

            console.log()
        });

    	$scope.saveData = function(){
            var x = $("#data").val();
            if( $rootScope.offline ){
                console.warn("Device is offline, data will be saved locally");
                DATAVAULT.insertData( x );
            }else{
                console.warn("Device is online, data will be saved locally and will also synchronize with cloud ;)");
                DATAVAULT.test().then(function(data, status){
                    console.log(data)
                })
            }
            
        }

        $scope.showData = function(){
            data = {}
            console.log( "loading data, please be patient...");
            if( GLOBAL.selectData(data) ){
                setTimeout( function(){ 
                    $scope.rows = $rootScope.q.rows;
                    console.log( $rootScope.q.rows );

                },150);
            }
        }

        $scope.clearWebSql = function(){
            console.log("deleting records")
            GLOBAL.clearDatabase();
        }  




        var init = function(){
            if( $rootScope.home_config.debugMode ){
                console.log("Home loaded")
            }

            console.log("test")
        }();
    }
]);
