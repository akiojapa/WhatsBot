import express from 'express'
import cors from 'cors'
import mongoose, { connection } from 'mongoose'
import { create, Client } from '@open-wa/wa-automate';
import moment from 'moment';
import routes from './routes'
import db from './models/db'



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

        function formatMessage(result, allWorkingOk, affects, notAffects) {
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
                    message += "\n\t\t" + `${notAffects.length <= 2 ? ' **Não afeta o negócio.*' : ' **Não afetam o negócio.**'}`;
                }

                return message;
            }
        }
        
        client.onMessage(async message => {

            if(message.body === '!RS' || message.body === '!rs' || message.body === '!p' || message.body === '!P'){
                db.connect().then(() => {
                    return Promise.all([
                        db.getToday()
                    ])
                }).then(([today]) => {
                    return today
                }).then((today) => {
                    console.log(today[0].Starttime)
                    data = today[0].Starttime
                })
                
                db.connect().then(() => {
                    return Promise.all([
                        db.searchInfo(4, 35), // primeiro intervalo
                        db.searchInfo(36, 45), // segundo intervalo
                        db.searchInfo(46, 49) // terceiro intervalo
                    ])
                }).then(([interval1, interval2, interval3]) => {

                    const mens = formatMessage('    *•Aplicações (BlazeMeter, Zabbix, Outros)📱- STATUS:*', interval1.result, interval1.affects, interval1.notAffects) + '\n\n' +  formatMessage('    *•Conectividade (Firewall, Links Campus) 📡 - STATUS:*', interval2.result, interval2.affects, interval2.notAffects) + '\n\n' + formatMessage ('    *•Datacenter (Gerador, Links DC, SMH, Nobreaks) 💾 - STATUS:*', interval3.result, interval3.affects, interval3.notAffects)

                    
                    return mens

                }).then((msg) => {
                    
                    if(message.body === '!p' || message.body === '!P'){
                        client.sendText(message.from,'*Report Diário do Relatório de Serviços TI Unicesumar (' + data + ')📋:* \n\n' + msg)
                    }

                    if(message.body === '!rs' || message.body === '!RS'){
                    client.sendText('120363048680196034@g.us', '*Report Diário do Relatório de Serviços TI Unicesumar (' + data + ')📋:* \n\n' + msg)
                    }
                })

                


            }  
                // função formatMessage é definida aqui e tem acesso às informações dos resultados dos intervalos
                    
                if(message.body[0] == '!' && message.body[1] < 10 && message.body.length > 450){
                    try{
                        let data = []
                        let aux = ''
                        for(let i=4; i < message.body.length; i++){
                            if(message.body[i] != '\t'){
                                if (message.body[i] != '!'){
                                    aux = aux + message.body[i]
                                }
                                
                            }
                            else{
                                data.push(aux)
                                aux = ''
                                
                            }
                            
                        }
                        db.insertDB(data)
                        await client.sendText(message.from, '*Os dados foram inseridos com sucesso no banco de dados*\n\n        Caso queira visualizar a nova formatação digite: !rs')
                        db.connect().then(() => {
                        return Promise.all([
                            db.getToday()
                        ])
                    }).then(([today]) => {
                        return today
                    }).then((today) => {
                        console.log(today[0].Starttime)
                        data = today[0].Starttime
                    })
                    
                    db.connect().then(() => {
                        return Promise.all([
                            db.searchInfo(4, 35), // primeiro intervalo
                            db.searchInfo(36, 45), // segundo intervalo
                            db.searchInfo(46, 49) // terceiro intervalo
                        ])
                    }).then(([interval1, interval2, interval3]) => {

                        const mens = formatMessage('    *•Aplicações (BlazeMeter, Zabbix, Outros)📱- STATUS:*', interval1.result, interval1.affects, interval1.notAffects) + '\n\n' +  formatMessage('    *•Conectividade (Firewall, Links Campus) 📡 - STATUS:*', interval2.result, interval2.affects, interval2.notAffects) + '\n\n' + formatMessage ('    *•Datacenter (Gerador, Links DC, SMH, Nobreaks) 💾 - STATUS:*', interval3.result, interval3.affects, interval3.notAffects)

                        
                        return mens

                    }).then((msg) => {
                        
                        client.sendText(message.from, '*Report Diário do Relatório de Serviços TI Unicesumar (' + data + ')📋:* \n\n' + msg)
                        
                    })
                        
                        
                    }
                    catch(err){
                        console.log(err)
                    }                    
                }

            if(message.body[0] == '!' && message.body.length == 6 && message.body[3] == '/'){
                var formata = ''
                var total = ''

                for(let i = 1; i < 6; i++){
                    formata = formata + message.body[i]
                    if(message.body[i] != '/'){
                        total = total + message.body[i]
                    }
                }
                console.log(formata)
                if(parseInt(total) < 10000){
                await client.sendText(message.from,
                    
                    '**Report Diário do Relatório de Serviços TI Unicesumar (' + formata +'/2022 ) 📋:**\n\n' + 
                        '  *•Aplicações (BlazeMeter, Zabbix, Outros)📱- STATUS:* ✅\n\n' +
            
                        '  *•Conectividade (Firewall, Links Campus) 📡 - STATUS:* ✅\n\n' +
                        
                        '  *•Datacenter (Gerador, Links DC, SMH, Nobreaks) 💾 - STATUS:* ✅')

                console.log(message.body.length)
                console.log(message.body)
                console.log(message.body[2])
            }
            else{
                await client.sendText(message.from, "*Mensagem inválida, digite !help para obter ajuda!*")
            }}


            if(message.body === '!help' || message.body === '!HELP' || message.body == '!Help'){
                await client.sendText(message.from, 'Aqui está a lista de comandos disponíveis: \n !rs - Último report diário realizado. \n !p - Demonstração do sistema com problemas \n !(data no formato dd/mm)')
            }

            if(message.body === '!'){
                await client.sendText(message.from, 'O "!" é o iniciador de comandos, em dúvida dos comandos existentes digite "!help"')



                await client.getAllGroups().then(
                    groups => groups.map((group => {
                        if(group.name == 'AutTest'){
                            console.log(group)
                        }
                    })
                        
                    )
                )

                await client.sendText('120363048680196034@g.us', "Teste!")
            }

        })
    }

}

export default new App().express