const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');

class WhatsAppClient {
    constructor(sessionFilePath) {
        this.sessionFilePath = sessionFilePath;
        this._qrCode = null;

        this.client = new Client({
            authStrategy: new LocalAuth({
                dataPath: fs.existsSync(sessionFilePath) ? sessionFilePath : null
            }),
        });

        this.client.on('authenticated', this.onAuthenticated.bind(this));
        this.client.on('disconnected', this.onDisconnected.bind(this));
        this.client.on('message', this.onMessage.bind(this));
        this.client.on('change_state', this.onChangeState.bind(this));
        this.client.on('ready', this.onReady.bind(this));
        this.client.on('qr', this.getQR.bind(this));
    }

    get qrCode() {
        return this._qrCode;
    }

    set qrCode(value) {
        this._qrCode = value;
    }

    initialize() {
        this.client.initialize();
    }

    onAuthenticated(session) {
        console.log('Cliente autenticado!');
        this.saveSession(session);
    }

    onDisconnected(reason) {
        console.log('Cliente desconectado:', reason);
    }

    onMessage(message) {
        console.log(`Nova mensagem recebida: ${message.body} de ${message.from}`);
        if(message.body.toLowerCase() === 'ping') {
            message.reply('*[Automatica]*: :D pong OI!');
        }

        if(message.body.toLowerCase() === 'oi') {
            message.reply('*[Automatica]*: :D Oi, tudo bem?');
        }

        if(message.body.toLowerCase() === 'tudo bem?') {
            message.reply('*[Automatica]*: :D Tudo sim, e com você?');
        }
    }

    onChangeState(state) {
        console.log('Estado do cliente mudou:', state);
    }

    onReady() {
        console.log('Cliente pronto!');
    }

    saveSession(session) {
        if (session) {
            fs.writeFile(this.sessionFilePath, JSON.stringify(session), (err) => {
                if (err) {
                    console.error('Erro ao salvar a sessão:', err);
                } else {
                    console.log('Sessão salva com sucesso!');
                }
            });
        }
    }

    async sendMessage(number, message) {
        try {
            const numberParsed = `${
                number.includes('@c.us') ? number : `${
                    number.includes('+') ? number : `55${number}`
                }@c.us`
            }`;

            console.log(`Enviando mensagem para ${numberParsed}...`)
            const result = await this.client.sendMessage(numberParsed, message);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    getSessionData() {
        return this.client.session;
    }

    getQR(qr) {
        this.qrCode = qr;
    }
}

module.exports = WhatsAppClient;
