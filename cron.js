const cronJob = require('cron').CronJob;
const cronTime = "00 00,10,20,30,40,50 00,01,07-21 * * *";
const job = new cronJob({
  cronTime: cronTime
   , onTick: function() {
    console.log('onTick!');
    let Main = require('./WeatherCheckerMain')
    Main.check()
  }
   , onComplete: function() {
    console.log('onComplete!')
  }
  , start: true
  , timeZone: "Asia/Tokyo"
})
 
job.start();