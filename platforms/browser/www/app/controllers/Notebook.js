/*--------------------PLANT TRACER 2.0----------------------
    Designed and Developed by NYU CREATE (c) 2017 - 2018
-----------------------------------------------------------*/
/**
 * Notebook handles the Notebook
 */
app.controller('Notebook', ['$rootScope', '$scope', '$http', 'DATAVAULT', 'GLOBAL', '$state', '$stateParams',
    function($rootScope, $scope, $http, DATAVAULT, GLOBAL, $state, $stateParams){
       
        var resetEvents = function(){
            $("#save_input").unbind("click");
            $scope.$destroy();
        }

        $scope.$on("$destroy", function(){
            $scope.openNotebook()
        })

        var eventMgr = function(){
            console.log("events loaded notebook")
            resetEvents();
            $("#save_input").click( function(){
               // alert("saving")
                var researcherEmail = $("#researcher").val();

                if($("#researcher").val() != "" && $("#experimentName").val() != "" && $("#accession").val() != "" &&  $("#geneName").val() != "" &&  $("#geneID").val() != "" ){
                    
                    if(researcherEmail.indexOf("@") != -1 && researcherEmail.indexOf(".") != -1 ){

                        var filename = $("#researcher").val()+"_"+$("#accession").val()+"_"+$("#geneName").val()+"_"+$("#geneID").val();
                        DATAVAULT.saveTrackingData( filename );
                        //DATAVAULT.saveVideo()
                      // DATAVAULT.saveVideo().then( function( data, status ){
                           // alert([data, status])
                            //console.log([data, status])
                            //alert([device.uuid, $("#researcher").val(), $("#accession").val(), $("#geneName").val(), $("#geneID").val(), $rootScope.currentView, $rootScope.rateDis, $rootScope.amplitudeDis, $rootScope.angle, "video", $rootScope.time_list, $rootScope.diffx_list, $rootScope.diffy_list])
                            if(isNaN($rootScope.rateDis)){
                                $rootScope.rateDis = 0;
                            }

                            if(isNaN($rootScope.amplitudeDis)){
                                $rootScope.amplitudeDis = 0;
                            }
                            DATAVAULT.uploadDatatoDatabase( device.uuid, $("#researcher").val(), $("#experimentName").val(), $("#accession").val(), $("#geneName").val(), $("#geneID").val(), $rootScope.currentView, $rootScope.rateDis, $rootScope.amplitudeDis, $rootScope.angle, "video", $rootScope.time_list, $rootScope.diffx_list, $rootScope.diffy_list);
                            setTimeout( function(){
                                $("#notebook").hide();
                                $rootScope.$broadcast("ResetVariables");
                                $state.transitionTo( "menu", {}, {location:true, notify:true, reload:true});
                            }, 1000);
                       // });
                    }else{
                        alert("Please use a valid email address")
                    }

                }else{
                    alert("Please provide all the information in the form")
                }
            });

            $("#close_notebook").click( function(){
                $("#notebook").hide();
            });
        }

        $scope.openNotebook = $rootScope.$on("openNotebook", function(){
            $("#notebook").show();
            init();
        });

         var init = function(){

            eventMgr();
        };

    }
]);
