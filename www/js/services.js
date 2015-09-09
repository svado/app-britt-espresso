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
        tx.executeSql('CREATE TABLE IF NOT EXISTS DETALLE_FACTURA (codigo_articulo integer, codigo_combo integer, descripcion, cantidad integer, image, precio float, precio_venta_bruto float, impuesto float, peso float, freebie, item_descripcion, primary key (codigo_articulo, codigo_combo))');

        //tx.executeSql('DROP TABLE IF EXISTS POS_SHIPPING');
        tx.executeSql('CREATE TABLE IF NOT EXISTS POS_SHIPPING (codigo_address unique, codigo_state, codigo_service_type integer, monto_envio float, address_1, address_2, city, codigo_pais integer, zipcode, phone, courier, courier_display)');

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
            tx.executeSql('INSERT INTO DETALLE_FACTURA (codigo_articulo, codigo_combo, descripcion, cantidad, image, precio, precio_venta_bruto, impuesto, peso, freebie, item_descripcion) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [data.codigo_articulo_incluir, data.codigo_combo, data.presentation_name, data.cantidad_incluir, data.presentation_img, data.precio.toString(), data.precio_venta_bruto.toString(), data.impuesto.toString(), data.peso.toString(), data.freebie, data.item_descripcion]);
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

    // Inserta el shipping
    this.addShipping = function (data) {
        var deferred = $q.defer();
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM POS_SHIPPING');
            tx.executeSql('INSERT INTO POS_SHIPPING (codigo_address, codigo_state, codigo_service_type, monto_envio, address_1, address_2, city, codigo_pais, zipcode, phone, courier, courier_display) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [data.codigo_address, data.codigo_state, data.codigo_service_type, data.monto_envio.toString(), data.address_1, data.address_2, data.city, data.codigo_pais, data.zipcode, data.phone, data.courier, data.courier_display]);
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
            /*tx.executeSql('SELECT sum(A.precio_venta_bruto*A.cantidad) as total, sum(A.cantidad) as items, sum(A.impuesto*A.cantidad) as impuesto, (sum(A.precio_venta_bruto*A.cantidad)-sum(A.impuesto*A.cantidad)) as sub_total, (((A.peso*sum(A.cantidad)*2.2)+0.89)) as peso, B.monto_envio as envio FROM DETALLE_FACTURA A LEFT OUTER JOIN POS_SHIPPING B', [], function (tx, results) {
                var res = [];
                if (results.rows.length > 0) {
                    res.total_sin_envio = results.rows[0].total;
                    res.total = (results.rows[0].total + results.rows[0].envio);
                    res.items = results.rows[0].items;
                    res.impuesto = results.rows[0].impuesto;
                    res.sub_total = results.rows[0].sub_total;
                    res.peso = results.rows[0].peso;
                    res.envio = results.rows[0].envio;
                }
                deferred.resolve(res);
            });*/

            tx.executeSql('SELECT sum(A.precio_venta_bruto*A.cantidad) as total, sum(A.cantidad) as items, sum(A.impuesto*A.cantidad) as impuesto, (sum(A.precio_venta_bruto*A.cantidad)-sum(A.impuesto*A.cantidad)) as sub_total, (((A.peso*sum(A.cantidad)*2.2)+0.89)) as peso, B.monto_envio as envio FROM DETALLE_FACTURA A LEFT OUTER JOIN POS_SHIPPING B', [], function (tx, results) {
                var res = [];
                if (results.rows.length > 0) {
                    res.total_sin_envio = results.rows[0].total;
                    res.total = (results.rows[0].total + results.rows[0].envio);
                    res.items = results.rows[0].items;
                    res.impuesto = results.rows[0].impuesto;
                    res.sub_total = results.rows[0].sub_total;
                    res.peso = results.rows[0].peso;
                    res.envio = results.rows[0].envio;
                }
                deferred.resolve(res);
            });
        });
        return deferred.promise;
    };

    // Obtiene el envio
    this.getShipping = function () {
        var deferred = $q.defer();
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM POS_SHIPPING', [], function (tx, results) {
                var res = [];
                if (results.rows.length > 0)
                    res = results.rows[0];
                deferred.resolve(res);
            });
        });
        return deferred.promise;
    };

    // Valida los pasos de la compra
    this.validView = function (page) {
        var deferred = $q.defer();
        console.log(page);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM DETALLE_FACTURA LEFT OUTER JOIN POS_SHIPPING', [], function (tx, results) {
                var res = [];
                res.access = true;
                if (page == 'app.basket' && results.rows.length == 0)
                    res.access = false;
                else if (page == 'app.shipping' && (results.rows.length = 0 || !isLoggedIn()))
                    res.access = false;
                else if (page == 'app.confirmation' && (results.rows.length = 0 || !isLoggedIn()))
                    res.access = false;
                else if (page == 'app.confirmation' && results.rows.length > 0 && isLoggedIn() && (results.rows[0].codigo_address = 0 || results.rows[0].codigo_service_type == 0))
                    res.access = false;
                deferred.resolve(res);
            });
        });

        return deferred.promise;
    };
});
