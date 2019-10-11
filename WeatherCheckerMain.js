module.exports = class WeatherCheckerMain {
  static check() {
    const fs = require('fs');
    const datafile = './status.json'

    require('dotenv').config()
    const GoogleHome = require('./GoogleHome')
    const googleHome = new GoogleHome(process.env.NODE_GOOGLE_HOME_IP_ADDRESS)

    const WeatherApi = require('./WeatherApi')
    const weatherApi = new WeatherApi(process.env.NODE_YAHOO_APP_ID)

    let dt    = new Date();
    dt.setTime(dt.getTime() + 32400000); // 1000 * 60 * 60 * 9(hour)
    const year  = dt.getFullYear();
    const month = dt.getMonth()+1;
    const day   = dt.getDate();
    const hour  = dt.getHours();
    const min   = dt.getMinutes()
    const date  = "" + year + month + day + hour + min;

    // ファイルの存在確認
    const isExistFile = function(file) {
      try {
        fs.statSync(file)
        return true
      } catch(err) {
        if(err.code === 'ENOENT') return false
      }
    }

    // 降雨量が0でなくなる時間
    const begin_rainfall_time = function(weathers) {
      const rainfall = weathers.filter(function(item, index){
        if (item.Rainfall != 0.0) return true;
      })
      if (rainfall.length == 0) return null

      return rainfall[0].Date
    }

    // 降雨量が0でなくなる時間
    const get_amount = function(weathers, time) {
      const match = weathers.filter(function(item, index){
        if (item.Date == time) return true;
      })
      if (match.length == 0) return null

      return match[0].Rainfall
    }

    weatherApi.request(process.env.NODE_LATITUDE, process.env.NODE_LONGITUDE, function(error, weathers) {
      if(!error) {
        console.log('request ok.')

        let status = {
          isRain : false,
          notice : -1,
        }

        if (isExistFile(datafile)) {
          const file = JSON.parse(fs.readFileSync(datafile, 'utf8'))
          status.isRain = file.isRain
          status.notice = file.notice
        }


        const current_time = weathers.filter(function(item, index){
          if (item.Type == "observation") return true;
        })[0].Date
        const begin_time = begin_rainfall_time(weathers)

        // 降雨予報がなければ、通知フラグはリセット
        if (begin_time == null)
          status.notice = -1

        // 降雨を最初に検知した場合（60分のフラグを素通りした場合）
        if (status.isRain == false && status.notice == -1 && begin_time != null)
        {
          const diff = begin_time - current_time
          status.notice = diff
          googleHome.tell(`降雨通知です。${diff}分後に、${get_amount(weathers, begin_time)}ミリの雨が降りそうです。`)
          console.log(`${date}: notice rainfall before ${diff} min`)
        }

        // 降雨30分前
        if (status.isRain == false && status.notice > 30 && begin_time == current_time + 30)
        {
          status.notice = 30
          googleHome.tell(`降雨通知です。30分後に、${get_amount(weathers, begin_time)}ミリの雨が降りそうです。`)
          console.log(`${date}: notice rainfall before 30 min`)
        }

        // 降雨10分前
        if (status.isRain == false && status.notice > 10 && begin_time <= current_time + 10 && current_time != begin_time)
        {
          status.notice = 10
          googleHome.tell(`降雨通知です。まもなく、雨が降り出します。`)
          console.log(`${date}: notice rainfall just before`)
        }

        // 降り始め
        if (status.isRain == false && current_time == begin_time)
        {
          status.isRain = true
          status.notice = 0
          googleHome.tell("降雨通知です。雨が降り始めました。")
          console.log(`${date}: notice rainfall start`)
        }

        // 降り終わり
        if (status.isRain == true && (begin_time == null || begin_time > current_time + 30) )
        {
          status.isRain = false
          status.notice = -1
          googleHome.tell("降雨通知です。雨が止みました。")
          console.log(`${date}: notice rainfall stop`)
        }


        fs.writeFile(datafile, JSON.stringify(status), function(err, result) {
          if(err) console.log('error', err)
        })
      } else {
        console.log(error)
      }
    })
  }
}
