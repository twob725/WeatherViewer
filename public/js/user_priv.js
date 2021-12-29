$('#work_line').hide();

Loading(); // Loading圈圈
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

// const setTime = 1500 // 倒數時間
let UC_res_time = getCookie('UC_res_time');
let cardId = getCookie("UC_cardId"); // 要被開卡的廠商卡號
// let AccountName = getCookie('AccountName')
let enterDate,
  enterTime,
  rSiteCode,
  UC_uuid_to_ACS,
  userId,
  userRole,
  cpu_name,
  updateUser,
  inSite,
  isReassign,
  deptIdReassignList,
  loginEnplId,
  start_time,
  end_time,
  count_time,
  myVar,
  openRSiteCode,
  isCardEnableDisable,
  companyId,
  companyName,
  companyEName,
  userName,
  userEName,
  receptionEmplName,
  receptionEmplEName,
  openType;

// 要先在user priv check取的相對應資料，才能進入下一步
if (cardId) {
  if (UC_res_time) {
    enterDate = UC_res_time.split(' ')[0];
    enterTime = UC_res_time.split(' ')[1];
    enterTime = enterTime.length == '12' ? enterTime.slice(0, -4) : enterTime;
    isReassign = getCookie('UC_isReassign'); // 是否重派權限
    // isReassign = 0
    deptIdReassignList = getCookie('UC_deptIdRessignList').split(','); // 重派權限清單
    //   if(getCookie('UC_deptIdRessignList').length > 1){
    // }else{
    //   deptIdReassignList = getCookie('UC_deptIdRessignList')
    // }
  }
  UC_uuid_to_ACS = getCookie('UC_uuid_to_ACS'); // ACS uuid
  acdn = getCookie('acdn');
  rSiteCode = getCookie('rSiteCode'); // 廠區代號
  userRole = getCookie('role'); // 登入人員權限
  userId = getCookie('UC_userId'); // 要被開卡的廠商工號
  if (TestOrTSMC == 1) {
    $('#user_pic').attr('src', `${EMSR_ip}/api/emsr/photo/jpg?id=${userId}`); // 使用者照片
  }
  userName = getCookie('UC_userName'); // 廠商名稱
  userEName = getCookie('UC_userEName'); // 廠商英文名稱
  cpu_name = getCookie('cpu_name'); // 電腦名稱
  companyId = getCookie("UC_companyId"); // 公司統編
  companyName = getCookie('UC_companyName'); // 公司名稱
  companyEName = getCookie('UC_companyEName'); // 公司英文名稱
  updateUser = getCookie('UC_receptionEmpl'); // 接待員工工號
  receptionEmplName = getCookie('UC_receptionEmplName'); // 接待員工名稱
  receptionEmplEName = getCookie('UC_receptionEmplEName'); // 接待員工英文名稱
  inSite = getCookie('UC_inSite'); // 該卡號是否在場內

  openType = getCookie('UC_openType'); // 開關卡型態
  if (openType != undefined) {
    openType = openType; // 開關卡型態
  } else if (openType == undefined) {
    openType = "";
  }
  openRSiteCode = getCookie('UC_openRSiteCode'); // 聯合連通廠區
  if (openRSiteCode != undefined) {
    if (openRSiteCode.length > 1) {
      openRSiteCode = openRSiteCode.split(','); // 聯合連通廠區
    }
  } else if (openRSiteCode == undefined) {
    openRSiteCode = "";
  }
  isCardEnableDisable = getCookie('UC_isCardEnableDisable'); // 進場不進辦

  // 取得卡片入廠時間
  let card_enterDate, card_enterTime;
  let value = JSON.stringify({
    AccountName: AccountName,
    token: acdn,
    userRole: userRole,
    cardId: cardId,
  })
  console.log(value);
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
      console.log(res);
      if (res.StatusCode == 1) {
        card_enterDate = (res.ContentObject.date.replace('-', '/')).replace('-', '/');
        card_enterTime = res.ContentObject.time;
        // let end_time_entertime = new Date()
        // GetTime(end_time_entertime, 'TIME API Finish')
        // let count_time_entertime = end_time_entertime - start_time_entertime + " ms"
        // console.log(`[checkin_datetime]花費時間: ${count_time_entertime}`)
      } else if (res.StatusCode == -2 | res.StatusCode == -3) {
        $("#dia_content").html(`
          <span>${i18n.t('Token Expired or Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
        `);
        $("#dialog").dialog("open");
        $('#next').click(() => {
          redirectA4();
        });
      }
    }
  });

  // 帶入頁面中的個人資料
  let dt = new Date();
  let gettime = dt.toString().split(' ')[4];
  let nowdate = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
  let nowtime = gettime;
  $("#cardId").append(`${userId}`); // 廠商編號
  if (companyId != undefined) {
    $("#compId").append(`${companyId}`); // 公司編號
  }
  $("#cardNo").append(`${cardId}`); // 門禁卡號
  $("#deptIdRessign").append(updateUser); // 接待員工工號
  $("#rSiteCode").append(`${rSiteCode}`); // 潔淨室工作區域
  if (inSite == 1) { // 出廠關卡
    $('.user_pic').attr('style', 'background-color: #00ffff');
    $('#bttn_submit').prepend(i18n.t('Card Disable'));
    if (UC_res_time) { // EMSR回覆的時間
      if (card_enterDate == undefined) {
        $("#work_start").append(`<span></span>`); // 工作起始日期
        $("#enterDate").append(``); // 廠商卡片入廠日期
        $("#enterTime").append(``); // 廠商卡片入廠時間
      } else {
        $("#work_start").append(`<span>${card_enterDate}</span>`); // 工作起始日期
        $("#enterDate").append(`${card_enterDate}`); // 廠商卡片入廠日期
        $("#enterTime").append(`${card_enterTime}`); // 廠商卡片入廠時間
      }
      $("#work_end").append(`<span>${enterDate}</span>`); // 工作結束日期
      $("#outDate").append(`${enterDate}`); // 廠商出廠日期
      $("#outTime").append(`${enterTime}`); // 廠商出場時間
    } else { // 沒有EMSR回覆的時間，取當下時間
      $("#work_start").append(`<span>${card_enterDate}</span>`); // 工作起始日期
      $("#work_end").append(`<span>${nowdate}</span>`); // 工作結束日期
      $("#enterDate").append(`${card_enterDate}`); // 廠商卡片入廠日期
      $("#enterTime").append(`${card_enterTime}`); // 廠商卡片入廠時間
      $("#outDate").append(`${nowdate}`); // 廠商出廠日期
      $("#outTime").append(`${nowtime}`); // 廠商出場時間
    }
  } else if (inSite == 0) { // 入場開卡
    $('.user_pic').attr('style', 'background-color: #ff0033');
    if (UC_res_time) { // EMSR回覆的時間
      $("#work_start").append(`<span>${enterDate}</span>`); // 工作起始日期
      $("#enterDate").append(`${enterDate}`); // 廠商入廠日期
      $("#enterTime").append(`${enterTime}`); // 廠商入廠時間
    } else { // 沒有EMSR回覆的時間，取當下時間
      $("#work_start").append(`<span>${nowdate}</span>`); // 工作起始日期
      $("#enterDate").append(`${nowdate}`); // 廠商入廠日期
      $("#enterTime").append(`${nowtime}`); // 廠商入廠時間
    }
    $('#bttn_submit').prepend(i18n.t('Card Enable'));
  }
} else {
  location.href = '/usercheck';
}


