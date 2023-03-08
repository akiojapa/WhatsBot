import express from 'express'
import cors from 'cors'
import mongoose, { connection } from 'mongoose'
import { create, Client } from '@open-wa/wa-automate';
import moment from 'moment';
import exp from 'constants';
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

        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'whatsappbot'
        })

        let data = moment().format("DD/MM/YYYY")
        
        client.onMessage(async message => {

            if(message.body == '!teste'){
                db.connect().then(() => {
                    return Promise.all([
                        db.searchInfo(4, 20), // primeiro intervalo
                        db.searchInfo(21, 35), // segundo intervalo
                        db.searchInfo(36, 50) // terceiro intervalo
                    ])
                }).then(([interval1, interval2, interval3]) => {

                    function formatMessage(result, allWorkingOk, affects, notAffects) {
                        if (allWorkingOk) {
                            return `${result} ✅`;
                        } else {
                            let message = `${result} ⚠️`;
            
                            if (affects.length !== 0) {
                                for (let i = 0; i < affects.length; i = i + 2) {
                                    message += `\n\t🔴 ${affects[i + 1]}`;
                                }
                                message += "\n\t\t" + `${affects.length <= 2 ? ' **Afeta o negócio!**' : ' **Afetam o negócio!**'}`;
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
                    const mens = formatMessage('    •*Aplicações (BlazeMeter, Zabbix, Outros)📱- STATUS:*', interval1.result, interval1.affects, interval1.notAffects) + '\n\n' +  formatMessage('    *•Conectividade (Firewall, Links Campus) 📡 - STATUS:*', interval2.result, interval2.affects, interval2.notAffects) + '\n\n' + formatMessage ('    *•Datacenter (Gerador, Links DC, SMH, Nobreaks) 💾 - STATUS:*', interval3.result, interval3.affects, interval3.notAffects)

                    
                    return mens

                }).then((msg) => {
 
                    client.sendText(message.from,'** Report Diário do Relatório de Serviços TI Unicesumar (' + data + ')📋: **\n\n' + msg)
                })

                


            }  
                // função formatMessage é definida aqui e tem acesso às informações dos resultados dos intervalos
                    
                if(message.body[0] == '!' && message.body[1] < 10 && message.body.length > 450){
                    try{
                        let data = []
                        let aux = ''
                        for(let i=0; i < message.body.length; i++){
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
                        
                    }
                    catch(err){
                        console.log(err)
                    }

                    await client.sendText(message.from, '*Os dados foram inseridos com sucesso no banco de dados*\n\n        Caso queira visualizar a nova formatação digite: !rs')
                }

    
            if(message.body === '!P' || message.body === '!p'){
                await client.sendText(message.from, '** Report Diário do Relatório de Serviços TI Unicesumar (' + data + ')📋: **\n\n\n' + 
                '    *•Aplicações (BlazeMeter, Zabbix)📱- STATUS:*  (100%) 🟢\n\n' +
                '    *•Firewall Campus (Conectividade) 📡 - STATUS:*  (40%) ⚠️\n' +
                    '           *🔴 Campus Londrina:* Queda de energia no local, aguardando retorno da elétrica.\n' +
                    '                       **Afeta o negócio! **\n\n' +
                    '           *🟠 Campus Curitiba:* Rompimento de Fibra, acionado operadora e aberto chamado protocolo: 123456.\n' +
                    '           *🟠 Campus Corumbá:* Rompimento de Fibra, acionado operadora e aberto chamado protocolo: 123456.\n' +
                    '                       **Não afeta o negócio. **\n\n' +
            
                '    *•Datacenter (Gerador, Links DC, SMH, Nobrake) 💾 - STATUS:*  (80%) ⚠️\n' +
                    '            *🟠 SMH (Sistema de incêndio):* O sensor de incêndio continua sinalizando falha. Já está sendo verificado pelo gestor de redes Tales.\n' +
                    '                       **Não afeta o negócio. **')}

            if(message.body === '!RS' || message.body === '!rs'){
                await client.sendText(message.from, '**Report Diário do Relatório de Serviços TI Unicesumar (' + data + ') 📋:**\n\n' + 
                        '  *•Aplicações (BlazeMeter, Zabbix, Outros)📱- STATUS:*  ✅\n\n' +
            
                        '  *•Conectividade (Firewall, Links Campus) 📡 - STATUS:* ✅\n\n' +
                        
                        '  *•Datacenter (Gerador, Links DC, SMH, Nobreaks) 💾 - STATUS:* ✅')}
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
                await client.sendText(message.from, 'Aqui está a lista de comandos disponíveis: \n !rs - Resumo diário do dia de hoje \n !p - Demonstração do sistema com problemas \n !(data no formato dd/mm)')
            }

            if(message.body === '!'){
                await client.sendText(message.from, 'O "!" é o iniciador de comandos, em dúvida dos comandos existentes digite "!help"')
            }

        })
    }

}

export default new App().express