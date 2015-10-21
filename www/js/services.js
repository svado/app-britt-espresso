angular.module('app.services', [])

// Funciones para la base de datos
.service('WebSql', function ($q) {

    var db = [];

    // Transaction error callback
    function errorDB(tx, err) {
        console.log(tx);
    }

    // Transaction success callback
    function successDB() {
        console.log('Db success');
    }

    // Crea las tablas principales
    function populateDB(tx) {
        //tx.executeSql('DROP TABLE IF EXISTS DETALLE_FACTURA');

        tx.executeSql('CREATE TABLE IF NOT EXISTS DETALLE_FACTURA (codigo_articulo integer, codigo_combo integer, descripcion, cantidad integer, image, precio float, precio_venta_bruto float, precio_venta_total float, impuesto float, peso float, freebie, item_descripcion, linea_combo integer, cantidad_combo integer, primary key (codigo_articulo, codigo_combo))');

        //tx.executeSql('DROP TABLE IF EXISTS ENCABEZADO_FACTURA');

        tx.executeSql('CREATE TABLE IF NOT EXISTS ENCABEZADO_FACTURA (codigo_address unique, codigo_state, codigo_service_type integer, monto_envio float, address_1, address_2, city, codigo_pais integer, zipcode, phone, courier, courier_display, codigo_credit_card integer, codigo_punto_venta integer, secuencia_factura integer, courier_padre)');

    };

    // Inicializa la base de datos
    this.createDbAndTables = function () {
        db = openDatabase('brittEspressoDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024);
        db.transaction(populateDB, errorDB, successDB);
    };

    // Inserta un producto
    this.addProduct = function (data) {
        var deferred = $q.defer();
        console.log(data);
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM DETALLE_FACTURA WHERE codigo_articulo = ? AND codigo_combo = ?', [data.codigo_articulo_incluir, data.codigo_combo]);
            tx.executeSql('INSERT INTO DETALLE_FACTURA (codigo_articulo, codigo_combo, descripcion, cantidad, image, precio, precio_venta_bruto, precio_venta_total, impuesto, peso, freebie, item_descripcion, linea_combo, cantidad_combo) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [data.codigo_articulo_incluir, data.codigo_combo, data.presentation_name, data.cantidad_incluir, data.presentation_img, data.precio.toString(), data.precio_venta_bruto.toString(), data.precio_venta_total.toString(), data.impuesto.toString(), data.peso.toString(), data.freebie, data.item_descripcion, data.linea_combo, data.cantidad_combo]);
        }, function () {
            deferred.reject('No se pudo agregar el producto');
        }, function () {
            deferred.resolve('Producto agregado');
        });

        return deferred.promise;
    };

    // Borra un producto
    this.delProduct = function (data) {
        var deferred = $q.defer();
        db.transaction(function (tx) {
            console.log(data);
            if (parseInt(data.codigo_combo) > 0) {
                tx.executeSql('DELETE FROM DETALLE_FACTURA WHERE codigo_combo = ?', [data.codigo_combo]);
            } else {
                tx.executeSql('DELETE FROM DETALLE_FACTURA WHERE codigo_articulo = ? AND codigo_combo = 0', [data.codigo_articulo]);
            }
        }, function () {
            deferred.reject('No se pudo borrar el producto');
        }, function () {
            deferred.resolve('');
        });

        return deferred.promise;
    };

    // Obtiene el basket
    this.getBasket = function () {
        var deferred = $q.defer();
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM DETALLE_FACTURA', [], function (tx, results) {
                var res = []
                for (var i = 0; i < results.rows.length; i++) {
                    res[i] = results.rows.item(i);
                }
                deferred.resolve(res);
            });
        });
        return deferred.promise;
    };

    // Obtiene el basket mini
    this.getBasketMini = function () {
        var deferred = $q.defer();
        db.transaction(function (tx) {
            tx.executeSql('SELECT codigo_articulo, codigo_combo, cantidad, precio, precio_venta_bruto, precio_venta_total, impuesto, peso, freebie, linea_combo, cantidad_combo FROM DETALLE_FACTURA', [], function (tx, results) {
                var res = []
                for (var i = 0; i < results.rows.length; i++) {
                    res[i] = results.rows.item(i);
                }
                deferred.resolve(res);
            });
        });
        return deferred.promise;
    };

    // Inserta el shipping
    this.addShipping = function (data) {
        var deferred = $q.defer();
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM ENCABEZADO_FACTURA');
            tx.executeSql('INSERT INTO ENCABEZADO_FACTURA (codigo_address, codigo_state, codigo_service_type, monto_envio, address_1, address_2, city, codigo_pais, zipcode, phone, courier, courier_display, courier_padre) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [data.codigo_address, data.codigo_state, data.codigo_service_type, data.monto_envio.toString(), data.address_1, data.address_2, data.city, data.codigo_pais, data.zipcode, data.phone, data.courier, data.courier_display, data.courier_padre]);
        }, function () {
            deferred.reject('No se pudo agregar el envio');
        }, function () {
            deferred.resolve('Envio agregado');
        });

        return deferred.promise;
    };

    // Obtiene el resumen del basket
    this.getTotals = function () {

        var deferred = $q.defer();
        db.transaction(function (tx) {
            /*tx.executeSql('SELECT sum(A.precio_venta_bruto*A.cantidad) as total, sum(A.cantidad) as items, sum(A.impuesto*A.cantidad) as impuesto, (sum(A.precio_venta_bruto*A.cantidad)-sum(A.impuesto*A.cantidad)) as sub_total, (((A.peso*sum(A.cantidad)*2.2)+0.89)) as peso, B.monto_envio as envio, B.codigo_address, B.codigo_service_type, B.codigo_state, B.codigo_state, B.codigo_credit_card FROM DETALLE_FACTURA A LEFT OUTER JOIN ENCABEZADO_FACTURA B', [],*/
            tx.executeSql('SELECT A.*, B.* FROM DETALLE_FACTURA A LEFT OUTER JOIN ENCABEZADO_FACTURA B', [],
                function (tx, results) {
                    var res = []
                    var total = 0;
                    var items = 0;
                    var impuesto = 0;
                    var peso = 0;
                    var envio = 0;
                    var codigo_address = 0;
                    var codigo_service_type = 0;
                    var codigo_state = '';
                    var codigo_credit_card = 0;

                    for (var i = 0; i < results.rows.length; i++) {
                        total = total + (results.rows.item(i).precio_venta_bruto * results.rows.item(i).cantidad);
                        items = items + results.rows.item(i).cantidad;
                        impuesto = impuesto + (results.rows.item(i).impuesto * results.rows.item(i).cantidad);
                        peso = peso + results.rows.item(i).peso;
                        envio = results.rows.item(i).monto_envio;
                        codigo_address = results.rows.item(i).codigo_address;
                        codigo_service_type = results.rows.item(i).codigo_service_type;
                        codigo_state = results.rows.item(i).codigo_state;
                        codigo_credit_card = results.rows.item(i).codigo_credit_card;
                    }

                    res.total_sin_envio = total;
                    res.total = total + envio;
                    res.items = items;
                    res.impuesto = impuesto;
                    res.sub_total = total - impuesto;
                    res.peso = (((peso * items * 2.2) + 0.89));
                    res.envio = envio;
                    res.codigo_address = codigo_address;
                    res.codigo_service_type = codigo_service_type;
                    res.codigo_state = codigo_state;
                    res.codigo_credit_card = codigo_credit_card;


                    /*var res = [];
                        if (results.rows.length > 0) {
                            res.total_sin_envio = results.rows[0].total;
                            res.total = (results.rows[0].total + results.rows[0].envio);
                            res.items = results.rows[0].items;
                            res.impuesto = results.rows[0].impuesto;
                            res.sub_total = results.rows[0].sub_total;
                            res.peso = results.rows[0].peso;
                            res.envio = results.rows[0].envio;
                            res.codigo_address = results.rows[0].codigo_address;
                            res.codigo_service_type = results.rows[0].codigo_service_type;
                            res.codigo_state = results.rows[0].codigo_state;
                            res.codigo_credit_card = results.rows[0].codigo_credit_card;
                        }*/

                    deferred.resolve(res);
                });
        });
        return deferred.promise;
    };

    // Obtiene el envio
    this.getShipping = function () {
        var deferred = $q.defer();
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM ENCABEZADO_FACTURA', [], function (tx, results) {
                var res = [];
                for (var i = 0; i < results.rows.length; i++) {
                    res = results.rows.item(i);
                }
                deferred.resolve(res);
            });
        });
        return deferred.promise;
    };

    // Borra el envio
    this.delShipping = function () {
        var deferred = $q.defer();
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM ENCABEZADO_FACTURA', []);
        }, function () {
            deferred.reject('No se pudo borrar el envio');
        }, function () {
            deferred.resolve('');
        });

        return deferred.promise;
    };

    // Borra el detalle de la orden
    function removeOrderDB(tx) {
        tx.executeSql('DELETE FROM DETALLE_FACTURA');
        tx.executeSql('DELETE FROM ENCABEZADO_FACTURA');
    };

    // Borra los datos de la orden
    this.removeOrder = function () {
        db.transaction(removeOrderDB, errorDB, successDB);
    };

    // Inserta el pago
    this.addPayment = function (data) {
        var deferred = $q.defer();
        db.transaction(function (tx) {
            tx.executeSql('UPDATE ENCABEZADO_FACTURA SET codigo_credit_card = ? ', [data.codigo_credit_card]);
        }, function () {
            deferred.reject('No se pudo agregar el pago');
        }, function () {
            deferred.resolve('Pago agregado');
        });

        return deferred.promise;
    };
});
