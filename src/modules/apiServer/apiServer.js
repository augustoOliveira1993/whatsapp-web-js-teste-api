const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const WhatsAppClient = require('../whatsapp/whatsappClient');

class APIServer {
    constructor() {
        this.app = express();
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.whatsappClient = new WhatsAppClient('./sessionLocal');

        this.app.get('/qr', this.getQR.bind(this));
        this.app.get('/session', this.getSession.bind(this));
        this.app.get('/send-message', this.sendMessage.bind(this));
    }

    start(port) {
        this.whatsappClient.initialize();
        this.app.listen(port, () => {
            console.log(`API rodando na porta ${port}`);
        });
    }

    async getQR(req, res) {
        try {
            const qrImage = await this.whatsappClient.getQR();
            res.send({ qr: qrImage });
        } catch (error) {
            console.error('Erro ao gerar código QR:', error);
            res.status(500).send(error.message);
        }
    }

    getSession(req, res) {
        try {
            const sessionData = this.whatsappClient.getSessionData();
            res.send({ session: sessionData });
        } catch (error) {
            console.error('Erro ao obter dados da sessão:', error);
            res.status(500).send(error.message);
        }
    }

    async sendMessage(req, res) {
        try {
            const { number, message } = req.query;
            const result = await this.whatsappClient.sendMessage(number, message);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
}

module.exports = APIServer;
