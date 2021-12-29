Loading() // Loading圈圈
$("#dialog").dialog({
  autoOpen: false,
  modal: true,
  open: function () {
    jQuery('.ui-widget-overlay').bind('click', function () {
      dialogopen.dialog('close');
    });
  },
  width: "40vw",
  maxWidth: "768px"
}); // popup 預設關閉

var BackPage = () => {
  deleteAllCookies('G_')
  location.href = redirect_home
}

var Logout = () => {
  deleteAllCookies()
  location.href = './login'
}

$('#bttn_submit').click(() => {
  CHECK_USER()
})

let redirect_home = "./usercheck"
let G_res_time = getCookie('G_res_time')
let G_cardId = getCookie("G_cardId") // 要被開卡的廠商卡號
let G_enterDate,
  _AccountName,
  G_userRole,
  G_enterTime,
  G_rSiteCode,
  _Acdn,
  G_uuid_to_ACS,
  G_userId,
  G_cpu_name,
  G_updateUser,
  G_inSite,
  G_isReassign,
  G_deptIdReassignList,
  G_loginEnplId,
  G_start_time,
  G_end_time,
  myVar,
  G_openRSiteCode,
  G_isCardEnableDisable,
  G_companyId,
  G_companyName,
  G_companyEName,
  G_userName,
  G_userEName,
  G_receptionEmplName,
  G_receptionEmplEName,
  G_openType


