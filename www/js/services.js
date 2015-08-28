angular.module('app.services', [])

// Funciones para la base de datos
.service('WebSql', function ($q) {

    var db = [];

    // Transaction error callback
    //
    function errorDB(tx, err) {
        console.log('Bd error --> ' + err);
    }

    // Transaction success callback
    //
    function successDB() {
        console.log('Db success');
    }

    // Crea las tablas principales
    function populateDB(tx) {
        //tx.executeSql('DROP TABLE CLIENTE');
        tx.executeSql('DROP TABLE DETALLE_FACTURA');
        //tx.executeSql('CREATE TABLE IF NOT EXISTS CLIENTE (codigo_cliente integer primary key, first_name text, last_name text, email text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS DETALLE_FACTURA (codigo_articulo unique, descripcion, cantidad)');
    };

    // Inicializa la base de datos
    this.createDbAndTables = function () {
        db = openDatabase('brittEspressoDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024);
        db.transaction(populateDB, errorDB, successDB);
    };

    // Inserta un cliente
    this.addCliente = function (data) {
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO CLIENTE (codigo_cliente, first_name, last_name, email) VALUES (?,?,?,?)', [data.codigo_cliente, data.first_name, data.last_name, data.email]);
        }, errorDB, successDB);
    };

    // Inserta un producto
    this.addProduct = function (data) {
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO DETALLE_FACTURA (codigo_articulo, cantidad, descripcion) VALUES (?,?,?)', [data.codigo_articulo, data.cantidad, data.descripcion]);
        }, errorDB, successDB);
    };

    function querySuccess(tx, results) {
        console.log("Returned rows = " + results.rows.length);
    }

    this.getBasket = function () {
        var deferred = $q.defer();
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM DETALLE_FACTURA', [], function (tx, results) {
                var res = [];
                for (var i = 0; i < results.rows.length; i++) {
                    res[i] = results.rows.item(i);
                }
                deferred.resolve(res);
            });
        });
        return deferred.promise;
    };

});
