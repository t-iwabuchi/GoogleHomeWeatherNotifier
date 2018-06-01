module.exports = class GoogleHome {
  constructor(ipAddress) {
    this._ipAddress = ipAddress
  }
  tell(message) {
    const googlehome = require('google-home-notifier')
    const language = 'ja';

    googlehome.device('Google-Home', language); 
    googlehome.ip(this._ipAddress);
    googlehome.notify(message, function(res) {
      console.log(res);
    });
  }
}