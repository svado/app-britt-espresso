angular.module('app.services', [])

// Funciones para la base de datos
.service('WebSql', function () {

    /*$userInfo = {
        UserId: '12345',
        UserName: 'Steve Vado',
        IsAdmin: true
    };

    this.storeUserInfo = function (user) {
        var db = openDatabase('myClientDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024);
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO User (UserInfo) VALUES ( ?)', [JSON.stringify(user)]);
            console.log('db: fill data');
        });
    }*/

    var db = [];

    function populateDB(tx) {
        tx.executeSql('DROP TABLE IF EXISTS POS_DETALLE_FACTURA');
        tx.executeSql('CREATE TABLE IF NOT EXISTS POS_DETALLE_FACTURA (linea unique, codigo_articulo)');
        tx.executeSql('INSERT INTO POS_DETALLE_FACTURA (linea, codigo_articulo) VALUES (1, "12345")');
    }

    this.createDbAndTables = function () {
        db = openDatabase('brittEspressoDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024);
        db.transaction(populateDB);
    };
});
