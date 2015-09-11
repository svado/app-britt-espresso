angular.module('starter.controllers', ['app.services', 'app.services'])

/* TODO: Defaults en los radios */

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

    // Create the address modal that we will use later
    $ionicModal.fromTemplateUrl('templates/address-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modalAddress = modal;
    });

    // Create the payment modal that we will use later
    $ionicModal.fromTemplateUrl('templates/payment-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modalPayment = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modalLogin.hide();
    };

    // Triggered in the signup modal to close it
    $scope.closeSignUp = function () {
        $scope.modalSignUp.hide();
    };

    // Triggered in the address modal to close it
    $scope.closeAddress = function () {
        $scope.modalAddress.hide();
    };

    // Triggered in the payment modal to close it
    $scope.closePayment = function () {
        $scope.modalPayment.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modalLogin.show();
    };

    // Open the signup modal
    $scope.signup = function () {
        $scope.modalSignUp.show();
    };

    // Open the address modal
    $scope.doAddress = function () {
        $scope.modalAddress.show();
    };

    // Open the payment modal
    $scope.doPayment = function () {
        $scope.modalPayment.show();
    };

    // Logout
    $scope.logout = function () {
        window.localStorage.removeItem("cliente");
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

    // Actualiza una paginas
    $scope.refreshPage = function () {
        $state.go($state.current, {}, {
            reload: true
        });
    }

    // TODO: Validaciones
    /*WebSql.validView($ionicHistory.currentView().stateName).then(function (result) {
        if (result.access == false) {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go("app.loginshipping");
        }
    });*/
})

// Pagina principal
.controller('HomeCtrl', function ($scope, $http, WebSql) {

    $params = '&template_id=54&article_types=70';
    $method = 'getPageArticles';
    $http.post($rutaPagesWs + $method + $params).
    success(function (data, status, headers) {
        console.log(data);
        $scope.banners = data;
        $scope.error = false;
    }).
    error(function (data, status) {
        $scope.error = true;
        console.log(status);
    });
})

// Manejo de clientes
.controller('ContactCtrl', function ($scope, $http, $stateParams, $state, $ionicHistory) {

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
        $params = '&codigo_cliente=' + $scope.codigo_cliente + '&codigo_address=' + $scope.codigo_address + '&address_1=' + $scope.address_1 + '&address_2=' + $scope.address_2 + '&city=' + $scope.city + '&state=' + $scope.codigo_state + '&zipcode=' + $scope.zipcode + '&phone=' + $scope.phone + '&first_name=' + $scope.first_name + '&last_name=' + $scope.last_name + '&email=' + $scope.email + '&principal=' + $scope.principal;
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
        $params = '&codigo_cliente=' + $scope.codigo_cliente + '&codigo_credit_card=' + $scope.codigo_credit_card + '&credit_card_number=' + $scope.credit_card_number + '&validation_number=' + $scope.validation_number + '&exp_month=' + $scope.exp_month + '&exp_year=' + $scope.exp_year + '&card_holder_name=' + $scope.card_holder_name + '&principal=' + $scope.principal_cc;
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
.controller('ProductInfoCtrl', function ($scope, $http, $stateParams, WebSql, $filter) {

    /* TODO: radio y checks deben verse con borde */

    $scope.rutaImagenes = $rutaImagenes;
    $scope.monedaSymbol = $monedaSymbol;
    $scope.totalitems = $totalitems;
    $scope.tiendaImpuesto = $tiendaImpuesto;

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
    $scope.productData.freebie = '0';

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
        $scope.imagen = $rutaImagenes + data.IMAGEN;
        $scope.imagen_sin_ruta = data.IMAGEN;
        $scope.codigo_articulo = data.CODIGO_ARTICULO;
        $scope.total_items = data.TOTAL_ITEMS;
        $scope.total_lineas = data.TOTAL_LINEAS;
        $scope.precio = data.PRECIO;
        $scope.combo = data.COMBO;
        $scope.items = data.ITEMS;
        $scope.error = false;
    }).
    error(function (data, status) {
        $scope.error = true;
        console.log(status);
    });

    // Agrega el producto al carrito
    $scope.addProduct = function () {
        $scope.productData.precio_venta_bruto = $scope.productData.precio;
        $scope.productData.precio_venta_total = $scope.productData.precio;
        WebSql.addProduct($scope.productData).then(function (alerta) {
            $scope.showPopup('Mi carrito', alerta);
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
                            item_descripcion: item_found[0].ITEM_HEADER
                        }

                        WebSql.addProduct(item).then(function (alerta) {}, function (err) {
                            error = err;
                        });
                    }
                }
            });
        }

        if (error == '') $scope.showPopup('Mi carrito', 'El especial fue agregado');
        else $scope.showPopup('Mi carrito', error);
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
                else if (items_linea != $scope.comboData.lineas[i].cantidad)
                    lineas_valid = false;
            }
        }

        // Valida el combo
        if (items_lineas == $scope.comboData.total_items && lineas_valid)
            $scope.comboData.valid = true;
    }

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
        $scope.principal = data.PRINCIPAL;
        $scope.principal_cc = data.PRINCIPAL_CC;
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

