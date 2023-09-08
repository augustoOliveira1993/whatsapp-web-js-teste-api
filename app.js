const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const QRCode = require('qrcode');
const {Client, LocalAuth} = require('whatsapp-web.js');

const app = express();

// Configuração do Body Parser e do CORS
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

let qrImage =''
let sessionData = ''

const SESSION_FILE_PATH = './sessionLocal';


// Inicializar o cliente
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: fs.existsSync(SESSION_FILE_PATH) ? SESSION_FILE_PATH : null
    }),
});

// Remova a lógica do evento 'qr' da rota '/qr'
client.on('qr', async qr => {
    try {
        qrImage = await QRCode.toDataURL(qr);
        console.log('QRCode gerado!')
    } catch (error) {
        console.error('Erro ao gerar código QR:', error);
    }
});

// Eventos do cliente
app.get('/qr', async (req, res) => {
    try {
        res.send({qr: qrImage});
    } catch (error) {
        console.error('Erro ao gerar código QR:', error);
        res.status(500).send(error.message);
    }
});
app.get('/session', (req, res) => {
    res.send({session: sessionData});
})

app.get('/send-message', async (req, res) => {
    try {
        const {number, message} = req.query;

        const numberParsed = `${
            number.includes('@c.us') ? number : `${
                number.includes('+') ? number : `55${number}`
            }@c.us`
        }`;

        console.log(`Enviando mensagem para ${numberParsed}...`)
        const result = await client.sendMessage(numberParsed, message);
        res.json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
})

client.on('disconnected', reason => {
    console.log('Cliente desconectado:', reason);
});
client.on('ready', () => {
    console.log('Cliente pronto!');
});
// state
client.on('change_state', state => {
    console.log('Estado do cliente mudou:', state);
})

client.on('message', (message) => {
    console.log(`Nova mensagem recebida: ${message.body} de ${message.from}`);
    if(message.body === 'ping') {
        message.reply('*[Automatica]*: :D pong OI!');
    }

    if(message.body === 'Oi') {
        message.reply('*[Automatica]*: :D Oi, tudo bem?');
    }

    if(message.body === 'Tudo bem?') {
        message.reply('*[Automatica]*: :D Tudo sim, e com você?');
    }
});

// Salvar a sessão quando estiver pronta
client.on('authenticated', (session) => {
    console.log('Cliente autenticado!')
    sessionData = session;

    if (session) {
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
            if (err) {
                console.error('Erro ao salvar a sessão:', err);
            } else {
                console.log('Sessão salva com sucesso!');
            }
        });
    }
});


// Iniciar o cliente
client.initialize();

// Iniciar o servidor
app.listen(3000, () => {
    console.log('API rodando na porta 3000');
});
