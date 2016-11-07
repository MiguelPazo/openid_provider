<!DOCTYPE HTML>
<html ng-app="OpenIDConnect">
<head>
    <title>OpenId Connect Provider</title>
    <link rel="stylesheet" href="js/libs/bootstrap/dist/css/bootstrap.min.css"/>
    <meta name="gsslo.federationId" content="5995a3c9"/>
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
<script src="js/libs/angular/angular.min.js"></script>
<script src="js/login.js"></script>
<script src="js/service/gsslo.js"></script>
</body>
</html>