// 要先在user priv check取的相對應資料，才能進入下一步
if (G_cardId != undefined) {
  if (G_res_time) {
    enterDate = G_res_time.split(' ')[0]
    enterTime = G_res_time.split(' ')[1]
    enterTime = enterTime.length == '12' ? enterTime.slice(0, -4) : enterTime
    G_isReassign = getCookie('G_isReassign') // 是否重派權限
    deptIdReassignList = getCookie('G_deptIdRessignList').split(',') // 重派權限清單
  }
  G_uuid_to_ACS = getCookie('G_uuid')
  _Acdn = getCookie('_Acdn')
  G_rSiteCode = getCookie('G_rSiteCode')
  G_userRole = getCookie('G_userRole')
  G_userId = getCookie('G_userId') // 要被開卡的廠商ID
  if (TestOrTSMC == 1) {
    $('#user_pic').attr('src', `${EMSR_ip}/api/emsr/photo/jpg?id=${G_userId}`)
  }
  G_userName = getCookie('G_userName') // 廠商名稱
  G_userEName = getCookie('G_userEName') // 廠商名稱
  G_cpu_name = getCookie('G_cpu_name')
  G_companyId = getCookie("G_companyId") // 公司統編
  G_companyName = getCookie('G_companyName') // 公司名稱
  G_companyEName = getCookie('G_companyEName') // 公司名稱
  G_updateUser = getCookie('G_receptionEmpl') // 接待員工工號
  G_receptionEmplName = getCookie('G_receptionEmplName') // 接待員工名稱
  G_receptionEmplEName = getCookie('G_receptionEmplEName') // 接待員工名稱
  G_inSite = getCookie('G_inSite') // 該卡號是否在場內

  G_openType = getCookie('G_openType') // 開關卡型態
  if (G_openType != undefined) {
    G_openType = G_openType // 開關卡型態
  } else if (G_openType == undefined) {
    G_openType = ""
  }
  G_openRSiteCode = getCookie('G_openRSiteCode')
  if (G_openRSiteCode != undefined) {
    if (G_openRSiteCode.length > 1) {
      G_openRSiteCode = G_openRSiteCode.split(',') // 聯合連通廠區
    }
  }else if (G_openRSiteCode == undefined) {
    G_openRSiteCode = ""
  }
  _AccountName = getCookie('_AccountName')
  G_isCardEnableDisable = getCookie('G_isCardEnableDisable')

  // 取得卡片入廠時間
  let card_enterDate, card_enterTime
  let value = JSON.stringify({
    AccountName: _AccountName,
    token: _Acdn,
    userRole: G_userRole,
    cardId: G_cardId,
  })
  console.log(value)
  // let start_time_entertime = new Date()
  // GetTime(start_time_entertime, 'TIME API Start')
  $.ajax({
    url: `${WEBAPI_ip}/api/checkin/datetime`,
    type: 'POST',
    async: false,
    dataType: 'JSON',
    contentType: 'application/json;charset=utf-8',
    data: value,
    success: function (res) {
      console.log(res)
      if (res.StatusCode == 1) {
        card_enterDate = (res.ContentObject.date.replace('-', '/')).replace('-', '/')
        // console.log((card_enterDate.replace('-', '/')).replace('-', '/'))
        // console.log(card_enterDate.split('-'))
        card_enterTime = res.ContentObject.time
      } else if (res.StatusCode == -2 || res.StatusCode == -3) {
        $("#dia_content").html(`
          <span>${i18n.t('Token Expired or Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
        `)
        $("#dialog").dialog("open")
        $('#next').click(() => {
          deleteAllCookies()
          location.href = A4RedirectUrl
        })
      }
    }
  })

  // 帶入頁面中的個人資料
  let dt = new Date();
  let gettime = dt.toString().split(' ')[4]
  let nowdate = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate()
  let nowtime = gettime;
  $("#cardId").append(`${G_userId}`) // 廠商編號
  if (G_companyId != undefined) {
    $("#compId").append(`${G_companyId}`) // 公司編號
  }
  $("#cardNo").append(`${G_cardId}`) // 門禁卡號
  $("#deptIdRessign").append(G_updateUser) // 接待員工工號
  $("#rSiteCode").append(`${G_rSiteCode}`) // 潔淨室工作區域
  if (G_inSite == 1) { // 出廠關卡
    $('.user_pic').attr('style', 'background-color: #00ffff')
    $('#bttn_submit').prepend(i18n.t('Card Disable'))
    if (G_res_time) {
      if (card_enterDate == undefined || card_enterDate == null) {
        $("#work_start").append(`<span></span>`) // 工作起始日期
        $("#enterDate").append(``) // 廠商卡片入廠日期
        $("#enterTime").append(``) // 廠商卡片入廠時間
      } else {
        $("#work_start").append(`<span>${card_enterDate}</span>`) // 工作起始日期
        $("#enterDate").append(`${card_enterDate}`) // 廠商卡片入廠日期
        $("#enterTime").append(`${card_enterTime}`) // 廠商卡片入廠時間
      }
      $("#work_end").append(`<span>${enterDate}</span>`) // 工作結束日期
      $("#outDate").append(`${enterDate}`) // 廠商出廠日期
      $("#outTime").append(`${enterTime}`) // 廠商出場時間
    } else { // 沒有EMSR回覆的時間，取當下時間
      $("#work_start").append(`<span>${card_enterDate}</span>`) // 工作起始日期
      $("#work_end").append(`<span>${nowdate}</span>`) // 工作結束日期
      $("#enterDate").append(`${card_enterDate}`) // 廠商卡片入廠日期
      $("#enterTime").append(`${card_enterTime}`) // 廠商卡片入廠時間
      $("#outDate").append(`${nowdate}`) // 廠商出廠日期
      $("#outTime").append(`${nowtime}`) // 廠商出場時間
    }
  } else if (G_inSite == 0) { // 入場開卡
    $('.user_pic').attr('style', 'background-color: #ff0033')
    if (G_res_time) { // EMSR回覆的時間
      $("#work_start").append(`<span>${enterDate}</span>`) // 工作起始日期
      $("#enterDate").append(`${enterDate}`) // 廠商入廠日期
      $("#enterTime").append(`${enterTime}`) // 廠商入廠時間
    } else { // 沒有EMSR回覆的時間，取當下時間
      $("#work_start").append(`<span>${nowdate}</span>`) // 工作起始日期
      $("#enterDate").append(`${nowdate}`) // 廠商入廠日期
      $("#enterTime").append(`${nowtime}`) // 廠商入廠時間
    }
    $('#bttn_submit').prepend(i18n.t('Card Enable'))
  }
} else {
  deleteAllCookies('G_')
  location.href = redirect_home
}




