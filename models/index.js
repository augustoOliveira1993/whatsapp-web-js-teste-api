const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    name: String,
    sessionData: Object,
    qrImage: String
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = { Session };
