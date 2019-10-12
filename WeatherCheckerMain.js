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

    // 雨がふり始める時間
    const begin_rainfall_time = function(weathers) {
      const rainfall = weathers.filter(function(item, index){
        if (item.Rainfall > 1.0) return true;
      })
      if (rainfall.length == 0) return null

      return rainfall[0].Date
    }

    // 雨がふり終わる時間
    // 降水量が規定値を下回り、その後20分間雨が降らなければ、雨が降り止んだと判定する
    const end_rainfall_time = function(weathers, begin_time) {
      const rainfall = weathers.filter(function(item, index){
        if (item.Rainfall > 1.0) return true;
      })
      if (rainfall.length == 0) return null

      for (let i = 0; i < rainfall.length; i++)
      {
        if(rainfall[i].Date >= begin_time)
          continue

        if (i == rainfall.length - 1)
          return rainfall[rainfall.length - 1].Date
        
        if (rainfall[i+1].Date - rainfall[i].Date > 20)
          return rainfall[i].Date
      }
    }

    // 特定の時間より後の降雨が判定条件に合致するか確認
    const check = function(weathers, begin_time) {
      const end_time = end_rainfall_time(weathers, begin_time)
      if (end_time == null) return false

      if (end_time - begin_time > 20)
        return true
      else
        return false
    }

    // 降雨量の取得
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

        // 降雨を最初に検知した場合（30分以内）
        if (status.isRain == false && status.notice == -1 && begin_time != null && begin_time <= current_time + 30 && current_time != begin_time)
        {
          if (check(weathers, begin_time) == true)
          {
            const diff = begin_time - current_time
            status.notice = diff
            googleHome.tell(`降雨通知です。${diff}分後に、${get_amount(weathers, begin_time)}ミリの雨がふりそうです。`)
            console.log(`${date}: notice rainfall before ${diff} min`)
          }
        }

        // 降雨10分前
        if (status.isRain == false && status.notice > 10 && begin_time <= current_time + 10 && current_time != begin_time)
        {
          if (check(weathers, begin_time) == true) 
          {
            status.notice = 10
            googleHome.tell(`降雨通知です。まもなく、雨がふりそうです。`)
            console.log(`${date}: notice rainfall just before`)
          }
        }

        // ふり始め
        if (status.isRain == false && current_time == begin_time)
        {
          if (check(weathers, begin_time) == true)
          {
            status.isRain = true
            status.notice = 0
            googleHome.tell("降雨通知です。雨がふり始めました。")
            console.log(`${date}: notice rainfall start`)
          }
        }

        // ふり終わり
        if (status.isRain == true && (begin_time == null || begin_time > current_time + 30) )
        {
          status.isRain = false
          status.notice = -1
          googleHome.tell("降雨通知です。雨がやみました。")
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
