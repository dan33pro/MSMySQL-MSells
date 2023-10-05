const twilio = require('twilio');
const config = require("../../../config");
const client = new twilio(config.sendSMS.accountSid, config.sendSMS.authToken);

function sendSMS(codPais, phoneNumber, code) {
    return client.messages.create({
        body: `Tu código de recuperación es: ${code}`,
        to: `+${codPais}${phoneNumber}`,
        from: `+${config.sendSMS.codPais}${config.sendSMS.phoneNumber}`
    });
}

module.exports = sendSMS;