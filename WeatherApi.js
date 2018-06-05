module.exports = class WeatherApi {
  constructor(appId) {
    this._appId = appId
  }

  /**
  * @param {WeatherApi~RequestCallback} callback
  */
  request(latitude, longitude, callback) {
    const request = require('request');
    const url = this._buildUrl(latitude, longitude, this._appId)
    console.log('url: ' + url)
    const options = {
      url: url,
      method: 'GET'
    }

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const json = JSON.parse(body);
        const weathers = json.Feature[0].Property.WeatherList.Weather
        const weatherStatus = new Object();
        weatherStatus.past = weathers[5]
        weatherStatus.current = weathers[6]
        weatherStatus.next = weathers[7]

        callback(error, weatherStatus)
      } else {
        callback(error, null)
      }
    })
  }

  _buildUrl(latitude, longitude, appId) {
    return 'https://map.yahooapis.jp/weather/V1/place?' + 
      'output=json' + 
      '&coordinates=' + longitude + ',' + latitude +
      '&appid=' + appId +
      '&past=1'
  }
}

/**
 * コールバック関数の説明
 * @callback WeatherApi~RequestCallback
 * @param {number} error - nullable.
 * @param {string} weathers - nullable. APIが返す[Weather]をそのまま返す
 */