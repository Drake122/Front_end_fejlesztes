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
            {name: 'idtask', displayName: 'Id', enableCellEdit: false, width: '4%'},
            {name: 'label', displayName: 'Label (editable)', width: '5%'},
            {name: 'description', displayName: 'Description (editable)', width: '30%'},
            {name: 'status', displayName: 'Status', type: 'number', width: '10%'},
            {name: 'startTime', displayName: 'startTime', type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '8%'},
            {name: 'finishTime', displayName: 'finishTime', type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '10%'},
            {name: 'priority', displayName: 'Priority', type: 'number', width: '6%'},
            {name: 'responsible', displayName: 'responsible', type: 'number', width: '7%'},
            {name: 'userCollection', displayName: 'Users(editable)', type: 'object', enableCellEdit: true, width: '20%'}]
    };


//Add Row ///////////////


    $scope.addData = function () {
        var n = $scope.gridOptions.data.length + 1;
        $scope.gridOptions.data.push({
            "idtask": n,
            "label": "label",
            "description": "Description",
            "status": 1,
            "startTime":  new Date(),
            "finishTime":  new Date(),
            "priority": 1,
            "responsible": "",
            "userCollection": []
        });

        //$http({
        //    method : 'PUT',
        //    url: urlWithId,
        //    headers: {
        //        'Content-Type': 'application/json; charset=utf-8'
        //    },
        //    data: jsonData
        //
        //}).then(function successCallback(response) {
        //    console.log(response);
        //}, function errorCallback(response) {
        //    console.error(response);
        //});
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


//Add Row////////////



    $scope.msg = {};
    //$scope.editedUsers = [];
    $scope.gridOptions.onRegisterApi = function (gridApi) {//update task
        $scope.gridApi = gridApi;
        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.idtask + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
            /*  if($scope.editedUsers.length>0){
            // rowEntity.userCollection.newValue=$scope.editedUsers;
             $scope.editedUsers=[];
             };*/

            console.log(rowEntity);
            console.log("MainCtrl: $scope.mainData.logs2 : " +$scope.mainData.logs);
            //TODO replace {id}
            var idTaskTemp = rowEntity.idtask;
            var urlWithId = 'http://localhost:8080/task/updateTaskById/'+idTaskTemp;
           // var jsonDatatemp = angular.toJson(rowEntity);
            var jsonDatatemp = rowEntity;
            console.log("jsonDatatemp: ");
            console.log(jsonDatatemp);
            var jsonData=jsonDatatemp;
          angular.forEach($scope.allUsers, function (user) {
                var value = user.iduser;
                var text = user.name;

        for(var i= 0; i<jsonData.userCollection.length; i++){
            if(angular.equals(text,jsonData.userCollection[i])){
                jsonData.userCollection.splice(i,1,value);
            }
        }
                var user = {value: value, text: text};
                $scope.statuses.push(user);
            });
            console.log("jsonData: "+jsonData);
            console.log("jsonData: ");
            console.log(jsonData);
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
        //Single filter/////
        $scope.gridApi.grid.registerRowsProcessor( $scope.singleFilter, 200 );
        //Single filter/////
    };
    $scope.formatDate = function(date){
        var dateOut = new Date(date);
        return dateOut;
    };
    console.log("MainCtrl: $scope.mainData.logs: " +$scope.mainData.logs);
    var userId= $scope.mainData.logs;
    if($scope.mainData.logs="false"){
        $http.get('http://localhost:8080/task/allTask')
            .success(function (data) {
                data.forEach( function addDates( row, index ){

                    row.startTime = $scope.formatDate(row.startTime);
                    row.finishTime = $scope.formatDate(row.finishTime);
                });
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

    //Single filter/////

    $scope.filter = function() {
        $scope.gridApi.grid.refresh();
    };

    $scope.singleFilter = function( renderableRows ){
        var matcher = new RegExp($scope.filterValue);
        renderableRows.forEach( function( row ) {
            var match = false;
            [ 'label', 'description' ].forEach(function( field ){
                if ( row.entity[field].match(matcher) ){
                    match = true;
                }
            });
            if ( !match ){
                row.visible = false;
            }
        });
        return renderableRows;
    };

    //Single filter/////
    $scope.user = {status: []};

    $scope.getCurrentSelection = function () {//betölti a showUserba a táblázatba szereplő usereket
        $scope.user = {status: []};
        var values = [];
        var currentSelection = $scope.gridApi.cellNav.getCurrentSelection();
        values.push(currentSelection[0].row.entity[currentSelection[0].col.name]);
       // $scope.printSelection = values.toString();
        angular.forEach(currentSelection[0].row.entity.userCollection, function (val, key) {
            $scope.user.status.push(val);
        })

    };




    $http.get('http://localhost:8080/user/allUser')
        .success(function (data) {
            $scope.statuses = [];
            //  console.log( $scope.statuses);
            $scope.allUsers = data;
            angular.forEach($scope.allUsers, function (u) {
                var value = u.iduser;
                var text = u.name;
                var user = {value: value, text: text};
                $scope.statuses.push(user);
            })

        });
    /* $scope.setCurrentSelectonUsers=function(){
        if($scope.gridApi.cellNav.getCurrentSelection()!=[]){
            var currentSelection = $scope.gridApi.cellNav.getCurrentSelection();
            currentSelection[0].row.entity.userCollection.clear();

        }
        var currentSelection = $scope.gridApi.cellNav.getCurrentSelection();
        console.log("currentSelection: "+currentSelection[0]);

    }*/
    //var selectedUsersIds = [];
    $scope.showStatus = function () {
        var selected = [];

        $scope.editedUsers = [];
       // currentSelection[0].row.entity.userCollection.clear();
        angular.forEach($scope.statuses, function (s) {
            if ($scope.user.status.indexOf(s.value) >= 0) {
                selected.push(s.text);
               // selectedUsersIds.push(s.value);

            }
        });
        $scope.editedUsers = selected;
      //  $scope.setCurrentSelectonUsers();
        return selected.length ? selected.join(', ') : 'Not set';

    };


    // Keresés///////////////////
   /* $scope.highlightFilteredHeader = function (row, rowRenderIndex, col, colRenderIndex) {
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
    };*/



}]);

