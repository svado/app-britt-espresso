angular.module('starter.controllers', ['app.services', 'app.services'])

// Controlador general
.controller('AppCtrl', function ($scope, $ionicModal, $ionicPlatform, $timeout, $http, $ionicPopup, $state) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Inicializador
    $scope.loginData = {};
    $scope.signData = [];
    $scope.isLoggedIn = isLoggedIn;

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

    // Alertas
    $scope.showPopup = function ($title, $template) {
        var alertPopup = $ionicPopup.alert({
            title: $title,
            template: $template
        });
        alertPopup.then(function (res) {});
    };

    // Actualiza una paginas
    $scope.refreshPage = function () {
        $state.go($state.current, {}, {
            reload: true
        });
    }

})

// Manejo de clientes
.controller('ContactCtrl', function ($scope, $http, $stateParams, $state, WebSql) {

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

                    //WebSql.addCliente($cliente);

                    $scope.closeLogin();
                    $state.go("app.contactinfo");
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
        $params = '&first_name=' + $scope.signData.first_name + '&last_name=' + $scope.signData.last_name + '&email=' + $scope.signData.email + '&phone=' + $scope.signData.phone + '&password=' + $scope.signData.password + '&password2=' + $scope.signData.password2;
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
    };

    // Actualiza un contacto
    $scope.updContact = function () {

        // TODO: actualizar perfil en local storage.

        $scope.error = true;
        $params = '&first_name=' + $scope.first_name + '&last_name=' + $scope.last_name + '&email=' + $scope.email + '&phone=' + $scope.phone + '&password=' + $scope.password + '&password2=' + $scope.password2 + '&codigo_cliente=' + $scope.codigo_cliente + '&codigo_email=' + $scope.codigo_email + '&codigo_phone=' + $scope.codigo_phone;
        $method = 'updContact';

        $http.post($rutaAccountWs + $method + $params).
        success(function (data, status, headers) {
            if (data.length != 0) {
                if (data.ERROR == false) {
                    console.log('actualizado');
                    $scope.error = false;
                    if (data.ALERTA.length != 0) $scope.showPopup('Perfil', data.ALERTA);
                } else
                if (data.ALERTA.length != 0) $scope.showPopup('Perfil', data.ALERTA);
            } else {
                $scope.showPopup('Perfil', 'Error de conexión');
            }
        }).
        error(function (data, status) {
            console.log(status);
        });
    };

    // Actualiza la direccion de un contacto
    $scope.updContactAddress = function () {

        $scope.error = true;
        $params = '&codigo_cliente=' + $scope.codigo_cliente + '&codigo_address=' + $scope.codigo_address + '&address_1=' + $scope.address_1 + '&address_2=' + $scope.address_2 + '&city=' + $scope.city + '&state=' + $scope.codigo_state + '&zipcode=' + $scope.zipcode + '&phone=' + $scope.phone + '&first_name=' + $scope.first_name + '&last_name=' + $scope.last_name + '&email=' + $scope.email;
        $method = 'updContactAddress';

        $http.post($rutaAccountWs + $method + $params).
        success(function (data, status, headers) {
            if (data.length != 0) {
                if (data.ERROR == false) {
                    $scope.codigo_address = data.CODIGO_ADDRESS;
                    $scope.error = false;
                    if (data.ALERTA.length != 0) $scope.showPopup('Mi dirección', data.ALERTA);
                } else
                if (data.ALERTA.length != 0) $scope.showPopup('Mi dirección', data.ALERTA);
            } else {
                $scope.showPopup('Mi dirección', 'Error de conexión');
            }
        }).
        error(function (data, status) {
            console.log(status);
        });
    };

    // Actualiza la tarjeta de un contacto
    $scope.updContactCreditcard = function () {

        $scope.error = true;
        $params = '&codigo_cliente=' + $scope.codigo_cliente + '&codigo_credit_card=' + $scope.codigo_credit_card + '&credit_card_number=' + $scope.credit_card_number + '&validation_number=' + $scope.validation_number + '&exp_month=' + $scope.exp_month + '&exp_year=' + $scope.exp_year + '&card_holder_name=' + $scope.card_holder_name;
        $method = 'updContactPayment';

        $http.post($rutaAccountWs + $method + $params).
        success(function (data, status, headers) {
            if (data.length != 0) {
                if (data.ERROR == false) {
                    $scope.codigo_credit_card = data.CODIGO_CREDIT_CARD;
                    $scope.error = false;
                    if (data.ALERTA.length != 0) $scope.showPopup('Mi Tarjeta', data.ALERTA);
                } else
                if (data.ALERTA.length != 0) $scope.showPopup('Mi Tarjeta', data.ALERTA);
            } else {
                $scope.showPopup('Mi Tarjeta', 'Error de conexión');
            }
        }).
        error(function (data, status) {
            console.log(status);
        });
    };

})

