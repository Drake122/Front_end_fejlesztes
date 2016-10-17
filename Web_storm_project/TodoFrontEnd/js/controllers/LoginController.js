/**
 * Created by kovacs.sandor on 2016.08.04..
 */
app.controller('LoginController', ['$scope', '$http','myFactoryService', function ($scope, $http,myFactoryService){

    myFactoryService.setData("false");

    $scope.loginName=" kedves ";

    $scope.login = function () {
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
               // console.log(response.data.valasz);
                $scope.loginName+=$scope.username;
                myFactoryService.setData("minden ok");

            }
        }, function errorCallback(response) {
            console.error(response);
        });

    };


}]);