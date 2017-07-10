(function() {
    'use strict';
    var app = angular.module('mainApp');
    app.controller('userCtrl',['userSRV','$scope', '$location', '$rootScope', '$mdDialog', '$mdToast', 'localStorageService','$window',
        function (userSRV,$scope, $location, $rootScope, $mdDialog, $mdToast, localStorageService, $window) {

            $scope.profile = null;
            $scope.users = [];
            $scope.advs = [];
            $scope.useradvs = [];
            $scope.currentNavItem = 'Perfil';
            $scope.viewteam=false;
            $scope.masculine=[];
            $scope.femenine=[];
            $scope.classes = [{"title": "Masculí"}, {"title": "Femení"}];
            $scope.title={};
            $scope.body={};
            $scope.telephone={};
            $scope.captain={};
            $scope.name={};
            $scope.color={};
            $scope.category={};
            $scope.team={};
            $scope.dpoints={};

            angular.element(document).ready(function () {

                $scope.profile=localStorageService.get('userName')
                userSRV.getTeams(function (listTeams) {

                    for (var i = 0; i < listTeams.length; i++) {

                        if(listTeams[i].category==="Masculí"){

                            $scope.masculine.push(listTeams[i])
                        }
                        else{

                            $scope.femenine.push((listTeams[i]))
                        }

                    }


                })
            });

            $scope.addPoints=function (ev) {

                var points=Number($scope.dpoints)
                var data = {
                    points: $scope.dpoints,
                    team: $scope.team1
                }

                if ( isNaN(points)) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Els punts han de ser un número!')
                            .ok('Ok!')
                    );
                }else if(data.team==null){

                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Faltan camps per omplir!')
                            .ok('Ok!')
                    )
                } else {
                    var confirm = $mdDialog.confirm()
                        .title('Vols afegir punts a aquest equip?')
                        .targetEvent(ev)
                        .ok('Si')
                        .cancel('No');
                    $mdDialog.show(confirm).then(function () {
                        userSRV.updateTeam(data, function (response) {

                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title('Punts afegits')
                                    .ok('Ok!')
                            );

                            setTimeout(function () {
                                $scope.currentNavItem = 'Perfil';
                                location.reload()
                            }, 2000)

                        })
                    });
                }
            }

            $scope.addTeam = function (ev) {
                var data = {
                    name:$scope.name.n,
                    telephone:$scope.telephone.t,
                    color:$scope.color.c,
                    captain:$scope.captain.c,
                    category:$scope.category.c
                };
                if (data.name == null || data.telephone == null || data.color == null|| data.category==null ||data.captain==null) {

                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Faltan camps per omplir!')
                            .ok('Ok!')
                    );
                }
                else {
                    var confirm = $mdDialog.confirm()
                        .title('Vols crear aquest equip?')
                        .targetEvent(ev)
                        .ok('Si!')
                        .cancel('No');

                    $mdDialog.show(confirm).then(function () {
                        userSRV.addTeam(data, function (response) {
                            if (response == "500") {
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .clickOutsideToClose(true)
                                        .title('Ja exiteix un equip amb aquest nom')
                                        .ok('Ok!')
                                );
                            } else {

                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .clickOutsideToClose(true)
                                        .title('Equip creat.')
                                        .ok('Ok!')
                                );

                                setTimeout(function () {
                                    $scope.currentNavItem = 'Perfil';
                                    location.reload()
                                }, 2000)
                            }
                        })
                    });
                }


            };
            $scope.view=function () {
                $scope.viewteam=true;
            }
            $scope.unview=function () {
                $scope.viewteam=false;
            }
            $scope.addNew = function (ev) {
                var data = {
                    title:$scope.title,
                    body:$scope.body
                };
                if (data.body == null || data.title == null) {

                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Faltan camps per omplir!')
                            .ok('Ok!')
                    );
                }
                else {
                    var confirm = $mdDialog.confirm()
                        .title('Vols crear aquesta notícia?')
                        .targetEvent(ev)
                        .ok('Si!')
                        .cancel('No');

                    $mdDialog.show(confirm).then(function () {
                        userSRV.addNew(data, function (response) {
                            if (response == "500") {
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .clickOutsideToClose(true)
                                        .title('Ja existeix una notícia amb el mateix títol')
                                        .ok('Entendido!')
                                );
                            } else {

                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .clickOutsideToClose(true)
                                        .title('Notícia creada')
                                        .ok('Ok!')
                                );
                                $scope.title="";
                                $scope.body=""

                            }
                        })
                    });
                }


            };

            $scope.logoutWeb = function () {
                userSRV.logoutWeb(function () {
                    localStorageService.clearAll();
                    $scope.profile = null;
                    $location.path("/");
                    location.reload();

                })

            };

            $scope.getAdv = function (adv) {

                localStorageService.add('adv', adv);
                $rootScope.adv = localStorageService.get('adv');
                $location.path("/Event");

            };


            $scope.search = function () {

                if ($scope.search.word != undefined) {
                    userSRV.search($scope.search.word, function (response) {
                        localStorageService.add('advs', response);
                        location.reload();
                        $location.path("/Events");
                    });


                } else {
                    localStorageService.add('advs', null);
                    location.reload();
                    $location.path("/Events");
                }
            };

            $scope.showAdvanced = function (ev) {
                $mdDialog.show({
                    templateUrl: 'tpls/dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
            };
            $scope.logout = function () {
                localStorageService.clearAll();
                $scope.profile = null;
                $location.path("/");
            };
        }]);
})();