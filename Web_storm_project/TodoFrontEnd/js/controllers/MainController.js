app.controller('MainCtrl', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
    $scope.gridOptions = {  };

    $scope.storeFile = function( gridRow, gridCol, files ) {
        // ignore all but the first file, it can only select one anyway
        // set the filename into this column
        gridRow.entity.filename = files[0].name;

        // read the file and set it into a hidden column, which we may do stuff with later
        var setFile = function(fileContent){
            gridRow.entity.file = fileContent.currentTarget.result;
            // put it on scope so we can display it - you'd probably do something else with it
            $scope.lastFile = fileContent.currentTarget.result;
            $scope.$apply();
        };
        var reader = new FileReader();
        reader.onload = setFile;
        reader.readAsText( files[0] );
    };

    $scope.gridOptions.columnDefs = [
        { name: 'idtask', enableCellEdit: false, width: '5%' },
        { name: 'label', displayName: 'Label (editable)', width: '10%' },
        { name: 'description',displayName:'Description (editable)', width: '30%' },
        { name: 'status', displayName: 'Status', type:'number',width:'10%'},
        { name: 'startTime', displayName: 'startTime' , type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '20%' },
        { name: 'finishTime', displayName: 'finishTime' , type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '20%' },
        { name: 'priority', displayName: 'Priority', type:'number',width:'10%'},
        { name: 'responsible', displayName: 'responsible', type:'number',width:'10%'},
        { name: 'userCollection', displayName: 'Users', type: 'object', width: '20%' },


    ];

    $scope.msg = {};

    $scope.gridOptions.onRegisterApi = function(gridApi){
        //set gridApi on scope
        $scope.gridApi = gridApi;
        gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
            $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
            $scope.$apply();
        });
    };


    $http.get('http://localhost:8080/task/allTask')
        .success(function(data) {

            $scope.gridOptions.data = data;
        });

}]);