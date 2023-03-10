import mysql from 'mysql2'
import { resolve } from 'path';


class DataBase{ 

    constructor(config) {
        this.connection = mysql.createConnection(config);
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.connection.connect(err => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Conectado ao banco de dados!');
                    resolve();
                }
            });
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Conexão encerrada.');
                    resolve();
                }
            });
        });
    }

    insertDB(dataInfo){

        const dataArray = ['ID', 'Starttime','Email', 'Name', 'CentraldeCaptacaoEAD', 'DescricaodoproblemaCentraldeCaptacaoEAD', 'Webclass', 'DescricaodoproblemaWebclass', 'WebServicesSydle', 'DescricaodoproblemaWebServicesSydle','GSuite', 'DescricaodoproblemaGSuite','Lyceum', 'DescricaodoproblemaLyceum','LyceumApiBoleto','DescricaodoproblemaLyceumApiBoleto', 'MundoAzul','DescricaodoproblemaMundoAzul', 'Plug', 'DescricaoodoproblemaPlug', 'PortalEAD','DescricaoodoproblemaPortalEAD', 'SistemasTerceiros','DescricaodoproblemaSistemasTerceiros', 'SitesEADePresencial', 'DescricaodoproblemaSitesEADePresencial', 'StudeoFront', 'DescricaodoproblemaStudeoFront', 'StudeoMonitoramentoBigIP','DescricaodoproblemaStudeoMonitoramentoBigIP', 'StudeoProducaoLogin','DescricaodoproblemaStudeoProducaoLogin','StudeoProducaoLogineDisciplina', 'DescricaodoproblemaStudeoProducaoLogineDisciplina','UniversoEAD','DescricaodoproblemaUniversoEAD','FirewallCampusCorumbaMemoriaLinksdeinternetSwitches', 'ProblemasemCorumba', 'FirewallCampusCuritibaMemoriaLinksdeinternetSwitches', 'ProblemasemCuritiba','FirewallCampusLondrinaMemoriaLinksdeinternetSwitches', 'ProblemasemLondrina', 'FirewallCampusMaringaMemoriaLinksdeinternetSwitches', 'ProblemasemMaringa', 'FirewallCampusPontaGrossaMemoriaLinksdeinternetSwitches', 'ProblemasemPontaGrossa', 'FirewallDataCenterMaringaMemoriaLinksdeinternet','ProblemasemFirewallDatacenter', 'InfraDatacenterBateriasHardwareCamerasSistemasdeprotecaoGerador', 'ProblemasemInfraDatacenter']

        const tableName = 'my_table';

        const dataObject = {};

        dataArray.forEach((column, index) => {
            dataObject[column] = dataInfo[index]
            })
                        
                        
        const query = `INSERT INTO ${tableName} SET ?`;
            this.connection.query(query,dataObject, (err, results, fields) => {
                    if(err) throw err;
                        console.log("Dados inseridos")
                    })

    }

    getToday() {
        return new Promise((resolve, reject) => {
            const query = "SELECT Starttime FROM my_table ORDER BY id DESC LIMIT 1";
            this.connection.query(query, (err, rows) => {
                if(err) {
                    reject(err)
                }
                else {
                    resolve(rows)
                }
            })
        })

    }

    searchInfo(startIndex: Number, endIndex: Number) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM my_table ORDER BY id DESC LIMIT 1";
            this.connection.query(query, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    let allWorkingOk = true;
                    let affects = [];
                    let notAffects = [];
                    const result = rows.map(row => Object.values(row));
                    const removedArray = result.splice(0, 1)[0];
                    const newResult = result.concat(removedArray);
                    // console.log(newResult)
                    // console.log(startIndex)
                    // console.log(endIndex)
                    for (let i = startIndex; i <= endIndex; i++) {
                        if (newResult[i] == 'EM FALHA - Afeta o negócio' || newResult[i] == 'Funcionando PARCIAL - Afeta o negócio') {
                            allWorkingOk = false;
                            affects.push(newResult[i], newResult[i + 1]);
                        } else if (newResult[i] == 'EM FALHA - Não afeta o negócio' || newResult[i] == 'Funcionando PARCIAL - Não afeta o negócio') {
                            allWorkingOk = false;
                            notAffects.push(newResult[i], newResult[i + 1]);
                        }
                    }
                    // console.log(affects);
                    // console.log(notAffects);
                    // console.log(allWorkingOk);
                    resolve({ result: allWorkingOk, affects, notAffects });
                }
            });
        });
    }


}

const config = {

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'whatsappbot'

}

export default new DataBase(config)