// 點擊開/關卡後的動作
function CHECK_USER() {
  if (G_inSite == 1) { // 關卡
    value = JSON.stringify({
      AccountName: _AccountName,
      token: _Acdn,
      userRole: G_userRole,
      uuid: G_uuid_to_ACS,
      cardId: G_cardId,
      userId: G_userId,
      computerName: G_cpu_name,
      updateUser: _AccountName,
      isCardEnableDisable: G_isCardEnableDisable,
      openType: G_openType
    })
    console.log(value)
    // ACS 關卡程式
    $.ajax({
      url: `${WEBAPI_ip}/api/card/disable`,
      type: 'POST',
      async: true,
      dataType: 'JSON',
      contentType: 'application/json;charset=utf-8',
      data: value,
      success: function (res) {
        console.log(res)
        if (res.StatusCode == 1) {
          console.log(`【user_priv.js】關卡StatusCode: ${res.StatusCode}`)
          if (res.ContentObject.isSuccess == 1) {
            if (G_openRSiteCode != undefined) {
              if (G_openRSiteCode.length > 1) { // 測試設定0，正式要改1
                CallOpenRSiteCode("disable")
              }
            }
            $("#dia_content").html(`
              <span>${i18n.t('Emp ID/Card ID')}: ${G_userId}</span><br>
              <span>${i18n.t('Factory')}: ${G_rSiteCode}</span><br>
              <span class="clr-green">${i18n.t('Card Disabled Successfully')}</span>
            `)
            $("#dialog").dialog("open")
            $('#next').click(() => {
              deleteAllCookies('G_')
              location.href = redirect_home
            })
          } else {
            $("#dia_content").html(`
              <span>${i18n.t('Emp ID/Card ID')}: ${G_userId}</span><br>
              <span>${i18n.t('Factory')}: ${G_rSiteCode}</span><br>
              <span>${i18n.t('Card closing failed, try again')}</span>
            `)
            $("#dialog").dialog("open")
            $('#next').click(() => {
              deleteAllCookies('G_')
              location.href = redirect_home
            })
          }
        } else if (res.StatusCode == -2 | res.StatusCode == -3) {
          $("#dia_content").html(`
            <span>${i18n.t('Emp ID/Card ID')}: ${G_userId}</span><br>
            <span>${i18n.t('Factory')}: ${G_rSiteCode}</span><br>
            <span>${i18n.t('Token Error,')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
          $("#dialog").dialog("open")
          $('#next').click(() => {
            deleteAllCookies('G_')
            location.href = A4RedirectUrl
          })
        } else if (res.StatusCode == -4) {
          $("#dia_content").html(`
            <span>${i18n.t('Emp ID/Card ID')}: ${G_userId}</span><br>
            <span>${i18n.t('Factory')}: ${G_rSiteCode}</span><br>
            <span>${i18n.t('Timeout Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
          $("#dialog").dialog("open")
          $('#next').click(() => {
            deleteAllCookies('G_')
            location.href = redirect_home
          })
        } else if (res.StatusCode == -5 | res.StatusCode == -6) {
          $("#dia_content").html(`
            <span>${i18n.t('Emp ID/Card ID')}: ${G_userId}</span><br>
            <span>${i18n.t('Factory')}: ${G_rSiteCode}</span><br>
            <span>${i18n.t('No Data or Data Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
          $("#dialog").dialog("open")
          $('#next').click(() => {
            deleteAllCookies('G_')
            location.href = redirect_home
          })
        } else if (res.StatusCode == -9) {
          $("#dia_content").html(`
            <span>${i18n.t('Emp ID/Card ID')}: ${G_userId}</span><br>
            <span>${i18n.t('Factory')}: ${G_rSiteCode}</span><br>
            <span>${i18n.t('NO Authority call API,')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
          $("#dialog").dialog("open")
          $('#next').click(() => {
            deleteAllCookies('G_')
            location.href = redirect_home
          })
        } else {
          console.log(`【user_priv.js】關卡StatusCode: ${res.StatusCode}`)
          $("#dia_content").html(`
            <span>${i18n.t('Emp ID/Card ID')}: ${G_userId}</span><br>
            <span>${i18n.t('Factory')}: ${G_rSiteCode}</span><br>
            <span>${i18n.t('Card closing failed,')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
          $("#dialog").dialog("open")
          $('#next').click(() => {
            deleteAllCookies('G_')
            location.href = redirect_home
          })
        }
      },
      error: function (xhr, status) {
        // console.log('ERROR' + xhr + status)
        $("#dia_content").html(`
          <span>${i18n.t('Emp ID/Card ID')}: ${G_userId}</span><br>
          <span>${i18n.t('Factory')}: ${G_rSiteCode}</span><br>
          <span>${i18n.t('Card closing failed,')}, ${i18n.t('Error Code: ')}${xhr.status}</span>
        `)
        $("#dialog").dialog("open");
        $('#next').click(() => {
          deleteAllCookies('G_')
          location.href = redirect_home
        })
      }
    })
  } else if (G_inSite == 0) { // 開卡
    // 是否重派特殊權限
    if (G_isReassign == 1) {
      let value = JSON.stringify({
        AccountName: _AccountName,
        token: _Acdn,
        userRole: G_userRole,
        uuid: _uuid(),
        deptIdReassignList: G_deptIdReassignList,
        cardId: G_cardId,
        userId: G_userId,
        updateUser: _AccountName,
      })
      console.log(value)
      $.ajax({
        url: `${WEBAPI_ip}/api/PrivDept/enable`,
        type: 'POST',
        async: true,
        dataType: 'JSON',
        contentType: 'application/json;charset=utf-8',
        data: value,
        success: function (res) {
          console.log(res)
          if (res.StatusCode == 1) {
            console.log("【user_priv.js】下派特殊權限成功")
          } else if (res.StatusCode == -2 | res.StatusCode == -3) {
            console.log(`Token 錯誤，錯誤代碼: ${res.StatusCode}`)
            deleteAllCookies()
            location.href = A4RedirectUrl
          } else {
            console.log("【user_priv.js】下派特殊權限失敗")
          }
        },
      })
    } else {
      console.log("【user_priv.js】免下派特殊權限")
    }

    value = JSON.stringify({
      AccountName: _AccountName,
      token: _Acdn,
      userRole: G_userRole,
      uuid: G_uuid_to_ACS,
      cardId: G_cardId,
      userId: G_userId,
      computerName: G_cpu_name,
      updateUser: _AccountName,
      isCardEnableDisable: G_isCardEnableDisable,
      openType: G_openType
    })
    console.log(value)
    // ACS 開卡程式
    start_time = new Date()
    GetTime(start_time, 'Card Enable Start')
    $.ajax({
      url: `${WEBAPI_ip}/api/card/enable`,
      type: 'POST',
      async: true,
      dataType: 'JSON',
      contentType: 'application/json;charset=utf-8',
      data: value,
      success: function (res) {
        console.log(res)
        if (res.StatusCode == 1) {
          console.log(`【user_priv.js】開卡StatusCode: ${res.StatusCode}`)
          if (res.ContentObject.isSuccess == 1) {
            if (G_openRSiteCode != undefined) {
              if (G_openRSiteCode.length > 1) {
                CallOpenRSiteCode('enable')
              }
            }
            $("#dia_content").html(`
              <span>${i18n.t('Emp ID/Card ID')}: ${G_userId}</span><br>
              <span>${i18n.t('Factory')}: ${G_rSiteCode}</span><br>
              <span class="clr-green">${i18n.t('Card Enabled Successfully')}</span>
            `)
            $("#dialog").dialog("open")
            $('#next').click(() => {
              deleteAllCookies('G_')
              location.href = redirect_home
            })
          } else {
            $("#dia_content").html(`
              <span>${i18n.t('Emp ID/Card ID')}: ${G_userId}</span><br>
              <span>${i18n.t('Factory')}: ${G_rSiteCode}</span><br>
              <span>${i18n.t('Failed to open card, try again')}</span>
              <span>${res.ContentObject.failReason}</span>
            `)
            $("#dialog").dialog("open")
            $('#next').click(() => {
              deleteAllCookies('G_')
              location.href = redirect_home
            })
          }
        } else if (res.StatusCode == -2 | res.StatusCode == -3) {
          $("#dia_content").html(`
            <span>${i18n.t('Emp ID/Card ID')}: ${G_userId}</span><br>
            <span>${i18n.t('Factory')}: ${G_rSiteCode}</span><br>
           <span>${i18n.t('Token Error,')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
          $("#dialog").dialog("open")
          $('#next').click(() => {
            deleteAllCookies('G_')
            location.href = redirect_home
          })
        } else if (res.StatusCode == -4) {
          $("#dia_content").html(`
            <span>${i18n.t('Emp ID/Card ID')}: ${G_userId}</span><br>
            <span>${i18n.t('Factory')}: ${G_rSiteCode}</span><br>
            <span>${i18n.t('Timeout Error,')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
          $("#dialog").dialog("open")
          $('#next').click(() => {
            deleteAllCookies('G_')
            location.href = redirect_home
          })
        } else if (res.StatusCode == -5 | res.StatusCode == -6) {
          $("#dia_content").html(`
            <span>${i18n.t('Emp ID/Card ID')}: ${G_userId}</span><br>
            <span>${i18n.t('Factory')}: ${G_rSiteCode}</span><br>
            <span>${i18n.t('No Data or Data Error,')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
          $("#dialog").dialog("open")
          $('#next').click(() => {
            deleteAllCookies('G_')
            location.href = redirect_home
          })
        } else if (res.StatusCode == -9) {
          $("#dia_content").html(`
            <span>${i18n.t('Emp ID/Card ID')}: ${G_userId}</span><br>
            <span>${i18n.t('Factory')}: ${G_rSiteCode}</span><br>
            <span>${i18n.t('NO Authority call API,')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
          $("#dialog").dialog("open")
          $('#next').click(() => {
            deleteAllCookies('G_')
            location.href = redirect_home
          })
        } else {
          console.log(`【user_priv.js】開卡StatusCode: ${res.StatusCode}`)
          $("#dia_content").html(`
            <span>${i18n.t('Emp ID/Card ID')}: ${G_userId}</span><br>
            <span>${i18n.t('Factory')}: ${G_rSiteCode}</span><br>
            <span>${i18n.t('Card closing failed,')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
          $("#dialog").dialog("open")
          $('#next').click(() => {
            deleteAllCookies('G_')
            location.href = redirect_home
          })
        }
      },
      error: function (xhr, status) {
        // console.log('ERROR' + xhr + status)
        $("#dia_content").html(`
          <span>${i18n.t('Emp ID/Card ID')}: ${G_userId}</span><br>
          <span>${i18n.t('Factory')}: ${G_rSiteCode}</span><br>
          <span>${i18n.t('Card closing failed,')}, ${i18n.t('Error Code: ')}${xhr.status}</span>
        `)
        $("#dialog").dialog("open")
        $('#next').click(() => {
          deleteAllCookies('G_')
          location.href = redirect_home
        })
      }
    })
  } else {
    console.log('【user_priv.js】不明錯誤')
  }
}





// 設定語言
function LangChange() {
  if (language == 'zh-TW') {
    $("#langIcon").attr('src', '../icon/EN.png')
    language = 'en-US'
    document.cookie = 'Language=' + language + ';path=/' 
    i18n.set({
      'lang': 'zh-tw', //e.g. en-us, zh-tw. Default is auto detect from browser.
      'path': '../js/i18n/' // Default is empty (same level as i18n.js)
    })
  } else if (language == 'en-US') {
    $("#langIcon").attr('src', '../icon/TW.png')
    language = 'zh-TW'
    document.cookie = 'Language=' + language + ';path=/' 
    i18n.set({
      'lang': 'en-us', //e.g. en-us, zh-tw. Default is auto detect from browser.
      'path': '../js/i18n/' // Default is empty (same level as i18n.js)
    })
  }
  // 重新渲染網頁文字
  $('#hi').html(`${i18n.t('Hi, ')}`)
  $("#hi").append(`${getCookie('_AccountName')}`)

  $('#title1').html(`${i18n.t('Onsite Person Check-in/out')}`)
  $('#work_start').html(`${i18n.t('Start Time')}`)
  $('#work_end').html(`${i18n.t('End Time')}`)
  $('#title2').html(`${i18n.t('Vendor NO')}`)
  $('#title3').html(`${i18n.t('Company NO')}`)
  $('#title4').html(`${i18n.t('Vendor Card ID')}`)
  $('#title5').html(`${i18n.t('Vendor Enter Date')}`)
  $('#title6').html(`${i18n.t('Vendor Enter Time')}`)
  $('#title7').html(`${i18n.t('Vendor Out Date')}`)
  $('#title8').html(`${i18n.t('Vendor Out Time')}`)
  $('#title9').html(`${i18n.t('Receptionist NO')}`)
  $('#title10').html(`${i18n.t('Cleanroom Area')}`)
  $('#title11').html(`${i18n.t('Holiday Approach')}`)
  $('#title12').html(`${i18n.t('Admin Message')}`)

  if (language == 'en-US') {
    $("#cardName").html(` ${G_userName}`) // 廠商名稱
    $("#compName").html(` ${G_companyName}`) // 公司名稱
    $("#deptName").html(` ${G_receptionEmplName}`) // 接待員工名稱

  } else if (language == 'zh-TW') {
    $("#cardName").html(` ${G_userEName}`) // 廠商名稱(E)
    $("#compName").html(` ${G_companyEName}`) // 公司名稱(E)
    $("#deptName").html(` ${G_receptionEmplEName}`) // 接待員工名稱(E)
  }

  $('#dialog').attr('title', 'SysInfo')
  $("#dialog").html(`
    <div class="dia_content" id="dia_content">
    </div>
    <hr>
    <div class="dia_btngroup" id="dia_btngroup">
      <button type="button" id="next" class="btn btn-primary bttn_submit bttn_dia" onclick="CloseDia()">${i18n.t('OK')}</button>
    </div>
  `)
  // 判斷是否開卡或關卡
  getCookie('G_inSite') == 0 ? ($('#bttn_submit').html(`${i18n.t('Card Enable')}`)) : ($('#bttn_submit').html(`${i18n.t('Card Disable')}`))

  $('#bttn_back').html(`${i18n.t('Back')}`)

  $(document).attr('title', i18n.t('Onsite Person Check-in/out')) // 修改網頁標題
}
LangChange()