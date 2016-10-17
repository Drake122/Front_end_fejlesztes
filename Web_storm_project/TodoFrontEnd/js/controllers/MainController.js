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
        //set gridApi on scope
        $scope.gridApi = gridApi;

        gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
            $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.idtask + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
            console.log(rowEntity);
           // console.log($scope.statuses);
            $scope.$apply();
        });
    };

    $http.get('http://localhost:8080/task/allTask')
        .success(function(data) {

            $scope.gridOptions.data = data;
        });
    $scope.info = {};

    $scope.getCurrentSelection = function() {
        var values = [];
        var currentSelection = $scope.gridApi.cellNav.getCurrentSelection();
        for (var i = 0; i < currentSelection.length; i++) {
            values.push(currentSelection[i].row.entity[currentSelection[i].col.name])
        }
        $scope.printSelection = values.toString();
    };
    $scope.user = {
        status: [2, 3]
    };

    $http.get('http://localhost:8080/user/allUser')
        .success(function(data) {
            console.log(data);

        });

    $scope.statuses = [
        {value: 1, text: 'status1'},
        {value: 2, text: 'status2'},
        {value: 3, text: 'status3'}
    ];

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
