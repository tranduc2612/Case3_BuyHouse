const db = require('./DBConnect');

class UserRenter{
    async getListUsers(){
        let sql = 'SELECT * FROM UserRenter'
        return await db
                .runMySQL(sql)
                .then((results) =>{
                    return results;
                })
                .catch((err) =>{
                    throw err;
                })
    }
}

module.exports = new UserRenter();