const cronJob = require('cron').CronJob;
const cronTime = "00 00,05,10,15,20,25,30,35,40,45,50,55 07-21 * * *";
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