// 點擊開/關卡後的動作
function CHECK_USER() {
  start_time = new Date(); // 記時開始
  GetTime(start_time, 'Card Enable/Disable Start'); // 顯示開始時間

  if (inSite == 1) { // 關卡
    value = JSON.stringify({
      AccountName: AccountName,
      token: acdn,
      userRole: userRole,
      uuid: UC_uuid_to_ACS,
      cardId: cardId,
      userId: userId,
      computerName: cpu_name,
      updateUser: AccountName,
      isCardEnableDisable: isCardEnableDisable,
      openType: openType
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
            // 聯合連通廠區
            if (openRSiteCode != undefined) { 
              if (openRSiteCode.length > 0) {
                CallOpenRSiteCode("disable");
              }
            }
            // COUNT TIME
            end_time = new Date();
            count_time = end_time - start_time; // 花費時間(ms)
            GetTime(end_time, 'Card Disable Finish'); // 顯示結束時間
            start_time = String(GetTime(start_time)).replace("Z", " ");
            end_time = String(GetTime(end_time)).replace("Z", " ");
            console.log(start_time, end_time);
            GetAPITime(start_time, end_time, inSite);
            console.log(`[card_disable]花費時間: ${count_time} ms`);

            $("#dia_content").html(`
              <span>${i18n.t('Emp ID/Card ID')}: ${userId}</span><br>
              <span>${i18n.t('Factory')}: ${i18n.t(rSiteCode)}</span><br>
              <span class="clr-green">${i18n.t('Card Disabled Successfully')}</span>
            `);
            $("#dialog").dialog("open");
            $('#next').click(() => {
              redirectUserCheck();
            });
          } else {
            $("#dia_content").html(`
              <span>${i18n.t('Emp ID/Card ID')}: ${userId}</span><br>
              <span>${i18n.t('Factory')}: ${i18n.t(rSiteCode)}</span><br>
              <span>${i18n.t('Card closing failed, try again')}</span>
            `);
            $("#dialog").dialog("open");
            $('#next').click(() => {
              redirectUserCheck();
            });
          }
        } else if (res.StatusCode == -2 | res.StatusCode == -3) {
          $("#dia_content").html(`
            <span>${i18n.t('Emp ID/Card ID')}: ${userId}</span><br>
            <span>${i18n.t('Factory')}: ${i18n.t(rSiteCode)}</span><br>
            <span>${i18n.t('Token Error,')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `);
          $("#dialog").dialog("open");
          $('#next').click(() => {
            redirectA4();
          })
        } else if (res.StatusCode == -4) {
          $("#dia_content").html(`
            <span>${i18n.t('Emp ID/Card ID')}: ${userId}</span><br>
            <span>${i18n.t('Factory')}: ${i18n.t(rSiteCode)}</span><br>
            <span>${i18n.t('Timeout Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `);
          $("#dialog").dialog("open");
          $('#next').click(() => {
            redirectUserCheck();
          });
        } else if (res.StatusCode == -5 | res.StatusCode == -6) {
          $("#dia_content").html(`
            <span>${i18n.t('Emp ID/Card ID')}: ${userId}</span><br>
            <span>${i18n.t('Factory')}: ${i18n.t(rSiteCode)}</span><br>
            <span>${i18n.t('No Data or Data Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `);
          $("#dialog").dialog("open");
          $('#next').click(() => {
            redirectUserCheck();
          });
        } else if (res.StatusCode == -9) {
          $("#dia_content").html(`
            <span>${i18n.t('Emp ID/Card ID')}: ${userId}</span><br>
            <span>${i18n.t('Factory')}: ${i18n.t(rSiteCode)}</span><br>
            <span>${i18n.t('NO Authority call API,')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `);
          $("#dialog").dialog("open");
          $('#next').click(() => {
            redirectUserCheck();
          });
        } else {
          console.log(`【user_priv.js】關卡StatusCode: ${res.StatusCode}`);
          $("#dia_content").html(`
            <span>${i18n.t('Emp ID/Card ID')}: ${userId}</span><br>
            <span>${i18n.t('Factory')}: ${i18n.t(rSiteCode)}</span><br>
            <span>${i18n.t('Card closing failed,')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `);
          $("#dialog").dialog("open");
          $('#next').click(() => {
            redirectUserCheck();
          });
        }
      },
      error: function (xhr, status) {
        $("#dia_content").html(`
          <span>${i18n.t('Emp ID/Card ID')}: ${userId}</span><br>
          <span>${i18n.t('Factory')}: ${i18n.t(rSiteCode)}</span><br>
          <span>${i18n.t('Card closing failed,')}, ${i18n.t('Error Code: ')}${xhr.status}</span>
        `);
        $("#dialog").dialog("open");
        $('#next').click(() => {
          redirectUserCheck();
        });
      }
    });
  } else if (inSite == 0) { // 開卡
    // 是否重派特殊權限
    if (isReassign == 1) {
      let value = JSON.stringify({
        AccountName: AccountName,
        token: acdn,
        userRole: userRole,
        uuid: _uuid(),
        deptIdReassignList: deptIdReassignList,
        cardId: cardId,
        userId: userId,
        updateUser: AccountName,
      });
      console.log(value);
      $.ajax({
        url: `${WEBAPI_ip}/api/PrivDept/enable`,
        type: 'POST',
        async: true,
        dataType: 'JSON',
        contentType: 'application/json;charset=utf-8',
        data: value,
        success: function (res) {
          console.log(res);
          if (res.StatusCode == 1) {
            console.log("【user_priv.js】下派特殊權限成功");
          } else if (res.StatusCode == -2 | res.StatusCode == -3) {
            console.log(`Token 錯誤，錯誤代碼: ${res.StatusCode}`);
            redirectA4();
          } else {
            console.log("【user_priv.js】下派特殊權限失敗");
          }
        },
      });
    } else {
      console.log("【user_priv.js】免下派特殊權限");
    }

    value = JSON.stringify({
      AccountName: AccountName,
      token: acdn,
      userRole: userRole,
      uuid: UC_uuid_to_ACS,
      cardId: cardId,
      userId: userId,
      computerName: cpu_name,
      updateUser: AccountName,
      isCardEnableDisable: isCardEnableDisable,
      openType: openType
    });
    console.log(value);
    // ACS 開卡程式
    $.ajax({
      url: `${WEBAPI_ip}/api/card/enable`,
      type: 'POST',
      async: true,
      dataType: 'JSON',
      contentType: 'application/json;charset=utf-8',
      data: value,
      success: function (res) {
        console.log(res);
        if (res.StatusCode == 1) {
          console.log(`【user_priv.js】開卡StatusCode: ${res.StatusCode}`);
          if (res.ContentObject.isSuccess == 1) {
            // 聯合連通廠區
            if (openRSiteCode != undefined) { 
              if (openRSiteCode.length > 0) {
                CallOpenRSiteCode('enable');
              }
            }
            // COUNT TIME
            end_time = new Date();
            count_time = end_time - start_time; // 花費時間(ms)
            GetTime(end_time, 'Card Enable Finish'); // 顯示結束時間
            start_time = String(GetTime(start_time)).replace("Z", " ");
            end_time = String(GetTime(end_time)).replace("Z", " ");
            console.log(start_time, end_time);
            GetAPITime(start_time, end_time, inSite); // 計算網頁呼叫API花費時間
            console.log(`[card_disable]花費時間: ${count_time} ms`);

            $("#dia_content").html(`
              <span>${i18n.t('Emp ID/Card ID')}: ${userId}</span><br>
              <span>${i18n.t('Factory')}: ${i18n.t(rSiteCode)}</span><br>
              <span class="clr-green">${i18n.t('Card Enabled Successfully')}</span>
            `);
            $("#dialog").dialog("open");
            $('#next').click(() => {
              redirectUserCheck();
            })
          } else {
            $("#dia_content").html(`
              <span>${i18n.t('Emp ID/Card ID')}: ${userId}</span><br>
              <span>${i18n.t('Factory')}: ${i18n.t(rSiteCode)}</span><br>
              <span>${i18n.t('Failed to open card, try again')}</span>
              <span>${res.ContentObject.failReason}</span>
            `);
            $("#dialog").dialog("open");
            $('#next').click(() => {
              redirectUserCheck();
            });
          }
        } else if (res.StatusCode == -2 | res.StatusCode == -3) {
          $("#dia_content").html(`
            <span>${i18n.t('Emp ID/Card ID')}: ${userId}</span><br>
            <span>${i18n.t('Factory')}: ${i18n.t(rSiteCode)}</span><br>
           <span>${i18n.t('Token Error,')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `);
          $("#dialog").dialog("open");
          $('#next').click(() => {
            redirectUserCheck();
          });
        } else if (res.StatusCode == -4) {
          $("#dia_content").html(`
            <span>${i18n.t('Emp ID/Card ID')}: ${userId}</span><br>
            <span>${i18n.t('Factory')}: ${i18n.t(rSiteCode)}</span><br>
            <span>${i18n.t('Timeout Error,')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `);
          $("#dialog").dialog("open");
          $('#next').click(() => {
            redirectUserCheck();
          });
        } else if (res.StatusCode == -5 | res.StatusCode == -6) {
          $("#dia_content").html(`
            <span>${i18n.t('Emp ID/Card ID')}: ${userId}</span><br>
            <span>${i18n.t('Factory')}: ${i18n.t(rSiteCode)}</span><br>
            <span>${i18n.t('No Data or Data Error,')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `);
          $("#dialog").dialog("open");
          $('#next').click(() => {
            redirectUserCheck();
          });
        } else if (res.StatusCode == -9) {
          $("#dia_content").html(`
            <span>${i18n.t('Emp ID/Card ID')}: ${userId}</span><br>
            <span>${i18n.t('Factory')}: ${i18n.t(rSiteCode)}</span><br>
            <span>${i18n.t('NO Authority call API,')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `);
          $("#dialog").dialog("open");
          $('#next').click(() => {
            redirectUserCheck();
          });
        } else {
          console.log(`【user_priv.js】開卡StatusCode: ${res.StatusCode}`);
          $("#dia_content").html(`
            <span>${i18n.t('Emp ID/Card ID')}: ${userId}</span><br>
            <span>${i18n.t('Factory')}: ${i18n.t(rSiteCode)}</span><br>
            <span>${i18n.t('Card closing failed,')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
          `);
          $("#dialog").dialog("open");
          $('#next').click(() => {
            redirectUserCheck();
          });
        }
      },
      error: function (xhr, status) {
        $("#dia_content").html(`
          <span>${i18n.t('Emp ID/Card ID')}: ${userId}</span><br>
          <span>${i18n.t('Factory')}: ${i18n.t(rSiteCode)}</span><br>
          <span>${i18n.t('Card closing failed,')}, ${i18n.t('Error Code: ')}${xhr.status}</span>
        `);
        $("#dialog").dialog("open");
        $('#next').click(() => {
          redirectUserCheck();
        });
      }
    });
  } else {
    console.log('【user_priv.js】不明錯誤');
  }
}

