var TestOrTSMC = 1 // 公司測試環境0 或 TSMC測試環境1
let WEBAPI_ip // WEB API IP
let EMSR_ip // EMSR IP
let TEST_Url // 公司內部測試用
let WEBAPI_PW = 'DEV:28883783' // WEBAPI 帳密
let A4RedirectUrl = "http://a4.tsmc.com.tw/a4CentralLogin/A4AuthNew.do?prd=EMSR&&sourceUrl=https://acsplusap03web.tsmc.com/" // A4 登入頁面(導向http://d12gwemsrd04..tsmc.com:3030/)
let acdn, Acdns
let language = getCookie('Language') // 設定語言
let onload = false // ReSeach Using

const cookie_time = ";Max-age=1500" // cookies 設定時間: 10分鐘
const setTime = 2000 // popup 時間
const side_tree_role = {
  Admin: ["home", "usercheck", "userpriv", "cleanroomcheck", "cleanroom", "clearance", "doorinfo", "doorpass", "cardswitch", "cleanroom30", "person30", "personenter", "person_total_list", "reservation", "inout_info", "card_statistics"],
  SMD: ["home", "usercheck", "userpriv", "cleanroomcheck", "cleanroom", "clearance", "doorinfo", "doorpass", "cardswitch", "cleanroom30", "person30", "personenter", "person_total_list", "reservation", "inout_info", "card_statistics"],
  CheckInOut: ["home", "usercheck", "userpriv", "cleanroomcheck", "cleanroom", "cardswitch", "personenter"],
  User: ["home", "cleanroom30", "person30", "personenter", "reservation", "inout_info"]
}

// 台積測試環境用 .175
if (TestOrTSMC == 0) {
  // 公司內部測試用 .112
  WEBAPI_ip = 'http://192.168.0.20:8081' // WEB API IP
  EMSR_ip = 'http://192.168.0.20:8082' // EMSR IP
  TEST_Url = 'http://192.168.0.20:8081/A4Key/recall/Url' // 公司內部測試用

} else if (TestOrTSMC == 1) {
  WEBAPI_ip = 'https://acsplusap03web.tsmc.com/api01' // WEB API IP
  EMSR_ip = 'https://acsplusap03web.tsmc.com/api02' // EMSR IP
}

// function StopTimeout(myVar) {
//   clearTimeout(myVar);
// }


if (getCookie('Language')) { //cookie有Language時
  console.log(language)
  if (language == 'zh-TW') {
    language = 'en-US'
  } else if (language == 'en-US') {
    language = 'zh-TW'
  }
} else { // 初次進入直接取得瀏覽器語系
  language = window.navigator.userLanguage || window.navigator.language;
}

var LangInit = () => {
  if (language == 'zh-TW') {
    console.log(language)
    $("#langIcon").attr('src', 'icon/EN.png')
    language = 'en-US'
    document.cookie = 'Language=' + language + ';path=/'
    // document.cookie = 'Language=' + language + ';path=/' + ';domain=' + '.tsmc.com'
    i18n.set({
      'lang': 'zh-tw', //e.g. en-us, zh-tw. Default is auto detect from browser.
      'path': './js/i18n/' // Default is empty (same level as i18n.js)
    })
    LangLocal()
  } else if (language == 'en-US') {
    console.log(language)
    $("#langIcon").attr('src', 'icon/TW.png')
    language = 'zh-TW'
    document.cookie = 'Language=' + language + ';path=/'
    // document.cookie = 'Language=' + language + ';path=/' + ';domain=' + '.tsmc.com'
    i18n.set({
      'lang': 'en-us', //e.g. en-us, zh-tw. Default is auto detect from browser.
      'path': './js/i18n/' // Default is empty (same level as i18n.js)
    })
    LangLocal()
  }
}

// 重新渲染side
function LangLocal() {
  $('#hi').html(`${i18n.t('Hi, ')}`)
  $("#hi").append(`${getCookie('AccountName')}`)
  $('#ST1').html(`${i18n.t('Onsite Person Check-in/out')}`)
  $('#usercheck').html(`${i18n.t('Main Entrance Check In/Out')}`)
  $('#cleanroomcheck').html(`${i18n.t('Cleanroom Check In/Out')}`)
  $('#ST2').html(`${i18n.t('Information Inquery')}`)
  $('#clearance').html(`${i18n.t('Clearance Name Inquery')}`)
  $('#doorinfo').html(`${i18n.t('Entrance Information Inquery')}`)
  $('#doorpass').html(`${i18n.t('Entrance Privilege Inquery')}`)
  $('#ST3').html(`${i18n.t('Record Inquery')}`)
  $('#cardswitch').html(`${i18n.t('Check In/Out Status Inquery')}`)
  $('#personenter').html(`${i18n.t('On-Site Person Resident Status')}`)
  $('#person30').html(`${i18n.t("30 days' Resident Status")}`)
  $('#cleanroom30').html(`${i18n.t("Vendor's 30 days' Cleanroom Resident Status")}`)
  $('#ST4').html(`${i18n.t('Report')}`)
  $('#person_total_list').html(`${i18n.t('Resident On-Site Person Statistics')}`)
  $('#reservation').html(`${i18n.t('Vender Book & Visit Statistics')}`)
  $('#inout_info').html(`${i18n.t('Personal Vender Book & Visit Statistics')}`)
  $('#card_statistics').html(`${i18n.t('Check In/Out Counter Statistics')}`)
  if(getCookie('rSiteCode') !== undefined){
    $('#headerFab').html(`<span>${i18n.t(getCookie('rSiteCode'))}</span>`)
  }else{
    $('#headerFab').html(`<span>Failed to get FAB</span>`)
  }
}

