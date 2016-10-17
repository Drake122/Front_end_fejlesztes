/**
 * Created by kovacs.sandor on 2016.08.22..
 */
app.controller('RegisterCtrl', ['$scope', '$http', function ($scope, $http){


    $scope.submitForm = function() {

        // check to make sure the form is completely valid
        if ($scope.userForm.$valid) {
            alert('our form is amazing');
        }

    };
    $scope.submitForm = function() {
        var name = $scope.user.name;
        var passw= $scope.user.password;
        var email= $scope.user.email;
        console.log(name);
        console.log(passw);
        console.log(email);
        $scope.toggle();

        var log={name: name,password: passw,email:email};
        var urlLogin = 'http://localhost:8080/user/newUser';
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
            if(response.data.success!="false"){
                console.log(response.data.success);
                $scope.loginName+=$scope.username;
                $scope.mainData.logs=response.data.success;

                console.log("LoginController+  $scope.mainData.logs"+ $scope.mainData.logs);
                //  $window.location.reload();
                $scope.regSuccess="Registration success!";
            }
        }, function errorCallback(response) {
            console.error(response);
        });

    }


    //$scope.reg = function () {
    //    console.log("usename: "+ $scope.username);
    //    var name = $scope.username;
    //    var passw= $scope.password;
    //    var email= $scope.email;
    //    console.log(name);
    //    console.log(passw);
    //    console.log(email);
    //    $scope.toggle();
    //
    //    var log={name: name,password: passw,email:email};
    //    var urlLogin = 'http://localhost:8080/user/newUser';
    //    var jsonData = angular.toJson(log);
    //    // console.log(jsonData);
    //    $http({
    //        method : 'POST',
    //        url: urlLogin,
    //        headers: {
    //            'Content-Type': 'application/json; charset=utf-8'
    //        },
    //        data: jsonData
    //
    //    }).then(function successCallback(response) {
    //        console.log(response.data.valasz);
    //        if(response.data.success!="false"){
    //            console.log(response.data.success);
    //            $scope.loginName+=$scope.username;
    //            $scope.mainData.logs=response.data.success;
    //
    //            console.log("LoginController+  $scope.mainData.logs"+ $scope.mainData.logs);
    //            //  $window.location.reload();
    //        $scope.regSuccess="Registration success!";
    //
    //        }
    //    }, function errorCallback(response) {
    //        console.error(response);
    //    });
    //
    //};

$scope.cancel = function(){
    $scope.toggle();

}

}]);;