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
        const current = weathers[6]
        const next = weathers[7]
        if(current.Rainfall == 0 && next.Rainfall > 0) {
          googleHome.tell("雨が降りそうです。")
        }
        const past = weather[4]
        if(past.Rainfall > 0 && current.Rainfall == 0) {
        	googleHome.tell("雨がやみました。")
        }
      } else {
        console.log(error)
      }
    })
  }
}
