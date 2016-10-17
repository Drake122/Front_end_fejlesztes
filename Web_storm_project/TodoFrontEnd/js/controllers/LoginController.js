/**
 * Created by kovacs.sandor on 2016.08.04..
 */
app.controller('LoginController', ['productService','$scope', '$http', function ($scope, $http){

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
            $scope.$emit('login',response.data.valasz);
            if(response.data.valasz=="ok"){
                console.log(response.data.valasz);
                $scope.loginName+=$scope.username;
                $scope.callToAddToProductList($scope.loginName);


            }
        }, function errorCallback(response) {
            console.error(response);
        });

    };
    app.controller('ProductController', function($scope, productService) {
        $scope.callToAddToProductList = function(currObj){
            productService.addProduct(currObj);
        };
    });

}]);