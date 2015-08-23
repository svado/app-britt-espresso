angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $http, $ionicPopup) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Variables globales
    $scope.monedaSymbol = '¢';
    $rutaPagesWs = 'http://pruebacr.cafebritt.com/app/ws/pages.cfc?returnformat=json&callback=&method=';
    $rutaAccountWs = 'http://pruebacr.cafebritt.com/app/ws/account.cfc?returnformat=json&callback=&method=';
    /*$rutaPagesWs = 'http://www.brittespresso.com/app/ws/pages.cfc?returnformat=json&callback=&method=';
    $rutaAccountWs = 'http://www.brittespresso.com/app/ws/account.cfc?returnformat=json&callback=&method=';*/
    $scope.rutaImagenes = 'http://www.brittespresso.com/siteimg/';

    // Inicializador
    $scope.loginData = {};
    $scope.signData = [];

    // Obtiene los datos locales
    $scope.getLocalData = function (elemento) {
        $elemento = {};
        if (window.localStorage.getItem(elemento) !== null)
            $elemento = JSON.parse(window.localStorage.getItem(elemento));
        return $elemento;
    }

    //Obtiene los datos del cliente
    $scope.loginData = $scope.getLocalData('cliente');

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modalLogin = modal;
    });

    // Create the signup  modal that we will use later
    $ionicModal.fromTemplateUrl('templates/signup.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modalSignUp = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modalLogin.hide();
    };

    // Triggered in the signup modal to close it
    $scope.closeSignUp = function () {
        $scope.modalSignUp.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modalLogin.show();
    };

    // Open the signup modal
    $scope.signup = function () {
        $scope.modalSignUp.show();
    };

    // Logout
    $scope.logout = function () {
        window.localStorage.removeItem("cliente");
    };

    // Esta loqueado?
    $scope.isLoggedIn = function () {
        if (window.localStorage.getItem("cliente") !== null) {
            $cliente = JSON.parse(window.localStorage.getItem("cliente"));
            if ($cliente.codigo_cliente !== undefined) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    // Alertas.
    $scope.showPopup = function ($title, $template) {
        var alertPopup = $ionicPopup.alert({
            title: $title,
            template: $template
        });
        alertPopup.then(function (res) {});
    };
})

// Manejo de Clientes
.controller('ContactCtrl', function ($scope, $http, $stateParams) {

    // Trata de loguearse en la web.
    $scope.doLogin = function () {

        $scope.error = true;
        $params = '&username=' + $scope.loginData.email + '&password=' + $scope.loginData.password;
        $method = 'getUser';

        $http.post($rutaAccountWs + $method + $params).
        success(function (data, status, headers) {
            if (data.length != 0) {
                if (data.ERROR == false) {
                    $cliente = {};
                    $cliente.codigo_cliente = data.CODIGO_CLIENTE;
                    $cliente.first_name = data.FIRST_NAME;
                    $cliente.last_name = data.LAST_NAME;
                    $cliente.email = data.EMAIL;
                    $scope.error = false;
                    window.localStorage.setItem('cliente', JSON.stringify($cliente));
                    console.log('Logueado', $cliente);
                    if (data.ALERTA.length != 0) $scope.showPopup('Ingreso', data.ALERTA);
                    $scope.closeLogin();
                } else
                if (data.ALERTA.length != 0) $scope.showPopup('Ingreso', data.ALERTA);
            } else {
                $scope.showPopup('Ingreso', 'Error de conexión');
            }
        }).
        error(function (data, status) {
            console.log(status);
        });
    };

    // Crea el cliente en la web.
    $scope.doSignUp = function () {

        $scope.error = true;
        $params = '&first_name=' + $scope.signData.first_name + '&last_name=' + $scope.signData.last_name + '&last_name=' + $scope.signData.last_name + '&email=' + $scope.signData.email + '&phone=' + $scope.signData.phone + '&password=' + $scope.signData.password + '&password2=' + $scope.signData.password2;
        $method = 'createUser';

        $http.post($rutaAccountWs + $method + $params).
        success(function (data, status, headers) {
            if (data.length != 0) {
                if (data.ERROR == false) {
                    $cliente = {};
                    $cliente.email = data.EMAIL;
                    window.localStorage.setItem('cliente', JSON.stringify($cliente));
                    $scope.error = false;
                    if (data.ALERTA.length != 0) $scope.showPopup('Registro', data.ALERTA);
                    $scope.login();
                } else
                if (data.ALERTA.length != 0) $scope.showPopup('Registro', data.ALERTA);
            } else {
                $scope.showPopup('Registro', 'Error de conexión');
            }
        }).
        error(function (data, status) {
            console.log(status);
        });
    }
})

// Lista de productos
.controller('ProductListCtrl', function ($scope, $http, $stateParams) {

    $params = '&url=' + $stateParams.page_url;
    $method = 'getProducts';

    $http.post($rutaPagesWs + $method + $params).
    success(function (data, status, headers) {
        $scope.products = data;
        $scope.page_url = $stateParams.page_url;
        $scope.error = false;
    }).
    error(function (data, status) {
        $scope.error = true;
        console.log(status);
    });
})

// Informacion de un producto
.controller('ProductInfoCtrl', function ($scope, $http, $stateParams) {

    $scope.productData = {};
    $scope.productData.cantidad_incluir = 1;

    $params = '&page_id=' + $stateParams.page_id;
    $method = 'getProductInfo';

    $http.post($rutaPagesWs + $method + $params).
    success(function (data, status, headers) {
        $scope.url = data.URL;
        $scope.title = data.TITLE;
        $scope.mini_description = data.MINI_DESCRIPTION;
        $scope.description = data.DESCRIPTION;
        $scope.imagen = $scope.rutaImagenes + data.IMAGEN;
        $scope.items = data.ITEMS;
        $scope.error = false;
    }).
    error(function (data, status) {
        $scope.error = true;
        console.log(status);
    });
});