// 聯合/連通廠區
const CallOpenRSiteCode = (status) => {
  if (status == 'enable') { // 聯合連通開卡
    value = JSON.stringify({
      AccountName: AccountName,
      token: acdn,
      userRole: userRole,
      openRSiteCode: openRSiteCode,
      // openRSiteCode: ['100008', '100205'], // 測試用
      rSiteCode: rSiteCode,
      enableList: [
        {
          cardId: cardId,
          userId: userId
        }
      ],
      uuid: UC_uuid_to_ACS,
      cardId: cardId,
      userId: userId,
      isReassign: isReassign,
      deptIdReassignList: deptIdReassignList,
      updateUser: AccountName,
      updateTime: UC_res_time,
      isCardEnableDisable: isCardEnableDisable,
      openType: openType
    });
  } else if (status == 'disable') {// 聯合連通關卡
    value = JSON.stringify({
      AccountName: AccountName,
      token: acdn,
      userRole: userRole,
      openRSiteCode: openRSiteCode,
      // openRSiteCode: ['100008', '100205'], // 測試用
      rSiteCode: rSiteCode,
      disableList: [
        {
          cardId: cardId,
          userId: userId
        }
      ],
      uuid: UC_uuid_to_ACS,
      cardId: cardId,
      userId: userId,
      isReassign: isReassign,
      deptIdReassignList: deptIdReassignList,
      updateUser: AccountName,
      updateTime: UC_res_time,
      isCardEnableDisable: isCardEnableDisable,
      openType: openType
    });
  }
  console.log('聯合連通廠區');
  console.log(value);
  $.ajax({
    url: `${EMSR_ip}/api/emsr/post/card/enable/disable`,
    type: 'POST',
    async: true,
    dataType: 'JSON',
    contentType: 'application/json;charset=utf-8',
    data: value,
    success: function (res) {
      console.log(res);
      if (status == "enable") {
        $('#dia_content').append(`<br><span>開啟聯合連通廠區</span>`);
      } else if (status == "disable") {
        $('#dia_content').append(`<br><span>關閉聯合連通廠區</span>`);
      }
    },
    error: function (xhr) {
      console.log(xhr);
    }
  });
};

