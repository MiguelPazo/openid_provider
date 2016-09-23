<!DOCTYPE HTML>
<html ng-app="OpenIDConnect">
<head>
    <title>OpenId Connect Provider</title>
    <link rel="stylesheet" href="{{ asset('/js/libs/bootstrap/dist/css/bootstrap.min.css') }}"/>
</head>
<body ng-controller="loginController">
<div class="container">
    <div class="row">
        <p></p>

        <div class="col-sm-6 col-sm-offset-3">
            <form class="form-horizontal" ng-submit="send()">
                <div class="form-group">
                    <label for="user" class="col-sm-2 control-label">Usuario:</label>

                    <div class="col-sm-10">
                        <input type="text" class="form-control" ng-model="user.user">
                    </div>
                </div>
                <div class="form-group">
                    <label for="pass" class="col-sm-2 control-label">Contraseña:</label>

                    <div class="col-sm-10">
                        <input type="password" class="form-control" ng-model="user.pass">
                    </div>
                </div>
                <div class="form-group" ng-if="error">
                    <p>
                        [[ error ]]
                    </p>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-10">
                        <button type="submit" class="btn btn-default">Ingresar</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<script src="{{ asset('/js/libs/angular/angular.min.js') }}"></script>
<script src="{{ asset('/js/libs/ngstorage/ngStorage.min.js') }}"></script>
<script src="{{ asset('/js/login.js') }}"></script>
</body>
</html>