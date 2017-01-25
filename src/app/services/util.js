angular
    .module('kraken').service('util',['LogService',function(LogService){

    var NETWORK_LABEL = 'network : ';
    var SERVICE_LABEL = 'service : ';

    function _getNetworkModel(compose,options){

        var nodes = [];
        var edges = [];

        var defaultNetwork = null;

        if(compose['networks']){
            if (typeof compose['networks'] === 'object' ){
                for (var n in compose['networks']) {

                    var network = compose['networks'][n];
                    if (!network) {

                        nodes.pushUniqueNode(
                            {
                                "id": 'networks-' + n,
                                "label": NETWORK_LABEL + n,
                                "size": 10,
                                "color": "red",
                                "shape": "icon",
                                icon: {
                                    face: 'FontAwesome',
                                    code: '\uf0e8',
                                    size: 50,
                                    color: '#303336'
                                },
                                "shadow": true
                            }
                        )
                    } else if (typeof  network === 'object') {

                        if (network.external) {
                            if (network.external.name) {
                                defaultNetwork = {
                                    "id": 'networks-' + network.external.name,
                                    "label": 'networks : ' + network.external.name,
                                    "size": 10,
                                    "color": "red",
                                    "shape": "icon",
                                    icon: {
                                        face: 'FontAwesome',
                                        code: '\uf0e8',
                                        size: 50,
                                        color: '#303336'
                                    },
                                    "shadow": true
                                };

                                nodes.pushUnique(defaultNetwork);

                            }

                        }

                    }
                }

            }  else {
                LogService.warn('expected an array of  networks, and simple string found')
            }
        }



        if(!defaultNetwork){
            nodes.pushUniqueNode(
                {
                    "id":'networks-default',
                    "label":NETWORK_LABEL + 'default',
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

        var composeService;

        if(compose['services']){
            composeService =  compose['services'];
        } else {
            composeService = compose;
        }


        for (var s in composeService){
            var service = composeService[s];
            if(service){


                nodes.pushUniqueNode(
                    {
                        "id":'services-'+s,
                        "label": SERVICE_LABEL +s,
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

                    if(Array.isArray(service['networks']) || typeof service['networks'] == 'object'){
                        for(var entry in service['networks']){

                            var alias = null;
                            var networkName = entry;
                            var serviceNetworksEntry = service['networks'][networkName];
                            // is configured service in network
                            if(!Array.isArray(service['networks']) ){
                                if(serviceNetworksEntry){
                                    if(serviceNetworksEntry.aliases){
                                        if(Array.isArray(serviceNetworksEntry.aliases)){
                                            angular.forEach(serviceNetworksEntry.aliases ,function(a){
                                                alias  =  (alias ? alias +', '+ (a ? a : '' ): 'aliases : ' + (a ? a : '' )) ;
                                            })
                                        }


                                    }
                                }
                                // simple networks name
                            } else {
                                networkName = serviceNetworksEntry ?  serviceNetworksEntry : '';
                            }
                            if (networkName === 'default' && defaultNetwork) {
                                edges.pushUniqueNode({
                                    id: 'services-' + s + '-to-' + 'networks-default',
                                    from: 'services-' + s,
                                    label:alias ? alias : '',
                                    to: defaultNetwork.id
                                })
                            } else {

                                edges.pushUniqueNode({
                                    id: 'services-' + s + '-to-' + 'networks-' + networkName,
                                    from: 'services-' + s,
                                    label: alias ? alias : '',
                                    to: 'networks-' + networkName
                                });

                                var serviceNode = {
                                    "id": 'networks-' + networkName,
                                    "label": NETWORK_LABEL + networkName,
                                    "size": 10,
                                    "color": "blue",
                                    "shape": "icon",
                                    icon: {
                                        face: 'FontAwesome',
                                        code: '\uf0e8',
                                        size: 50,
                                        color: '#777'
                                    },
                                    "shadow": true
                                };

                                // adding unique node,
                                if (nodes.arrayNodeIndexOf(serviceNode) < 0)
                                    nodes.pushUniqueNode(
                                        {
                                            "id": 'networks-' + networkName,
                                            "label": NETWORK_LABEL + networkName,
                                            "size": 10,
                                            "color": "blue",
                                            "shape": "icon",
                                            icon: {
                                                face: 'FontAwesome',
                                                code: '\uf0e8',
                                                size: 50,
                                                color: '#777'
                                            },
                                            "shadow": true
                                        });
                                LogService.warn('service ' + s + ' linked with  unknown network : ' + networkName + '')
                            }
                        }
                    } else {
                        LogService.warn('expected an array of services networks, simple string found')
                    }

                } else {
                    // default networks has custom name
                    if (defaultNetwork) {

                        edges.pushUniqueNode({
                            id: 'services-' + s + '-to-' + 'networks-default',
                            from: 'services-' + s,
                            to: defaultNetwork.id
                        })
                    } else {
                        // no default networks then link service to default network
                        edges.pushUniqueNode({
                            id: 'services-' + s + '-to-' + 'networks-default',
                            from: 'services-' + s,
                            to: 'networks-default'
                        })
                    }
                }
                if(options){
                    if (service['links']) {
                        for (var l in service['links']) {
                            if (service['links'][l]) {
                                var link = service['links'][l].split(':');
                                edges.pushUniqueNode({
                                    id: 'services-' + s + '-to-' + 'services-' + link[0] + '-as-' + link[1],
                                    from: 'services-' + s,
                                    label: options.displayLinks ? (link[1] ? link[1] : link[0]) : '',
                                    arrows: 'to',
                                    physics:false,
                                    color:{
                                        opacity:options.displayLinks ? 1 :0,
                                    },
                                    chosen : {
                                        edge:function(values,id,selected){
                                            values.color = selected ?  'red' : 'black';
                                            values.label =  '';

                                        }

                                    },
                                    smooth: {
                                        enabled: true,
                                        type: "discrete",
                                        roundness: 0.2
                                    },
                                    dashes: true,
                                    to: 'services-' + link[0]
                                })
                            }

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

