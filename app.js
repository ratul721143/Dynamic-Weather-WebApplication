const http = require('http');
const fs = require('fs');
const requests = require('requests');

const homeFile = fs.readFileSync("index.html","utf-8");

const KtoC = (K) =>{
    var C= K-273.0;
    return parseFloat(C.toFixed(1));
}

const replaceValue = (prehomeVal,orghomeVal) =>{
    let temperature = prehomeVal.replace("{% tempval %}",KtoC(orghomeVal.main.temp));
    //now temperature is contains all home file
    temperature = temperature.replace("{% mintemp %}",KtoC(orghomeVal.main.temp_min));
    temperature = temperature.replace("{% maxtemp %}",KtoC(orghomeVal.main.temp_max));
    temperature = temperature.replace("{% cityname %}",orghomeVal.name);
    temperature = temperature.replace("{% country %}",orghomeVal.sys.country);
    temperature = temperature.replace("{%weatherstatus%}",orghomeVal.weather[0].main);
    return temperature;
};


const server = http.createServer((req,res)=>{
    if(req.url == "/"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=Kolkata&appid=285bdf820e5d68dc7caf25c0517ec7e9')
        .on('data', function (chunk) {
            const objData = JSON.parse(chunk);
            const arrData = [objData];

            const changedHomeData = arrData.map(val=> replaceValue(homeFile,val)).join("");
            res.write(changedHomeData);
        })
        .on('end', function (err) {
            if (err) return console.log('connection closed due to errors', err);
            res.end();
        });
    }

    
});


server.listen(3000,'127.0.0.1');