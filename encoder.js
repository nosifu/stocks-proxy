// const input = 'abc中文解析123.~!@#$%^&*()_+-={}[]|\\:";\'<>?,./'
const input = '645750b58397218297b3644650c98397218197b3645250b5839a218197a8645450d98396218597a1645350c78394217597b5645450c88394218397a1645a50c98389218397c5'
const rand = '6421509783'

module.exports.encode = (input) => {
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

const decode = (input) => {
    const arr = rand.split('').map(i => parseInt(i))
    let unicode = input.split('').map((c, index) => {
        let i = parseInt(c, 16)
        i = i + 16 - arr[index % 10]
        return (i % 16).toString(16)
    }).join('')
    // console.log('unicode', unicode)
    const result = unicode.replace(/(\w{1,4})/gi, m => unescape('%u' + m))
    return decodeURIComponent(result)
}

// console.log('解码：', decode(input))

module.exports.decode = decode