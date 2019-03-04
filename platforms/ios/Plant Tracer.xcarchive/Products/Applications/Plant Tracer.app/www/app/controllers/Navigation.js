/*
-------------------- D.R.E.A.M. 3.0 -------------------------
    Designed and Developed by NYU CREATE (c) 2014 - 2018
-----------------------------------------------------------
*/
/**
 * Navigation handles the Navigation
 */
app.controller('Navigation', ['$rootScope', '$scope', '$http', 'DATAVAULT', 'GLOBAL', '$state', '$stateParams',
    function($rootScope, $scope, $http, DATAVAULT, GLOBAL, $state, $stateParams){

        var init = function(){
            if( $rootScope.nav_config.debugMode ){
                console.log("Navigation loaded")
            }
        }();

    }

]);
