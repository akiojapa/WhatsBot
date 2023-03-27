import {createPool, Pool, PoolConnection} from 'mysql2/promise'
import { resolve } from 'path';


class DataBase{ 

    private pool: Pool;

    constructor() {
        this.pool = createPool({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'whatsappbot',
            connectionLimit: 1000000000,
            namedPlaceholders: true

        });
    }

    public async getConnection(): Promise<PoolConnection> {
        return await this.pool.getConnection();
    }

    public async executeQuery(sql: string, values?: any[]): Promise<any>{
        const connection = await this.getConnection();
        try{
            const [rows] = await connection.execute(sql, values);
            return rows
        } catch (err) {
            console.error(err);
        } finally {
            connection.release;
        }

    }

    public async readDailyReport(table: string, startIndex: Number, endIndex: Number): Promise<any>{
        const sql = `SELECT * FROM ${table} ORDER BY id DESC LIMIT 1`;
        const result =  await this.executeQuery(sql);
        const value = result.map(row => Object.values(row));
        let allWorkingOk = true;
        let affects = [];
        let notAffects = [];
        const removedArray = value.splice(0, 1)[0];
        const newResult: String = value.concat(removedArray);
        for(let i = startIndex; i <= endIndex; i++) {
            if(newResult[i].includes('Afeta o negócio')){
                allWorkingOk = false;
                affects.push(newResult[i], newResult[i + 1]);
            } 

            if(newResult[i].includes('Não afeta o negócio')){
                allWorkingOk = false;
                notAffects.push(newResult[i], newResult[i + 1]);
            }
    }
        return ({allWorkingOk, affects, notAffects})

    }

    public async getDate(table: string){
        const sql = `SELECT gc_date FROM ${table} ORDER BY id DESC LIMIT 1`
        return await this.executeQuery(sql)
    }

    public async getColumns(table: String) {
        const results = await this.executeQuery(`DESCRIBE ${table}`);
        let columns = results.map(result => result.Field);
        return columns;
    }

    public async insertColumns(table: String, values: Array<String>) {
        const columns = await this.getColumns(table)


        const query = `INSERT INTO ${table} (${columns.slice(1).join(', ')}) VALUES (${values});`;

        console.log(query)

        await this.executeQuery(query)
        console.log("Query executada");
    
    }



    public async insertData(table: string, data: any): Promise<Any>{
        console.log(data)
        const sql = `INSERT INTO ${table} (Starttime, Email, CentraldeCaptacaoEAD, DescricaodoproblemaCentraldeCaptacaoEAD, Webclass, DescricaodoproblemaWebclass, WebServicesSydle, DescricaodoproblemaWebServicesSydle, GSuite, DescricaodoproblemaGSuite, Lyceum, DescricaodoproblemaLyceum, LyceumApiBoleto, DescricaodoproblemaLyceumApiBoleto, MundoAzul, DescricaodoproblemaMundoAzul, Plug, DescricaoodoproblemaPlug, PortalEAD, DescricaoodoproblemaPortalEAD, SistemasTerceiros, DescricaodoproblemaSistemasTerceiros, SitesEADePresencial, DescricaodoproblemaSitesEADePresencial, StudeoFront, DescricaodoproblemaStudeoFront, StudeoMonitoramentoBigIP, DescricaodoproblemaStudeoMonitoramentoBigIP, StudeoProducaoLogin, DescricaodoproblemaStudeoProducaoLogin, StudeoProducaoLogineDisciplina, DescricaodoproblemaStudeoProducaoLogineDisciplina, UniversoEAD, DescricaodoproblemaUniversoEAD, FirewallCampusCorumbaMemoriaLinksdeinternetSwitches, ProblemasemCorumba, FirewallCampusCuritibaMemoriaLinksdeinternetSwitches, ProblemasemCuritiba, FirewallCampusLondrinaMemoriaLinksdeinternetSwitches, ProblemasemLondrina, FirewallCampusMaringaMemoriaLinksdeinternetSwitches, ProblemasemMaringa, FirewallCampusPontaGrossaMemoriaLinksdeinternetSwitches, ProblemasemPontaGrossa, FirewallDataCenterMaringaMemoriaLinksdeinternet, ProblemasemFirewallDatacenter, InfraDatacenterBateriasHardwareCamerasSistemasdeprotecaoGerador, ProblemasemInfraDatacenter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        await this.executeQuery(sql, data);
        
    }

}

export default new DataBase()