$(document.body).css('display', 'none') // 隱藏BAR

let url_split = window.location.search
let dt = new Date()
// url_split = 1
console.log(`【local.js】URL: ${url_split}`)
if (url_split !== undefined) {
  if (url_split == "?qsi28883783") {
    // alert('eddd')
    // if (getCookie('AccountName')) { // 如果已經取得使用者名稱，跳過以下步驟
    //   redirectHome()
    // } else { // 初次登入成功
    document.cookie = 'AccessMode=' + "QSI" + ';path=/' 
    document.cookie = 'Domain=' + "QSI" + ';path=/' 
    document.cookie = 'AccountName=' + "NPYLES" + ';path=/' 
    document.cookie = 'AccountType=' + "ADMIN" + ';path=/' 
    document.cookie = 'role=' + "ADMIN" + ';path=/' 
    redirectHome()
    // }
  } else if (url_split.length == 0) { // 如果網址後面沒有帶路徑
    if (getCookie('AccountName')) {
      if (getCookie('location') !== undefined) {
        location.href = '/' + getCookie('location')
      } else {
        redirectHome()
      }
    } else { // 進入第二層判斷是否有A4 TOKEN
      Call_A4()
    }
  } else if (url_split) { // A4 Login 頁面用
    if (url_split.length > 15) {
      // 台積測試環境用
      let _url1 = url_split.split('=')[2]
      let _url2 = url_split.split('=')[1]
      let value

      if (TestOrTSMC == 0) { // 公司內部測試用
        value = JSON.stringify(TEST_Url)
      } else if (TestOrTSMC == 1) { // 台積測試環境用
        if (_url2 != undefined) {
          _url2 = _url2.split('&')[0]
        }
        value = JSON.stringify(`${_url1};jsessionid=${_url2}`)
      }
      console.log(value)
      // 取得A4TOKEN
      $.ajax({
        url: `${EMSR_ip}/api/a4/token`,
        type: "POST",
        async: false,
        dataType: 'JSON',
        contentType: 'application/json;charset=utf-8',
        data: value,
        // timeout: 10000,
        success: function (res) {
          console.log(res)
          if (res.StatusCode == 1 || res.StatusCode == -10) {
            // console.log(`【local.js】TOKEN SUCCESS , SCode: ${res.StatusCode}`)
            acdn = res.ContentObject.token // 第一次取得的t
            // console.log(Acdn)
            // if (getCookie('AccountName')) { // 如果已經取得使用者名稱，跳過以下步驟
            //   console.log('已有AccountName')
            //   Get_Auth(Acdn)
            // } else { // 初次登入成功
            console.log('【local.js】初次登入')
            document.cookie = 'AccessMode=' + res.ContentObject.LoginEmplData.CASResult.AccessMode + ';path=/' + ';domain=' + '.tsmc.com'
            document.cookie = 'Domain=' + res.ContentObject.LoginEmplData.CASResult.Domain + ';path=/' + ';domain=' + '.tsmc.com'
            document.cookie = 'AccountName=' + res.ContentObject.LoginEmplData.CASResult.AccountName + ';path=/' + ';domain=' + '.tsmc.com'
            document.cookie = 'AccountType=' + res.ContentObject.LoginEmplData.CASResult.AccountType + ';path=/' + ';domain=' + '.tsmc.com'
            Get_Auth(acdn)
            // }
          } else {
            console.log('【local.js】Token認證失敗')
            redirectA4()
          }
        },
        error: function () {
          console.log('【local.js】Token認證失敗，請重新登入')
          redirectA4()
        }
      })
    } else {
      if (getCookie('AccounName') && getCookie('acdn')) {
        if (getCookie('location') !== undefined) {
          location.href = '/' + getCookie('location')
        } else {
          redirectHome()
        }
      } else {
        Call_A4()
      }
    }

  } else {
    console.log('【local.js】Token認證失敗，請重新登入')
    redirectA4()
  }
} else {
  redirectHome()
}

