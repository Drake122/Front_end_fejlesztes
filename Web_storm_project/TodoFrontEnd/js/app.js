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

app.service('productService', function() {
    var productList = [];

    var addProduct = function(newObj) {
        productList.push(newObj);
    };

    var getProducts = function(){
        return productList;
    };

    return {
        addProduct: addProduct,
        getProducts: getProducts
    };

});