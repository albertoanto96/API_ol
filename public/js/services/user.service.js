(function() {
    'use strict';
    var app = angular.module('mainApp');
    app.service('userSRV', ['$http','Upload','localStorageService',function ($http,Upload,localStorageService) {


        this.logoutWeb=function (callback) {
            var req = {
                method: 'POST',
                url: '/logout',
                headers: {'Content-Type': 'application/json'},

            };
            $http(req).then(function (response) {
                callback(response.data)
            });
        }

        this.search =function (data,callback) {

            var req = {
                method: 'GET',
                data: data,
                url: '/search/'+data,
                headers: {'Content-Type': 'application/json'}

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
        this.addTeam = function (data, callback) {

            var req = {
                method: 'POST',
                url: '/addTeam',
                headers: {'Content-Type': 'application/json'},
                data: data
            };

            $http(req).then(function (response) {
                callback(response.data)
            });

        };
        this.updateTeam = function (data, callback) {

            var req = {
                method: 'PUT',
                url: '/updateTeam',
                headers: {'Content-Type': 'application/json'},
                data: data
            };

            $http(req).then(function (response) {
                callback(response.data)
            });

        };
        this.addNew = function (data, callback) {

            var req = {
                method: 'POST',
                url: '/addNew',
                headers: {'Content-Type': 'application/json'},
                data: data
            };

            $http(req).then(function (response) {
                callback(response.data)
            });

        };

    }]);
})();