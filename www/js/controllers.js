angular.module('starter.controllers', ['app.services', 'app.services'])

// Controlador general
.controller('AppCtrl', function ($scope, $ionicModal, $ionicPlatform, $timeout, $http, $ionicPopup, $state, $parse, $ionicHistory) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Inicializador
    $scope.loginData = {};
    $scope.signData = [];
    $scope.resetData = [];
    $scope.addressData = [];
    $scope.cardData = [];
    $scope.isLoggedIn = isLoggedIn;
    $scope.hasBasket = hasBasket;

    // Es IOS o no
    $scope.isIOS = function () {
        if (ionic.Platform.isIOS() || ionic.Platform.isIPad())
            return true;
        else
            return false;
    }

    // Inactiva el boton de atras
    /*$ionicHistory.nextViewOptions({
        historyRoot: true,
        disableBack: true
    });*/

    // Obtiene los datos locales
    $scope.getLocalData = function (elemento) {
        $elemento = {};
        if (window.localStorage.getItem(elemento) !== null)
            $elemento = JSON.parse(window.localStorage.getItem(elemento));
        return $elemento;
    }

    // Obtiene los datos de sesion
    $scope.getSessionlData = function (elemento) {
        $elemento = {};
        if (window.sessionStorage.getItem(elemento) !== null)
            $elemento = JSON.parse(window.sessionStorage.getItem(elemento));
        return $elemento;
    }

    //Obtiene los datos del cliente
    $scope.loginData = $scope.getLocalData('cliente');

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login-modal.html', {
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

    // Create the reset  modal that we will use later
    $ionicModal.fromTemplateUrl('templates/reset.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modalReset = modal;
    });

    // Create the address modal that we will use later
    $ionicModal.fromTemplateUrl('templates/address-edit-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modalAddress = modal;
    });
    $scope.openModal = function () {
        $scope.modalAddress.show();
    };
    $scope.closeModal = function () {
        $scope.modalAddress.hide();
    };

    // Create the payment modal that we will use later
    $ionicModal.fromTemplateUrl('templates/payment-edit-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modalPayment = modal;
    });
    $scope.openModal = function () {
        $scope.modalPayment.show();
    };
    $scope.closeModal = function () {
        $scope.modalPayment.hide();
    };

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modalLogin.hide();
    };

    // Triggered in the signup modal to close it
    $scope.closeSignUp = function () {
        $scope.modalSignUp.hide();
    };

    // Triggered in the reset modal to close it
    $scope.closeReset = function () {
        $scope.modalReset.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modalLogin.show();
    };

    // Open the signup modal
    $scope.signup = function () {
        $scope.modalSignUp.show();
    };

    // Open the reset modal
    $scope.reset = function () {
        $scope.modalReset.show();
    };

    // Logout
    $scope.logout = function () {
        window.localStorage.removeItem("cliente");
        window.localStorage.removeItem("orden");
        $state.go("app.home");
    };

    // Alertas
    $scope.showPopup = function ($title, $template) {
        var alertPopup = $ionicPopup.alert({
            title: $title,
            template: $template
        });
        alertPopup.then(function (res) {});
    };

    // Alertas de confirmacion
    $scope.showConfirm = function (titulo, subtitulo, negativo, positivo, fnRetorna) {
        $ionicPopup.show({
            title: titulo,
            subTitle: subtitulo,
            scope: $scope,
            buttons: [
                {
                    text: negativo,
                    type: 'button-light',
                    onTap: function (e) {
                        return true;
                    }
                    },
                {
                    text: positivo,
                    type: 'button-positive',
                    onTap: function (e) {
                        //return $scope.showConfirmOK();
                        return $scope.$eval(fnRetorna);
                    }
                },

              ]
        }).then(function (res) {
            //console.log('Tapped!', res);
        }, function (err) {
            //console.log('Err:', err);
        }, function (msg) {
            //console.log('message:', msg);
        });
    };

    // Actualiza una paginas
    $scope.refreshPage = function () {
        $state.go($state.current, {}, {
            reload: true
        });
    }
})

// Pagina principal
.controller('HomeCtrl', function ($scope, $rootScope, $http, $timeout, $ionicHistory) {

    // Inactiva el boton de atras
    $ionicHistory.nextViewOptions({
    historyRoot: true,
    disableBack: true
});

    // Timer para la primera vez
    var timer = 3000;
    var $paginas = $scope.getSessionlData('paginas') || {};
    if ($paginas.HomeCtrl !== undefined) {
        timer = 0;

    } else {
        $paginas.HomeCtrl = true;
        window.sessionStorage.setItem('paginas', JSON.stringify($paginas));
    }

    $timeout(function () {
        $scope.hasBasket = hasBasket;
        $params = '&template_id=54&article_types=70';
        $method = 'getPageArticles';
        $http.post($rutaPagesWs + $method + $params).
        success(function (data, status, headers) {
            $scope.banners = data;
            $scope.error = false;
        }).
        error(function (data, status) {
            $scope.error = true;
            console.log(status);
        });

    }, timer);

})

