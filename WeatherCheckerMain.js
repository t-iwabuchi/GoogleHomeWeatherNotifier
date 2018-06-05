module.exports = class WeatherCheckerMain {
  static check() {
    require('dotenv').config()
    const GoogleHome = require('./GoogleHome')
    const googleHome = new GoogleHome(process.env.NODE_GOOGLE_HOME_IP_ADDRESS)

    const WeatherApi = require('./WeatherApi')
    const weatherApi = new WeatherApi(process.env.NODE_YAHOO_APP_ID)
    weatherApi.request(process.env.NODE_LATITUDE, process.env.NODE_LONGITUDE, function(error, weatherStatus) {
      if(!error) {
        console.log('request ok.')

        const current = weatherStatus.current
        const next = weatherStatus.next
        if(current.Rainfall == 0 && next.Rainfall > 0) {
          googleHome.tell("雨がふりそうですよ。")
        }
        const past = weatherStatus.past
        if(past.Rainfall > 0 && current.Rainfall == 0) {
        	googleHome.tell("雨がやんだっぽいです。")
        }
        if(past.Rainfall == 0 && currentRainfall > 0) {
      	    googleHome.tell("雨がふり始めたかもしれません。")
        }
      } else {
        console.log(error)
      }
    })
  }
}