// Basket
.controller('BasketInfoCtrl', function ($scope, $http, $stateParams, WebSql, $state, $ionicHistory) {

    $scope.items = [];
    $scope.totales = [];
    $scope.$rutaImagenes = $rutaImagenes;
    $scope.monedaSymbol = $monedaSymbol;
    $scope.data = {
        showDelete: false
    };
    $scope.basketData = {};
    $scope.basketData.codigo_address = '0';

    // Borra un producto al carrito
    $scope.delBasketItem = function (item) {
        WebSql.delProduct(item).then(function (alerta) {
            $scope.items.splice($scope.items.indexOf(item), 1);

            // Si el basket esta vacio elimina el shipping y redirecciona
            WebSql.getTotals().then(function (result) {
                if (result.total == 0) {

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

})

// Shipping
.controller('ShippingCtrl', function ($scope, $http, $stateParams, $ionicHistory, $state, WebSql) {

    // Lista de provincias
    $scope.stateslst = $states;
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

    // Obtiene los totales
    WebSql.getTotals().then(function (result) {
        $scope.shippingData.peso = result.peso;
        $scope.shippingData.monto_envio = result.envio;
        $scope.shippingData.codigo_address_selected = result.codigo_address;
        $scope.shippingData.codigo_service_type_selected = result.codigo_service_type;

        // Calcula el envio ya seleccionado previamente
        $scope.getShipping(result.peso, result.codigo_state, result.codigo_service_type);
    });

    // Actualiza la direccion de un contacto
    $scope.updContactAddress = function () {

        $scope.productData = {};
        $scope.productData.cantidad_incluir = '1';

        $scope.error = true;
        $params = '&codigo_cliente=' + $scope.codigo_cliente + '&codigo_address=' + $scope.codigo_address + '&address_1=' + $scope.address_1 + '&address_2=' + $scope.address_2 + '&city=' + $scope.city + '&state=' + $scope.codigo_state + '&zipcode=' + $scope.zipcode + '&phone=' + $scope.phone + '&principal=' + $scope.principal;
        $method = 'updContactAddress';

        $http.post($rutaAccountWs + $method + $params).
        success(function (data, status, headers) {
            if (data.length != 0) {
                if (data.ERROR == false) {
                    $scope.codigo_address = data.CODIGO_ADDRESS;
                    $scope.error = false;
                    if (data.ALERTA.length != 0) $scope.showPopup('Envio', data.ALERTA);
                    $scope.closeAddress();
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
    };

    // Guarda el envio
    $scope.addShipping = function () {
        WebSql.addShipping($scope.shippingData).then(function (alerta) {
            //$scope.showPopup('Envio', alerta);
            $state.go("app.confirmation");
        }, function (err) {
            $scope.showPopup('Envio', err);
        });
    }

    // Tipos de envio
    $scope.getShipping = function (peso, state, codigo_service_type) {
        $params = '&rango_peso=' + peso + '&state=' + state + '&codigo_service_type=' + codigo_service_type;
        $method = 'getShipping';
        $http.post($rutaOrderWs + $method + $params).
        success(function (data, status, headers) {
            if (data.length > 0) {
                $scope.shippings = data;
                $scope.shippingData.monto_envio = data[0].MONTO;
                $scope.error = false;
            }
        }).error(function (data, status) {
            $scope.error = true;
            console.log(status);
        });
    }

})

// Confirmation
.controller('ConfirmationCtrl', function ($scope, $http, $stateParams, $ionicHistory, $state, WebSql) {

    // Lista de meses y variables
    $scope.items = [];
    $scope.meseslst = $meses;
    $scope.anoslist = $anostarjeta;
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

    // Datos del envio
    $scope.shippingData = {};

    // Actualiza la tarjeta de un contacto
    $scope.updContactCreditcard = function () {

        $scope.error = true;
        $params = '&codigo_cliente=' + $scope.codigo_cliente + '&codigo_credit_card=' + $scope.codigo_credit_card + '&credit_card_number=' + $scope.credit_card_number + '&validation_number=' + $scope.validation_number + '&exp_month=' + $scope.exp_month + '&exp_year=' + $scope.exp_year + '&card_holder_name=' + $scope.card_holder_name + '&principal=' + $scope.principal_cc;

        $method = 'updContactPayment';
        $http.post($rutaAccountWs + $method + $params).
        success(function (data, status, headers) {
            if (data.length != 0) {
                if (data.ERROR == false) {
                    $scope.codigo_credit_card = data.CODIGO_CREDIT_CARD;
                    $scope.error = false;
                    if (data.ALERTA.length != 0) $scope.showPopup('Confirmacion', data.ALERTA);
                    $scope.closePayment();
                    $scope.refreshPage();
                } else
                if (data.ALERTA.length != 0) $scope.showPopup('Confirmacion', data.ALERTA);
            } else {
                $scope.showPopup('Confirmacion', 'Error de conexión');
            }
        }).
        error(function (data, status) {
            console.log(status);
        });
    };

    // Obtiene el shipping
    WebSql.getShipping().then(function (result) {
        $scope.shippingData = result;
    });

    // Obtiene el basket
    WebSql.getBasket().then(function (result) {
        $scope.items = result;
    });

    // Crea la orden
    $scope.addOrder = function () {
        console.log($scope.paymentData);
        $scope.showPopup('Confirmacion', 'Procesar orden');
    }

})

// Mis pedidos
.controller('OrderListCtrl', function ($scope, $http, $stateParams, $state, WebSql) {

    $scope.monedaSymbol = $monedaSymbol;
    $scope.$rutaImagenes = $rutaImagenes;
    $scope.isLoggedIn = isLoggedIn;

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

})
