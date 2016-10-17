
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
            {name: 'idtask', displayName: 'Id (not focusable)', allowCellFocus : false, enableCellEditOnFocus:false, enableCellEdit: false, width: '2%'},
            {name: 'label', displayName: 'Label (editable)', width: '5%'},
            {name: 'description', displayName: 'Description (editable)', width: '30%'},
            {name: 'status', displayName: 'Status', type: 'number', width: '2%'},
            {name: 'startTime', displayName: 'startTime', type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '16%'},
            {name: 'finishTime', displayName: 'finishTime', type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '16%'},
            {name: 'priority', displayName: 'Priority', type: 'number', width: '2%'},
            {name: 'responsible', displayName: 'responsible', type: 'number', width: '7%'},
            {name: 'userCollection',  displayName: 'Users', type: 'object', enableCellEditOnFocus:false,  enableCellEdit: false, width: '20%'
               }]
    };


//Add Row ///////////////


    $scope.addData = function () {
        var n = $scope.gridOptions.data.length + 1;

            var dataAdd=
            {
            "idtask": n,
            "label": "label",
            "description": "Description",
            "status": 1,
            "startTime":  new Date(),
            "finishTime":  new Date(),
            "priority": 1,
            "responsible": "",
            "userCollection": []
        };

        $scope.gridOptions.data.push(dataAdd);

        var jsonDataAdd=angular.toJson(dataAdd);
        console.log("jsonDataAdd: ");
        console.log(jsonDataAdd);
        $http({
            method : 'PUT',
            url:'http://localhost:8080/task/newTask',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            data: jsonDataAdd

        }).then(function successCallback(response) {
            console.log(response);
        }, function errorCallback(response) {
            console.error(response);
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


//Add Row////////////


    var userId=$scope.mainData.logs;
    $scope.msg = {};
    //$scope.editedUsers = [];
    $scope.gridOptions.onRegisterApi = function (gridApi) {//update task
        $scope.gridApi = gridApi;

        $scope.loadDataInTable(userId);
        $scope.$watch('$scope.mainData.logs', function() {

             $scope.loadDataInTable
            $scope.gridApi.core.refresh();
            console.log("table refreshed!!");
        });


        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.idtask + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;

            console.log("MainCtrl: $scope.mainData.logs2 : " )
            console.log($scope.mainData.logs);
            //TODO replace {id}
            var jsonData = updateTask(rowEntity, $scope, $http);
            $scope.$apply();
            // $scope.gridApi.grid.refresh();


         /*   angular.forEach($scope.allUsers, function (user) {
                var value = user.iduser;
                var text = user.name;

                for (var i = 0; i < jsonData.userCollection.length; i++) {
                    if (angular.equals(text, jsonData.userCollection[i])) {
                        jsonData.userCollection.splice(i, 1, text);
                        console.log(i);
                    }
                }
                //var user = {value: value, text: text};
                //$scope.statuses.push(user);
            });*/
            console.log("ujratoltve!!");
            console.log(jsonData);
          //  convertUserIdsToUserNamesInUserCollection(rowEntity, $scope);
            $scope.user = {status: []};
            $scope.editedUsers = [];
        });
       

        //Single filter/////
        $scope.gridApi.grid.registerRowsProcessor( $scope.singleFilter, 200 );
        //Single filter/////
    };

    $scope.formatDate = function(date){
        var dateOut = new Date(date);
        return dateOut;
    };


////CheckList-Model/////
 $scope.users=[];

    ////CheckList-Model/////


    ///EDIT USER BUTTON ////// feltölti az összes usert
    //$scope.statuses = [];

    $http.get('http://localhost:8080/user/allUser')
        .success(function (data) {

            //  console.log( $scope.statuses);
            $scope.allUsers = data;
            angular.forEach($scope.allUsers, function (u) {
                var id = u.iduser;
                var name = u.name;
              var user = {id: id, name: name};
                $scope.users.push(user);
            })

        });
    ////CheckList-Model/////



    ///EDIT USER BUTTON //////

    //console.log("MainCtrl: $scope.mainData.logs: " +$scope.mainData.logs);

    $scope.loadDataInTable = function(userId){
        if(userId>0){
            loadAllTaskByUserId($http, userId, $scope);

        }else{
            loadAllTask($http, $scope);
            // $window.location.reload();
            console.log("MainCtrl: $scope.mainData.logsellen : " +$scope.mainData.logs);
        }


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





    ///EDIT USER BUTTON //////


   $scope.user = {status: []};

    $scope.getCurrentSelection = function () {

        $scope.uncheckAll();
        var values = [];
        var currentSelection =$scope.gridApi.cellNav.getCurrentSelection();
      //  values.push(currentSelection[0].row.entity[currentSelection[0].col.name]);
      //  $scope.printSelection = values.toString();

        //////Check-List-Model/////////////
       // $scope.user.chekedUsers=angular.copy(currentSelection[0].row.entity.userCollection);

        //////Check-List-Model/////////////

        angular.forEach(currentSelection[0].row.entity.userCollection, function (val, key) {
            values.push(val);
        });
        //console.log("values: ");
        //console.log(values);
        angular.forEach( $scope.users,function(us){
            for(var i=0; i<values.length; i++){
                if(angular.equals(values[i],us.name)){
                    $scope.selectedUsers.push(us);
                }
            }

        })
        //console.log("  $scope.selectedUsers:");
        //console.log( $scope.selectedUsers);

   //
   //console.log("user-statusbetölti a getcurrentSelectiont: ");
   //     console.log($scope.user.status);
    };


    ////Hide-Show//////

    $scope.myVar =true;
    $scope.toggle = function() {
        $scope.myVar = !$scope.myVar;
        $scope.getCurrentSelection();

    };



    ////Hide-Show//////

    ////Check-List-model//////
    $scope.selectedUsers = [];
    $scope.compareFn = function(obj1, obj2){
        return obj1.id === obj2.id;
    };

    $scope.uncheckAll = function() {
        $scope.selectedUsers.splice(0, $scope.selectedUsers.length);
    };

    $scope.saveSelectedUsers =function(){
        //console.log(" SAVE:  $scope.selectedUsers:");
        //console.log( $scope.selectedUsers);
        //console.log(" SAVE előtt:  $scope.gridApi.cellNav.getCurrentSelection().row.entity.userCollection:");
        //console.log($scope.gridApi.cellNav.getCurrentSelection()[0].row.entity.userCollection);
        var tempSelectedUsers =[];
        angular.forEach( $scope.selectedUsers,function(us){
            var name = us.name;
            tempSelectedUsers.push(name);
        });
        //console.log("tempSelectedUsers:");
        //console.log(tempSelectedUsers);
        $scope.gridApi.cellNav.getCurrentSelection()[0].row.entity.userCollection=tempSelectedUsers;
        //console.log(" SAVE utan:  $scope.gridApi.cellNav.getCurrentSelection().row.entity.userCollection:");
        //console.log($scope.gridApi.cellNav.getCurrentSelection()[0].row.entity.userCollection);
        var jsonData = updateTask($scope.gridApi.cellNav.getCurrentSelection()[0].row.entity, $scope, $http);

        $scope.myVar = !$scope.myVar;
    };

    $scope.canceleSelectedUsers = function(){
        $scope.myVar = !$scope.myVar;
    };


    ////Check-List-model//////



    ///EDIT USER BUTTON //////

}]);

