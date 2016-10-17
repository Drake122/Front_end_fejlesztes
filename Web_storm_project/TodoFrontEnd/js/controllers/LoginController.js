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

    $scope.loginName=" kedves ";

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
            if(response.data.valasz=="ok"){
                console.log(response.data.valasz);
                $scope.loginName+=$scope.username;
                $scope.mainData.logs=$scope.username;
                console.log("LoginController+  $scope.mainData.logs"+ $scope.mainData.logs);


            }
        }, function errorCallback(response) {
            console.error(response);
        });

    };
  /*  app.controller('logged'['$scope', '$rootscope', function($scope, $rootscope){
        $rootscope.showBanner= false;

    }])*/

}]);