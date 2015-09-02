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
            console.log(data);
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

    // Obtiene el resumen del basket
    this.getTotals = function () {
        var deferred = $q.defer();
        db.transaction(function (tx) {
            tx.executeSql('SELECT sum(precio*cantidad) as total, sum(cantidad) as items, sum(impuesto*cantidad) as impuesto, (sum(precio*cantidad)-sum(impuesto*cantidad)) as sub_total, (((peso*sum(cantidad)*2.2)+0.89)) as peso, 0 as envio FROM DETALLE_FACTURA', [], function (tx, results) {
                var res = [];
                res = results.rows[0];
                deferred.resolve(res);
            });
        });
        return deferred.promise;
    };

});
