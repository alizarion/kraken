angular
    .module('kraken').service('util',['LogService',function(LogService){

    var NETWORK_LABEL = 'network : ';
    var SERVICE_LABEL = 'service : ';


    function _createDependsOnLink(from,to) {
        return {
            id: 'service-' + from + '-depends-on-service-' + to,
            from: 'service-' + from,
            to: 'service-' + to,
            arrows: 'to',
            physics: false,
            color: '#ffb5bd',
            dashes: [2, 2, 20, 20],
            chosen: {
                edge: function (values, id, selected) {
                    values.color = selected ? '#ff2841' : 'ffb5bd';
                    values.label = '';

                }

            },
            smooth: {
                enabled: true,
                type: "discrete",
                roundness: 0.2
            }
        }
    }

    function _createNetwork(name,exist){
        return {
            "id": 'network-' + name,
            "label": NETWORK_LABEL + name,
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
    }

    function _linkServiceToNetwork(service,network,aliases){
        return {
            id: 'service-' + service + '-to-network-' + (network ? network : 'default'),
            from: 'service-' + service,
            label: aliases ? aliases : '',
            to: 'network-' + (network ? network : 'default')
        }
    }

    function _addVolume(name,path,color){
        return {
            id: 'volume-'+name,
            label:name,
            color: color
        }

    }

    function _guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    function _linkToVolume(service,volume,path){
        return {
            id: 'service-' + service + '-to-volume-' + volume,
            from: 'service-' + service,
            label: path ? path : '',
            dashes: [2, 4],
            to: 'volume-' + volume
        }
    }

    function _getNetworkModel(composes,options){

        var nodes = [];
        var edges = [];


        for(var composePos in composes){
            var defaultNetwork = null;
            var compose = composes[composePos].json;
            var composeColor =  composes[composePos].color;
            if(compose['networks']){
                var networks =compose['networks'];
                if (typeof compose['networks'] === 'object' || !Array.isArray(networks) ){
                    for (var n in networks) {

                        var networkObjectValue = networks[n];



                        if(networkObjectValue){

                            if (networkObjectValue.external) {
                                if (networkObjectValue.external.name) {
                                    var externalNetwork = _createNetwork(networkObjectValue.external.name);

                                    nodes.pushUnique(externalNetwork);
                                    if(n === 'default'){
                                        defaultNetwork = externalNetwork;
                                    }

                                }

                            }  else {
                                nodes.pushUniqueNode( _createNetwork(n))
                            }
                        } else {
                            nodes.pushUniqueNode(_createNetwork(n))
                        }
                    }

                }  else {
                    LogService.warn('expected an array of  networks, and simple string found')
                }
            }

            var externalVolumes = {};
            if(options){
                if(options.displayVolumes) {
                    if(compose['volumes']){
                        var volumes = compose['volumes'];
                        if(Array.isArray(volumes)){

                        } else {

                            for(var v in volumes){
                                var volumeSetted = false;
                                var volume = volumes[v];
                                if(volumes[v]){
                                    if(volume.external){
                                        if(volume.external.name){
                                            nodes.pushUniqueNode(_addVolume(volume.external.name,compose.color));
                                            externalVolumes[v]= volume.external.name;
                                            volumeSetted = true;

                                        }
                                    }
                                }

                                if(!volumeSetted){
                                    nodes.pushUniqueNode(_addVolume(v,compose.color));

                                }

                            }
                        }

                    }
                }

            }



            if(!defaultNetwork){
                nodes.pushUniqueNode(_createNetwork('default'));
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
                            "id":'service-'+s,
                            "label": SERVICE_LABEL +s,
                            "size":10,
                            icon: {
                                face: 'FontAwesome',
                                code: '\uf233',
                                size: 50,
                                color: composeColor
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
                                    edges.pushUniqueNode(_linkServiceToNetwork(s,null,alias))
                                } else {

                                    edges.pushUniqueNode(_linkServiceToNetwork(s,networkName,alias));

                                    var serviceNode = {
                                        "id": 'network-' + networkName,
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
                                        nodes.pushUniqueNode(_createNetwork(networkName));
                                    LogService.warn('service ' + s + ' linked with  unknown network : ' + networkName + '')
                                }
                            }
                        } else {
                            LogService.warn('expected an array of services networks, simple string found')
                        }

                    } else {
                        // default networks has custom name
                        if (defaultNetwork) {

                            edges.pushUniqueNode(_linkServiceToNetwork(s,null,null))
                        } else {
                            // no default networks then link service to default network

                            edges.pushUniqueNode(_linkServiceToNetwork(s,null,null))
                        }
                    }
                    if(service['depends_on'] && options.displayDependsOn){
                        if(Array.isArray(service['depends_on'])){
                            for(var dep  in service['depends_on'] ){
                                edges.pushUniqueNode(
                                    _createDependsOnLink(s,
                                        service['depends_on'][dep])
                                )
                            }

                        } else{
                            for(var key  in service['depends_on'] ){
                                edges.pushUniqueNode(
                                    _createDependsOnLink(s,
                                        key)
                                )
                            }

                        }
                    }

                    if(options){
                        if(options.displayVolumes) {
                            if(service['volumes']){
                                var volumes = service['volumes'];
                                if(Array.isArray(volumes)){
                                    for(var v in volumes){
                                        var volume =volumes[v].split(':');
                                        if(externalVolumes[volume[0]]){
                                            nodes.pushUniqueNode(_addVolume(externalVolumes[volume[0]],volume[1]))
                                            edges.pushUniqueNode(_linkToVolume(s,externalVolumes[volume[0]],volume[1]))
                                        } else {
                                            nodes.pushUniqueNode(_addVolume(volume[0],volume[1]))
                                            edges.pushUniqueNode(_linkToVolume(s,volume[0],volume[1]))
                                        }
                                    }
                                }

                            }
                        }
                    }
                    if(options){
                        var sericeLinks  = service['links'];
                        var serviceExternalLinks =   service['external_links'];
                        var links = [];

                        if(Array.isArray(sericeLinks)){
                            links = links.concat(sericeLinks);
                        }
                        if(Array.isArray(serviceExternalLinks)){
                            links = links.concat(serviceExternalLinks);
                        }

                        if (links) {


                            for (var l in links) {
                                if (links[l]) {
                                    var link = links[l].split(':');
                                    edges.pushUniqueNode({
                                        id: 'service-' + s + '-to-' + 'service-' + link[0] + '-as-' + link[1],
                                        from: 'service-' + s,
                                        label: options.displayLinks ? (link[1] ? link[1] : link[0]) : '',
                                        arrows: 'to',
                                        physics:false,
                                        color:{
                                            opacity:options.displayLinks ? 1 :0,
                                        },
                                        chosen : {
                                            edge:function(values,id,selected){
                                                values.color = selected ?  '#a100ff' : '#a5e2ff';
                                                values.label =  '';

                                            }

                                        },
                                        smooth: {
                                            enabled: true,
                                            type: "discrete",
                                            roundness: 0.2
                                        },
                                        dashes: true,
                                        to: 'service-' + link[0]
                                    })
                                }

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

        composeToVis :_getNetworkModel,
        UUID: _guid

    }
}]);