// 取得網頁開關卡經過時間
const GetAPITime = (start_time, end_time, inSite) => {
  let targetUrl
  let value = JSON.stringify({
    AccountName: AccountName,
    userRole: userRole,
    token: acdn,
    startDt: start_time,
    endDt: end_time,
    uniqueCode: cardId
  });
  if (inSite == 1) { // 關卡
    targetUrl = "lobbyDisable";
  } else if (inSite == 0) { // 開卡
    targetUrl = "lobbyEnable";
  } else { // 測試用
    targetUrl = "lobbyDisable";
  }
  // console.log(value)
  $.ajax({
    url: `${WEBAPI_ip}/api/ccop/web/${targetUrl}`,
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

// 點擊上一頁的動作
$('#bttn_back').click(function () {
  redirectUserCheck();
});


// 設定語言
function LangChange() {
  LangInit();
  // 重新渲染網頁文字
  $('#title1').html(`${i18n.t('Onsite Person Check-in/out')}`);
  $('#work_start').html(`${i18n.t('Start Time')}`);
  $('#work_end').html(`${i18n.t('End Time')}`);
  $('#title2').html(`${i18n.t('Vendor NO')}`);
  $('#title3').html(`${i18n.t('Company NO')}`);
  $('#title4').html(`${i18n.t('Vendor Card ID')}`);
  $('#title5').html(`${i18n.t('Vendor Enter Date')}`);
  $('#title6').html(`${i18n.t('Vendor Enter Time')}`);
  $('#title7').html(`${i18n.t('Vendor Out Date')}`);
  $('#title8').html(`${i18n.t('Vendor Out Time')}`);
  $('#title9').html(`${i18n.t('Receptionist NO')}`);
  $('#title10').html(`${i18n.t('Cleanroom Area')}`);
  $('#title11').html(`${i18n.t('Holiday Approach')}`);
  $('#title12').html(`${i18n.t('Admin Message')}`);

  if (language == 'en-US') {
    $("#cardName").html(` ${userName}`); // 廠商名稱
    $("#compName").html(` ${companyName}`); // 公司名稱
    $("#deptName").html(` ${receptionEmplName}`); // 接待員工名稱

  } else if (language == 'zh-TW') {
    $("#cardName").html(` ${userEName}`); // 廠商名稱(E)
    $("#compName").html(` ${companyEName}`); // 公司名稱(E)
    $("#deptName").html(` ${receptionEmplEName}`); // 接待員工名稱(E)
  }

  $('#ui-id-1').html(i18n.t('SysInfo'));
  $("#dialog").html(`
    <div class="dia_content" id="dia_content">
    </div>
    <hr>
    <div class="dia_btngroup" id="dia_btngroup">
      <button type="button" id="next" class="btn btn-primary bttn_submit bttn_dia" onclick="CloseDia()">${i18n.t('OK')}</button>
    </div>
  `);
  // 判斷是否開卡或關卡
  getCookie('UC_inSite') == 0 ? ($('#bttn_submit').html(`${i18n.t('Card Enable')}`)) : ($('#bttn_submit').html(`${i18n.t('Card Disable')}`));

  $('#bttn_back').html(`${i18n.t('Back')}`);

  $(document).attr('title', i18n.t('Onsite Person Check-in/out')); // 修改網頁標題
};

LangChange();