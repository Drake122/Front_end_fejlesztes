app.controller('MainCtrl', ['$scope', '$http', '$log', 'uiGridConstants','$window', function ($scope, $http, uiGridConstants,$window, $log) {

    //console.log("loginController$scope.parentData.message:" +$scope.parentData.message);

   // console.log("MainVtrl:$scope.parentData.message:" +$scope.parentData.message);
 //   console.log("MainCtrl data.message: "+ LoginController.parentData.message);


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
              if($scope.editedUsers.length>0){
             rowEntity.userCollection.newValue=$scope.editedUsers;
             $scope.editedUsers=[];
             };

            console.log(rowEntity);
            console.log("MainCtrl: $scope.mainData.logs2 : " +$scope.mainData.logs);
            //TODO replace {id}
            var idTaskTemp = rowEntity.idtask;
            var urlWithId = 'http://localhost:8080/task/updateTaskById/'+idTaskTemp;
            var jsonData = angular.toJson(rowEntity);
            $scope.$apply();
            $http({
                method : 'PUT',
                url: urlWithId,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: jsonData
            }).then(function successCallback(response) {
                console.log(response);
            }, function errorCallback(response) {
                console.error(response);
            });
        });
    };

    console.log("MainCtrl: $scope.mainData.logs: " +$scope.mainData.logs);
    var userId= $scope.mainData.logs;
    if($scope.mainData.logs="false"){
        $http.get('http://localhost:8080/task/allTask')
            .success(function (data) {
                $scope.gridOptions.data = data;
            });
    }else{

    $http.get('http://localhost:8080/user//findAllTaskByUserId/'+userId)
        .success(function (data) {
            $scope.gridOptions.data = data;

        });
        $window.location.reload();
        console.log("MainCtrl: $scope.mainData.logsellen : " +$scope.mainData.logs);
    }
   

    $scope.user = {status: []};

    $scope.getCurrentSelection = function () {//betölti a showUserba a táblázatba szereplő usereket
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
    $scope.setCurrentSelectonUsers=function(){
       /* if($scope.gridApi.cellNav.getCurrentSelection()!=[]){
            var currentSelection = $scope.gridApi.cellNav.getCurrentSelection();
            currentSelection[0].row.entity.userCollection.clear();

        }*/
        var currentSelection = $scope.gridApi.cellNav.getCurrentSelection();
        console.log("currentSelection: "+currentSelection[0]);

    }
    $scope.showStatus = function () {
        var selected = [];
        $scope.editedUsers = [];
       // currentSelection[0].row.entity.userCollection.clear();
        angular.forEach($scope.statuses, function (s) {
            if ($scope.user.status.indexOf(s.value) >= 0) {
                selected.push(s.text);

            }
        });
        $scope.editedUsers = selected;
        $scope.setCurrentSelectonUsers();
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

    $scope.toggleFiltering = function () {
        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };

    return function (input) {
        if (!input) {
            return '';
        } else {
            return genderHash[input];
        }
    };

}]);
