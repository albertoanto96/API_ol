'use strict';
var app = angular.module('mainApp',
    ['ngRoute', 'ngMaterial', 'LocalStorageModule','ngMap'])

app.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.
    when('/', {
        templateUrl: 'tpls/advs.html',
        controller: 'advCtrl'
    }).when('/Events', {
        templateUrl: 'tpls/advs.html',
        controller: 'advCtrl'
    }).when('/Perfil', {
        templateUrl: 'tpls/profile.html',
        controller: 'userCtrl'
    }).when('/Event', {
        templateUrl: 'tpls/adv.html',
        controller: 'advCtrl'
    }).when('/NouEvent', {
        templateUrl: 'tpls/newAdv.html',
        controller: 'advCtrl'
    }).otherwise({redirectTo: '/Anuncios'})


}]);

app.controller('mainCtrl', ['$http', '$rootScope', '$scope', '$location', '$mdDialog', 'localStorageService', function ($http, $rootScope, $scope, $location, $mdDialog, localStorageService) {
    $scope.currentNavItem = 'Login';

    $scope.doLogin = function () {
        localStorageService.add('userName', $scope.userName);

        var newUser = {
            name: $scope.userName,
            password: $scope.userPass
        };
        $scope.userName = "";
        $scope.userPass = "";
        var req = {
            method: 'POST',
            url: '/loginw',
            headers: {'Content-Type': 'application/json'},
            data: newUser
        };
        $http(req).then(function (response) {


            localStorageService.set('userID', response.data[0]._id);
            if (angular.equals(response.data[0].name, newUser.name)) {
                localStorageService.set('userName',response.data[0].name)
                $scope.currentNavItem = 'Advs';
                $mdDialog.hide();
                $location.path("/Events");
                location.reload();
            }
             else {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Nombre de usuario y/o contraseña incorrectos.')
                        .ok('Entendido!')
                );
                localStorageService.clearAll();
            }
        });
    };
    $scope.doRegister = function () {
        var newUser = {
            name: $scope.userName,
            password: $scope.userPass
        };
        var req = {
            method: 'POST',
            url: '/push',
            headers: {'Content-Type': 'application/json'},
            data: newUser
        };
        $http(req).then(function (response) {

            if (response === "500") {
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('Imposible registrarse.')
                .ok('Entendido!');
                localStorageService.clearAll();

            }
            else{
                localStorageService.set('userID', response.data._id);
                localStorageService.set('userName', $scope.userName);
                $scope.doLogin();
                $mdDialog.hide();
            }

        });
    };
}]);
