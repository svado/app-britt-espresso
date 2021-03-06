// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngMessages', 'app.services', 'angular.filter', 'ngCordova'])
    //angular.module('starter', ['ionic', 'starter.controllers', 'ngMessages', 'app.services', 'angular.filter', 'ngCordova', 'ionic.service.core', 'ionic.service.push'])

.run(function ($ionicPlatform, WebSql, $state, $rootScope, $ionicPopup, $ionicHistory, $timeout) {

    $ionicPlatform.ready(function () {

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        // Inicializa la base de datos
        WebSql.createDbAndTables();

        // Variables globales
        $tiendaImpuesto = 13;
        $monedaSymbol = '¢';
        /*$rutaPagesWs = 'http://prueba.cafebritt.com/app/brittespresso/ws/pages.cfc?returnformat=json&callback=&method=';
        $rutaAccountWs = 'http://prueba.cafebritt.com/app/brittespresso/ws/account.cfc?returnformat=json&callback=&method=';
        $rutaOrderWs = 'http://prueba.cafebritt.com/app/brittespresso/ws/order.cfc?returnformat=json&callback=&method=';*/
        $rutaPagesWs = 'http://www.cafebritt.com/app/brittespresso/ws/pages.cfc?returnformat=json&callback=&method=';
        $rutaAccountWs = 'http://www.cafebritt.com/app/brittespresso/ws/account.cfc?returnformat=json&callback=&method=';
        $rutaOrderWs = 'http://www.cafebritt.com/app/brittespresso/ws/order.cfc?returnformat=json&callback=&method=';
        $rutaImagenes = 'http://www.brittespresso.com/siteimg/';

        // Maximo de productos permitidos
        $totalitems = [];
        for (var i = 1; i <= 99; i++) $totalitems.push(i);

        // Años tarjeta
        $anostarjeta = [];
        $currentyear = new Date().getFullYear();
        $maxyear = $currentyear + 10;
        for (var i = $maxyear; i >= $currentyear; i--) $anostarjeta.push(i);

        // Estados de Costa Rica
        $states = {};
        $states = [
            {
                codigo_state: "ALAJ",
                nombre: "Alajuela"
            },
            {
                codigo_state: "CAR",
                nombre: "Cartago"
            },
            {
                codigo_state: "GUAN",
                nombre: "Guanacaste"
            },
            {
                codigo_state: "HER",
                nombre: "Heredia"
            },
            {
                codigo_state: "LIM",
                nombre: "Limon"
            },
            {
                codigo_state: "PUN",
                nombre: "Puntarenas"
            },
            {
                codigo_state: "SJO",
                nombre: "San Jose"
            }

        ];

        // Meses
        $meses = {};
        $meses = [
            {
                mes: "01",
                nombre: "Enero"
            },
            {
                mes: "02",
                nombre: "Febrero"
            },
            {
                mes: "03",
                nombre: "Marzo"
            }, {
                mes: "04",
                nombre: "Abril"
            }, {
                mes: "05",
                nombre: "Mayo"
            }, {
                mes: "06",
                nombre: "Junio"
            }, {
                mes: "07",
                nombre: "Julio"
            }, {
                mes: "08",
                nombre: "Agosto"
            }, {
                mes: "09",
                nombre: "Setiembre"
            }, {
                mes: "10",
                nombre: "Octubre"
            }, {
                mes: "11",
                nombre: "Noviembre"
            },
            {
                mes: "12",
                nombre: "Diciembre"
            }
        ];


        //$state.go('app.home');
    });

    // Esta loqueado?
    isLoggedIn = function () {
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

    // Tiene items en el basket
    hasBasket = function () {

        if (window.localStorage.getItem("orden") !== null) {
            $cliente = JSON.parse(window.localStorage.getItem("orden"));
            if ($cliente.hasItems) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    // Tiene shipping
    hasShipping = function () {
        if (window.localStorage.getItem("orden") !== null) {
            $cliente = JSON.parse(window.localStorage.getItem("orden"));
            if ($cliente.hasShipping) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    // Doble back para salir
    $ionicPlatform.registerBackButtonAction(function (e) {
        if ($rootScope.backButtonPressedOnceToExit) {
            ionic.Platform.exitApp();
        } else if ($ionicHistory.backView()) {
            $ionicHistory.goBack();
        } else {
            $rootScope.backButtonPressedOnceToExit = true;
            var alertPopup = $ionicPopup.alert({
                title: 'Desea salir?',
                template: 'Presione atrás 2 veces para salir'
            });
            alertPopup.then(function (res) {});

            setTimeout(function () {
                $rootScope.backButtonPressedOnceToExit = false;
            }, 2000);
        }
        e.preventDefault();
        return false;
    }, 101);

})

.run(function ($rootScope, $ionicLoading, $state) {

    // Muestra un mensaje mientras carga datos en la vista
    $rootScope.$on('loading:show', function () {
        $ionicLoading.show({
            template: 'Un momento por favor'
        })
    })

    $rootScope.$on('loading:hide', function () {
        $ionicLoading.hide()
    })

    // Manejo de accesos
    $rootScope.$on('$stateChangeError', function (e, toState, toParams, fromState, fromParams, error) {

        console.log(error);

        if (error === "No logged") {
            $state.go("app.loginpage");
        } else if (error === 'Invalid access') {
            $state.go("app.invalidaccess");
        } else if (error === 'No logged shipping') {
            $state.go("app.loginshipping");

        }
    })

})

// Manejo de paginas
.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
    //.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider, $ionicAppProvider) {

    // Configuracion general
    $ionicConfigProvider.backButton.text('Atrás');

    // Id de la aplicacion
    /*$ionicAppProvider.identify({
    app_id: '356cbc2f',
    api_key: '77fbd68f1e4fee8d57a1e3606dca31a71b529243f085cf3d',
    dev_push: true
});*/

    // Intercepta un evento http cuando es invocado
    $httpProvider.interceptors.push(function ($rootScope) {
        return {
            request: function (config) {
                if (config.url != 'https://push.ionic.io/dev/push/check')
                    $rootScope.$broadcast('loading:show')
                return config
            },
            response: function (response) {
                $rootScope.$broadcast('loading:hide')
                return response
            }
        }
    })

    // Seguridad
    $stateProvider.decorator('data', function (state, parent) {
        var stateData = parent(state);
        state.resolve = state.resolve || {};

        state.resolve.security = ['$q', function ($q) {

            if (stateData.needLogged && !isLoggedIn()) {

                if (state.self.name == 'app.shipping' || state.self.name == 'app.confirmation') {

                    // Necesita estar logueado para seguir con el shipping
                    return $q.reject("No logged shipping");

                } else {

                    // Necesita estar logueado
                    return $q.reject("No logged");
                }

            } else if (stateData.needItems && !hasBasket()) {

                // Necesita items
                return $q.reject("Invalid access");

            } else if (stateData.needShipping && !hasShipping()) {

                // Necesita shipping
                return $q.reject("Invalid access");
            }
           }];

        return stateData;
    })

    // Manejo de paginas
    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl',
            data: {
                needLogged: false,
                needItems: false,
                needShipping: false
            }
        })

    //Devuelve la lista de productos.
    .state('app.productlist', {
        url: '/products/:page_url',
        views: {
            'menuContent': {
                templateUrl: 'templates/products.html'
            }
        },
        data: {
            needLogged: false,
            needItems: false,
            needShipping: false
        }
    })

    //Informacion de un producto
    .state('app.productinfo', {
        url: '/product/:page_id',
        views: {
            'menuContent': {
                templateUrl: 'templates/product.html'
            }
        },
        data: {
            needLogged: false,
            needItems: false,
            needShipping: false
        }
    })

    //Informacion de un combo
    .state('app.comboinfo', {
        url: '/combo/:page_id',
        views: {
            'menuContent': {
                templateUrl: 'templates/combo.html'
            }
        },
        data: {
            needLogged: false,
            needItems: false,
            needShipping: false
        }
    })

    //Informacion de un cliente
    .state('app.contactinfo', {
        url: '/my-account',
        views: {
            'menuContent': {
                templateUrl: 'templates/my-account.html'
            }
        },
        data: {
            needLogged: true,
            needItems: false,
            needShipping: false
        }
    })

    //Perfil de un cliente
    .state('app.profileinfo', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html'
            }
        },
        data: {
            needLogged: true,
            needItems: false,
            needShipping: false
        }
    })

    //Direccion del cliente
    .state('app.addressedit', {
        url: '/my-address/:address_id',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/my-address.html'
            }
        },
        data: {
            needLogged: true,
            needItems: false,
            needShipping: false
        }
    })

    //Tarjeta del cliente
    .state('app.paymentedit', {
        url: '/my-payment/:payment_id',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/my-payment.html'
            }
        },
        data: {
            needLogged: true,
            needItems: false,
            needShipping: false
        }
    })

    //Acceso invalido
    .state('app.invalidaccess', {
        url: '/invalid-access',
        views: {
            'menuContent': {
                templateUrl: 'templates/invalid-access.html'
            }
        },
        data: {
            needLogged: false,
            needItems: false,
            needShipping: false
        }
    })

    //Basket
    .state('app.basket', {
        url: '/basket',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/basket.html'
            }
        },
        data: {
            needLogged: false,
            needItems: true,
            needShipping: false
        }
    })

    //Shipping
    .state('app.shipping', {
        url: '/shipping',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/shipping.html'
            }
        },
        data: {
            needLogged: true,
            needItems: true,
            needShipping: false
        }
    })

    //Confirmacion
    .state('app.confirmation', {
        url: '/confirmation',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/confirmation.html'
            }
        },
        data: {
            needLogged: true,
            needItems: true,
            needShipping: true
        }
    })

    //Shipping login
    .state('app.loginshipping', {
        url: '/login-shipping',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/login-shipping.html'
            }
        },
        data: {
            needLogged: false,
            needItems: false,
            needShipping: false
        }
    })

    //Shipping page
    .state('app.loginpage', {
        url: '/login-page',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/login-page.html'
            }
        },
        data: {
            needLogged: false,
            needItems: false,
            needShipping: false
        }
    })

    //Mis ordenes
    .state('app.myorders', {
        url: '/my-orders',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/my-orders.html'
            }
        },
        data: {
            needLogged: true,
            needItems: false,
            needShipping: false
        }
    })

    //Confirmacion de la orden
    .state('app.confirmation-success', {
        url: '/confirmation-success/:order_id',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/confirmation-success.html'
            }
        },
        data: {
            needLogged: true,
            needItems: false,
            needShipping: false
        }
    })

    //Confirmacion de la orden pendiente
    .state('app.confirmation-pending', {
        url: '/confirmation-pending/:order_id',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/confirmation-pending.html'
            }
        },
        data: {
            needLogged: true,
            needItems: false,
            needShipping: false
        }
    })

    //Home
    .state('app.home', {
        url: '/home',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/home.html'
            }
        },
        data: {
            needLogged: false,
            needItems: false,
            needShipping: false
        }
    })

    //Contenido
    .state('app.content', {
        url: '/contenido/:page_url',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/content.html'
            }
        },
        data: {
            needLogged: false,
            needItems: false,
            needShipping: false
        }
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');

});