// Loading 功能
function Loading() {
  let $loading = $('#loading').hide() // 轉圈圈功能預設關閉
  $(document)
    .ajaxStart(function () {
      $('#bttn_submit').attr('disabled', true)
      $loading.show() // 轉圈圈功能開啟
    })
    .ajaxStop(function () {
      $('#bttn_submit').attr('disabled', false)
      $loading.hide() // 轉圈圈功能關閉
    })
}

// 時間format
function GetTime(dt, str) {
  // let dt = new Date()
  let time_string = `${dt.getFullYear()}-${paddingLeft(String(dt.getMonth() + 1), 2)}-${paddingLeft(String(dt.getDate()), 2)} ${paddingLeft(String(dt.getHours()), 2)}:${paddingLeft(String(dt.getMinutes()), 2)}:${paddingLeft(String(dt.getSeconds()), 2)}.${paddingLeft(String(dt.getMilliseconds()), 3)}`
  if (str !== undefined) {
    console.log(str ,":", time_string)
  } else {
    console.log(time_string)
  }
  return time_string
}

// 補零功能
function paddingLeft(str, length) {
  if (str.length >= length) {
    return str;
  } else {
    return ("0" + str);
  }
}

// 關閉DIALOG
var CloseDia = () => {
  $("#dialog").dialog("close")
  $('#input_time').focus()
  $('#input_time').select()
  $('#bttn_target').attr('disabled', false)
}

// 資料不符重新導向至A4 Service
var redirectA4 = () => {
  deleteAllCookies()
  location.href = './'
}

// 資料不符重新導向至A4 Login頁面
var redirectA4Login = () => {
  deleteAllCookies()
  location.href = A4RedirectUrl
}

// 導向初始Home頁面
var redirectHome = () => {
  location.href = '/home'
}

// 導向UserCheck頁面
var redirectUserCheck = () => {
  deleteAllCookies('UC_')
  location.href = '/usercheck'
}

// 導向CleanroomCheck頁面
var redirectCleanroomCheck = () => {
  deleteAllCookies('UC_')
  deleteAllCookies('cleanRoomList_')
  location.href = "/cleanroomcheck"
}

// var logOut=()=>{
//   deleteAllCookies()
//   location.href = A4RedirectUrl
// }

// 檢查使用者登入後資訊
function CheckData() {
  if (getCookie('rSiteCode') || getCookie('loginEmplId')) {
    // 確認使用者有無權限訪問頁面
    let value = JSON.stringify({
      AccountName: AccountName,
      token: getCookie('acdn'),
      userRole: getCookie('role'),
      authName: getCookie('role'),
      pagePath: check_url
    })
    $.ajax({
      url: `${WEBAPI_ip}/api/auth/check`,
      type: 'POST',
      async: false,
      dataType: 'JSON',
      contentType: 'application/json;charset=utf-8',
      data: value,
      success: function (res) {
        // console.log(res)
        if (res.StatusCode == 1) {
          console.log(`Auth 驗證成功，代碼: ${res.ContentObject.AuthCheck}`)
          // console.log(res.ContentObject.AuthCheck)
        } else if (res.StatusCode == -6 | res.StatusCode == -5) {
          if (res.ContentObject.AuthCheck == -1) {
            console.log(res.ContentObject.AuthCheck)
            redirectHome()
          } else if (res.ContentObject.AuthCheck == 0) {
            console.log(`Token 錯誤，錯誤代碼: ${res.ContentObject.AuthCheck}`)
            redirectA4()
          }
        } else if (res.StatusCode == -2) {
          console.log(`Token 過期，錯誤代碼: ${res.ContentObject.AuthCheck}`)
          redirectA4()
        } else if (res.StatusCode == -3) {
          console.log(`Token 錯誤，錯誤代碼: ${res.ContentObject.AuthCheck}`)
          redirectA4()
        } else {
          console.log(res.ContentObject.AuthCheck)
          redirectHome()
        }
      },
    })
  } else {
    console.log(getCookie('rSiteCode'))
    console.log(getCookie('loginEmplId'))
    console.log(getCookie('cpu_name'))
    alert('【first_login.js】資料未完善，請聯絡MIS')
    redirectA4()
  }
}

// 當照片取不到時
// function imgError(image) {
//   // $(image).hide(); 
//   $(this).attr("src", "/user_none.png");
// }

// 匯出XLS 2
function exportReportToExcel() {
  let table = document.getElementsByTagName("table")
  TableToExcel.convert(table[0], {
    name: `export.xlsx`,
    sheet: {
      name: 'Sheet 1'
    }
  });
}

// 列印功能
// Print('#person30_table',{})")

// 自動帶入時間功能
// to type="date"
Date.prototype.toDateInputValue = (function () {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
});

// to type="datetime-local"
Date.prototype.toDateInputValueLocal = (function () {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 16);
});

// to type="month"
Date.prototype.toDateInputValueMonth = (function () {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 7);
});

// to type="datetime-local" before 30 days
Date.prototype.toDateInputValue30d = (function () {
  var local = new Date(this);
  local.setDate(this.getDay()-30);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 16);
});