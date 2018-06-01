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
        callback(error, json.Feature[0].Property.WeatherList.Weather)
      } else {
        callback(error, null)
      }
    })
  }

  _buildUrl(latitude, longitude, appId) {
    return 'https://map.yahooapis.jp/weather/V1/place?' + 
      'output=json' + 
      '&coordinates=' + longitude + ',' + latitude +
      '&appid=' + appId
  }
}

/**
 * コールバック関数の説明
 * @callback WeatherApi~RequestCallback
 * @param {number} error - nullable.
 * @param {string} weathers - nullable. APIが返す[Weather]をそのまま返す
 */