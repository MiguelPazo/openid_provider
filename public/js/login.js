var app = angular.module('OpenIDConnect', []);

app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
});

app.controller('loginController', function ($scope, $http) {
    $scope.user = {
        user: null,
        pass: null
    };
    $scope.error = null;
    $scope.token = 'token.5995a3c9';

    $scope.send = function () {
        $http({
            url: 'login',
            method: 'POST',
            data: $scope.user
        }).success(function (response) {
            if (response.success) {
                gsslo.login(response.jwt);
            } else {
                $scope.error = response.message;
            }
        });
    }
});