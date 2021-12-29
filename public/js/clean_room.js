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

let UC_res_time = getCookie('UC_res_time')
let cardId = getCookie("UC_cardId") // 要被開卡的廠商卡號
let cleanDate,
  cleanTime,
  rSiteCode,
  UC_uuid_to_ACS,
  userId,
  userRole,
  cpu_name,
  updateUser,
  inSite,
  cleanRoomIdList,
  companyId,
  receptionEmplPhone,
  companyName,
  companyEName,
  userName,
  userEName,
  receptionEmplName,
  receptionEmplEName

// 要先在user priv check取的相對應資料，才能進入下一步
// cardId = 1
if (cardId) {
  if (UC_res_time) {
    cleanDate = UC_res_time.split(' ')[0]
    cleanTime = UC_res_time.split(' ')[1]
    cleanTime = cleanTime.length == '12' ? cleanTime.slice(0, -4) : cleanTime
  }
  rSiteCode = getCookie('rSiteCode')
  userRole = getCookie('role')
  acdn = getCookie('acdn')
  UC_uuid_to_ACS = getCookie('UC_uuid_to_ACS')

  cardId = getCookie("UC_cardId") // 要被開卡潔淨室的卡號
  userId = getCookie('UC_userId') // 要被開卡潔淨室ID
  // $('#user_pic').attr('src', `https://urldefense.com/v3/__http://10.19.64.176:8082/api/emsr/photo/jpg?id=$*7BuserId*7D__;JSU!!NxvNxO7DmFM!F9JCJp-bZ-oj56atu5mX8qr8HgFmdw6XTkNH-Xc3YIFWL-yoXO1XxCYTwQrp59IZRxU5$ `)
  $('#user_pic').attr('src', `${EMSR_ip}/api/emsr/photo/jpg?id=${userId}`)
  cpu_name = getCookie('cpu_name') // 電腦名稱
  updateUser = getCookie('UC_receptionEmpl') // 接待員工工號
  inSite = getCookie('UC_inSite') // 該卡號是否在場內
  if(getCookie('UC_cleanRoomIdList') != undefined){
    cleanRoomIdList = getCookie('UC_cleanRoomIdList').split(',') // 潔淨室卡號清單
  }
  companyId = getCookie("UC_companyId")
  receptionEmplPhone = getCookie("UC_receptionEmplPhone")
  // cleanRoomList = getCookie('UC_cleanRoomList').split(',') // 潔淨室清單
  // console.log(cleanRoomList)

  // 代入個人資料
  $("#cardId").append(`${userId}`) // 廠商編號
  $("#compId").append(``) // 公司編號
  $("#cardNo").append(`${cardId}`) // 門禁卡號
  if (companyId != undefined) {
    $("#compId").append(`${companyId}`) // 公司編號
  }
  userName = getCookie('UC_userName') // 廠商名稱
  userEName = getCookie('UC_userEName') // 廠商英文名稱
  companyName = getCookie('UC_companyName') // 公司名稱
  companyEName = getCookie('UC_companyEName') // 公司英文名稱
  receptionEmplName = getCookie('UC_receptionEmplName') // 接待員工名稱
  receptionEmplEName = getCookie('UC_receptionEmplEName') // 接待員工英文名稱
  // if (inSite == 0) {
  //   $("#card_status").html(i18n.t(`No Card`)) // 未開卡
  //   $("#card_status").attr("style", "color: #ff0000")
  // } else if (inSite == 1) {

  // }
  $("#card_status").html(i18n.t(`Card has been opened`)) // 已開卡
  $("#card_status").attr("style", "color: #11cc44")
  if (UC_res_time) {
    $("#cleanDate").append(`${cleanDate}`) // 進入日期
    $("#cleanTime").append(`${cleanTime}`) // 進入時間
  } else {
    let dt = new Date();
    let gettime = dt.toString().split(' ')[4]
    let nowdate = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate()
    let nowtime = gettime;
    $("#cleanDate").append(`${nowdate}`) // 進入日期
    $("#cleanTime").append(`${nowtime}`) // 進入時間
  }
  $("#deptIdRessign").append(updateUser)
  $("#receptionEmplPhone").append(receptionEmplPhone)
  
  $("#cleanRoomList").append(`${cleanRoomIdList}`)
  $("#rSiteCode").append(`${rSiteCode}`)
} else {
  location.href = '/cleanroomcheck'
}

