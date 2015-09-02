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
        tx.executeSql('CREATE TABLE IF NOT EXISTS DETALLE_FACTURA (codigo_articulo unique, descripcion, cantidad integer, image, precio float, impuesto float, peso float)');

        //tx.executeSql('DROP TABLE IF EXISTS POS_SHIPPING');
        tx.executeSql('CREATE TABLE IF NOT EXISTS POS_SHIPPING (codigo_address unique, codigo_state, codigo_service_type integer, monto_envio float)');

    };

    // Inicializa la base de datos
    this.createDbAndTables = function () {
        db = openDatabase('brittEspressoDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024);
        db.transaction(populateDB, errorDB, successDB);
    };

    // Inserta un producto
    this.addProduct = function (data) {
        var deferred = $q.defer();
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM DETALLE_FACTURA WHERE codigo_articulo = ?', [data.codigo_articulo_incluir]);
            tx.executeSql('INSERT INTO DETALLE_FACTURA (codigo_articulo, descripcion, cantidad, image, precio, impuesto, peso) VALUES (?,?,?,?,?,?,?)', [data.codigo_articulo_incluir, data.presentation_name, data.cantidad_incluir, data.presentation_img, data.precio.toString(), data.impuesto.toString(), data.peso.toString()]);
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
            tx.executeSql('DELETE FROM DETALLE_FACTURA WHERE codigo_articulo = ?', [data.codigo_articulo]);
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
            tx.executeSql('INSERT INTO POS_SHIPPING (codigo_address, codigo_state, codigo_service_type, monto_envio) VALUES (?,?,?,?)', [data.codigo_address, data.codigo_state, data.codigo_service_type, data.monto_envio.toString()]);
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
            tx.executeSql('SELECT sum(A.precio*A.cantidad) as total, sum(A.cantidad) as items, sum(A.impuesto*A.cantidad) as impuesto, (sum(A.precio*A.cantidad)-sum(A.impuesto*A.cantidad)) as sub_total, (((A.peso*sum(A.cantidad)*2.2)+0.89)) as peso, B.monto_envio as envio FROM DETALLE_FACTURA A LEFT OUTER JOIN POS_SHIPPING B', [], function (tx, results) {
                var res = [];
                res.total_sin_envio = results.rows[0].total;
                res.total = (results.rows[0].total + results.rows[0].envio);
                res.items = results.rows[0].items;
                res.impuesto = results.rows[0].impuesto;
                res.sub_total = results.rows[0].sub_total;
                res.peso = results.rows[0].peso;
                res.envio = results.rows[0].envio;
                deferred.resolve(res);
            });
        });
        return deferred.promise;
    };
});
