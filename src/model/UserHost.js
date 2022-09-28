const db = require('./DBConnect');

class UserHost{
    async getListUsers(){
        let sql = 'SELECT * FROM UserHost'
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

module.exports = new UserHost();