function UsersIdsArrayToNamesArray($scope, row) {
    angular.forEach($scope.allUsers, function (user) {
        var value = user.iduser;
        var text = user.name;

        for (var i = 0; i < row.userCollection.length; i++) {
            if (angular.equals(value, row.userCollection[i])) {
                row.userCollection.splice(i, 1, text);

            }
        }


    });
}

function updateTask(rowEntity, $scope, $http) {
    var idTaskTemp = rowEntity.idtask;
    var urlWithId = 'http://localhost:8080/task/updateTaskById/' + idTaskTemp;
    // var jsonDatatemp = angular.toJson(rowEntity);
    // console.log("rowEntity elotte: ");
    // console.log(rowEntity);
    var jsonData = convertUserNamesToUserIdsInuserCollection(rowEntity, $scope);
    //convertUserIdsToUserNamesInUserCollection(rowEntity, $scope);

    // var jsonData = angular.toJson(rowEntity);
    //console.log("rowEntity utana: ");
    //console.log(rowEntity);

    $http({
        method: 'PUT',
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
    return jsonData;
}

function convertUserNamesToUserIdsInuserCollection(rowEntity, $scope) {
    var jsonDatatemp =   angular.copy(rowEntity);

    console.log("jsonDatatemp: ");
    console.log(jsonDatatemp);
    var jsonData = jsonDatatemp;
    angular.forEach($scope.allUsers, function (user) {
        var value = user.iduser;
        var text = user.name;
        if(angular.equals(jsonData.responsible,text)){
            jsonData.responsible=value;
        }
        for (var i = 0; i < jsonData.userCollection.length; i++) {
            if (angular.equals(text, jsonData.userCollection[i])) {
                jsonData.userCollection.splice(i, 1, value);
            }
        }
        //var user = {value: value, text: text};
        //$scope.statuses.push(user);
    });
    return jsonData;
}

function convertUserIdsToUserNamesInUserCollection(rowEntity, $scope){
   // var jsonDataTemp = rowEntity;
    angular.forEach($scope.allUsers, function (user) {
        var value = user.iduser;
        var text = user.name;

        for (var i = 0; i < rowEntity.userCollection.length; i++) {
            if (angular.equals(value, rowEntity.userCollection[i])) {
                rowEntity.userCollection.splice(i, 1, text);
            }
        }
        //var user = {value: value, text: text};
        //$scope.statuses.push(user);
    });

}

function responsibleIdToName($scope, row) {
    angular.forEach($scope.allUsers, function (user) {
        var value = user.iduser;
        var text = user.name;
    if(angular.equals(row.responsible,value)){
        row.responsible=text;
    }


    });


}
function loadAllTask($http, $scope) {
    $http.get('http://localhost:8080/task/allTask')
        .success(function (data) {
            data.forEach(function addDates(row, index) {
                row.startTime = $scope.formatDate(row.startTime);
                row.finishTime = $scope.formatDate(row.finishTime);
                UsersIdsArrayToNamesArray($scope, row);
                responsibleIdToName($scope, row);
            });
            $scope.gridOptions.data = data;
            console.log("gridOptionData:");
            console.log($scope.gridOptions.data);
        })
}

function loadAllTaskByUserId($http, userId, $scope) {
    $http.get('http://localhost:8080/user//findAllTaskByUserId/' + userId)
        .success(function (data) {
            data.forEach(function addDates(row, index) {
                row.startTime = $scope.formatDate(row.startTime);
                row.finishTime = $scope.formatDate(row.finishTime);
                UsersIdsArrayToNamesArray($scope, row);
                responsibleIdToName($scope, row);
            });
            $scope.gridOptions.data = data;
            console.log("gridOptionData:");
            console.log($scope.gridOptions.data);
        });
}