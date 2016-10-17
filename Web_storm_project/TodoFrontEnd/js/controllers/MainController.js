app.controller('MainCtrl', ['$scope', '$http', '$log', 'uiGridConstants', function ($scope, $http, uiGridConstants, $log) {
    $scope.gridOptions = {
        enableFiltering: true,
        modifierKeysToMultiSelectCells: true,
        showGridFooter: true,
        enableSorting: true,
        enableCellEditOnFocus: true,
        columnDefs: [
            {name: 'field1', enableSorting: false, enableCellEdit: false},
            {name: 'field2'},
            {name: 'field3', visible: false}]
    };


//DELETE + RESET  ///////////////


    $scope.addData = function () {
        var n = $scope.gridOptions.data.length + 1;
        $scope.gridOptions.data.push({
            "idtask": n,
            "label": "label",
            "description": "Description",
            "status": "Status",
            "startTime": "startTime",
            "finishTime": "finishTime",
            "priority": "priority",
            "responsible": "responsible",
            "userCollection": "Users"
        });
    };


    var columnDefs1 = [
        {name: 'idtask'},
        {name: 'label'},
        {name: 'description'},
        {name: 'status'},
        {name: 'startTime'},
        {name: 'finishTime'},
        {name: 'priority'},
        {name: 'responsible'},
        {name: 'userCollection'}
    ];

    var data1 = $scope.gridOptions.data;

    $scope.gridOptions = {
        columnDefs: columnDefs1,
        data: data1
    };


//DELETE + RESET////////////

    $scope.gridOptions.columnDefs = [
        {name: 'idtask', displayName: 'Id', enableCellEdit: false, width: '4%'},
        {name: 'label', displayName: 'Label (editable)', headerCellClass: $scope.highlightFilteredHeader, width: '5%'},
        {name: 'description', displayName: 'Description (editable)', width: '30%'},
        {name: 'status', displayName: 'Status', type: 'number', width: '10%'},
        {name: 'startTime', displayName: 'startTime', type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '8%'},
        {name: 'finishTime', displayName: 'finishTime', type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '10%'},
        {name: 'priority', displayName: 'Priority', type: 'number', width: '6%'},
        {name: 'responsible', displayName: 'responsible', type: 'number', width: '7%'},
        {name: 'userCollection', displayName: 'Users', type: 'object', /*enableCellEdit: false,*/ width: '20%'}
    ];

    $scope.msg = {};
    $scope.editedUsers = [];
    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.idtask + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
            /*  if($scope.editedUsers.length>0){
             rowEntity.userCollection=$scope.editedUsers;
             $scope.editedUsers=[];
             };*/

            console.log(rowEntity);
            $scope.$apply();
            $http.put({
                url: 'http://localhost:8080/task//updateTaskById/{id}',
                data: {
                    id: rowEntity.idtask,
                    data: rowEntity
                },
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            });

        });
    };

    $http.get('http://localhost:8080/task/allTask')
        .success(function (data) {
            $scope.gridOptions.data = data;
        });


    $scope.info = {};

    $scope.user = {status: []};

    $scope.getCurrentSelection = function () {
        $scope.user = {status: []};
        var values = [];
        var currentSelection = $scope.gridApi.cellNav.getCurrentSelection();
        values.push(currentSelection[0].row.entity[currentSelection[0].col.name]);
        $scope.printSelection = values.toString();
        angular.forEach(currentSelection[0].row.entity.userCollection, function (val, key) {
            $scope.user.status.push(val);
        })
    };


    $scope.statuses = [];

    $http.get('http://localhost:8080/user/allUser')
        .success(function (data) {
            //  console.log( $scope.statuses);
            $scope.allUsers = data;
            angular.forEach($scope.allUsers, function (u) {
                var value = u.iduser;
                var text = u.name;
                var user = {value: value, text: text};
                $scope.statuses.push(user);
            })
        });

    $scope.showStatus = function () {
        var selected = [];
        $scope.editedUsers = [];
        angular.forEach($scope.statuses, function (s) {
            if ($scope.user.status.indexOf(s.value) >= 0) {
                selected.push(s.text);
            }
        });
        $scope.editedUsers = selected;
        return selected.length ? selected.join(', ') : 'Not set';
    };


    // Keresés///////////////////
    $scope.highlightFilteredHeader = function (row, rowRenderIndex, col, colRenderIndex) {
        if (col.filters[0].term) {
            return 'header-filtered';
        } else {
            return '';
        }
    };


}]);
