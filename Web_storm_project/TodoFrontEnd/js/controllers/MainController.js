app.controller('MainCtrl', ['$scope', '$http', '$log', function ($scope, $http,  $log) {
    $scope.gridOptions = {     modifierKeysToMultiSelectCells: true,
        showGridFooter: true };



    $scope.gridOptions.columnDefs = [
        { name: 'idtask', enableCellEdit: false, width: '5%' },
        { name: 'label', displayName: 'Label (editable)', width: '10%' },
        { name: 'description',displayName:'Description (editable)', width: '30%' },
        { name: 'status', displayName: 'Status', type:'number',width:'10%'},
        { name: 'startTime', displayName: 'startTime' , type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '20%' },
        { name: 'finishTime', displayName: 'finishTime' , type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '20%' },
        { name: 'priority', displayName: 'Priority', type:'number',width:'10%'},
        { name: 'responsible', displayName: 'responsible', type:'number',width:'10%'},
        { name: 'userCollection', displayName: 'Users', type: 'object', enableCellEdit: false, width: '20%' }




    ];

    $scope.msg = {};

    $scope.gridOptions.onRegisterApi = function(gridApi){
        //set gridApi on scope
        $scope.gridApi = gridApi;



        gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
            $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.idtask + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
            console.log(rowEntity);
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


}]);