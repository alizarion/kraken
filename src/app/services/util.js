angular
    .module('kraken').service('util',['LogService',function(LogService){




    function _getNetworkModel(compose){

        var nodes = [];
        var edges = [];

        if(compose['networks']){
            for (var n in compose['networks']){
                var network = compose['networks'][n]
                nodes.push(
                    {
                        "id":'networks-'+n,
                        "label":'networks :' + n,
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
            }
        }
        nodes.push(
            {
                "id":'networks-default',
                "label":'network : default',
                "size":10,
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

        for (var s in compose['services']){
            var service = compose['services'][s];
            if(service){


                console.log(service);
                nodes.push(
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
                        edges.push({
                            id:'services-'+s+'-to-'+'networks-'+ service['networks'][n],
                            from: 'services-'+s,
                            to : 'networks-'+ service['networks'][n]
                        })
                    }

                } else {
                    edges.push({
                        id:'services-'+s+'-to-'+'networks-default',
                        from: 'services-'+s,
                        to : 'networks-default'
                    })
                }
                if (service['links']){
                    for (var l in service['links']){
                        if(service['links'][l]){
                            var link = service['links'][l].split(':');
                            console.log(link)
                            edges.push({
                                id: 'services-'+s+'-to-'+'services-'+ link[0],
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

