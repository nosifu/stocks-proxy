const { loadavg } = require("os")

const input = 'abc中文解析123.~!@#$%^&*()_+-={}[]|\\:";\'<>?,./'
const rand = '6421509783'

const encode = (input, rand) => {
    const unicode = encodeURIComponent(input).split('').map(c => {
        let code = c.charCodeAt(0).toString(16)
        return code.length === 2 ? '00' + code : code
    }).join('')
    const arr = rand.split('').map(i => parseInt(i))
    return unicode.split('').map((c, index) => {
        let i = parseInt(c, 16)
        i = i + arr[index % 10]
        return (i % 16).toString(16)
    }).join('')
}

const out = encode(input, rand)
console.log(out)

const decode = (input, rand) => {
    const arr = rand.split('').map(i => parseInt(i))
    let unicode = input.split('').map((c, index) => {
        let i = parseInt(c, 16)
        i = i + 16 - arr[index % 10]
        return (i % 16).toString(16)
    }).join('')
    console.log('unicode', unicode)
    const result = unicode.replace(/(\w{1,4})/gi, m => unescape('%u' + m))
    return decodeURIComponent(result)
}
const result = decode(out, rand)
console.log(result)