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

$('#bttn_submit').click(()=>{
  CHECK_CLEANROOM()
})

// check priv 資料，card 資料，tsmc card 資料， data json，res 時間， 是否可以開卡
let check_priv_data,
  card_data, data_json,
  res_time, card_ED

// 重派權限相關變數
let openRSiteCode,
  isReassign,
  deptIdRessign

// let AccountName = getCookie('AccountName')
let UC_uuid_to_ACS = _uuid()
document.cookie = "UC_uuid_to_ACS=" + UC_uuid_to_ACS + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 給 ACS+ 的 uuid

acdn = getCookie('acdn')
let cpu_name = getCookie('cpu_name')
let rSiteCode = getCookie('rSiteCode')
let updateUser = getCookie('loginEmplId') // 幫忙開卡的員工

$(document).ready(() => {
  $('#input_time').focus() // FOCUS在INPUT表單上  
})

// 取得開關卡的基本資料 USER PRIV CHECK
const CHECK_CLEANROOM = function () {
  let keyinvalue = $('#input_time').val()
  if (keyinvalue.length == 0) { // 初步檢查有無輸入資料
    $("#dia_content").html(`
      <span>${i18n.t('Please Enter CardID')}</span>
    `)
    $("#dialog").dialog("open")
    $('#next').click(() => {
      $("#dialog").dialog("close");
      $('#input_time').focus()
    })
  } else {
    // CALL 取得卡片資料 API (C是潔淨室)
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
        source: 'C',
      },
    })
    console.log(check_priv_data)
    // EMSR 取得卡片資料 API (C是潔淨室)
    $.ajax({
      url: `${EMSR_ip}/api/emsr/post/user/priv/check`,
      type: 'POST',
      async: true,
      dataType: 'JSON',
      contentType: 'application/json;charset=utf-8',
      data: check_priv_data,
      success: function (res) {
        console.log(res)
        if (res.StatusCode == 1) {
          let statusMsg = res.ContentObject.message // 回傳狀態訊息
          let res_time = res.ContentObject.responseTime.slice(0, -4) // 回傳狀態時間
          if (statusMsg == null) {
            $("#dia_content").html(`
              <span>${i18n.t('Card Status:')}${i18n.t('No such card number')}</span>
            `)
            $("#dialog").dialog("open")
            $('#next').click(() => {
              $('#input_time').focus()
              $('#input_time').select()
            })
          } else if (statusMsg != "SUCCESS") {
            $("#dia_content").html(`
              <span>${statusMsg}</span><br>
              <span class="timebar">${res_time}</span>
            `);
            $("#dialog").dialog("open")
          } else if (statusMsg == "SUCCESS") { // 成功時
            console.log(`【user_priv_check.js】確認卡號: ${statusMsg}${res_time}`)
            user_check_res_time = res.ContentObject.responseTime // 送出查詢的時間
            user_check_json = res.ContentObject.data[0] // 將資料收入 DATA_JSON
            card_ED = user_check_json.inSite == 1 ? 1 : 0

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
            redirectA4()
          })
        } else if (res.StatusCode == -7) {
          $("#dia_content").html(`
            <span>${i18n.t('EMSR NO Response')}, ${i18n.t('Error Code: ')} ${res.StatusCode}</span>
          `)
          $("#dia_btngroup").append(`<button type="button" id="acs_verif" class="btn btn-primary bttn_submit bttn_dia">${i18n.t('ACS self-verification')}</button>`)
          $("#dialog").dialog("open")
          $("#acs_verif").click(() => {
            NoEMSR(keyinvalue) // EMSR打不到，改內部自行開卡
          })
        } else if (res.StatusCode == -8) {
          $("#dia_content").html(`
            <span>${i18n.t('Key Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
          $("#dialog").dialog("open")
        } else if (res.StatusCode == -9) {
          $("#dia_content").html(`
            <span>${i18n.t('NO Authority call API,')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
          $("#dialog").dialog("open")
        }else{
          $("#dia_content").html(`
            <span>${i18n.t('Other Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
          $("#dialog").dialog("open")
        }
        $('#bttn_target').attr('disabled', false)
      },
      error: function (xhr, status) {
        // console.log('【user_priv_check.js】')
        $("#dia_content").html(`
          <span>${i18n.t('EMSR Call Failed')}, ${i18n.t('Error Code: ')}${xhr.status}</span>
        `);
        $("#dialog").dialog("open");
        $('#bttn_target').attr('disabled', false)
      }
    })
  }
}

// 呼叫不到EMSR，改呼叫ACS+做認證
function NoEMSR(keyin) {
  let AccountName = getCookie('AccountName')
  acdn = getCookie('acdn')
  let value = JSON.stringify({
    AccountName: AccountName,
    token: acdn,
    userKeyIn: keyin,
    loginEmplId: updateUser,
    computerName: cpu_name,
  })
  $.ajax({
    url: `${WEBAPI_ip}/api/priv/data/cleanRoom/check`,
    type: 'POST',
    async: true,
    dataType: 'JSON',
    contentType: 'application/json;charset=utf-8',
    data: value,
    success: function (res) {
      console.log(res)
      if (res.StatusCode == 1) {
        user_check_json = res.ContentObject
        UserPrivCheck("ACS")
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
          redirectA4()
        })
      } else if (res.StatusCode == -7) {
        $("#dia_content").html(`
          <span>${i18n.t('EMSR NO Response')}, ${i18n.t('Error Code: ')} ${res.StatusCode}</span>
        `)
        $("#dialog").dialog("open")
      } else if (res.StatusCode == -8) {
        $("#dia_content").html(`
          <span>${i18n.t('Key Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
        `);
        $("#dialog").dialog("open")
      } else if (res.StatusCode == -9) {
        $("#dia_content").html(`
          <span>${i18n.t('NO Authority call API,')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
        `)
        $("#dialog").dialog("open")
      }
      $('#bttn_target').attr('disabled', false)
    },
    error: function (xhr, status) {
      $("#dia_content").html(`
        <span>${i18n.t('EMSR Call Failed')}, ${i18n.t('Error Code: ')}${xhr.status}</span>
      `);
      $("#dialog").dialog("open");
      $('#bttn_target').attr('disabled', false)
    }
  })
}


// ACS USER PRIV CHECK API
function UserPrivCheck(keyword) {
  let AccountName = getCookie('AccountName')
  acdn = getCookie('acdn')
  if (keyword == "EMSR") { // 如果有這個資料的話
    console.log(`【clean_room_check.js】進入${keyword}`)
    let value = JSON.stringify({
      AccountName: AccountName,
      token: acdn,
      userRole: getCookie('role'),
      uuid: UC_uuid_to_ACS, // 要使用一開始登入給的UUID
      applyNoList: user_check_json.applyNoList, // 單號
      inSite: user_check_json.inSite, // 是否在廠內 1 = true, 0= false
      cardId: user_check_json.cardId.slice(3, 12), // 卡號
      userId: user_check_json.userId, // 卡片所有人廠編
      computerName: cpu_name, // 電腦名稱
      type: user_check_json.type, // V = 廠商, C = 客戶, E = 員工
      rSiteCode: rSiteCode, // 此廠區代碼
      openRSiteCode: user_check_json.openRSiteCode, // 連通聯合廠區的代碼
      receptionEmpl: user_check_json.receptionEmpl, // 接待人員工號
      isReassign: user_check_json.isReassign, // 需不需要重派 1=true, 0=false
      source: user_check_json.source, // L = 大廳, LF = 大廳人臉辨識, C = 潔淨室, CF = 潔淨室人臉辨識, S=特殊目的
      updateUser: updateUser, // 櫃檯開卡人員工號
    })
    console.log(value)
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
          console.log("【clean_room_check.js】資料寫入ASC+成功")
        } else if (res.StatusCode == -2 | res.StatusCode == -3) {
          $("#dia_content").html(`
            <span>${i18n.t('Token Expired or Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
          $("#dialog").dialog("open")
          $('#next').click(() => {
            redirectA4()
          })
        }else{
          console.log('Other Error')
          // $("#dia_content").html(`
          //   <span>${i18n.t('Other Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          // `)
          // $("#dialog").dialog("open")
        }
      },
      error: function (xhr, status) {
        $("#dia_content").html(`
          <span>${i18n.t('ACS data write Failure')}, ${i18n.t('Error Code: ')}${xhr.status}</span>
        `);
        $("#dialog").dialog("open");
        $('#bttn_target').attr('disabled', false)
      }
    })

    // 傳送登入後資料，包在cookie
    document.cookie = "UC_userId=" + user_check_json.userId + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 卡片所有人廠編
    document.cookie = "UC_cardId=" + user_check_json.cardId.slice(3, 12) + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 卡號
    document.cookie = "UC_type=" + user_check_json.type + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 型態: V(廠商)、C(客戶)、E(員工)
    document.cookie = "UC_res_time=" + user_check_res_time + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 送出查詢的時間
    document.cookie = "UC_receptionEmpl=" + user_check_json.receptionEmpl + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 接待人員工號
    document.cookie = "UC_inSite=" + user_check_json.inSite + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 是否在廠內
    document.cookie = "UC_cleanRoomIdList=" + user_check_json.cleanRoomIdList + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 潔淨室卡號列表
    document.cookie = "UC_receptionEmplPhone=" + user_check_json.phone + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 接待人員分機
    
    document.cookie = "UC_companyId=" + user_check_json.companyId + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 公司統編
    document.cookie = "UC_companyName=" + user_check_json.companyName + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 公司名稱
    document.cookie = "UC_companyEName=" + user_check_json.companyEName + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 公司名稱(E)
    document.cookie = "UC_userName=" + user_check_json.userName + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 廠商名稱
    document.cookie = "UC_userEName=" + user_check_json.userEName + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 廠商名稱(E)
    document.cookie = "UC_receptionEmplName=" + user_check_json.receptionEmplName + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 接待員工名稱 
    document.cookie = "UC_receptionEmplEName=" + user_check_json.receptionEmplEName + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 接待員工名稱(E) 
    
    // document.cookie = "UC_card_ED=" + card_ED + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 是否開關卡
    // if (user_check_json.applyNoList.length > 1) {
    //   for (i = 0; i < user_check_json.applyNoList.length; i++) {
    //     document.cookie = `UC_cleanRoomList_${i + 1}=` + user_check_json.applyNoList[i] + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 潔淨室array
    //   }
    // } else {
    //   document.cookie = `UC_cleanRoomList=` + user_check_json.applyNoList + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 潔淨室array
    // }
    // 前往正確的網頁
    location.href = '/cleanroom'

  } else if (keyword == "ACS") {
    console.log(`【clean_room_check.js】進入${keyword}`)
    let acs_value = JSON.stringify({
      uuid: UC_uuid_to_ACS,
      cardId: user_check_json.cardId.slice(3, 12),
      userId: user_check_json.userId,
      computerName: cpu_name,
      rSiteCode: rSiteCode,
      source: "C",
      updateUser: updateUser,
    })
    // console.log(acs_value)
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
          console.log("【clean_room_check.js】資料寫入ASC+成功")
        } else if (res.StatusCode == -2 | res.StatusCode == -3) {
          $("#dia_content").html(`
            <span>${i18n.t('Token Expired or Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
          $("#dialog").dialog("open")
          $('#next').click(() => {
            redirectA4()
          })
        }
      },
      error: function (xhr, status) {
        $("#dia_content").html(`
          <span>${i18n.t('ACS self-verification Failed')}, ${i18n.t('Error Code: ')}${xhr.status}</span>
        `)
        $("#dialog").dialog("open")
        $('#bttn_target').attr('disabled', false)
      }
    })

    // 傳送登入後資料，包在cookie
    document.cookie = "UC_userId=" + user_check_json.userId + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 卡片所有人廠編
    document.cookie = "UC_cardId=" + user_check_json.cardId.slice(3, 12) + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 卡號
    document.cookie = "UC_card_ED=" + card_ED + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 是否開關卡
    if (user_check_json.applyNoList.length > 1) {
      for (i = 0; i < user_check_json.applyNoList.length; i++) {
        document.cookie = `UC_cleanRoomList_${i + 1}=` + user_check_json.applyNoList[i] + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 潔淨室array
      }
    } else {
      document.cookie = `UC_cleanRoomList=` + user_check_json.applyNoList + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 潔淨室array
    }
    // 前往正確的網頁
    location.href = '/cleanroom'
  } else {
    $("#dia_content").html(`
      <span>${i18n.t('Other Error')}</span>
    `)
    $("#dialog").dialog("open")
    $('#bttn_target').attr('disabled', false)
  }
}


// 設定語言
function LangChange() {
  LangInit()
  // 重新渲染網頁文字
  $('#title1').html(`${i18n.t('Cleanroom Check In/Out')}`)
  $('#title2').html(`${i18n.t('Please Enter Card ID:')}`) //請輸入卡號
  $('#bttn_submit').html(`${i18n.t('Personnel Information Confirm')}`) // 駐廠人員資料確認

  $('#ui-id-1').html(i18n.t('SysInfo'))
  $("#dialog").html(`
    <div class="dia_content" id="dia_content">
    </div>
    <hr>
    <div class="dia_btngroup" id="dia_btngroup">
      <button type="button" id="next" class="btn btn-primary bttn_submit bttn_dia" onclick="CloseDia()">${i18n.t('OK')}</button>
    </div>
  `)

  $(document).attr('title', i18n.t('Cleanroom Check In/Out')) // 修改網頁標題
}

LangChange()