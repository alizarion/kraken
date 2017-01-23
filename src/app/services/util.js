angular
    .module('kraken').service('util',['LogService',function(LogService){




    function _getNetworkModel(compose){



        var nodes = [];
        var edges = [];


        var defaultNetwork = null;

        if(compose['networks']){
            for (var n in compose['networks']){
                var network = compose['networks'][n];
                console.log(n,network);

                if(!network){

                    nodes.pushUniqueNode(
                        {
                            "id":'networks-'+n,
                            "label":'networks : ' + n,
                            "size":10,
                            "color":"red",
                            "shape":"icon",
                            icon: {
                                face: 'FontAwesome',
                                code: '\uf0e8',
                                size: 50,
                                color: '#303336'
                            },
                            "shadow":true
                        }
                    )
                }  else if(typeof  network === 'object'){

                    if (network.external){
                        if(network.external.name){
                            defaultNetwork =   {
                                "id":'networks-'+network.external.name,
                                "label":'networks : ' + network.external.name,
                                "size":10,
                                "color":"red",
                                "shape":"icon",
                                icon: {
                                    face: 'FontAwesome',
                                    code: '\uf0e8',
                                    size: 50,
                                    color: '#303336'
                                },
                                "shadow":true
                            };

                            nodes.pushUnique(defaultNetwork);

                        }

                    }

                }

            }
        }
        if(!defaultNetwork){
            nodes.pushUniqueNode(
                {
                    "id":'networks-default',
                    "label":'network : default',
                    "size":10,
                    "color":"red",
                    "shape":"icon",
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf0e8',
                        size: 50,
                        color: '#303336'
                    },
                    "shadow":true
                }
            );
        }

        for (var s in compose['services']){
            var service = compose['services'][s];
            if(service){


                nodes.pushUniqueNode(
                    {
                        "id":'services-'+s,
                        "label": 'service :' +s,
                        "size":10,
                        icon: {
                            face: 'FontAwesome',
                            code: '\uf233',
                            size: 50,
                            color: '#4078c0'
                        },
                        "shape":"icon",
                        "shadow":true
                    }
                );
                if (service['networks']){
                    for (var n in service['networks']){
                        if(service['networks'][n] === 'default' && defaultNetwork){
                            edges.pushUniqueNode({
                                id: 'services-' + s + '-to-' + 'networks-default',
                                from: 'services-' + s,
                                to: defaultNetwork.id
                            })
                        }  else {


                            edges.pushUniqueNode({
                                id:'services-'+s+'-to-'+'networks-'+ service['networks'][n],
                                from: 'services-'+s,
                                to : 'networks-'+ service['networks'][n]
                            });

                            var serviceNode =  {
                                "id":'networks-'+service['networks'][n],
                                "label":'networks : ' + service['networks'][n],
                                "size":10,
                                "color":"blue",
                                "shape":"icon",
                                icon: {
                                    face: 'FontAwesome',
                                    code: '\uf0e8',
                                    size: 50,
                                    color: '#777'
                                },
                                "shadow":true
                            };

                            if(nodes.arrayNodeIndexOf(serviceNode) < 0)
                                nodes.pushUniqueNode(
                                    {
                                        "id":'networks-'+service['networks'][n],
                                        "label":'networks : ' + service['networks'][n],
                                        "size":10,
                                        "color":"blue",
                                        "shape":"icon",
                                        icon: {
                                            face: 'FontAwesome',
                                            code: '\uf0e8',
                                            size: 50,
                                            color: '#777'
                                        },
                                        "shadow":true
                                    });
                            LogService.warn('service ' + s + ' linked with  unknown network : '+service['networks'][n] +'')
                        }
                    }

                } else {
                    if (defaultNetwork) {

                        edges.pushUniqueNode({
                            id: 'services-' + s + '-to-' + 'networks-default',
                            from: 'services-' + s,
                            to: defaultNetwork.id
                        })
                    } else {

                        edges.pushUniqueNode({
                            id: 'services-' + s + '-to-' + 'networks-default',
                            from: 'services-' + s,
                            to: 'networks-default'
                        })
                    }
                }
                if (service['links']){
                    for (var l in service['links']){
                        if(service['links'][l]){
                            var link = service['links'][l].split(':');
                            edges.pushUniqueNode({
                                id: 'services-'+s+'-to-'+'services-'+ link[0]+'-as-'+link[1],
                                from: 'services-'+s,
                                label : link[1] ? link[1] :link[0],
                                arrows : 'to',
                                smooth: true,
                                dashes :true,
                                to : 'services-'+ link[0]
                            })
                        }

                    }
                }
            }

        }
        return  {
            edges: edges,
            nodes: nodes
        };

    }

    return {

        composeToVis :_getNetworkModel

    }
}]);

