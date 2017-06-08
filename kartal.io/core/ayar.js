var ayar = {};

// host:port
ayar.host = "http://kartal.io";
ayar.port = 80;


ayar.uglyjs = true;

ayar.YZ = false;

ayar.adminMail = 'omer@farukcan.net';

// email ayarları
ayar.mailAdresi = 'noreply@farukcan.net';
ayar.mail = {
    host: 'mail.farukcan.net',
    port: 587,
    auth: {
        user: ayar.mailAdresi,
        pass: 'noreply@farukcan'
    }
};

module.exports = ayar;
