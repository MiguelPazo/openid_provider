var app = angular.module("OpenIDConnect", ['ngStorage']);

app.config(function ($interpolateProvider, $localStorageProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
    $localStorageProvider.setKeyPrefix('app_');
});

app.controller('loginController', function ($scope, $http, $localStorage) {
    $scope.user = {
        user: null,
        pass: null
    };
    $scope.error = null;

    $scope.send = function () {
        $http({
            url: 'login',
            method: 'POST',
            data: $scope.user
        }).success(function (response) {
            if (response.success) {
                $localStorage.token = response.token;
            } else {
                $scope.error = response.message;
            }
        });
    }

    console.log(localStorage);

    console.log($localStorage.token);
});