function CLEANROOM_OPEN() {
  console.log('CLEANROOM ENTER')
  acdn = getCookie('acdn')

  // 開卡
  start_time = new Date(); // 記時開始
  GetTime(start_time, 'Card Enable/Disable Start'); // 顯示開始時間
  // ACS 潔淨室開卡程式
  value = JSON.stringify({
    AccountName: AccountName,
    token: acdn,
    userRole: userRole,
    uuid: UC_uuid_to_ACS,
    cardId: cardId,
    userId: userId,
    cleanRoomIdList: cleanRoomIdList,
    computerName: cpu_name,
    updateUser: AccountName,
  })
  console.log(value)
  $.ajax({
    url: `${WEBAPI_ip}/api/PrivCleanRoom/enable`,
    type: 'POST',
    async: true,
    dataType: 'JSON',
    contentType: 'application/json;charset=utf-8',
    data: value,
    success: function (res) {
      console.log(res)
      if (res.StatusCode == 1) { // 潔淨室開卡成功
        if (res.ContentObject.code == 'SUCCESS') {

          // COUNT TIME
          end_time = new Date();
          count_time = end_time - start_time; // 花費時間(ms)
          GetTime(end_time, 'Card Disable Finish'); // 顯示結束時間
          start_time = String(GetTime(start_time)).replace("Z", " ");
          end_time = String(GetTime(end_time)).replace("Z", " ");
          console.log(start_time, end_time);
          GetAPITime(start_time, end_time);
          console.log(`[card_disable]花費時間: ${count_time} ms`);

          $("#dia_content").html(`
              <span>${i18n.t('Emp ID/Card ID')}: ${userId}</span><br>
              <span>${i18n.t('Factory')}: ${i18n.t(rSiteCode)}</span><br>
              <span class="clr-green">${i18n.t('Card Enabled Successfully')}</span>
            `)
          $("#dialog").dialog("open")
          $('#next').click(() => {
            redirectCleanroomCheck()
          })
        } else if (res.ContentObject.code != 'SUCCESS') {
          $("#dia_content").html(`
              <span>${i18n.t('Emp ID/Card ID')}: ${userId}</span><br>
              <span>${i18n.t('Factory')}: ${i18n.t(rSiteCode)}</span><br>
              <span class="clr-red">${i18n.t('Failed to open card')}</span><br>
              <span>${i18n.t('Error Msg:')} ${res.ContentObject.message}</span>
            `)
          $("#dialog").dialog("open")
          $('#next').click(() => {
            redirectCleanroomCheck()
          })
        }

      } else if (res.StatusCode == -2 | res.StatusCode == -3) {
        $("#dia_content").html(`
            <span>${i18n.t('Token Expired or Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `)
        $("#dialog").dialog("open")
        $('#next').click(() => {
          redirectA4()
        })
      } else { // 潔淨室開卡失敗
        $("#dia_content").html(`
            <span>${i18n.t('Card ID')}: ${userId}(${i18n.t('Factory')}:${i18n.t(rSiteCode)}),${i18n.t('Failed to open Cleanroom,')} </span><br>
            <span>${i18n.t('Error Msg:')}${res.ContentObject.message}</span>
          `)
        $("#dialog").dialog("open")
        $('#next').click(() => {
          redirectCleanroomCheck()
        })
      }
    },
    error: function (xhr, status) {
      $("#dia_content").html(`
        <span>${i18n.t('Card ID')}: ${userId}</span><br>
        <span>${i18n.t('Factory')}: ${i18n.t(rSiteCode)}</span><br>
        <span>${i18n.t('Failed to open Cleanroom,')}</span><br>
        <span>${i18n.t('Error Code:')}${xhr.code}</span>
      `)
      $("#dialog").dialog("open")
      $('#next').click(() => {
        redirectCleanroomCheck()
      })
    }
  })
}
// }

$('#bttn_back').click(function () {
  redirectCleanroomCheck()
})


// 設定語言
function LangChange() {
  LangInit()
  // 重新渲染網頁文字
  $('#title1').html(`${i18n.t('Cleanroom Check In/Out')}`)
  $('#title2').html(`${i18n.t('Vendor NO')}`) // 廠商編號
  $('#title3').html(`${i18n.t('Company NO')}`) // 公司編號
  $('#title4').html(`${i18n.t('Vendor Card ID')}`) // 卡號
  $('#title5').html(`${i18n.t('Card Status')}`) // 持卡狀態 
  $('#title6').html(`${i18n.t('Cleanroom EnterDate')}`) // 進潔淨室日期
  $('#title7').html(`${i18n.t('Cleanroom EnterTime')}`) // 進潔淨室時間
  $('#title8').html(`${i18n.t('Receptionist NO')}`) // 接待員工工號
  $('#title9').html(`${i18n.t('Work Projects')}`) // 工作項目
  $('#title10').html(`${i18n.t('Area')}`) // 工作區域
  $('#title11').html(`${i18n.t('Reception Extension')}`) // 接待員工分機

  $('#bttn_submit').html(`${i18n.t('Card Enable for Cleanroom')}`)
  $('#bttn_back').html(`${i18n.t('Back')}`)

  if (language == 'en-US') {
    $("#cardName").html(` ${userName}`) // 廠商名稱
    $("#compName").html(` ${companyName}`) // 公司名稱
    $("#deptName").html(` ${receptionEmplName}`) // 接待員工名稱

  } else if (language == 'zh-TW') {
    $("#cardName").html(` ${userEName}`) // 廠商名稱(E)
    $("#compName").html(` ${companyEName}`) // 公司名稱(E)
    $("#deptName").html(` ${receptionEmplEName}`) // 接待員工名稱(E)
  }


  inSite == 0 ? ($("#card_status").html(i18n.t(`No Card`))) : ($("#card_status").html(i18n.t(`Card has been opened`)));

  // if (inSite == 0) {
  //   $("#card_status").html(i18n.t(`No Card`)) // 未開卡
  // } else if (inSite == 1) {
  //   $("#card_status").html(i18n.t(`Card has been opened`)) // 已開卡
  // }

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


// 取得網頁潔淨室開卡經過時間
const GetAPITime = (start_time, end_time) => {
  let value = JSON.stringify({
    AccountName: AccountName,
    userRole: userRole,
    token: acdn,
    startDt: start_time,
    endDt: end_time,
    uniqueCode: cardId
  });
  console.log(value);
  $.ajax({
    url: `${WEBAPI_ip}/api/ccop/web/lobbyEnable`,
    type: 'POST',
    async: true,
    dataType: 'JSON',
    contentType: 'application/json;charset=utf-8',
    data: value,
    success: function (res) {
      console.log(res);
    },
    error: function (xhr) {
      console.log(xhr);
    }
  });
};