let check_url = location.href.split('/')[3]
console.log(check_url)
document.cookie = 'location=' + check_url + ';path=/' + ';domain=' + '.tsmc.com' // 當前頁面URL
let AccountName = getCookie('AccountName') // 使用者名稱
acdn = getCookie('acdn') // 使用者名稱
if (AccountName || acdn) {
  let cpu_name, rSiteCode
  // let check_cookie = getCookie('loginEmplId') // 員工編號，要透過DB抓取
  let data = JSON.stringify({ AccountName: AccountName, token: getCookie('acdn'), userRole: getCookie('role') });
  console.log(data)
  console.log(`${WEBAPI_ip}/api/computer_name`)
  // ACS+取得當前電腦名稱
  $.ajax({
    url: `${WEBAPI_ip}/api/computer_name`,
    type: 'POST',
    async: true,
    dataType: 'JSON',
    contentType: 'application/json;charset=utf-8',
    data: data,
    success: function (res) {
      console.log(res)
      if (res.StatusCode == 1) {
        cpu_name = res.ContentObject.computerName
        console.log(`【first_login.js】取得電腦名稱：${cpu_name}`)// 電腦名稱
        document.cookie = 'cpu_name=' + cpu_name + ';path=/' + ';domain=' + '.tsmc.com' // 給CPU NAME cookie
      } else { // 未取得CPU NAME，暫時設定為 USER
        cpu_name = 'USER'
        console.log(`【first_login.js】未取得CPU NAME，電腦名稱暫時設定：${cpu_name}`)
        document.cookie = 'cpu_name=' + cpu_name + ';path=/' + ';domain=' + '.tsmc.com' // 給CPU NAME cookie
      }
    },
    error: function (xhr, status) {
      console.log("【first_login.js】" + "WEBAPI ERROR CODE: " + xhr.status + ", 未取得CPU NAME")
    }
  })
  // ACS+取得 rsiteCode 廠區代碼
  $.ajax({
    url: `${WEBAPI_ip}/api/rsite_code`,
    type: 'POST',
    async: false,
    dataType: 'JSON',
    contentType: 'application/json;charset=utf-8',
    data: data,
    success: function (res) {
      if (res.StatusCode == 1) {
        console.log(`【first_login.js】取得廠區代碼：${res.ContentObject.rSiteCode}`)
        rSiteCode = res.ContentObject.rSiteCode
        document.cookie = 'rSiteCode=' + rSiteCode + ';path=/' + ';domain=' + '.tsmc.com'
        //document.cookie = 'rSiteCode=' + "100012" + ';path=/' + ';domain=' + '.tsmc.com'
      } else {
        console.log(`【first_login.js】取得廠區代碼失敗`)
        console.log(res)
      }

    },
    error: function (xhr, status) {
      console.log("【first_login.js】" + "WEBAPI ERROR CODE: " + xhr.status + ", 取得廠區代碼失敗")
    }
  })
  // ACS+取得員工編號
  $.ajax({
    url: `${WEBAPI_ip}/api/login/name`,
    type: 'POST',
    async: false,
    dataType: 'JSON',
    contentType: 'application/json;charset=utf-8',
    data: data,
    success: function (res) {
      if (res.StatusCode == 1) {
        loginEmplId = res.ContentObject.loginEmplId
        console.log(`【first_login.js】取得員工編號：${loginEmplId}`)
        document.cookie = 'loginEmplId=' + loginEmplId + ';path=/' + ';domain=' + '.tsmc.com'
      } else {
        console.log('【first_login.js】取得員工編號錯誤:')
        console.log(res)
      }
    },
    error: function (xhr, status) {
      console.log("【first_login.js】" + "WEBAPI ERROR CODE: " + xhr.status + ", 取得員工編號錯誤")
    }
  })
  if (TestOrTSMC == 1) {
    // CheckData() // 確認使用者資訊有沒有齊全、以及有無權限訪問頁面 
  }
} else {
  if (TestOrTSMC == 0) {
    // alert('測試環境~')

  } else {
    console.log('【CHECK_Cookie.js】使用者未登入')
    alert('【CHECK_Cookie.js】使用者未登入')
    redirectA4()
    // location.href = './'
  }

}
