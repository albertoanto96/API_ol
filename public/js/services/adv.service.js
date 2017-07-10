(function () {
    'use strict';
    var app = angular.module('mainApp');
    app.service('advSRV', ['$http',function ($http) {


        this.getAdvs = function (callback) { //cambiar
            $http.get('/allAdvs').then(function (response) {
                callback(response.data);
            });

        };

        this.deleteadv = function (data, callback) {

            var req = {
                method: 'DELETE',
                url: '/deleteadv',
                headers: {'Content-Type': 'application/json'},
                data: data
            };

            $http(req).then(function (response) {
                callback(response.data)
            });

        };
        this.winneradv = function (data, callback) {

            var req = {
                method: 'PUT',
                url: '/winneradv',
                headers: {'Content-Type': 'application/json'},
                data: data
            };

            $http(req).then(function (response) {
                callback(response.data)
            });

        };
        this.getTeams=function (callback) {

            $http.get('/getTeams').then(function (response) {
                callback(response.data);
            });

        }

        this.addEvent = function (data, callback) {

            var req = {
                method: 'POST',
                url: '/addEvent',
                headers: {'Content-Type': 'application/json'},
                data: data
            };

            $http(req).then(function (response) {
                callback(response.data)
            });

        };

    }]);
})();

