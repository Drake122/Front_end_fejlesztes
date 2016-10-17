// var app = angular.module('app', ['ngTouch', 'ui.grid']);

var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'xeditable', 'checklist-model', 'ngAnimate']);

app.config(function ($httpProvider) {
    //Enable cors
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});


app.run(function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

app.factory('myFactoryService',function(){


    var data="";

    //var setData = function(str){
    //    data = str;
    //
    //}
    //var getData = function(){
    //    return data;
    //}
    //return {getData: getData};

    return{
        getData:function() {
            return data;
        },
        setData:function(str){
            data = str;
        }


        };



});