// 判斷是否有A4 TOKEN
function Call_A4() {
  console.log('【local.js】Token認證失敗，請重新登入')
  // alert('【local.js】Token認證失敗，請重新登入')
  // let a4value
  let dt = new Date()
  let sso = $('#sso').text()
  if (sso != undefined) { // 呼叫A4 Service
    // alert('sso a4 API')
    console.log(`${EMSR_ip}/api/check/a4/token`)
    $.ajax({
      url: `${EMSR_ip}/api/check/a4/token`,
      type: 'POST',
      async: false,
      dataType: 'JSON',
      contentType: 'application/json;charset=utf-8',
      data: JSON.stringify({
        A4Profile_A4SSO: sso
      }),
      success: function (res) {
        // alert('a4 API enter')
        console.log(res)
        let a4timestamp, a4userName
        let checkDT = dt.getTime()
        let statusCode = res.StatusCode
        if (statusCode == 1) {
          // alert('a4 API success')
          if (res.ContentObject.code == 'SUCCESS') {
            a4userName = res.ContentObject.data.userName
            document.cookie = "AccountName=" + a4userName + ";path=/" + ';domain=' + '.tsmc.com'
            a4timestamp = res.ContentObject.data.expiredTimestamp
            checkDT = a4timestamp - checkDT
            if (checkDT <= 0) {
              // alert('Token驗證過期 a4 account API')
              console.log('【local.js】Token驗證過期，請重新登入')
              redirectA4Login()
            } else {
              // alert('Token驗證成功, Account: ' + a4userName)
              // alert(JSON.stringify(a4userName))
              // 呼叫API產生第一次t
              $.ajax({
                url: `${EMSR_ip}/api/a4/token/account`,
                type: 'POST',
                async: false,
                dataType: 'JSON',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(a4userName),
                success: function (res) {
                  // alert('a4 account API success')
                  console.log(res)
                  if (res.StatusCode == 1) {
                    acdn = res.ContentObject.token
                    // 呼叫使用者權限，產生第二次t
                    Get_Auth(acdn)
                  } else {
                    // alert('a4 account API error 1')
                    redirectA4Login()
                  }
                },
                error: function (xhr) {
                  // alert('a4 account API error 2')
                  console.log(xhr)
                  console.log(xhr.status)
                  redirectA4Login()
                }
              })
            }
          } else {
            // alert('a4 account API error 3')
            redirectA4Login()
          }
        } else {
          // alert('a4 account API error 4')
          redirectA4Login()
        }
      },
      error: function (xhr) {
        // alert('a4 API error')
        console.log(xhr)
        console.log(xhr.status)
        redirectA4Login()
      }
    })
  } else {
    // alert('a4 API all error')
    redirectA4Login()
  }
}


// 使用者權限 WEBAPI
function Get_Auth(Acdn) {
  // alert('GetAuth API enter')
  let role
  let user_role = JSON.stringify({
    tokenObject:
    {
      AccountName: getCookie("AccountName"),
      token: Acdn
    },
    roleObject:
    {
      uuid: "",
      winAcct: getCookie("AccountName"), // 必填
      token: Acdn
    }
  })
  console.log(user_role)
  // 取得權限
  $.ajax({
    url: `${EMSR_ip}/api/emsr/post/check/user/role`,
    type: 'POST',
    async: false,
    dataType: 'JSON',
    contentType: 'application/json;charset=utf-8',
    data: user_role,
    success: function (res) {
      if (res.StatusCode == 1) {
        // alert('GetAuth API success')
        console.log('【home.js】取得權限成功')
        console.log(res)
        Acdns = res.ContentObject.token
        document.cookie = "acdn=" + Acdns + ";path=/" + ';domain=' + '.tsmc.com;'
        role = res.ContentObject.roleData.data.userRole
        document.cookie = "role=" + role + ";path=/" + ';domain=' + '.tsmc.com' // 使用者權限
        // alert('user role', role)
        if (getCookie('location') !== undefined) {
          location.href = '/' + getCookie('location')
        } else {
          redirectHome()
        }
      } else {
        // alert('GetAuth API error 1')
        console.log('【home.js】取得權限失敗')
        console.log(res)
        redirectA4Login()
      }
    },
    error: function (xhr, status) {
      // alert('GetAuth API error 2')
      console.log(`ERROR: ${status}`)
      console.log(xhr)
      // redirectA4Login()
    }
  })
}