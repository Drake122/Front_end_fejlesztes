app.controller('MainCtrl', ['$scope', '$http', '$log','uiGridConstants', function ($scope, $http,uiGridConstants, $log) {
    $scope.gridOptions = {
        enableFiltering: true,
        modifierKeysToMultiSelectCells: true,
        showGridFooter: true,
        enableSorting: true,
        enableCellEditOnFocus: true,
        columnDefs: [
            { name: 'field1', enableSorting: false, enableCellEdit: false },
            { name: 'field2' },
            { name: 'field3', visible: false }]
    };
//DELETE + RESET  ///////////////

     /*   $scope.swapData = function() {
            if ($scope.gridOpts.data === data1) {
                $scope.gridOpts.data = data2;
                $scope.gridOpts.columnDefs = columnDefs2;
            }
            else {
                $scope.gridOpts.data = data1;
                $scope.gridOpts.columnDefs = columnDefs1;
            }
        };*/

    $scope.addData = function() {
        var n = $scope.gridOptions.data.length + 1;
        $scope.gridOptions.data.push({
            "idtask": "Id" + n,
            "description": "Description" + n,
            "status": "Status",
            "startTime": "startTime",
            "finishTime": "finishTime",
            "priority": "priority",
            "responsible": "responsible",
            "userCollection": "Users"
        });
    };

   /* $scope.removeFirstRow = function() {
        //if($scope.gridOpts.data.length > 0){
        $scope.gridOpts.data.splice(0,1);
        //}
    };*/

    $scope.reset = function () {
        data1 = angular.copy(origdata1);
        data2 = angular.copy(origdata2);

        $scope.gridOptions.data = data1;
        $scope.gridOptions.columnDefs = columnDefs1;
    };

    var columnDefs1 = [
        { name: 'idtask' },
        { name: 'description' },
        { name: 'status' },
        { name: 'startTime' },
        { name: 'finishTime' },
        { name: 'priority' },
        { name: 'responsible' },
        { name: 'userCollection' }
    ];
    var data2 =$scope.gridOptions.data;

    var data1 = $scope.gridOptions.data;

    var origdata1 = angular.copy(data1);

    var origdata2 = angular.copy(data2);

    $scope.gridOptions = {
        columnDefs: columnDefs1,
        data: data1
    };



//DELETE + RESET////////////

    $scope.gridOptions.columnDefs = [
        { name: 'idtask',displayName: 'Id', enableCellEdit: false, width: '2%' },
        { name: 'label', displayName: 'Label (editable)',headerCellClass: $scope.highlightFilteredHeader, width: '5%' },
        { name: 'description',displayName:'Description (editable)', width: '30%' },
        { name: 'status', displayName: 'Status', type:'number',width:'10%'},
        { name: 'startTime', displayName: 'startTime' , type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '10%' },
        { name: 'finishTime', displayName: 'finishTime' , type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '10%' },
        { name: 'priority', displayName: 'Priority', type:'number',width:'6%'},
        { name: 'responsible', displayName: 'responsible', type:'number',width:'7%'},
        { name: 'userCollection', displayName: 'Users', type: 'object', /*enableCellEdit: false,*/ width: '20%' }
    ];

    $scope.msg = {};
    $scope.editedUsers=[];
    $scope.gridOptions.onRegisterApi = function(gridApi){
        $scope.gridApi = gridApi;
        gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
            $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.idtask + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
         /*  if($scope.editedUsers.length>0){
               rowEntity.userCollection=$scope.editedUsers;
               $scope.editedUsers=[];
           };*/

            console.log(rowEntity);
            $scope.$apply();
           // $http.put('http://localhost:8080/updateTask/{id}',rowEntity.idtask,rowEntity);

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
        $scope.editedUsers=[];
        angular.forEach($scope.statuses, function(s) {
            if ($scope.user.status.indexOf(s.value) >= 0) {
                selected.push(s.text);
            }
        });
        $scope.editedUsers=selected;
        return selected.length ? selected.join(', ') : 'Not set';
    };


    // Keresés///////////////////
    $scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
        if( col.filters[0].term ){
            return 'header-filtered';
        } else {
            return '';
        }
    };



}]);
