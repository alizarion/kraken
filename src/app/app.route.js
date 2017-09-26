angular.module('kraken').config(
    [
        '$stateProvider',
        '$urlRouterProvider',
        function(
            $stateProvider,
            $urlRouterProvider
        ) {


            $stateProvider
                .state('home',{
                    url: "/home",
                    cache: false,
                    controller: 'HomeCtrl',
                    templateUrl: 'app/components/home/home.html',
                    controllerAs: 'home',
                    ncyBreadcrumb: {
                        label: 'Home'
                    }

                })

                .state({
                    name :'home.edit',
                    url: '/edit/:projectId?project&collection',
                    templateUrl: 'app/components/edit/edit.html',
                    controller: 'EditCtrl',
                    controllerAs: 'edit',
                    ncyBreadcrumb: {
                        label: 'Edit {{edit.currentProject.name}}'
                    }
                });


            $urlRouterProvider.otherwise('/home');


        }]);