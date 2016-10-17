// var app = angular.module('app', ['ngTouch', 'ui.grid']);

var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'xeditable',
    'checklist-model', 'ngAnimate', 'ui.grid.grouping', 'ui.grid.selection']);

app.config(function ($httpProvider) {
    //Enable cors
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});


app.run(function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

app.service('stats', function(){

    var coreAccumulate = function(aggregation, value){
        initAggregation(aggregation);
        if ( angular.isUndefined(aggregation.stats.accumulator) ){
            aggregation.stats.accumulator = [];
        }
        if ( !isNaN(value) ){
            aggregation.stats.accumulator.push(value);
        }
    };

    var initAggregation = function(aggregation){
        /* To be used in conjunction with the cleanup finalizer */
        if (angular.isUndefined(aggregation.stats) ){
            aggregation.stats = {sum: 0};
        }
    };

    var increment = function(obj, prop){
        /* if the property on obj is undefined, sets to 1, otherwise increments by one */
        if ( angular.isUndefined(obj[prop])){
            obj[prop] = 1;
        }
        else {
            obj[prop]++;
        }
    };

    var service = {
        aggregator: {
            accumulate: {
                /* This is to be used with the uiGrid customTreeAggregationFn definition,
                 * to accumulate all of the data into an array for sorting or other operations by customTreeAggregationFinalizerFn
                 * In general this strategy is not the most efficient way to generate grouped statistics, but
                 * sometime is the only way.
                 */
                numValue: function (aggregation, fieldValue, numValue) {
                    return coreAccumulate(aggregation, numValue);
                },
                fieldValue: function (aggregation, fieldValue) {
                    return coreAccumulate(aggregation, fieldValue);
                }
            },
            mode: function(aggregation, fieldValue){
                initAggregation(aggregation);
                var thisValue = fieldValue;
                if (angular.isUndefined(thisValue) || thisValue === null){
                    thisValue = aggregation.col.grid.options.groupingNullLabel;
                }
                increment(aggregation.stats, thisValue);
                if ( aggregation.stats[thisValue] > aggregation.maxCount || angular.isUndefined(aggregation.maxCount) ){
                    aggregation.maxCount = aggregation.stats[thisValue];
                    aggregation.value = thisValue;
                }
            },
            sumSquareErr: function(aggregation, fieldValue, numValue){
                initAggregation(aggregation);
                if ( !isNaN(numValue) ){
                    increment(aggregation.stats, 'count');
                }
                aggregation.stats.sum += numValue || 0;
                service.aggregator.accumulate.numValue(aggregation, fieldValue, numValue);
            }
        },
        finalizer: {
            cleanup: function (aggregation) {
                delete aggregation.stats;
                if ( angular.isUndefined(aggregation.rendered) ){
                    aggregation.rendered = aggregation.value;
                }
            },
            median: function(aggregation){
                aggregation.stats.accumulator.sort();
                var arrLength = aggregation.stats.accumulator.length;
                aggregation.value = arrLength % 2 === 0 ?
                (aggregation.stats.accumulator[(arrLength / 2) - 1] + aggregation.stats.accumulator[(arrLength / 2)]) / 2
                    : aggregation.stats.accumulator[(arrLength / 2) | 0];
                service.finalizer.cleanup(aggregation);
            },
            sumSquareErr: function(aggregation){
                aggregation.value = 0;
                if ( aggregation.count !== 0 ){
                    var mean = aggregation.stats.sum/aggregation.stats.count,
                        error;

                    angular.forEach(aggregation.stats.accumulator, function(value){
                        error = value - mean;
                        aggregation.value += error * error;
                    });
                }
            },
            variance: function(aggregation){
                service.finalizer.sumSquareErr(aggregation);
                aggregation.value = aggregation.value / aggregation.stats.count;
                service.finalizer.cleanup(aggregation);
                aggregation.rendered = Math.round(aggregation.value * 100)/100;
            },
            varianceP: function(aggregation){
                service.finalizer.sumSquareErr(aggregation);
                if ( aggregation.count !== 0 ) {
                    aggregation.value = aggregation.value / (aggregation.stats.count - 1);
                }
                service.finalizer.cleanup(aggregation);
            },
            stDev: function(aggregation){
                service.finalizer.variance(aggregation);
                aggregation.value = Math.sqrt(aggregation.value);
                aggregation.rendered = Math.round(aggregation.value * 100)/100;
            },
            stDevP: function(aggregation){
                service.finalizer.varianceP(aggregation);
                aggregation.value = Math.sqrt(aggregation.value);
                aggregation.rendered = Math.round(aggregation.value * 100)/100;
            }
        }
    };

    return service;
});