// Lista de productos
.controller('ProductListCtrl', function ($scope, $http, $stateParams) {

    $scope.$rutaImagenes = $rutaImagenes;

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

    $scope.totalitems = $totalitems;
    $scope.productData = {};
    $scope.productData.cantidad_incluir = "1";
    $scope.rutaImagenes = $rutaImagenes;
    $scope.monedaSymbol = $monedaSymbol;

    $params = '&page_id=' + $stateParams.page_id;
    $method = 'getProductInfo';

    $http.post($rutaPagesWs + $method + $params).
    success(function (data, status, headers) {
        $scope.url = data.URL;
        $scope.title = data.TITLE;
        $scope.mini_description = data.MINI_DESCRIPTION;
        $scope.description = data.DESCRIPTION;
        $scope.imagen = $rutaImagenes + data.IMAGEN;
        $scope.items = data.ITEMS;
        $scope.error = false;
    }).
    error(function (data, status) {
        $scope.error = true;
        console.log(status);
    });

})

// Informacion de un contacto
.controller('ContactInfoCtrl', function ($scope, $http, $stateParams, $ionicHistory) {

    // Lista de provincias, meses
    $scope.stateslst = $states;
    $scope.meseslst = $meses;
    $scope.anoslist = $anostarjeta;

    $cliente = $scope.getLocalData('cliente');
    $params = '&codigo_cliente=' + $cliente.codigo_cliente;
    $method = 'getContact';

    if ($ionicHistory.currentView().stateName == 'app.addressedit')
        $params = $params + '&codigo_address=' + $stateParams.address_id;
    else if ($ionicHistory.currentView().stateName == 'app.paymentedit')
        $params = $params + '&codigo_credit_card=' + $stateParams.payment_id;

    $http.post($rutaAccountWs + $method + $params).success(function (data, status, headers) {

        $scope.codigo_cliente = data.CODIGO_CLIENTE;
        $scope.first_name = data.FIRST_NAME;
        $scope.last_name = data.LAST_NAME;
        $scope.email = data.EMAIL;
        $scope.address_1 = data.ADDRESS_1;
        $scope.address_2 = data.ADDRESS_2;
        $scope.city = data.CITY;
        $scope.state = data.STATE;
        $scope.pais = data.PAIS;
        $scope.phone = data.PHONE;
        $scope.codigo_email = data.CODIGO_EMAIL;
        $scope.codigo_address = data.CODIGO_ADDRESS;
        $scope.codigo_phone = data.CODIGO_PHONE;
        $scope.codigo_state = data.CODIGO_STATE;
        $scope.zipcode = data.ZIPCODE;
        $scope.codigo_credit_card = data.CODIGO_CREDIT_CARD;
        $scope.card_holder_name = data.CARD_HOLDER_NAME;
        $scope.exp_month = data.EXP_MONTH;
        $scope.exp_year = data.EXP_YEAR;
        $scope.number_display = data.NUMBER_DISPLAY;
        $scope.validation_number = data.VALIDATION_NUMBER;
        $scope.credit_card_number = '';
        $scope.password = '';
        $scope.password2 = '';
        $scope.addresses = data.ADDRESSES;
        $scope.cards = data.CARDS;
        $scope.error = false;
    }).error(function (data, status) {
        $scope.error = true;
        console.log(status);
    });

    // Borra la direccion de un contacto
    $scope.delContactAddress = function () {

        $scope.error = true;
        $params = '&codigo_cliente=' + $scope.codigo_cliente + '&codigo_address=' + $scope.codigo_address;
        $method = 'removeAddress';

        $http.post($rutaAccountWs + $method + $params).
        success(function (data, status, headers) {
            if (data.length != 0) {
                if (data.ERROR == false) {
                    $scope.error = false;
                    if (data.ALERTA.length != 0) $scope.showPopup('Mi dirección', data.ALERTA);
                    $scope.refreshPage();
                } else
                if (data.ALERTA.length != 0) $scope.showPopup('Mi dirección', data.ALERTA);
            } else {
                $scope.showPopup('Mi dirección', 'Error de conexión');
            }
        }).
        error(function (data, status) {
            console.log(status);
        });
    };

    // Borra la tarjeta de un contacto
    $scope.delContactCard = function () {

        $scope.error = true;
        $params = '&codigo_cliente=' + $scope.codigo_cliente + '&codigo_credit_card=' + $scope.codigo_credit_card;
        $method = 'removeCreditCard';

        $http.post($rutaAccountWs + $method + $params).
        success(function (data, status, headers) {
            if (data.length != 0) {
                if (data.ERROR == false) {
                    $scope.error = false;
                    if (data.ALERTA.length != 0) $scope.showPopup('Mi tarjeta', data.ALERTA);
                    $scope.refreshPage();
                } else
                if (data.ALERTA.length != 0) $scope.showPopup('Mi tarjeta', data.ALERTA);
            } else {
                $scope.showPopup('Mi tarjeta', 'Error de conexión');
            }
        }).
        error(function (data, status) {
            console.log(status);
        });
    };
})

// Informacion de un producto
.controller('BasketInfoCtrl', function ($scope, $http, $stateParams, WebSql) {

    $scope.items = [];

    WebSql.getBasket().then(function (result) {
        $scope.items = result;
        console.log($scope.items);
    });
})
