// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngMessages', 'app.services', 'angular.filter'])

.run(function ($ionicPlatform, WebSql) {
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
        $rutaPagesWs = 'http://prueba.cafebritt.com/app/brittespresso/ws/pages.cfc?returnformat=json&callback=&method=';
        $rutaAccountWs = 'http://prueba.cafebritt.com/app/brittespresso/ws/account.cfc?returnformat=json&callback=&method=';
        $rutaOrderWs = 'http://prueba.cafebritt.com/app/brittespresso/ws/order.cfc?returnformat=json&callback=&method=';
        /*$rutaPagesWs = 'http://www.cafebritt.com/app/brittespresso/ws/pages.cfc?returnformat=json&callback=&method=';
        $rutaAccountWs = 'http://www.cafebritt.com/app/brittespresso/ws/account.cfc?returnformat=json&callback=&method=';
        $rutaOrderWs = 'http://www.cafebritt.com/app/brittespresso/ws/order.cfc?returnformat=json&callback=&method=';*/
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
        }
    })

})

// Directiva: solo digitar numeros
.directive('onlyDigits', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/[^0-9]/g, '');

                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseInt(digits, 10);
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
})

// Manejo de paginas
.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    // Intercepta un evento http cuando es invocado
    $httpProvider.interceptors.push(function ($rootScope) {
        return {
            request: function (config) {
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

            // Necesita estar logueado
            if (stateData.needLogged && !isLoggedIn()) {
                return $q.reject("No logged");
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
                needLogged: false
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
            needLogged: false
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
            needLogged: false
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
            needLogged: false
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
            needLogged: true
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
            needLogged: true
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
            needLogged: true
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
            needLogged: true
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
            needLogged: false
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
            needLogged: false
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
            needLogged: true
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
            needLogged: true
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
            needLogged: false
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
            needLogged: false
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
            needLogged: false
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
            needLogged: true
        }
    })


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');

});
