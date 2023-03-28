import express from 'express'
import cors from 'cors'
import mongoose, { connection } from 'mongoose'
import { create, Client } from '@open-wa/wa-automate';
import moment from 'moment';
import routes from './routes'
import db from './models/db'
import { format } from 'path';

//Grupo de teste: 120363048680196034@g.us

// Grupo oficial: 554491373732-1614010500@g.us

class App {
    public express: express.Application


    public constructor () {
        this.express = express()

        
        this.middlewares()
        this.routes()
        this.whatsBot()
    }

    private middlewares (): void {
        this.express.use(express.json())
        this.express.use(cors())
    }

    private routes (): void {
        this.express.use(routes)
    }

    private whatsBot(): void {
        
        const launchConfig = {
            useChrome: true,
            autoRefresh: true,
            cacheEnabled: false,
            sessionId: 'hr'
        };

        create(launchConfig).then(this.start);

    }

    private start(client) {


        let data = moment().format("DD/MM/YYYY")



        function formatMessage(result, allWorkingOk, affects, notAffects, withObservation) {

            if (allWorkingOk) {
                return `${result} ✅`;
            } else {
                let message = `${result} ⚠️`;

                if (affects.length !== 0) {
                    for (let i = 0; i < affects.length; i = i + 2) {
                        message += `\n\t🔴 ${affects[i + 1]}`;
                    }
                    message += "\n\t\t" + `${affects.length <= 2 ? ' **Afeta o negócio!**\n' : ' **Afetam o negócio!**\n'}`;
                }

                if (notAffects.length !== 0) {
                    for (let i = 0; i < notAffects.length; i = i + 2) {
                        message += `\n\t🟠 ${notAffects[i + 1]}`;
                    }
                    message += "\n\t\t" + `${notAffects.length <= 2 ? ' **Não afeta o negócio.**' : ' **Não afetam o negócio.**'}`;
                }
                if (withObservation.length !== 0) {
                    for (let i = 0; i < withObservation.length; i = i + 2) {
                        message += `\n\t🟡 ${withObservation[i + 1]}`;
                    }
                    message += "\n\t\t" + `${withObservation.length <= 2 ? ' **Funcionando com observação.**' : ' **Funcionando com obeservações.**'}`;
                }

                return message;
            }
        }
        
        client.onMessage(async message => {



            if(message.body === '!RS' || message.body === '!rs' || message.body === '!p' || message.body === '!P'){
                try {
                let date = await db.getDate('general_checklist')
                let mens: String = '';

                let aux = await db.readDailyReport('general_checklist',2,33)
                mens = formatMessage('    *•Aplicações (BlazeMeter, Zabbix, Outros)📱- STATUS:*', aux.allWorkingOk, aux.affects, aux.notAffects, aux.withObservation)
            
                aux = await db.readDailyReport('general_checklist',34,43)
                mens += '\n\n' + formatMessage('    *•Conectividade (Firewall, Links Campus) 📡 - STATUS:*', aux.allWorkingOk, aux.affects, aux.notAffects, aux.withObservation)
                
                aux = await db.readDailyReport('datacenter_checklist',2,19)
                mens += '\n\n' + formatMessage('    *•Datacenter (Gerador, Links DC, SMH, Nobreaks) 💾 - STATUS:*', aux.allWorkingOk, aux.affects, aux.notAffects, aux.withObservation)
                
                await client.sendText(message.from, '*Report Diário do Relatório de Serviços TI Unicesumar (' + date[0].gc_date + ')📋:* \n\n' + mens)
            } catch(err) {
                console.log(err)
            }
            
            }

            if(message.body[0] == '!' && message.body.length >=300){
                message.body = message.body + '\t'
                try{
                    let data: Array<String> = []
                    let aux = ''
                    for(let i = 0; i < message.body.length; i++){
                    if(data.length < 50){
                        if(message.body[i] != '\t' ){
                            if (message.body[i] != '!'){
                                aux = aux + message.body[i]
                            }

                        }
                        else{
                        data.push( '"' + aux + '"')
                        aux = ''
                        }
                    }
                }
                console.log(data)
                console.log(data.length)
                if (data.length > 22){
                    data.splice(43)
                    console.log(data.length)
                    db.insertColumns('general_checklist', data)
                    await client.sendText(message.from, '*Os dados foram inseridos com sucesso no banco de dados*\n\n        Caso queira visualizar a nova formatação digite: !rs')
                }
                else{ 
                    data.splice(0,2)
                    data.splice(1,1)
                    db.insertColumns('datacenter_checklist', data)
                    await client.sendText(message.from, '*Os dados foram inseridos com sucesso no banco de dados*\n\n        Caso queira visualizar a nova formatação digite: !rs')
                }

            } catch(err) {
                console.error(err)
            }
            
            
        }

            if(message.body === '!help' || message.body === '!HELP' || message.body == '!Help'){
                await client.sendText(message.from, 'Aqui está a lista de comandos disponíveis: \n !rs - Último report diário realizado. \n !p - Demonstração do sistema com problemas \n !(data no formato dd/mm)')
            }
        })
    }

}

export default new App().express