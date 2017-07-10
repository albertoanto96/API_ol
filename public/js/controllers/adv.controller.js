(function () {
    'use strict';
    var app = angular.module('mainApp');
    app.controller('advCtrl', ['advSRV', '$scope', '$location', '$rootScope', '$mdDialog', '$mdToast', 'localStorageService',
        function (advSRV, $scope, $location, $rootScope, $mdDialog, $mdToast, localStorageService, NgMap) {

            $scope.profil = null;
            $scope.place={};
            $scope.category = {};
            $scope.sport={};
            $scope.link={};
            $scope.round={};
            $scope.team={};
            $scope.date={};
            $scope.time={};
            $scope.totaladv = [];
            $scope.reladv = [];
            $scope.boton = false;
            $scope.advs = [];
            $scope.user = localStorageService.get('userID');
            $scope.currentNavItem = 'Advs';
            $scope.places = [{"title": "Club de Begues"}, {"title": "Camp Municipal"},{"title":"Camí de Can Sadurní"}];
            $scope.classes = [{"title": "Masculí"}, {"title": "Femení"}];
            $scope.rounds = [{"title": "vuitens"}, {"title": "cuarts"}, {"title": "semifinal"}, {"title": "final"},{"title": "repesca"}];
            $scope.sports=[{nom:"Futbol-7"}, {nom:"Futbol-Sala"}, {nom:"Waterpolo"},
                    {
                        nom:"Petanca"
                    },
                    {
                        nom:"Bàsquet"
                    },
                    {
                        nom:"Ping-Pong"
                    },
                    {
                        nom:"Tenis"
                    },
                    {
                        nom:"Marató"
                    },
                    {
                        nom:"Dards"
                    },
                    {
                        nom:"Natació"
                    },
                    {
                        nom:"Minigolf"
                    },
                    {
                        nom:"Dominó"
                    },
                    {
                        nom:"Billar"
                    },
                    {
                        nom:"Futbolí"
                    },
                    {
                        nom:"Handbol"
                    },
                    {
                        nom:"Ciclisme"
                    },
                    {
                        nom:"Volei-Pista"
                    },
                    {
                        nom:"Volei-Platja"
                    },
                    {
                        nom:"Pàdel"
                    },
                    {
                        nom:"Frontó"
                    },
                    {
                        nom:"Escacs"
                    }
                ];
            $scope.masculine=[];
            $scope.femenine=[];
            $scope.points={p:0};
            $scope.points2={p:0};
            $scope.radioy={y:'false'};
            angular.element(document).ready(function () {
                $scope.profil=localStorageService.get('userName');
                $('#date').pickadate({
                    format: 'd/m/yyyy',
                    formatSubmit: 'd/m/yyyy',
                    hiddenName: true
                });
                $('#date2').pickadate({
                    format: 'd/m/yyyy',
                    formatSubmit: 'd/m/yyyy',
                    hiddenName: true
                });
                $('#time').pickatime({

                    format: 'H:i ',
                    interval:15,
                    formatLabel: undefined,
                    formatSubmit: undefined,
                    hiddenPrefix: undefined,
                    hiddenSuffix: '_submit'
                });

                advSRV.getTeams(function (listTeams) {
                    for (var i = 0; i < listTeams.length; i++) {

                        if(listTeams[i].category==="Masculí"){

                            $scope.masculine.push(listTeams[i])
                        }
                        else{

                            $scope.femenine.push((listTeams[i]))
                        }

                    }


                })

                if (localStorageService.get('advs') == null) {
                    advSRV.getAdvs(function (listadv) {
                        $scope.totaladv = listadv;
                        $scope.boton = false;
                        $scope.advs = listadv;
                        $rootScope.adv = localStorageService.get('adv');
                    });
                }
                else {
                    $scope.boton = true;
                    $scope.totaladv = localStorageService.get('advs')
                    $scope.advs = localStorageService.get('advs');
                    $rootScope.adv = localStorageService.get('adv');
                }
            });


            $scope.resetAdv = function () {
                localStorageService.add('advs', null);
                location.reload()
            };

            $scope.delete = function (ev) {

                var confirm = $mdDialog.confirm()
                    .title('Vols eliminar el event?')
                    .targetEvent(ev)
                    .ok('Si!')
                    .cancel('No');

                $mdDialog.show(confirm).then(function () {

                    var data = {
                        advid: $rootScope.adv.id
                    };
                    advSRV.deleteadv(data, function (response) {

                    });
                    $location.path("/Events");
                });

            };
            $scope.win1= function (ev) {

                var adv= $rootScope.adv
                var confirm = $mdDialog.confirm()
                    .title('Vols establir a '+ adv.team1 +' como guanyadors?')
                    .targetEvent(ev)
                    .ok('Si!')
                    .cancel('No');

                $mdDialog.show(confirm).then(function () {

                    var data = {
                        title:adv.title,
                        winner: adv.team1,
                        points:adv.points,
                        points2:adv.points2,
                        loser:adv.team2
                    };
                    advSRV.winneradv(data, function (response) {

                    });
                    $location.path("/Events");
                });

            };
            $scope.win2= function (ev) {

                var adv= $rootScope.adv
                var confirm = $mdDialog.confirm()
                    .title('Vols establir a '+ adv.team2 +' como guanyadors?')
                    .targetEvent(ev)
                    .ok('Si!')
                    .cancel('No');

                $mdDialog.show(confirm).then(function () {

                    var data = {
                        title:adv.title,
                        winner: adv.team2,
                        points:adv.points,
                        points2:adv.points2,
                        loser:adv.team1
                    };
                    advSRV.winneradv(data, function (response) {

                    });
                    $location.path("/Events");
                });

            };


            $scope.resetAdv = function () {
                localStorageService.add('advs', null)
                location.reload()
            }

            $scope.categoryAdv = function (c) {
                if(c!=undefined) {
                    $scope.category.cat = c.title
                }
                $scope.dateAdv()
                return $scope.category.cat
            }
            $scope.dateAdv = function () {
                $scope.advs = $scope.totaladv
                var catadv = [];
                var i = 0;

                if(typeof  $scope.date2!=='undefined' && typeof $scope.category.cat==='undefined') {
                    catadv=[];
                    for (i; i < $scope.advs.length; i++) {

                        if ($scope.advs[i].date === $scope.date2 ) {

                            catadv.push($scope.advs[i])
                        }

                    }
                    $scope.boton=true;
                    $scope.advs = catadv;
                }
                if(typeof  $scope.date2==='undefined' && typeof $scope.category.cat!=='undefined') {
                    catadv=[];
                    for (i; i < $scope.advs.length; i++) {

                        if ($scope.advs[i].category === $scope.category.cat ) {

                            catadv.push($scope.advs[i])
                        }

                    }
                    $scope.boton=true;
                    $scope.advs = catadv;
                }


                if(typeof  $scope.date2!=='undefined' && typeof $scope.category.cat!=='undefined') {
                    catadv=[];
                    for (i; i < $scope.advs.length; i++) {

                        if ($scope.advs[i].date === $scope.date2 && $scope.advs[i].category === $scope.category.cat) {

                            catadv.push($scope.advs[i])
                        }

                    }
                    $scope.boton=true;
                    $scope.advs = catadv;
                }

                return $scope.category.cat
            };


            $scope.getAdv = function (adv) {
                localStorageService.add('adv', adv);
                $rootScope.adv = localStorageService.get('adv');
                $location.path("/Event");

            };

            $scope.addEvent = function (ev) {

               var data = {
                    title: $scope.sport.sp+" ("+$scope.category.cat+") : "+$scope.team.team1+" vs " +$scope.team.team2 +". Partit de "+ $scope.round.r,
                    sport: $scope.sport.sp,
                    link: $scope.link.li,
                    round:$scope.round.r,
                    category: $scope.category.cat,
                    location: $scope.place.p,
                    team1:$scope.team.team1,
                    team2:$scope.team.team2,
                    date:$scope.date.d,
                    time:$scope.time.t,
                   all:$scope.radioy.y
                };
               if(data.all==='true'){
                   data.title=data.sport +", EVENT GLOBAL";
               }
               console.log(data)
                if ((data.sport == null || data.link == null || data.round == null|| data.category == null|| data.location == null|| data.team1 == null|| data.team2 == null|| data.date == null|| data.time == null)&&(data.all==='false')) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Faltan camps per omplir!')
                            .ok('Ok!')
                    );
                }
                else if ((data.sport == null || data.link == null || data.location == null|| data.date == null|| data.time == null)&&(data.all==='true')) {

                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Faltan camps per omplir!')
                            .ok('Ok!')
                    );
                }
                else if((data.team1===data.team2)&&(data.all==='false')){
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Els equips no poden ser els mateixos!')
                            .ok('Ok!')
                    );
                }

                else {
                    var confirm = $mdDialog.confirm()
                        .title('Esàs segur de que vols crear el event?')
                        .targetEvent(ev)
                        .ok('Ok!')
                        .cancel('No');

                    $mdDialog.show(confirm).then(function () {
                        advSRV.addEvent(data, function (response) {
                            if (response == "500") {
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .clickOutsideToClose(true)
                                        .title('Ja exitseix un event igual')
                                        .ok('Ok!')
                                );
                            } else {

                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .clickOutsideToClose(true)
                                        .title('Event creat correctament')
                                        .ok('Ok!')
                                );
                                $location.path("/Events");
                            }
                        })
                    });
                }


            };

            $scope.cancelAdv = function (ev) {
                var confirm = $mdDialog.confirm()
                    .title('Vols cancelar aquest event?')
                    .targetEvent(ev)
                    .ok('Si!')
                    .cancel('No');

                $mdDialog.show(confirm).then(function () {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Event cancelat.')
                            .ok('Ok!')
                    );
                    $scope.currentNavItem = 'Anuncios';
                    $location.path("/Events");
                });
            }

        }]);
})();
