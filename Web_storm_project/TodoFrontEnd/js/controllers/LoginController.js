/**
 * Created by kovacs.sandor on 2016.08.04..
 */
app.controller('LoginController', ['$scope', '$http', function ($scope, $http){

    //$scope.parentData = {
    //    message: 'messageAAA'
    //};
    //
    //$scope.broadcastEvent = function() {
    //    $scope.$broadcast('eventBroadcastedName', $scope.parentData);
    //};
    //
    //$scope.$on('eventEmitedName', function(event, data) {
    //    $scope.mainData.logs = $scope.mainData.logs + '\nParentController - receive EVENT "' + event.name + '" with message = "' + $scope.parentData.message + '"';
    //});
    //
    //$scope.$on('eventEmitedName', function(event, data) {
    //    $scope.mainData.logs = $scope.mainData.logs + '\nParentController - receive EVENT "' + event.name + '" with message = "' + data.message + '"';
    //});

   // console.log("loginController$scope.parentData.message:" +$scope.parentData.message);
    console.log("LoginController+  $scope.mainData.logs"+ $scope.mainData.logs);
    $scope.regSuccess="";
    $scope.loginName=" dear ";

    $scope.login = function () {
        console.log("usename: "+ $scope.username);
        var name = $scope.username;
        var passw= $scope.password;

       // console.log(name);
       // console.log(passw);

        var log={username: name,password: passw};
        var urlLogin = 'http://localhost:8080/user/login';
        var jsonData = angular.toJson(log);
       // console.log(jsonData);
        $http({
            method : 'POST',
            url: urlLogin,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            data: jsonData

        }).then(function successCallback(response) {
            console.log(response.data.valasz);
            $scope.mainData.logs=response.data.valasz;
            if(response.data.valasz > 0){
                console.log(response.data.valasz);
                $scope.loginName+=$scope.username;


                console.log("LoginController+  $scope.mainData.logs"+ $scope.mainData.logs);
              //  $window.location.reload();
        $scope.toggeLogin();
            }
        }, function errorCallback(response) {
            console.error(response);
        });

      
    };
  /*  app.controller('logged'['$scope', '$rootscope', function($scope, $rootscope){
        $rootscope.showBanner= false;

    }])*/
    $scope.regButtonHide=false;
    $scope.regHide=true;
    $scope.hideLogin =false;
    $scope.logoutHide=true;
    $scope.toggle = function() {
        $scope.hideLogin = !$scope.hideLogin;
        $scope.regHide = !$scope.regHide;
    $scope.regButtonHide = !$scope.regButtonHide;

    };
    $scope.toggeLogin = function(){
        $scope.hideLogin = !$scope.hideLogin;
        $scope.logoutHide = ! $scope.logoutHide;
        $scope.regButtonHide = ! $scope.regButtonHide;
    }


    $scope.logout = function(){

        $scope.toggeLogin();
        $scope.mainData.logs=-1;
    }
}]);