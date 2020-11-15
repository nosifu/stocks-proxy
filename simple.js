var express = require('express');
var request = require('request');
var Iconv = require('iconv-lite');
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


// list?id=hk00001,hk00700,hk00388
// http://hq.sinajs.cn/list=hk00001,hk00700,hk00388
/**
 * 接受请求：http://localhost:3001/list?id=hk00001,hk00700,hk00388
 * 返回内容：http://hq.sinajs.cn/list=hk00001,hk00700,hk00388
 */
app.get('/list', function (req, res) {
    res.status(200),
    console.log('req.query:', JSON.stringify(req.query))
    request({
        encoding: null,
        url: `http://hq.sinajs.cn/list=${req.query.id}`
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('body', body)
            body = Iconv.decode(body, 'GB18030').toString()
            console.log('body', body)
            res.json(body)
        }
    })
});

//配置服务端口
var server = app.listen(3001, function () {
    console.log('server.address()', server.address())
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
})