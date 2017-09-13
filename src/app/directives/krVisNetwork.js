/**
 * Directive for network chart.
 */
angular
    .module('kraken').directive('krVisNetwork',
    [
        'util',
        'LogService',
        function (
            util,
            LogService) {
            return {
                restrict: 'EA',
                transclude: false,
                scope: {
                    options: '=',
                    jsonCompose :'=',
                    composes: '=',
                    project: '=',
                    events: '='
                },
                link: function (scope, element, attr) {
                    var networkEvents = [
                        'click',
                        'doubleclick',
                        'oncontext',
                        'hold',
                        'release',
                        'selectNode',
                        'selectEdge',
                        'deselectNode',
                        'deselectEdge',
                        'dragStart',
                        'dragging',
                        'dragEnd',
                        'hoverNode',
                        'blurNode',
                        'zoom',
                        'showPopup',
                        'hidePopup',
                        'startStabilizing',
                        'stabilizationProgress',
                        'stabilizationIterationsDone',
                        'stabilized',
                        'resize',
                        'initRedraw',
                        'beforeDrawing',
                        'afterDrawing',
                        'animationFinished'];

                    var self = this;
                    self.network = null;
                    self.data =null;
                    self.visOption = {
                        autoResize: true,
                        height: '100%',
                        width: '100%',
                        interaction: {
                            navigationButtons: true,
                            keyboard: false
                        },
                        physics: {
                            forceAtlas2Based: {
                                gravitationalConstant: -26,
                                centralGravity: 0.005,
                                springLength: 230,
                                springConstant: 0.18
                            },
                            maxVelocity: 146,
                            solver: 'forceAtlas2Based',
                            timestep: 0.35,
                            stabilization: {
                                enabled: true,
                                iterations: 2000,
                                updateInterval: 50
                            }
                        },
                        layout: {
                            randomSeed: 34
                        }
                    };


                    function _refrehsVis(){

                        // Sanity check
                        if (scope.jsonCompose == null) {
                            return;
                        }

                        // If we've actually changed the data set, then recreate the graph
                        // We can always update the data by adding more data to the existing data set
                        var newData =
                            util.composeToVis(scope.composes,scope.options
                            );

                        var dataSetNodes = new vis.DataSet(newData.nodes);
                        var dataSetEdges = new vis.DataSet(newData.edges) ;
                        if (self.network) {


                            self.data.nodes.forEach(function(node){
                                if(!dataSetNodes.get(node.id)) {
                                    self.data.nodes.remove(node.id)
                                }

                            });

                            self.data.edges.forEach(function(edge){
                                if(!dataSetEdges.get(edge.id)) {
                                    self.data.edges.remove(edge.id)
                                }
                            });

                            self.data.nodes.update(newData.nodes);
                            self.data.edges.update(newData.edges)

                        } else {
                            self.data = {
                                nodes: dataSetNodes,
                                edges: dataSetEdges
                            };
                            self.network = new vis.Network(element[0],self.data,
                                self.visOption);
                        }

                        // Create the graph2d object


                        // Attach an event handler if defined
                        angular.forEach(scope.events, function (callback, event) {
                            if (networkEvents.indexOf(String(event)) >= 0) {
                                self.network.on(event, callback);
                            }
                        });

                        // onLoad callback
                        if (scope.events != null && scope.events.onload != null &&
                            angular.isFunction(scope.events.onload)) {
                            scope.events.onload(graph);
                        }
                    }

                    scope.$watch('jsonCompose', function () {
                        _refrehsVis();
                    });
                    scope.$watch('options.displayLinks', function () {
                        _refrehsVis();
                    });
                    scope.$watch('options.displayDependsOn', function () {
                        _refrehsVis();
                    });
                    scope.$watch('options.displayVolumes', function () {
                        _refrehsVis();
                    });


                }
            };
        }]);