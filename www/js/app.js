// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngMessages'])

.run(function ($ionicPlatform) {
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
    });
})

// Muestra un mensaje mientras carga datos en la vista
.run(function ($rootScope, $ionicLoading) {
    $rootScope.$on('loading:show', function () {
        $ionicLoading.show({
            template: 'Un momento por favor'
        })
    })

    $rootScope.$on('loading:hide', function () {
        $ionicLoading.hide()
    })
})

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

    // Manejo de paginas
    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })

    //Devuelve la lista de productos.
    .state('app.productlist', {
        url: '/products/:page_url',
        views: {
            'menuContent': {
                templateUrl: 'templates/products.html'
            }
        }
    })

    //Informacion de un producto
    .state('app.productinfo', {
        url: '/product/:page_id',
        views: {
            'menuContent': {
                templateUrl: 'templates/product.html'
            }
        }
    })

    //Informacion de un cliente
    .state('app.contactinfo', {
        url: '/my-account',
        views: {
            'menuContent': {
                templateUrl: 'templates/my-account.html'
            }
        }
    })

    //Profile del cliente
    .state('app.contactedit', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html'
            }
        }
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/products/espresso');
});
