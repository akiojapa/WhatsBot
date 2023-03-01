import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { create, Client } from '@open-wa/wa-automate';
import moment from 'moment';
import exp from 'constants';
import routes from './routes'



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

    // private database (): void {
    //     mongoose.connect('mongodb://localhost:27017/tsnode', {
    //         useNewUrlParser: true
    //     })
    // }

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
        client.onMessage(async message => {
            if(message.body === '!P' || message.body === '!p'){
                await client.sendText(message.from, '** Resumo do Relatório Diário Serviços TI IES (' + data + ')📋: **\n\n' + 
                '*•Aplicações (BlazeMeter)📱- STATUS:*  (100%) 🟢\n\n' +
                '*•Firewall Campus (Conectividade) 📡 - STATUS:*  (40%) ⚠️\n' +
                    '       *🔴 Campus Londrina:* Queda de energia no local, aguardando retorno da elétrica.\n' +
                    '                       **Afeta o negócio! **\n\n' +
                    '       *🟠 Campus Curitiba:* Rompimento de Fibra, acionado operadora e aberto chamado protocolo: 123456.\n' +
                    '       *🟠 Campus Corumbá:* Rompimento de Fibra, acionado operadora e aberto chamado protocolo: 123456.\n' +
                    '                       **Não afeta o negócio. **\n\n' +
            
                '*•Datacenter (Gerador, Links DC, SMH, Nobrake) 💾 - STATUS:*  (80%) ⚠️\n' +
                    '        *🟠 SMH (Sistema de incêndio):* O sensor de incêndio continua sinalizando falha. Já está sendo verificado pelo gestor de redes Tales.\n' +
                    '                       **Não afeta o negócio. **\n\n' +	
                
                '*•Infra Dynatrace (Uniasselvi) 🏢 - STATUS:*  (0%) ⚠️\n' + 
                    '        *🟠Dynatrace :* Ferramenta de monitoração do ambiente Uniasselvi indisponível, verificando com responsáveis.)\n' +
                    '                       **Não afeta o negócio. **')}

            if(message.body === '!RS' || message.body === '!rs'){
                await client.sendText(message.from, '** Resumo do Relatório Diário Serviços TI IES (' + data + ') 📋: **\n\n' + 
                        '        *•Aplicações (BlazeMeter)📱- STATUS:*  (100%) ✅\n\n' +
            
                        '        *•Firewall Campus (Conectividade) 📡 - STATUS:*  (100%) ✅\n\n' +
                        
                        '        *•Datacenter (Gerador, Links DC, SMH, Nobrake) 💾 - STATUS:*  (100%) ✅\n\n' +
                            
                        '        *•Infra Dynatrace (Uniasselvi) 🏢 - STATUS:* (100%) ✅\n\n')}
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
                    
                    '** Resumo do Relatório Diário Serviços TI IES (' + formata + '/2022) 📋: **\n\n' + 
                '        *•Aplicações (BlazeMeter)📱- STATUS:*  (100%) ✅\n\n' +
    
                '        *•Firewall Campus (Conectividade) 📡 - STATUS:*  (100%) ✅\n\n' +
                
                '        *•Datacenter (Gerador, Links DC, SMH, Nobrake) 💾 - STATUS:*  (100%) ✅\n\n' +
                    
                '        *•Infra Dynatrace (Uniasselvi) 🏢 - STATUS:* (100%) ✅\n\n')

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