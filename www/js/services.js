angular.module('app.services', [])

.service('WebSqlDbService', function () {

    this.createDbAndTables = function () {

        console.log('Crea la base de datos');

        var db = openDatabase('myClientDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024);
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS User (UserInfo)');
        });
    };

    this.storeUserInfo = function (user) {
        var db = openDatabase('myClientDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024);
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO User (UserInfo) VALUES ( ?)', [JSON.stringify(user)]);
        });
    };

});
