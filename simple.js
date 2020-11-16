var express = require('express');
var request = require('request');
var Iconv = require('iconv-lite');
var { encode } = require('./encoder');
process.env.NODE_ENV = 'production';
var app = express();

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

function formatNum(num, n) {
    //参数说明：num 要格式化的数字 n 保留小数位
    num = String(num.toFixed(n));
    var re = /(-?\d+)(\d{3})/;
    while (re.test(num)) num = num.replace(re, "$1,$2")
    return num;
}

function getKeyInfo(str) {
    const arrCode = str.split("\"")
    console.log('arrCode', arrCode);
    if (arrCode.length < 2) return
    const elements = arrCode[1].split(",")
    var today_open = elements[2];
    var today_new = elements[6];
    if (elements[2] == "0.000") {
        today_open = "--";
    }
    var change = today_new - elements[3]
    var change_p = change / elements[3] * 100
    console.log("股票英文：" + elements[0]);
    console.log("股票名称：" + elements[1]);
    console.log("今开盘：" + today_open);
    console.log("昨收盘：" + elements[3]);
    console.log("最新价：" + today_new);
    console.log("升跌：" + change);
    console.log("升跌%：" + change_p + " %");
    console.log("成交价：" + elements[10] + " HK$");
    console.log("成交量：" + elements[12] + " 股");
    console.log("更新日期：" + elements[17]);
    console.log("更新时间：" + elements[18]);
    const wrapP = change_p < 0 ? 200 - change_p : 100 + change_p
    return today_new + '#' + wrapP.toFixed(2)
}


// list?id=hk00001,hk00700,hk00388
// http://hq.sinajs.cn/list=hk00001,hk00700,hk00388
/**
 * 接受请求：http://localhost:3001/list?id=14264,14155
 * 减去12345，留5位，加上前缀hk
 * 接受请求：http://localhost:3001/list?id=hk01919,hk01810
 * 返回内容：http://hq.sinajs.cn/list=hk01919,hk01810
 * var hq_str_hk00001="CHEUNG KONG,长和,54.500,54.200,55.450,54.350,55.150,0.950,1.753,55.050,55.150,591676121,10758238,41.591,0.000,72.504,42.978,2020/11/16,16:08";
 * var hq_str_hk00700="TENCENT,腾讯控股,600.000,602.000,603.000,585.500,597.000,-5.000,-0.831,597.000,597.500,11525779749,19389831,422.505,0.000,633.000,316.996,2020/11/16,16:08";
 * var hq_str_hk00388="HKEX,香港交易所,374.600,371.000,375.800,366.000,374.000,3.000,0.809,373.800,374.000,1667670022,4481080,388.773,0.000,396.800,198.631,2020/11/16,16:08";
 */
app.get('/list', function (req, res) {
    res.status(200),
        console.log('req.query:', JSON.stringify(req.query))
    const ids = req.query.id.split(',').map(i => 'hk' + (parseInt(i) - 12345 + 1000000 + '').substr(-5)).join(',')
    console.log('ids:', ids);
    request({
        encoding: null,
        url: `http://hq.sinajs.cn/list=${ids}`
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('body', body)
            body = Iconv.decode(body, 'GB18030').toString()
            console.log('body', body)
            const items = body.split('\n')
            body = items.map(i => getKeyInfo(i)).join(';')
            console.log('getKeyInfo body', body)
            body = encode(body)
            console.log('encoded body', body)
            res.send(body)
        }
    })
});

//配置服务端口
var server = app.listen(80, function () {
    console.log('server.address()', server.address())
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
})