// Manejo de clientes
.controller('ContactCtrl', function ($scope, $rootScope, $http, $stateParams, $state, $ionicHistory) {

    // Inactiva el boton de atras
    /*$ionicHistory.nextViewOptions({
        historyRoot: true,
        disableBack: true
    });*/

    // Trata de loguearse en la web.
    $scope.doLogin = function (page) {

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

                    // Reenvia a la cuenta o continua con el envio
                    if (page == 'shipping')
                        $state.go("app.shipping");
                    else
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

    // Resetea la clave
    $scope.doReset = function () {
        $scope.error = true;
        $params = '&email=' + $scope.resetData.email;
        $method = 'resetPassword';
        $http.post($rutaAccountWs + $method + $params).
        success(function (data, status, headers) {
            if (data.length != 0) {
                if (data.ERROR == false) {
                    $scope.error = false;
                    if (data.ALERTA.length != 0) $scope.showPopup('Solicitud enviada', data.ALERTA);
                    $scope.closeReset();
                    $scope.login();
                } else
                if (data.ALERTA.length != 0) $scope.showPopup('Ingreso', data.ALERTA);
            } else {
                $scope.showPopup('Registro', 'Error de conexión');
            }
        }).
        error(function (data, status) {
            console.log(status);
        });
    }

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
                    $scope.closeSignUp();
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
        $params = '&codigo_cliente=' + $scope.codigo_cliente + '&codigo_address=' + $scope.codigo_address + '&address_1=' + fAddress.address_1.value + '&address_2=' + fAddress.address_2.value + '&city=' + fAddress.city.value + '&state=' + fAddress.codigo_state.value + '&zipcode=' + fAddress.zipcode.value + '&phone=' + fAddress.phone.value + '&first_name=' + $scope.first_name + '&last_name=' + $scope.last_name + '&email=' + $scope.email + '&principal=' + fAddress.principal.value;
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
        $params = '&codigo_cliente=' + $scope.codigo_cliente + '&codigo_credit_card=' + $scope.codigo_credit_card + '&credit_card_number=' + fCreditcard.credit_card_number.value + '&validation_number=' + fCreditcard.validation_number.value + '&exp_month=' + fCreditcard.exp_month.value + '&exp_year=' + fCreditcard.exp_year.value + '&card_holder_name=' + fCreditcard.card_holder_name.value + '&principal=' + fCreditcard.principal_cc.value;
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
.controller('ProductListCtrl', function ($scope, $http, $stateParams, $ionicHistory) {

    // Inactiva el boton de atras
    /*$ionicHistory.nextViewOptions({
        historyRoot: true,
        disableBack: true
    });*/

    $scope.$rutaImagenes = $rutaImagenes;
    $scope.hasBasket = hasBasket;

    $params = '&url=' + $stateParams.page_url;
    $method = 'getProducts';
    $http.post($rutaPagesWs + $method + $params).
    success(function (data, status, headers) {
        console.log(data);
        $scope.products = data;
        $scope.page_url = $stateParams.page_url;
        $scope.error = false;
    }).
    error(function (data, status) {
        //alert('No se puede iniciar la consulta');
        $scope.error = true;
        console.log(status);
    });
})

// Informacion de un producto
.controller('ProductInfoCtrl', function ($scope, $state, $rootScope, $http, $stateParams, WebSql, $filter, $ionicHistory) {

    // Inactiva el boton de atras
    /*$ionicHistory.nextViewOptions({
        historyRoot: true,
        disableBack: true
    });*/

    $scope.rutaImagenes = $rutaImagenes;
    $scope.monedaSymbol = $monedaSymbol;
    $scope.totalitems = $totalitems;
    $scope.tiendaImpuesto = $tiendaImpuesto;
    $scope.hasBasket = hasBasket;

    // Producto
    $scope.productData = {};
    $scope.productData.cantidad_incluir = '1';
    $scope.productData.codigo_articulo_incluir = '';
    $scope.productData.presentation_name = '';
    $scope.productData.presentation_img = '';
    $scope.productData.precio = '0';
    $scope.productData.precio_venta_bruto = '0';
    $scope.productData.impuesto = '0';
    $scope.productData.combo = '0';
    $scope.productData.codigo_combo = '0';
    $scope.productData.linea_combo = '0';
    $scope.productData.freebie = '0';
    $scope.productData.cantidad_combo = '1';

    //Combo
    $scope.comboData = {};
    $scope.comboData.valid = false;
    $scope.comboData.codigo_combo = 0;
    $scope.comboData.total_items = 0;
    $scope.comboData.total_lineas = 0;
    $scope.comboData.lineas = [];

    $params = '&page_id=' + $stateParams.page_id;
    $method = 'getProductInfo';
    $http.post($rutaPagesWs + $method + $params).
    success(function (data, status, headers) {
        $scope.url = data.URL;
        $scope.title = data.TITLE;
        $scope.mini_description = data.MINI_DESCRIPTION;
        $scope.description = data.DESCRIPTION;
        $scope.imagen = $rutaImagenes + data.IMAGEN + '?cache=1';
        $scope.imagen_small = $rutaImagenes + data.IMAGEN_SMALL + '?cache=1';
        $scope.imagen_sin_ruta = data.IMAGEN;
        $scope.codigo_articulo = data.CODIGO_ARTICULO;
        $scope.total_items = data.TOTAL_ITEMS;
        $scope.total_lineas = data.TOTAL_LINEAS;
        $scope.precio = data.PRECIO;
        $scope.combo = data.COMBO;
        $scope.items = data.ITEMS;
        $scope.related = data.RELATED;
        $scope.error = false;

        $scope.productData.codigo_articulo_incluir = data.ITEMS[0].CODIGO_ARTICULO;
        $scope.productData.presentation_name = data.TITLE;
        $scope.productData.presentation_img = data.ITEMS[0].PRESENTATION_IMG;
        $scope.productData.precio = data.ITEMS[0].PRECIO;
        $scope.productData.impuesto = data.ITEMS[0].IMPUESTO;
        $scope.productData.peso = data.ITEMS[0].PESO;
        $scope.productData.item_descripcion = data.ITEMS[0].PRESENTATION_NAME;
    }).
    error(function (data, status) {
        $scope.error = true;
        console.log(status);
    });

    // Desea seguir comprando?
    $rootScope.goCart = function () {
        $state.go("app.basket");
    }

    // Agrega el producto al carrito
    $scope.addProduct = function () {
        $scope.productData.precio_venta_bruto = $scope.productData.precio;
        $scope.productData.precio_venta_total = $scope.productData.precio;
        WebSql.addProduct($scope.productData).then(function (alerta) {

            var $orden = $scope.getLocalData('orden') || {};
            $orden.hasItems = true;
            window.localStorage.setItem('orden', JSON.stringify($orden));
            $scope.showConfirm($scope.title, 'El producto fue agregado al carrito', 'Continuar comprando', 'Ver carrito', 'goCart()');
        }, function (err) {
            $scope.showPopup('Mi carrito', err);
        });
    }

    // Agrega el combo al carrito
    $scope.addCombo = function () {

        var error = '';

        // Borra el combo
        WebSql.delProduct($scope.comboData).then(function (alerta) {}, function (err) {
            error = err;
        });

        // Obtiene el total del monto de los items del combo
        var sum_total_items = 0;
        for (var i = 0; i < $scope.comboData.lineas.length; i++) {
            angular.forEach($scope.comboData.lineas[i].items, function (value, key) {

                // Busca los datos del producto
                if (parseInt(value) > 0) {
                    var item_found = $filter('filter')($scope.items, {
                        CODIGO_ITEM: key
                    });

                    if (item_found.length == 1) {
                        sum_total_items += (item_found[0].PRECIO * value);
                    }
                }
            });
        }

        for (var i = 0; i < $scope.comboData.lineas.length; i++) {
            angular.forEach($scope.comboData.lineas[i].items, function (value, key) {

                // Busca los datos del producto
                if (parseInt(value) > 0) {
                    var item_found = $filter('filter')($scope.items, {
                        CODIGO_ITEM: key
                    });

                    if (item_found.length == 1) {

                        // Precio de venta
                        var precio_venta_bruto = (item_found[0].PRECIO / (sum_total_items / $scope.precio));

                        // Impuesto
                        if (item_found[0].IMPUESTO > 0)
                            var impuesto = (precio_venta_bruto - (precio_venta_bruto / (1 + ($scope.tiendaImpuesto / 100))));
                        else
                            var impuesto = 0;

                        // Crea el objeto para enviarlo al carrito
                        var item = {
                            codigo_articulo_incluir: key,
                            codigo_combo: $scope.comboData.codigo_combo,
                            cantidad_incluir: value,
                            presentation_name: $scope.title,
                            presentation_img: $scope.imagen_sin_ruta,
                            precio: item_found[0].PRECIO,
                            precio_venta_bruto: precio_venta_bruto,
                            precio_venta_total: $scope.precio,
                            impuesto: impuesto,
                            peso: item_found[0].PESO,
                            freebie: 0,
                            item_descripcion: item_found[0].ITEM_HEADER,
                            linea_combo: item_found[0].LINEA_COMBO,
                            cantidad_combo: 1
                        }

                        WebSql.addProduct(item).then(function (alerta) {}, function (err) {
                            error = err;
                        });
                    }
                }
            });
        }

        if (error == '') {
            var $orden = $scope.getLocalData('orden') || {};
            $orden.hasItems = true;
            window.localStorage.setItem('orden', JSON.stringify($orden));

            $scope.showConfirm($scope.title, 'El especial fue agregado al carrito', 'Continuar comprando', 'Ver carrito', 'goCart()');
        } else $scope.showPopup('Mi carrito', error);
    }

    // Actualiza los datos del combo
    $scope.refreshCombo = function (index, linea, cantidad, codigo_item) {

        $scope.comboData.total_items = $scope.total_items;
        $scope.comboData.total_lineas = $scope.total_lineas;
        $scope.comboData.codigo_combo = $scope.codigo_articulo;
        $scope.comboData.lineas[index].cantidad = cantidad;
        $scope.comboData.valid = false;

        var items_lineas = 0;
        var lineas_valid = true;

        // Verifica que el total seleccionado sea el total del combo
        for (var i = 0; i <= $scope.comboData.total_lineas - 1; i++) {
            if ($scope.comboData.lineas[i] !== undefined) {

                // Total de items seleccionado
                var items_linea = 0;
                angular.forEach($scope.comboData.lineas[i].items, function (item) {
                    items_lineas += parseInt(item);
                    items_linea += parseInt(item);
                });

                // Verifica que se haya seleccionado el total de elementos de cada linea
                if ($scope.comboData.lineas[i].cantidad == undefined)
                    lineas_valid = false;
                else if (items_linea < $scope.comboData.lineas[i].cantidad)
                    lineas_valid = false;
                else if (items_linea > $scope.comboData.lineas[i].cantidad)
                    lineas_valid = false;

                // Actualiza el total seleccionado
                if (items_linea == 0)
                    $scope.comboData.lineas[i].selection = '';
                else
                    $scope.comboData.lineas[i].selection = items_linea + ' de';

                // Alertas
                $scope.comboData.lineas[i].selection_alert = '';
                if (items_linea == $scope.comboData.lineas[i].cantidad)
                    $scope.comboData.lineas[i].selection_alert = 'Selección completa';
                else if (items_linea > $scope.comboData.lineas[i].cantidad)
                    $scope.comboData.lineas[i].selection_alert = 'Remueva ' + (items_linea - cantidad) + ' productos';
            }
        }

        // Valida el combo
        if (items_lineas == $scope.comboData.total_items && lineas_valid)
            $scope.comboData.valid = true;
    }

})

// Informacion de un contacto
.controller('ContactInfoCtrl', function ($scope, $rootScope, $http, $stateParams, $ionicHistory, $timeout, $ionicModal) {

    // Inactiva el boton de atras
    /*$ionicHistory.nextViewOptions({
        historyRoot: true,
        disableBack: true
    });*/

    // Timer para la primera vez
    var timer = 3000;
    var $paginas = $scope.getSessionlData('paginas') || {};
    if ($paginas.ContactInfoCtrl !== undefined) {
        timer = 0;
    } else {
        $paginas.ContactInfoCtrl = true;
        window.sessionStorage.setItem('paginas', JSON.stringify($paginas));
    }

    $timeout(function () {

        // Lista de provincias, meses
        $scope.stateslst = $states;
        $scope.meseslst = $meses;
        $scope.anoslist = $anostarjeta;

        $scope.data = {
            showDelete: false
        };

        // Obtiene los datos del contacto
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
            $scope.phone_default = data.PHONE_DEFAULT;
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
            $scope.validation_number = ''; //data.VALIDATION_NUMBER;
            $scope.principal = data.PRINCIPAL;
            $scope.principal_cc = data.PRINCIPAL_CC;
            $scope.clase_credit_card = data.CLASE_CREDIT_CARD;
            $scope.credit_card_number = '';
            $scope.password = '';
            $scope.password2 = '';
            $scope.addresses = data.ADDRESSES;
            $scope.cards = data.CARDS;
            $scope.addressData.address_1 = data.ADDRESS_1;
            $scope.addressData.address_2 = data.ADDRESS_2;
            $scope.addressData.city = data.CITY;
            $scope.addressData.state = data.STATE;
            $scope.addressData.pais = data.PAIS;
            $scope.addressData.phone = data.PHONE;
            $scope.addressData.codigo_state = data.CODIGO_STATE;
            $scope.addressData.zipcode = data.ZIPCODE;
            $scope.addressData.card_holder_name = data.CARD_HOLDER_NAME;
            $scope.addressData.exp_month = data.EXP_MONTH;
            $scope.addressData.exp_year = data.EXP_YEAR;
            $scope.addressData.number_display = data.NUMBER_DISPLAY;
            $scope.addressData.validation_number = ''; //data.VALIDATION_NUMBER;
            $scope.addressData.principal = data.NUMBER_DISPLAY;
            $scope.addressData.principal_cc = data.PRINCIPAL_CC;
            $scope.addressData.credit_card_number = '';
            $scope.addressData.clase_credit_card = data.CLASE_CREDIT_CARD;

            if ($ionicHistory.currentView().stateName == 'app.profileinfo' || $ionicHistory.currentView().stateName == 'app.contactinfo')
                $scope.phone = $scope.phone_default;

            $scope.error = false;
        }).error(function (data, status) {
            $scope.error = true;
            console.log(status);
        });

        // Borra la direccion de un contacto
        $scope.delContactAddressConfirm = function () {
            $scope.showConfirm('Borrar dirección', 'Está seguro?', 'Cancelar', 'Borrar', 'delContactAddress()');
        }

        // Borra la direccion de un contacto
        $rootScope.delContactAddress = function () {

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
        $scope.delContactCardConfirm = function () {
            $scope.showConfirm('Borrar tarjeta', 'Está seguro?', 'Cancelar', 'Borrar', 'delContactCard()');
        }

        // Borra la tarjeta de un contacto
        $rootScope.delContactCard = function () {

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

        // Agrega una direccion
        $scope.addAddress = function (codigo_address, address_1, address_2, city, codigo_state, zipcode, phone, principal) {
            $scope.addressData.modal = true;
            $scope.addressData.codigo_address = codigo_address;
            $scope.addressData.address_1 = address_1;
            $scope.addressData.address_2 = address_2;
            $scope.addressData.city = city;
            $scope.addressData.codigo_state = codigo_state;
            $scope.addressData.zipcode = zipcode;
            $scope.addressData.phone = phone;
            $scope.addressData.principal = principal;
            $scope.modalAddress.show();
        }

        // Agrega una tarjeta
        $scope.addPayment = function (codigo_credit_card, codigo_card_type, number, exp_month, exp_year, validation_number, card_holder_name, number_display) {
            $scope.cardData.modal = true;
            $scope.cardData.codigo_credit_card = codigo_credit_card;
            $scope.cardData.codigo_card_type = codigo_card_type;
            $scope.cardData.number = number;
            $scope.cardData.exp_month = exp_month;
            $scope.cardData.exp_year = exp_year;
            $scope.cardData.validation_number = validation_number;
            $scope.cardData.card_holder_name = card_holder_name;
            $scope.cardData.number_display = number_display;
            $scope.modalPayment.show();
        }

        // Cierra el modal de la direccion
        $rootScope.closeAddress = function () {
            $scope.modalAddress.hide();
        };

        // Cierra el modal de la tarjeta
        $rootScope.closePayment = function () {
            $scope.modalPayment.hide();
        };

        // Actualiza la direccion de un contacto
        $rootScope.updContactAddress = function () {

            $scope.error = true;
            $params = '&codigo_cliente=' + $cliente.codigo_cliente + '&codigo_address=' + $scope.addressData.codigo_address + '&address_1=' + $scope.addressData.address_1 + '&address_2=' + $scope.addressData.address_2 + '&city=' + $scope.addressData.city + '&state=' + $scope.addressData.codigo_state + '&zipcode=' + $scope.addressData.zipcode + '&phone=' + $scope.addressData.phone + '&principal=' + $scope.addressData.principal + '&first_name=' + $scope.first_name + '&last_name=' + $scope.last_name + '&email=' + $scope.email;
            $method = 'updContactAddress';

            $http.post($rutaAccountWs + $method + $params).
            success(function (data, status, headers) {
                if (data.length != 0) {
                    if (data.ERROR == false) {
                        $scope.error = false;
                        $rootScope.closeAddress();
                        $scope.refreshPage();
                    } else
                    if (data.ALERTA.length != 0) $scope.showPopup('Envio', data.ALERTA);
                } else {
                    $scope.showPopup('Envio', 'Error de conexión');
                }
            }).
            error(function (data, status) {
                console.log(status);
            });
        }

        // Actualiza la tarjeta de un contacto
        $rootScope.updContactCreditcard = function () {
            $scope.error = true;
            $params = '&codigo_cliente=' + $cliente.codigo_cliente + '&codigo_credit_card=' + $scope.cardData.codigo_credit_card + '&credit_card_number=' + $scope.cardData.credit_card_number + '&validation_number=' + $scope.cardData.validation_number + '&exp_month=' + $scope.cardData.exp_month + '&exp_year=' + $scope.cardData.exp_year + '&card_holder_name=' + $scope.cardData.card_holder_name + '&principal=' + $scope.cardData.principal_cc;
            $method = 'updContactPayment';

            $http.post($rutaAccountWs + $method + $params).
            success(function (data, status, headers) {
                if (data.length != 0) {
                    if (data.ERROR == false) {
                        $scope.error = false;
                        $rootScope.closePayment();
                        $scope.refreshPage();
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

    }, timer);
})

// Basket
.controller('BasketInfoCtrl', function ($scope, $timeout, $http, $stateParams, WebSql, $state, $ionicHistory) {

    // Inactiva el boton de atras
    /*$ionicHistory.nextViewOptions({
        historyRoot: true,
        disableBack: true
    });*/

    var timer = 3000;
    var $paginas = $scope.getSessionlData('paginas') || {};
    if ($paginas.BasketInfoCtrl !== undefined) {
        timer = 0;
    } else {
        $paginas.BasketInfoCtrl = true;
        window.sessionStorage.setItem('paginas', JSON.stringify($paginas));
    }

    $timeout(function () {
        $scope.items = [];
        $scope.totales = [];
        $scope.$rutaImagenes = $rutaImagenes;
        $scope.monedaSymbol = $monedaSymbol;
        $scope.basketData = {};
        $scope.basketData.codigo_address = '0';
        $scope.data = {
            showDelete: false
        };

        // Borra un producto al carrito
        $scope.delBasketItem = function (item) {
            WebSql.delProduct(item).then(function (alerta) {
                $scope.items.splice($scope.items.indexOf(item), 1);

                // Si el basket esta vacio elimina el shipping y redirecciona
                WebSql.getTotals().then(function (result) {
                    if (result.total == 0) {

                        var $orden = $scope.getLocalData('orden') || {};
                        $orden.hasItems = false;
                        $orden.hasShipping = false;
                        window.localStorage.setItem('orden', JSON.stringify($orden));

                        WebSql.delShipping().then(function (alerta) {
                            $state.go("app.home");
                        }, function (err) {
                            $scope.showPopup('Mi carrito', err);
                        });
                    } else
                        $scope.refreshPage();
                });

            }, function (err) {
                $scope.showPopup('Mi carrito', err);
            });
        }

        // Obtiene el basket
        WebSql.getBasket().then(function (result) {
            $scope.items = result;
        });

        // Obtiene los totales
        WebSql.getTotals().then(function (result) {
            $scope.totales = result;
        });
    }, timer);

})

// Shipping
.controller('ShippingCtrl', function ($scope, $timeout, $rootScope, $http, $stateParams, $ionicHistory, $state, $ionicModal, WebSql) {

    // Inactiva el boton de atras
    /*$ionicHistory.nextViewOptions({
        historyRoot: true,
        disableBack: true
    });*/

    var timer = 3000;
    var $paginas = $scope.getSessionlData('paginas') || {};
    if ($paginas.ShippingCtrl !== undefined) {
        timer = 0;
    } else {
        $paginas.ShippingCtrl = true;
        window.sessionStorage.setItem('paginas', JSON.stringify($paginas));
    }

    $timeout(function () {

        // Lista de provincias
        $rootScope.stateslst = $states;
        $scope.monedaSymbol = $monedaSymbol;

        // Obtiene las funciones del state en el cual estoy
        $scope.$state = $state;

        // Datos del cliente en sesion
        $cliente = $scope.getLocalData('cliente');
        $scope.codigo_cliente = $cliente.codigo_cliente;
        $scope.codigo_address = 0;

        // Datos para el envio
        $scope.shippingData = {};
        $scope.shippingData.codigo_address = '';
        $scope.shippingData.codigo_service_type = '';
        $scope.shippingData.codigo_address_selected = '';
        $scope.shippingData.codigo_service_type_selected = '';
        $scope.shippingData.monto_envio = 0;
        $scope.shippingData.peso = 0;
        $scope.shippingData.address_1 = '';
        $scope.shippingData.address_2 = '';
        $scope.shippingData.city = '';
        $scope.shippingData.codigo_state = '';
        $scope.shippingData.codigo_pais = 0;
        $scope.shippingData.zipcode = '';
        $scope.shippingData.phone = '';
        $scope.shippingData.courier = '';
        $scope.shippingData.courier_display = '';
        $scope.shippingData.courier_padre = '';
        $scope.shippingData.total_items = 0;
        $scope.shippingData.items = {};

        // La direccion debe ser valida
        $scope.checkAddress = function () {

            if ($scope.shippingData.address_1 == '' || $scope.shippingData.city == '' || $scope.shippingData.codigo_state == '') {
                $scope.shippingData.codigo_address = '';
                return false;
            } else
                return true;
        }

        // Obtiene el basket mini
        WebSql.getBasketMini().then(function (result) {
            $scope.shippingData.items = result;
        });

        // Obtiene los totales
        WebSql.getTotals().then(function (result) {
            $scope.shippingData.peso = result.peso;
            $scope.shippingData.monto_envio = result.envio;
            $scope.shippingData.codigo_address_selected = result.codigo_address;
            $scope.shippingData.codigo_service_type_selected = result.codigo_service_type;
            $scope.shippingData.total_items = result.items;

            // Calcula el envio ya seleccionado
            if (result.total > 0) {
                $scope.getShipping(result.peso, result.codigo_state, result.codigo_service_type);
            }
        });

        // Guarda el envio
        $scope.addShipping = function () {
            WebSql.addShipping($scope.shippingData).then(function (alerta) {

                var $orden = $scope.getLocalData('orden') || {};
                $orden.hasShipping = true;
                window.localStorage.setItem('orden', JSON.stringify($orden));

                $state.go("app.confirmation");
            }, function (err) {
                $scope.showPopup('Envio', err);
            });
        }

        // Tipos de envio
        $scope.getShipping = function (peso, state, codigo_service_type) {

            $params = '&rango_peso=' + peso + '&state=' + state + '&codigo_service_type=' + codigo_service_type + '&total_items=' + $scope.shippingData.total_items + '&items=' + JSON.stringify($scope.shippingData.items);
            $method = 'getShipping';
            $http.post($rutaOrderWs + $method + $params).
            success(function (data, status, headers) {
                if (data.length > 0) {
                    $scope.shippings = data;
                    $scope.shippingData.monto_envio = data[0].MONTO;
                    $scope.shippingData.codigo_service_type = data[0].CODIGO_SERVICE_TYPE; // Default
                    $scope.error = false;
                }
            }).error(function (data, status) {
                $scope.error = true;
                console.log(status);
            });

            // Revisa que la direccion sea valida
            $scope.checkAddress();
        }
    }, timer);

})

// Confirmation
.controller('ConfirmationCtrl', function ($scope, $rootScope, $http, $stateParams, $ionicHistory, $state, $ionicModal, $ionicPopup, WebSql) {

    // Inactiva el boton de atras
    /*$ionicHistory.nextViewOptions({
        historyRoot: true,
        disableBack: true
    });*/

    // Lista de meses y variables
    $scope.items = [];
    $scope.items_mini = [];
    $rootScope.meseslst = $meses;
    $rootScope.anoslist = $anostarjeta;
    $scope.monedaSymbol = $monedaSymbol;
    $scope.$rutaImagenes = $rutaImagenes;

    // Obtiene las funciones del state en el cual estoy
    $scope.$state = $state;

    // Datos del cliente en sesion
    $cliente = $scope.getLocalData('cliente');
    $scope.codigo_cliente = $cliente.codigo_cliente;
    $scope.codigo_credit_card = 0;

    // Datos para el pago
    $scope.paymentData = {};
    $scope.paymentData.codigo_credit_card = 0;
    $scope.paymentData.codigo_card_type = '';
    $scope.paymentData.number = '';
    $scope.paymentData.exp_month = '';
    $scope.paymentData.exp_year = '';
    $scope.paymentData.validation_number = '';
    $scope.paymentData.card_holder_name = '';
    $scope.paymentData.codigo_credit_card_selected = '';
    $scope.paymentData.monto_shipping = 0;
    $scope.paymentData.monto_total = 0;

    // Datos del envio
    $scope.shippingData = {};

    // La tarjeta debe ser valida
    $scope.checkPayment = function () {

        if ($scope.paymentData.number == '' || $scope.paymentData.exp_month == '' || $scope.paymentData.exp_year == '') {
            $scope.paymentData.codigo_card_type = '';
            return false;
        } else
            return true;
    }

    // Obtiene el shipping
    WebSql.getShipping().then(function (result) {
        $scope.shippingData = result;
    });

    // Obtiene el basket
    WebSql.getBasket().then(function (result) {
        $scope.items = result;
    });

    // Obtiene el basket mini
    WebSql.getBasketMini().then(function (result) {
        $scope.items_mini = result;
    });

    // Obtiene los totales
    WebSql.getTotals().then(function (result) {
        $scope.paymentData.codigo_credit_card_selected = result.codigo_credit_card;
        $scope.paymentData.monto_shipping = result.envio;
        $scope.paymentData.monto_total = result.total;
    });

    // Desea crear la orden?
    $scope.addOrderConfirm = function () {
        $scope.showConfirm('Confirmar compra', 'Está seguro?', 'Cancelar', 'Confirmar', 'addOrder()');
    }

    // Crea la orden
    $rootScope.addOrder = function () {

        // Agrega la forma de pago
        WebSql.addPayment($scope.paymentData).then(function (alerta) {

                var $orden = $scope.getLocalData('orden') || {};
                var $cliente = $scope.getLocalData('cliente');

                console.log('shipping', $scope.shippingData);
                console.log('items', $scope.items);

                // Crea el encabezado de la orden
                $params = '&secuencia_factura=' + ($orden.secuencia_factura === undefined ? 0 : $orden.secuencia_factura) + '&codigo_cliente=' + $cliente.codigo_cliente + '&codigo_address=' + $scope.shippingData.codigo_address + '&codigo_service_type=' + $scope.shippingData.codigo_service_type + '&first_name=' + $cliente.first_name + '&last_name=' + $cliente.last_name + '&codigo_credit_card=' + $scope.paymentData.codigo_credit_card + '&monto_total=' + $scope.paymentData.monto_total + '&items=' + JSON.stringify($scope.items_mini);
                $method = 'addOrder';

                $http.post($rutaOrderWs + $method + $params).
                success(function (data, status, headers) {
                    if (data.ERROR == false && angular.isNumber(data.SECUENCIA_FACTURA) && data.SECUENCIA_FACTURA > 0) {

                        // Guarda el numero de orden en sesion
                        var $orden = $scope.getLocalData('orden') || {};
                        $orden.hasPayment = true;
                        $orden.hasOrder = true;
                        $orden.codigo_punto_venta = data.CODIGO_PUNTO_VENTA;
                        $orden.secuencia_factura = data.SECUENCIA_FACTURA;
                        window.localStorage.setItem('orden', JSON.stringify($orden));

                        if (data.COBRADA) {
                            $state.go("app.confirmation-success", {
                                'order_id': data.CODIGO_PUNTO_VENTA + '-' + data.SECUENCIA_FACTURA
                            });
                        } else {

                            // Poner orden pendiente de cargo?
                            $scope.showConfirm('Problema con la tarjeta', 'Se ha presentado un problema autorizando su tarjeta.<br><br>Desea continuar y que un representante de servicio al cliente se contacte con usted?', 'Cancelar', 'Continuar', 'chargePending()');
                        }

                        console.log('payment', $scope.paymentData);
                    } else {
                        console.log(data.ALERTA);
                        $scope.showPopup('Confirmacion', data.ALERTA);
                    }
                }).
                error(function (data, status) {
                    console.log(status);
                    $scope.showPopup('Confirmacion', status);
                });

            },
            function (err) {
                $scope.showPopup('Confirmacion', err);
            });
    }

    // Orden pendiente de cargo
    $rootScope.chargePending = function () {

        var $orden = $scope.getLocalData('orden') || {};
        var $cliente = $scope.getLocalData('cliente');

        // Pone la orden pendiente de cargo
        $params = '&secuencia_factura=' + $orden.secuencia_factura + '&codigo_cliente=' + $cliente.codigo_cliente + '&codigo_address=';
        $method = 'orderPending';

        $http.post($rutaOrderWs + $method + $params).
        success(function (data, status, headers) {
            if (data.ERROR == false) {

                // Poner orden pendiente de cargo
                $state.go("app.confirmation-pending", {
                    'order_id': $orden.codigo_punto_venta + '-' + $orden.secuencia_factura
                })
            } else {
                console.log(data.ALERTA);
                $scope.showPopup('Confirmacion', data.ALERTA);
            }
        }).
        error(function (data, status) {
            console.log(status);
            $scope.showPopup('Confirmacion', status);
        });

    }
})

// Confirmation success
.controller('ConfirmationSuccessCtrl', function ($scope, $http, $stateParams, $ionicHistory, $state, WebSql) {

    // Inactiva el boton de atras
    $ionicHistory.nextViewOptions({
        historyRoot: true,
        disableBack: true
    });

    // Datos de la orden
    var order_id = $stateParams.order_id;

    // Datos del cliente en sesion
    $cliente = $scope.getLocalData('cliente');
    $scope.first_name = $cliente.first_name;
    $scope.last_name = $cliente.last_name;
    $scope.email = $cliente.email;
    $scope.order_id = order_id;

    // Borra los datos de sesion
    window.localStorage.removeItem("orden");

    // Borra los datos de la orden
    WebSql.removeOrder();

})

// Mis pedidos
.controller('OrderListCtrl', function ($scope, $http, $stateParams, $state, $timeout, WebSql, $ionicHistory) {

    // Inactiva el boton de atras
    /* $ionicHistory.nextViewOptions({
         historyRoot: true,
         disableBack: true
     });*/

    // Timer para la primera vez
    var timer = 3000;
    var $paginas = $scope.getSessionlData('paginas') || {};
    if ($paginas.OrderListCtrl !== undefined) {
        timer = 0;
    } else {
        $paginas.OrderListCtrl = true;
        window.sessionStorage.setItem('paginas', JSON.stringify($paginas));
    }

    $timeout(function () {
        $scope.monedaSymbol = $monedaSymbol;
        $scope.$rutaImagenes = $rutaImagenes;
        $scope.isLoggedIn = isLoggedIn;

        // Lista de ordenes
        if (isLoggedIn()) {
            $cliente = $scope.getLocalData('cliente');
            $params = '&codigo_cliente=' + $cliente.codigo_cliente;
            $method = 'getOrders';

            $http.post($rutaAccountWs + $method + $params).success(function (data, status, headers) {
                console.log(data);
                $scope.orders = data;
                $scope.error = false;
            }).error(function (data, status) {
                $scope.error = true;
                console.log(status);
            });

            // Accordeon
            $scope.toggleGroup = function (item) {
                if ($scope.isGroupShown(item)) {
                    $scope.shownGroup = null;
                } else {
                    $scope.shownGroup = item;
                }
            };
            $scope.isGroupShown = function (item) {
                return $scope.shownGroup === item;
            };
        }
    }, timer);

})

// Notificaciones
.controller('PushCtrl', function ($scope, $rootScope, $ionicUser, $ionicPush, $ionicPlatform) {

    $rootScope.$on('$cordovaPush:tokenReceived', function (event, data) {
        console.log('Got token: ', data.token, data.platform);
        $scope.token = data.token;
    })

    $scope.identifyUser = function () {
        var user = $ionicUser.get();
        var user_name = 'unknown-user';
        var user_bio = 'unknown-user';

        if (!user.user_id) {
            user.user_id = $ionicUser.generateGUID();
        }

        // Datos del cliente
        $scope.isLoggedIn = isLoggedIn;
        $cliente = JSON.parse(window.localStorage.getItem('cliente'));
        user_name = $cliente.first_name + ' ' + $cliente.last_name;
        user_bio = 'id: ' + $cliente.codigo_cliente + '| email: ' + $cliente.email;

        angular.extend(user, {
            name: user_name,
            bio: user_bio
        });

        $ionicUser.identify(user).then(function () {
            $scope.identified = true;
            console.log('name: ', user.name, 'id: ' + user.user_id);
        });
    }

    $scope.pushRegister = function () {
        $ionicPush.register({
            canShowAlert: true,
            canSetBadge: true,
            canPlaySound: true,
            canRunActionOnWake: true,
            onNotification: function (notification) {
                // handle your stuff
                return true
            }
        })
    };

    if (isLoggedIn()) {
        $scope.identifyUser();
        $scope.pushRegister();
    }

})

// Pagina contenido
.controller('ContentCtrl', function ($scope, $rootScope, $http, $timeout, $ionicHistory, $stateParams) {

    // Inactiva el boton de atras
    /*$ionicHistory.nextViewOptions({
    historyRoot: true,
    disableBack: true
});*/

    $scope.hasBasket = hasBasket;
    $params = '&template_id=55&article_types=95&page_url=' + $stateParams.page_url;
    $method = 'getPageArticles';
    $http.post($rutaPagesWs + $method + $params).
    success(function (data, status, headers) {
        $scope.contents = data;
        $scope.error = false;
    }).
    error(function (data, status) {
        $scope.error = true;
        console.log(status);
    });
})

// Genericos
.controller('GenericCtrl', function ($scope, $rootScope, $ionicHistory) {

    // Inactiva el boton de atras
    $ionicHistory.nextViewOptions({
        historyRoot: true,
        disableBack: true
    });

});
