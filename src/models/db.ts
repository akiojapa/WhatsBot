import mysql from 'mysql2'


class DataBase{ 

    private databaseConn () {
            
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'botdiscord'
        })
        try {
            connection.connect()

        }catch (err) {
            console.error("Erro na conexão de banco de dados!", err)
        }

    }
}

export default new DataBase()