const express = require('express')
const app = express()
const sha256 = require('crypto-js/sha256') // crypto 加密API
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
app.use(cookieParser())
// 設定 SERVER 網址
// const hostname = '127.0.0.1'
// 設定 PORT號
// const port = 3006
// 設定樣板引擎為ejs
app.set('view engine', 'ejs')
// 加上靜態資料夾路徑
app.use(express.static(__dirname + '/public'))
// 使用 bodyParser
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))



// let dt = new Date
// let key = dt.getTime()
// var encryKey = sha256(key)

// app.use(cookieParser("secret")) // 簽證設定(到時可改成更複雜的加密方式)

// 重新導向
app.get('/', (req, res) => {
  res.render('local', {
    cookie: req.cookies.A4Profile_A4SSO
  })
})

// 初次登入
// app.get('/first_login', (req, res) => {
//   res.render('first_login')
// })


// 首頁
app.get('/home', (req, res) => {
  // console.log(req.query) //抓取 "?" 後面的 key value
  // let val = req.signedCookies.A4Profile_A4SSO
  res.render('home', {
    cookie: req.cookies.A4Profile_A4SSO
  })

})
// 登出頁面
app.get('/logout', (req, res) => {
  res.render('logout')
})

// 開關卡確認
app.get('/usercheck', (req, res) => {
  res.render('user_priv_check', {
    cookie: req.cookies.A4Profile_A4SSO
  })
})
// 開卡後頁面
app.get('/userpriv', (req, res)=>{
  res.render('user_priv', {
    cookie: req.cookies.A4Profile_A4SSO
  })
})
// 潔淨室確認
app.get('/cleanroomcheck', (req, res) => {
  res.render('clean_room_check', {
    cookie: req.cookies.A4Profile_A4SSO
  })
})
// 潔淨室開啟權限後
app.get('/cleanroom', (req, res) => {
  res.render('clean_room', {
    cookie: req.cookies.A4Profile_A4SSO
  })
})
// 資料查詢
// CLEARANCE NAME 通行權查詢頁面
app.get('/clearance', (req, res) => {
  console.log(req.query) //抓取 "?" 後面的 key value
  res.render('clearance', {
    cookie: req.cookies.A4Profile_A4SSO
  })
})
// 門禁基本資料查詢頁面
app.get('/doorinfo', (req, res) => {
  console.log(req.query) //抓取 "?" 後面的 key value
  res.render('door_info', {
    cookie: req.cookies.A4Profile_A4SSO
  })
})
// 門禁通行權查詢頁面
app.get('/doorpass', (req, res) => {
  res.render('door_pass', {
    cookie: req.cookies.A4Profile_A4SSO
  })
})
// 記錄查詢
// 開關卡記錄查詢頁面
app.get('/cardswitch', (req, res) => {
  res.render('card_switch', {
    cookie: req.cookies.A4Profile_A4SSO
  })
})
// 潔淨室30天記錄查詢頁面
app.get('/cleanroom30', (req, res) => {
  res.render('cleanroom30', {
    cookie: req.cookies.A4Profile_A4SSO
  })
})
// 駐廠人員出入廠30天記錄查詢頁面
app.get('/person30', (req, res) => {
  res.render('person30', {
    cookie: req.cookies.A4Profile_A4SSO
  })
})
// 駐廠人員今日入廠記錄查詢頁面
app.get('/personenter', (req, res) => {
  res.render('person_enter', {
    cookie: req.cookies.A4Profile_A4SSO
  })
})
// 預約駐廠人員今日入廠記錄查詢頁面
app.get('/personvisit', (req, res) => {
  res.render('person_visit', {
    cookie: req.cookies.A4Profile_A4SSO
  })
})
// 報表管理
// 廠區駐廠人員總數與列表
app.get('/person_total_list', (req, res) => {
  res.render('person_total_list', {
    cookie: req.cookies.A4Profile_A4SSO
  })
})
// 廠區預約及實際入廠通知
app.get('/reservation', (req, res) => {
  res.render('reservation', {
    cookie: req.cookies.A4Profile_A4SSO
  })
})
// 個人廠區出入廠資訊明細
app.get('/inout_info', (req, res) => {
  res.render('inout_info', {
    cookie: req.cookies.A4Profile_A4SSO
  })
})
// 各開關卡點廠商刷卡統計表
app.get('/card_statistics', (req, res) => {
  res.render('card_statistics', {
    cookie: req.cookies.A4Profile_A4SSO
  })
})

// TEST
app.get('/test', (req, res) => {
  res.render('test')
})

// Vendor Login Page
app.get('/vendor', (req, res) => {
  res.redirect('vendor/login')
})

app.get('/vendor/login', (req, res) => {
  res.render('vendor/vendor_login')
})

app.get('/vendor/usercheck', (req, res) => {
  res.render('vendor/vendor_usercheck')
})

app.get('/vendor/userpriv', (req, res) => {
  res.render('vendor/vendor_userpriv')
})

// 啟動剛建立的 SERVER
// app.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}`)
// })
app.listen(process.env.PORT)


