angular.module('classifier').config(
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
                    controller: 'HomeCtrl',
                    templateUrl: 'app/components/home/home.html',
                    controllerAs: 'home',
                    ncyBreadcrumb: {
                        label: 'Home'
                    }

                })

                .state({
                    name :'home.edit',
                    url: '/edit/:id',
                    templateUrl: 'app/components/edit/edit.html',
                    controller: 'EditCtrl',
                    controllerAs: 'edit',
                    ncyBreadcrumb: {
                        label: 'Edit {{edit.currentProject.name}}'
                    }
                });


            $urlRouterProvider.otherwise('/home');


        }]);