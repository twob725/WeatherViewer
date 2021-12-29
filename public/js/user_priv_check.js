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

// check priv 資料，card 資料，tsmc card 資料， data json，res 時間，是否可以開卡
let check_priv_data,
  card_data, data_json,
  res_time, card_ED,
  user_check_json,
  user_check_res_time

// 重派權限相關變數
let openRSiteCode,
  isReassign,
  deptIdRessign

// let AccountName = getCookie('AccountName')
let UC_uuid_to_ACS = _uuid() // 重新拿一個 uuid
document.cookie = "UC_uuid_to_ACS=" + UC_uuid_to_ACS + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 給 ACS+ 的 uuid

acdn = getCookie('acdn')
let cpu_name = getCookie('cpu_name')
let rSiteCode = getCookie('rSiteCode')
let updateUser = getCookie('loginEmplId') // 幫忙開卡的員工

$(document).ready(() => {
  $('#input_time').focus() // FOCUS在INPUT表單上 
})

// 取得開關卡的基本資料 USER PRIV CHECK
const CHECK_USER = function () {
  let keyinvalue = $('#input_time').val()
  $('#bttn_target').attr('disabled', true)
  if (keyinvalue.length == 0) { // 初步檢查有無輸入資料
    $("#dia_content").html(`
      <span>${i18n.t("Please Enter Card ID")}</span>
    `)
    $("#dialog").dialog("open");
  } else {
    check_priv_data = JSON.stringify({
      tokenObject: {
        AccountName: AccountName,
        token: acdn,
        userRole: getCookie('role')
      },
      privObject: {
        token: acdn,
        uuid: UC_uuid_to_ACS,
        userKeyIn: keyinvalue,
        loginEmplId: updateUser,
        rSiteCode: rSiteCode,
        computerName: cpu_name,
        source: 'L',
      },
    })
    console.log(check_priv_data)
    // EMSR 取得卡片資料 API (L是開卡大廳)
    // let start_time = new Date() // 計算API呼叫時間
    // GetTime(start_time)
    $.ajax({
      url: `${EMSR_ip}/api/emsr/post/user/priv/check`,
      type: 'POST',
      async: true,
      dataType: 'JSON',
      contentType: 'application/json;charset=utf-8',
      // timeout: 5000, // Timeout
      data: check_priv_data,
      success: function (res) {
        console.log(res)
        if (res.StatusCode == 1) {
          let statusMsg = res.ContentObject.message // 回傳狀態訊息
          let res_time = res.ContentObject.responseTime.slice(0, -4) // 回傳狀態時間
          let statusCode = res.ContentObject.code
          // console.log(res_time.slice(0, -4))
          if (statusMsg == null) {
            $("#dia_content").html(`
              <span>${i18n.t('No such card number')}</span>
            `)
            $("#dialog").dialog("open");
            $('#next').click(() => {
              $('#input_time').focus()
              $('#input_time').select()
            })
          } else if (statusMsg != "SUCCESS") {
            $("#dia_content").html(`
              <span>${statusMsg}</span><br>
              <span class="timebar">${res_time}</span>
            `)
            $("#dialog").dialog("open");
            $('#next').click(() => {
              if (statusCode == 'SUCCESS') { // 它廠未關卡，在該廠繼續做開卡
                console.log(`【user_priv_check.js】確認卡號: ${statusMsg}${res_time}`)
                user_check_res_time = res.ContentObject.responseTime // 送出查詢的時間
                user_check_json = res.ContentObject.data[0] // 將資料收入 DATA_JSON
                card_ED = user_check_json.inSite == 1 ? 0 : 1

                UserPrivCheck("EMSR")
              }
            })
            // NoEMSR(keyinvalue) // TESTING
          } else if (statusMsg == "SUCCESS") { // 成功時
            console.log(`【user_priv_check.js】確認卡號: ${statusMsg}${res_time}`)
            user_check_res_time = res.ContentObject.responseTime // 送出查詢的時間
            user_check_json = res.ContentObject.data[0] // 將資料收入 DATA_JSON
            card_ED = user_check_json.inSite == 1 ? 0 : 1

            // COUNT TIME
            // let end_time = new Date()
            // GetTime(end_time)
            // let count_time = end_time - start_time + " ms"
            // console.log(`[user_priv_check API]花費時間: ${count_time}`)
            // $('#count_time').html(count_time)

            UserPrivCheck("EMSR")
          }
        } else if (res.StatusCode == -1) {
          $("#dia_content").html(`
              <span>${i18n.t('DB Error')}, ${i18n.t('Error Code: ')} ${res.StatusCode}</span>
            `)
          $("#dialog").dialog("open")
        } else if (res.StatusCode == -2 | res.StatusCode == -3) {
          $("#dia_content").html(`
            <span>${i18n.t('Token Expired or Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
          $("#dialog").dialog("open")
          $('#next').click(() => {
            deleteAllCookies()
            // = A4RedirectUrl
          })
        } else if (res.StatusCode == -7) {
          $("#dia_content").html(`
            <span>${i18n.t('EMSR NO Response')}, ${i18n.t('Error Code: ')} ${res.StatusCode}</span>
          `)
          $("#dia_btngroup").html(`
              <button type="button" id="acs_verif" class="btn btn-primary bttn_submit bttn_dia">${i18n.t('ACS self-verification')}</button>
            `)
          $("#dialog").dialog("open")
          $("#acs_verif").click(() => {
            CloseDia()
            NoEMSR(keyinvalue) // EMSR打不到，改內部自行開卡
          })
        } else if (res.StatusCode == -8) {
          $("#dia_content").html(`
            <span>${i18n.t('Key Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
          $("#dialog").dialog("open");
        } else if (res.StatusCode == -9) {
          $("#dia_content").html(`
            <span>${i18n.t('NO Authority call API,')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
          $("#dialog").dialog("open");
        }
        $('#bttn_target').attr('disabled', false)
      },
      error: function (xhr, status) {
        // console.log('【user_priv_check.js】')
        $("#dia_content").html(`
          <span>${i18n.t('EMSR Call Failed')}, ${i18n.t('Error Code: ')}${xhr.status}</span>
        `)
        $("#dialog").dialog("open");
      }
    })
  }
}

// 呼叫不到EMSR，改呼叫ACS+做認證
function NoEMSR(keyin) {
  let value = JSON.stringify({
    AccountName: AccountName,
    token: acdn,
    userRole: getCookie('role'),
    userKeyIn: keyin,
    loginEmplId: updateUser,
    computerName: cpu_name,
  })
  // let start_time_2 = new Date()
  // console.log(start_time_2)
  $.ajax({
    url: `${WEBAPI_ip}/api/priv/data/card/check`,
    type: 'POST',
    async: true,
    dataType: 'JSON',
    contentType: 'application/json;charset=utf-8',
    data: value,
    success: function (res) {
      console.log(res)
      if (res.StatusCode == 1 || res.StatusCode == -1) {
        user_check_json = res.ContentObject
        if (user_check_json.enable_disable == "D") {
          card_ED = 1
        } else if (user_check_json.enable_disable == "E") {
          card_ED = 0
        }

        // let end_time_2 = new Date()
        // let count_time_2 = end_time_2 - start_time_2 + " ms"
        // console.log(`[priv_data_card_check]花費時間: ${count_time_2}`)

        UserPrivCheck("ACS")
      } else if (res.StatusCode == -2 | res.StatusCode == -3) {
        $("#dia_content").html(`
          <span>${i18n.t('Token Expired or Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
        `)
        $("#dialog").dialog("open")
        $('#next').click(() => {
          deleteAllCookies()
          // = A4RedirectUrl
        })
      }
    },
  })
}

// ACS USER PRIV CHECK API
function UserPrivCheck(keyword) {
  if (keyword == "EMSR") { // 如果有這個資料的話
    console.log(`【user_priv_check.js】進入${keyword}`)
    let value = JSON.stringify({
      AccountName: AccountName,
      token: acdn,
      userRole: getCookie('role'),
      uuid: UC_uuid_to_ACS, // 要使用一開始登入給的UUID
      applyNoList: user_check_json.applyNoList, // 單號
      inSite: user_check_json.inSite, // 是否在廠內 1 = true, 0= false
      cardId: user_check_json.cardId, // 卡號
      userId: user_check_json.userId, // 卡片所有人廠編
      computerName: cpu_name, // 電腦名稱
      type: "V", // V = 廠商, C = 客戶, E = 員工
      rSiteCode: rSiteCode, // 此廠區代碼
      openRSiteCode: user_check_json.openRSiteCode, // 連通聯合廠區的代碼
      receptionEmpl: user_check_json.receptionEmpl, // 接待人員工號
      isReassign: user_check_json.isReassign, // 需不需要重派 1=true, 0=false
      source: user_check_json.source, // L = 大廳, LF = 大廳人臉辨識, C = 潔淨室, CF = 潔淨室人臉辨識, S=特殊目的
      updateUser: updateUser, // 櫃檯開卡人員工號
    })
    console.log(value)
    // let start_time_emsr = new Date()
    // GetTime(start_time_emsr)
    $.ajax({
      url: `${WEBAPI_ip}/api/priv/check/post`,
      type: 'POST',
      async: true,
      dataType: 'JSON',
      contentType: 'application/json;charset=utf-8',
      data: value,
      success: function (res) {
        console.log(res)
        if (res.StatusCode == 1) {
          console.log("【user_priv_check.js】資料寫入ASC+成功")
          let end_time_emsr = new Date()
          // GetTime(end_time_emsr)
          // let count_time_emsr = end_time_emsr - start_time_emsr + " ms"
          // console.log(`[priv_check_post]花費時間: ${count_time_emsr}`)
        } else if (res.StatusCode == -2 | res.StatusCode == -3) {
          $("#dia_content").html(`
            <span>${i18n.t('Token Expired or Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
          $("#dialog").dialog("open")
          $('#next').click(() => {
            deleteAllCookies()
            // = A4RedirectUrl
          })
        }
      },
    })

    // 傳送登入後資料，包在cookie
    document.cookie = "UC_userId=" + user_check_json.userId + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 卡片所有人廠編
    document.cookie = "UC_cardId=" + user_check_json.cardId + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 卡號
    document.cookie = "UC_type=" + user_check_json.type + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 型態: V(廠商)、C(客戶)、E(員工)
    document.cookie = "UC_res_time=" + user_check_res_time + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 送出查詢的時間
    document.cookie = "UC_receptionEmpl=" + user_check_json.receptionEmpl + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 接待人員工號
    document.cookie = "UC_inSite=" + user_check_json.inSite + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 是否在廠內
    document.cookie = "UC_isReassign=" + user_check_json.isReassign + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 是否重派權限
    document.cookie = "UC_deptIdRessignList=" + user_check_json.deptIdRessignList + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 是否重派權限
    document.cookie = "UC_card_ED=" + card_ED + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time + cookie_time // 是否開關卡
    document.cookie = "UC_openRSiteCode=" + user_check_json.openRSiteCode + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 是否連通廠區
    document.cookie = "UC_isCardEnableDisable=" + user_check_json.isCardEnableDisable + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 是否能進辦公室
    
    document.cookie = "UC_companyId=" + user_check_json.companyId + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 公司編號
    document.cookie = "UC_companyName=" + user_check_json.companyName + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 公司名稱
    document.cookie = "UC_companyEName=" + user_check_json.companyEName + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 公司名稱(E)
    document.cookie = "UC_userName=" + user_check_json.userName + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 廠商名稱
    document.cookie = "UC_userEName=" + user_check_json.userEName + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 廠商名稱(E)
    document.cookie = "UC_receptionEmplName=" + user_check_json.receptionEmplName + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 接待員工名稱 
    document.cookie = "UC_receptionEmplEName=" + user_check_json.receptionEmplEName + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 接待員工名稱(E) 
    if (user_check_json.openType == undefined) {
      document.cookie = "UC_openType=" + "0" + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 開關卡型態
    }else{
      document.cookie = "UC_openType=" + user_check_json.openType + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 開關卡型態
    }

   
    // 前往正確的網頁
    location.href = '/userpriv'

  } else if (keyword == "ACS") {
    console.log(`【user_priv_check.js】進入${keyword}`)
    let acs_value = JSON.stringify({
      AccountName: AccountName,
      token: acdn,
      userRole: getCookie('role'),
      uuid: UC_uuid_to_ACS,
      cardId: user_check_json.cardId,
      userId: user_check_json.userId,
      computerName: cpu_name,
      rSiteCode: rSiteCode,
      source: "L",
      updateUser: updateUser,
    })
    // console.log(acs_value)
    // let start_time_acs = new Date()
    // console.log(start_time_acs)
    $.ajax({
      url: `${WEBAPI_ip}/api/priv/check/post`,
      type: 'POST',
      async: true,
      dataType: 'JSON',
      contentType: 'application/json;charset=utf-8',
      data: acs_value,
      success: function (res) {
        console.log(res)
        if (res.StatusCode == 1) {
          console.log("【user_priv_check.js】資料寫入ASC+成功")
          $("#dia_content").html(`
            <span>${i18n.t('Successfully started the ACS+ internal verification mechanism!')}</span>
          `)
          $("#dialog").dialog("open");

          // let end_time_acs = new Date()
          // console.log(end_time_acs)
          // let count_time_acs = end_time_acs - start_time_acs + " ms"
          // console.log(`[priv_check_post(ACS)]花費時間: ${count_time_acs}`)

          // 傳送登入後資料，包在cookie
          document.cookie = "UC_userId=" + user_check_json.userId + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 卡片所有人廠編
          document.cookie = "UC_cardId=" + user_check_json.cardId + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 卡號
          document.cookie = "UC_card_ED=" + card_ED + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 是否開關卡
          document.cookie = "UC_inSite=" + user_check_json.inSite + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 是否在廠內 TESTing inSite = "1"
          document.cookie = "UC_companyId=" + user_check_json.companyId + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // Company ID

          // 前往正確的網頁
          $('#next').click(() => {
            location.href = '/userpriv'
          })
        } else if (res.StatusCode == -2 | res.StatusCode == -3) {
          $("#dia_content").html(`
            <span>${i18n.t('Token Expired or Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
          $("#dialog").dialog("open")
          $('#next').click(() => {
            deleteAllCookies()
            // = A4RedirectUrl
          })
        }
      },
    })

  } else {
    console.log('【user_priv_check.js】取得資料失敗')
  }
}

// 設定語言
function LangChange() {
  // 重新渲染側邊列表
  LangInit()
  // 重新渲染網頁文字
  $('#title1').html(`${i18n.t('Onsite Person Check-in/out')}`)
  $('#title2').html(`${i18n.t('Please Enter Emp ID/Card ID:')}`)
  $('#bttn_submit').html(`${i18n.t('Personnel Information Confirm')}`)

  $('#ui-id-1').html(i18n.t('SysInfo'))
  $("#dialog").html(`
    <div class="dia_content" id="dia_content">
    </div>
    <hr>
    <div class="dia_btngroup" id="dia_btngroup">
      <button type="button" id="next" class="btn btn-primary bttn_submit bttn_dia" onclick="CloseDia()">${i18n.t('OK')}</button>
    </div>
  `)


  $(document).attr('title', i18n.t('Onsite Person Check-in/out')) // 修改網頁標題
}
LangChange()
