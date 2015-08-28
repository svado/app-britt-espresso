angular.module('app.services', [])

// Funciones para la base de datos
.service('WebSql', function ($q) {

    /*$userInfo = {
        UserId: '12345',
        UserName: 'Steve Vado',
        IsAdmin: true
    };

    this.storeUserInfo = functio

    return deferred.promise;n (user) {
        var db = openDatabase('myClientDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024);
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO User (UserInfo) VALUES ( ?)', [JSON.stringify(user)]);
            console.log('db: fill data');
        });
    }*/

    var db = [];

    // Transaction error callback
    //
    function errorDB(tx, err) {
        console.log('error1');
        console.log(err);
        console.log('error2');
    }

    // Transaction success callback
    //
    function successDB() {
        console.log('success');
    }

    // Crea las tablas principales
    function populateDB(tx) {
        tx.executeSql('DROP TABLE CLIENTE');
        tx.executeSql('DROP TABLE DETALLE_FACTURA');
        tx.executeSql('CREATE TABLE IF NOT EXISTS CLIENTE (codigo_cliente integer primary key, first_name text, last_name text, email text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS DETALLE_FACTURA (linea unique, codigo_articulo, descripcion)');
        //tx.executeSql('INSERT INTO DETALLE_FACTURA (linea, codigo_articulo) VALUES (1, "12345")');
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
            //console.log(JSON.stringify(data));
        }, errorDB, successDB);
    };

    // Inserta un producto
    this.addProduct = function (data) {
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO DETALLE_FACTURA (linea, codigo_articulo, descripcion) VALUES (?,?,?)', [data.linea, data.codigo_articulo, data.descripcion]);
            //console.log(JSON.stringify(data));
        }, errorDB, successDB);
    };

    function querySuccess(tx, results) {
        console.log("Returned rows = " + results.rows.length);
    }

    this.getBasket = function () {
        var deferred = $q.defer();
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM DETALLE_FACTURA', [], function (tx, results) {
                var clientes = [];
                for (var i = 0; i < results.rows.length; i++) {
                    clientes[i] = results.rows.item(i);
                }
                deferred.resolve(clientes);
            });
        });
        return deferred.promise;
    };

});
