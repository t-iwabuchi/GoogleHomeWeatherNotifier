module.exports = class WeatherCheckerMain {
  static check() {
    require('dotenv').config()
    const GoogleHome = require('./GoogleHome')
    const googleHome = new GoogleHome(process.env.NODE_GOOGLE_HOME_IP_ADDRESS)

    const WeatherApi = require('./WeatherApi')
    const weatherApi = new WeatherApi(process.env.NODE_YAHOO_APP_ID)
    weatherApi.request(process.env.NODE_LATITUDE, process.env.NODE_LONGITUDE, function(error, weathers) {
      if(!error) {
        console.log('request ok.')
        const current = weathers[0]
        const next = weathers[1]
        if(current.Rainfall == 0 && next.Rainfall > 0) {
          googleHome.tell("雨が振りそうです。")
        }
      } else {
        console.log(error)
      }
    })
  }
}
