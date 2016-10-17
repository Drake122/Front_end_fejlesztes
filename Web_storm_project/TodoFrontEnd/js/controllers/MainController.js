app.controller('MainController', function($scope, $rootScope) {
    $scope.mainData = {
        logs: 'a'
    };



    $scope.$on('eventEmitedName', function(event, data) {
        $scope.mainData.logs = $scope.mainData.logs + '\nMainController - receive EVENT "' + event.name + '" with message = "' + data.message + '"';
        console.log("MainController data.message: "+ data.message);
    });


    $rootScope.$on('eventEmitedName', function(event, data) {
        $scope.mainData.logs = $scope.mainData.logs + '\n$rootScope - receive EVENT "' + event.name + '" with message = "' + data.message + '"';
    });
})
