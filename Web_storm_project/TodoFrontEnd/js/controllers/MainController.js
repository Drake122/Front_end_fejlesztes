app.controller('MainCtrl', ['$scope', '$http', '$log', function ($scope, $http,  $log) {
    $scope.gridOptions = {     modifierKeysToMultiSelectCells: true,
        showGridFooter: true };



    $scope.gridOptions.columnDefs = [
        { name: 'idtask', enableCellEdit: false, width: '2%' },
        { name: 'label', displayName: 'Label (editable)', width: '5%' },
        { name: 'description',displayName:'Description (editable)', width: '30%' },
        { name: 'status', displayName: 'Status', type:'number',width:'10%'},
        { name: 'startTime', displayName: 'startTime' , type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '10%' },
        { name: 'finishTime', displayName: 'finishTime' , type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '10%' },
        { name: 'priority', displayName: 'Priority', type:'number',width:'6%'},
        { name: 'responsible', displayName: 'responsible', type:'number',width:'7%'},
        { name: 'userCollection', displayName: 'Users', type: 'object', enableCellEdit: false, width: '20%' }
    ];

    $scope.msg = {};

    $scope.gridOptions.onRegisterApi = function(gridApi){
        $scope.gridApi = gridApi;
        gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
            $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.idtask + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
            $scope.$apply();
        });
    };

    $http.get('http://localhost:8080/task/allTask')
        .success(function(data) {
            $scope.gridOptions.data = data;
        });

    $scope.info = {};

    $scope.user = {status: []};

    $scope.getCurrentSelection = function() {
        $scope.user = {status: []};
        var values = [];
        var currentSelection = $scope.gridApi.cellNav.getCurrentSelection();
            values.push(currentSelection[0].row.entity[currentSelection[0].col.name]);
        $scope.printSelection = values.toString();
        angular.forEach(currentSelection[0].row.entity.userCollection, function (val,key) {
            $scope.user.status.push(val);
        })
    };


    $scope.statuses = [];

    $http.get('http://localhost:8080/user/allUser')
        .success(function(data) {
          //  console.log( $scope.statuses);
        $scope.allUsers=data;
            angular.forEach($scope.allUsers, function (u) {
                var value =u.iduser;     var text = u.name;
                var user =  {value:value, text:text};
               $scope.statuses.push( user);
            })
        });

    $scope.showStatus = function() {
        var selected = [];
        angular.forEach($scope.statuses, function(s) {
            if ($scope.user.status.indexOf(s.value) >= 0) {
                selected.push(s.text);
            }
        });
        return selected.length ? selected.join(', ') : 'Not set';
    };

}]);
