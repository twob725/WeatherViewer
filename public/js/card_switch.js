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

$('#userInput').focus()

// 偵測ENTER鍵
//#inputTarget是你input的ID
$("#cardInput").keypress(function (e) {
  code = (e.keyCode ? e.keyCode : e.which);
  if (code == 13) {
    //bttn_submit是按鈕名稱
    $("#bttn_submit").click();
  }
})
$("#userInput").keypress(function (e) {
  code = (e.keyCode ? e.keyCode : e.which);
  if (code == 13) {
    //bttn_submit是按鈕名稱
    $("#bttn_submit").click();
  }
})
$("#startTime").keypress(function (e) {
  code = (e.keyCode ? e.keyCode : e.which);
  if (code == 13) {
    //bttn_submit是按鈕名稱
    $("#bttn_submit").click();
  }
})
$("#endTime").keypress(function (e) {
  code = (e.keyCode ? e.keyCode : e.which);
  if (code == 13) {
    //bttn_submit是按鈕名稱
    $("#bttn_submit").click();
  }
})

$("#bttn_submit2").click(() => {
  seach_value()
})

let row_setting = 10 // 表格一次呈現多少列
var setPage = 10
let ajax_num
let getData

function seach_value(offset, limit, pageIndex) {
  if ($("#cardInput").val() || $("#userInput").val()) {
    if ($("#startTime").val() && $("#endTime").val()) {
      clear_value()
      let AccountName = getCookie('AccountName')
      acdn = getCookie('acdn')
      let cardInput = $('#cardInput').val()
      let userInput = $('#userInput').val()
      let startTime = $('#startTime').val()
      startTime = startTime.replace("T", " ")
      let endTime = $('#endTime').val()
      endTime = endTime.replace("T", " ")

      let value = JSON.stringify({
        AccountName: AccountName,
        token: acdn,
        userRole: getCookie("role"),
        cardId: cardInput,
        userId: userInput,
        startTime: startTime,
        endTime: endTime + " 23:59:59",
        offset: offset == undefined ? 0 : offset,
        limit: offset == undefined ? 100 : limit,
      })
      console.log(value)

      // 取得結果總筆數 API
      $.ajax({
        url: `${WEBAPI_ip}/api/log/card/enable/disable/number`,
        type: "POST",
        async: false,
        dataType: 'JSON',
        contentType: 'application/json;charset=utf-8',
        data: value,
        success: function (res) {
          console.log(res)
          ajax_num = res.ContentObject
        },
        error: function (xhr) {
          console.log(xhr)
        }
      })
      // WEB API
      $.ajax({
        url: `${WEBAPI_ip}/api/log/card/enable/disable`,
        type: "POST",
        async: true,
        dataType: 'JSON',
        contentType: 'application/json;charset=utf-8',
        data: value,
        success: function (res) {
          console.log(res)
          if (res.StatusCode == 1) {
            getData = res.ContentObject
            if (getData) {
              // 廠商基本通行權
              $("#seach_res").html(`,共${getData.length}筆`)
              for (i = 0; i < getData.length; i++) {
                $('#card_switch_form').append(`
                  <tr title="${i + 1} ${i18n.t("Line")}">
                    <td>${getData[i].userName}</th>
                    <td>${getData[i].userId}</td>
                    <td>${getData[i].companyName}</td>
                    <td>${getData[i].cardId}</td>
                    <td>${getData[i].cardTime}</td>
                    <td>${i18n.t(getData[i].areaName == null ? "" : getData[i].areaName)}</td>
                    <td>${getData[i].enable_disable == 1 ? i18n.t('Card Disable') : i18n.t('Card Enable')}</td>
                    <td>${getData[i].description == "" ? i18n.t('Success') : getData[i].description}</td>
                    <td>${getData[i].computerName.toUpperCase()}</td>
                  </tr>
                `)
              }
              if (limit == undefined) {
                $('#card_table').tablepage($("#table_btn_group"), row_setting, setPage, ajax_num, true, pageIndex)
              }
              else if (limit == row_setting * 10) {
                $('#card_table').tablepage($("#table_btn_group"), row_setting, setPage, ajax_num, false, pageIndex)
              }
              else {
                $('#card_table').tablepage($("#table_btn_group"), row_setting, limit, ajax_num, false, pageIndex)
              }
              onload = true
              clientPrint(getData)
              exportReportToExcelClient(getData)
            }
          } else if (res.StatusCode == -2 | res.StatusCode == -3) {
            $("#dia_content").html(`
              <span>${i18n.t('Token Expired or Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
            `);
            $("#dialog").dialog("open");
            $('#next').click(() => {
              redirectA4()
            })
          } else if (res.StatusCode == -5) {
            $("#dia_content").html(`
              <span>${i18n.t('No required information')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
            `)
            $("#dialog").dialog("open")
          } else {
            // $("#seach_res").html(`,共 0 筆`)
            $('#card_switch_form').append(`
              <tr class="text_center">
                <th colspan="9" id="result">${i18n.t('NO Result')}</th>
              <tr>
              $('#table_btn_group').html("")
            `)
            // $('#userInput').focus()
          }
        },
        error: function (xhr) {
          $("#dia_content").html(`
            <span>${i18n.t('Other Error')}, ${i18n.t('Error Code: ')}${xhr.status}</span>
          `)
          $("#dialog").dialog("open")
        }
      })
    } else {
      $("#dia_content").html(`
        <span>${i18n.t('Please Enter the start and end time')}</span>
      `)
      $("#dialog").dialog("open")
      $('#next').click(() => {
        $('#startTime').focus()
        $('#startTime').select()
      })
    }
  } else {
    $("#dia_content").html(`
      <span>${i18n.t('Please Enter User ID or Card ID')}</span>
    `)
    $("#dialog").dialog("open")
    $('#next').click(() => {
      $('#userInput').focus()
      $('#userInput').select()
    })
  }
}

function clear_value() {
  $('#seach_res').html('')
  $('#card_table').html(`
    <thead class="text_center bgc-orange fixTable">
      <tr>
        <th scope="col" id="col7">${i18n.t('Vendor Name')}</th>
        <th scope="col" id="col8">${i18n.t('Vendor ID/User ID')}</th>
        <th scope="col" id="col9">${i18n.t('Vendor Company Name')}</th>
        <th scope="col" id="col10">${i18n.t('Vendor Card ID')}</th>
        <th scope="col" id="col2">${i18n.t('Date Card')}</th>
        <th scope="col" id="col3">${i18n.t('Factory')}</th>
        <th scope="col" id="col4">${i18n.t('Check In/Out')}</th>
        <th scope="col" id="col5">${i18n.t('Description')}</th>
        <th scope="col" id="col6">${i18n.t('Check-In/Out Computer Name')}</th>
      </tr>
    </thead>
    <tbody id="card_switch_form">
    </tbody>
  `)
  $('#table_btn_group').html("")
  onload = false
}

function clear_input() {
  $('#cardInput').val("")
  $('#userInput').val("")
  $('#startTime').val("")
  $('#endTime').val("")
}

function clear_all() {
  clear_value()
  clear_input()
}



// 當自訂顯示筆數被改變時
$('#row_select').change(function () {
  clear_value() // 清除表格與初始化
  // $('#table_btn_group').html('')
  // alert($('#row_select').val())
  row_setting = $('#row_select').val()
  table_btn_group() // 建立表格下方的頁數按鈕
  bulid_table(row_start) // 建立表格，初始參數為 0 
})

// 建立表格下方的頁數按鈕
function table_btn_group() {
  $('#table_btn_group').html('')
  let table_btn = getData.length / row_setting
  if (table_btn) {
    $('#table_btn_group').append(`<button class="btn btn-light" id="table_start" onclick="bulid_table(0)">第一頁</button>`)
    for (i = 0; i < table_btn; i++) {
      $('#table_btn_group').append(`
        <button class="btn btn-light" id="table_${i + 1}" onclick="bulid_table(${i})">${i + 1}</button>
      `)
    }
  }
}


// 設定語言
function LangChange() {
  LangInit()
  // 重新渲染網頁文字
  $('#title1').html(`${i18n.t('Check In/Out Status Inquery')}`) //
  $('#title2').html(`${i18n.t('Vendor ID/User ID')}`) //駐廠人員編號/使用者編號:
  $('#title3').html(`${i18n.t('Card NO')}`) //卡號
  $('#title4').html(`${i18n.t('Category')}`) //分類
  $('#title5').html(`${i18n.t('Sync')}`) //同步
  $('#title6').html(`${i18n.t('Async')}`) //非同步
  $('#title7').html(`${i18n.t('Date')}`) //查詢日期
  $('#title8').html(`${i18n.t('Start Time')}`) //起始時間
  $('#title9').html(`${i18n.t('End Time')}`) //結束時間

  $('#title10').html(`${i18n.t('Custom display number')}`) //自訂顯示筆數
  $('#export').html(`${i18n.t('Export XLS')}`) //匯出XLS
  $('#printbtn').html(`${i18n.t('Print')}`) //列印

  $('#col1').html(`${i18n.t('Vendor')}`) //駐廠人員
  $('#col2').html(`${i18n.t('Date Card')}`) //刷卡時間
  $('#col3').html(`${i18n.t('Factory')}`) //廠區
  $('#col4').html(`${i18n.t('Check In/Out')}`) //開關卡
  $('#col5').html(`${i18n.t('Description')}`) //說明
  $('#col6').html(`${i18n.t('Check-In/Out Computer Name')}`) //開關卡電腦

  $('#col7').html(`${i18n.t('Vendor Name')}`) //人員名稱
  $('#col8').html(`${i18n.t('Vendor ID/User ID')}`) //編號/使用者編號
  $('#col9').html(`${i18n.t('Vendor Company Name')}`) //公司名稱
  $('#col10').html(`${i18n.t('Vendor Card ID')}`) //卡號

  $('#ui-id-1').html(i18n.t('SysInfo'))
  $("#dialog").html(`
    <div class="dia_content" id="dia_content">
    </div>
    <hr>
    <div class="dia_btngroup" id="dia_btngroup">
      <button type="button" id="next" class="btn btn-primary bttn_submit bttn_dia" onclick="CloseDia()">${i18n.t('OK')}</button>
    </div>
  `)

  $('#bttn_submit').html(`${i18n.t('Query')}`) //查詢
  $('#bttn_clear').html(`${i18n.t('Clear')}`) //清除
  $('#result').html(`${i18n.t('Result')}`) //查詢結果

  $(document).attr('title', i18n.t('Check In/Out Status Inquery')) // 修改網頁標題

  // 切換中英重新搜尋結果
  if (onload) {
    seach_value()
  }
}

LangChange()

if (TestOrTSMC == 0) {
  // 測試用
  for (i = 0; i < 55; i++) {
    $('#card_switch_form').append(`
      <tr class="text-warp">
        <td>【${i}】user name user name</td>
        <td>【${i}】user Id user Id</td>
        <td>【${i}】companyName companyName</td>
        <td>【${i}】cardId cardId</td>
        <td>【${i}】cardTime cardTime</td>
        <td>【${i}】rsiteCode rsiteCode</td>
        <td>【${i}】enable_disable enable_disable</td>
        <td>【${i}】description description</td>
        <td>【${i}】computerName computerName computerName computerName computerName computerName computerName computerName computerName computerName</td>
      </tr>
    `)
  }
  $('#card_table').tablepage($("#table_btn_group"), 10)
}



let printContent
// 列印功能(用開始新tab的方式，新建一個<table>並事先放入 result 直接 onload=print())
var clientPrint = (obj) => {
  printContent = `
    <table>
      <thead class="text_center bgc-orange fixTable">
        <tr>
          <th scope="col" id="col7">${i18n.t('Vendor Name')}</th>
          <th scope="col" id="col8">${i18n.t('Vendor ID/User ID')}</th>
          <th scope="col" id="col9">${i18n.t('Vendor Company Name')}</th>
          <th scope="col" id="col10">${i18n.t('Vendor Card ID')}</th>
          <th scope="col" id="col2">${i18n.t('Date Card')}</th>
          <th scope="col" id="col3">${i18n.t('Factory')}</th>
          <th scope="col" id="col4">${i18n.t('Check In/Out')}</th>
          <th scope="col" id="col5">${i18n.t('Description')}</th>
          <th scope="col" id="col6">${i18n.t('Check-In/Out Computer Name')}</th>
        </tr>
      </thead>
      <tbody>`
  if (obj) {
    for (i = 0; i < obj.length; i++) {
      printContent += `
        <tr>
          <td>${obj[i].userName}</th>
          <td>${obj[i].userId}</td>
          <td>${obj[i].companyName}</td>
          <td>${obj[i].cardId}</td>
          <td>${obj[i].cardTime}</td>
          <td>${i18n.t(obj[i].areaName == null ? "" : obj[i].areaName)}</td>
          <td>${obj[i].enable_disable == 1 ? i18n.t('Card Disable') : i18n.t('Card Enable')}</td>
          <td>${obj[i].description == "" ? i18n.t('Success') : obj[i].description}</td>
          <td>${obj[i].computerName.toUpperCase()}</td>
        </tr>`
    }
  } else {
    for (i = 0; i < 100; i++) {
      printContent += `
        <tr>
          <td>areaName areaName areaName</td>
          <td>companyId companyId companyId</td>
          <td>companyName companyName companyName</td>
          <td>userId userId userId</td>
          <td>userName userName userName</td>
          <td>inTime inTime inTime</td>
          <td>outTime outTime outTime</td>
          <td>receptionEmpl receptionEmpl receptionEmpl</td>
          <td>deptId deptId deptId</td>
        </tr>`
    }
  }

  printContent += `
    </tbody>
    </table>`
  console.log(printContent)

  // var value = person_enter_form.innerHTML;
}
$('#printbtn').click(function () {
  var printPage = window.open("", i18n.t("Printing"), "");
  printPage.document.open();
  printPage.document.write("<HTML><head></head><BODY onload='window.print();window.close()'>");
  printPage.document.write("<PRE>");
  printPage.document.write(printContent);
  printPage.document.write("</PRE>");
  printPage.document.close("</BODY></HTML>");
})

// 匯出XLS(在原先頁面隱藏一個<table>，搜尋資料後塞入資料，等待點選按鈕時Query出整張<table>)
var exportReportToExcelClient = (obj) => {
  $('#tableExport').html(`
    <table id="table">
      <thead class="text_center bgc-orange fixTable">
        <tr>
          <th scope="col" id="col7">${i18n.t('Vendor Name')}</th>
          <th scope="col" id="col8">${i18n.t('Vendor ID/User ID')}</th>
          <th scope="col" id="col9">${i18n.t('Vendor Company Name')}</th>
          <th scope="col" id="col10">${i18n.t('Vendor Card ID')}</th>
          <th scope="col" id="col2">${i18n.t('Date Card')}</th>
          <th scope="col" id="col3">${i18n.t('Factory')}</th>
          <th scope="col" id="col4">${i18n.t('Check In/Out')}</th>
          <th scope="col" id="col5">${i18n.t('Description')}</th>
          <th scope="col" id="col6">${i18n.t('Check-In/Out Computer Name')}</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
  `)
  if (obj) {
    for (i = 0; i < obj.length; i++) {
      $('#tableExport').append(`
        <tr>
          <td>${obj[i].userName}</th>
          <td>${obj[i].userId}</td>
          <td>${obj[i].companyName}</td>
          <td>${obj[i].cardId}</td>
          <td>${obj[i].cardTime}</td>
          <td>${i18n.t(obj[i].areaName == null ? "" : obj[i].areaName)}</td>
          <td>${obj[i].enable_disable == 1 ? i18n.t('Card Disable') : i18n.t('Card Enable')}</td>
          <td>${obj[i].description == "" ? i18n.t('Success') : obj[i].description}</td>
          <td>${obj[i].computerName.toUpperCase()}</td>
        </tr>`
      )
    }
  } else {
    for (i = 0; i < 100; i++) {
      $('#tableExport').append(`
        <tr>
          <td>areaName areaName areaName</td>
          <td>companyId companyId companyId</td>
          <td>companyName companyName companyName</td>
          <td>userId userId userId</td>
          <td>userName userName userName</td>
          <td>inTime inTime inTime</td>
          <td>outTime outTime outTime</td>
          <td>receptionEmpl receptionEmpl receptionEmpl</td>
          <td>deptId deptId deptId</td>
        </tr>`
      )
    }
  }
  $('#tableExport').append(`
  </tbody>
  </table>
  `)
  // $('#tableExport').html(printContent)
}
$('#export').click(function () {
  let table = document.getElementsByTagName("table")
  TableToExcel.convert(table[1], { // 取第二張table
    name: `export.xlsx`,
    sheet: {
      name: 'Sheet 1'
    }
  });
})

// 預設帶入時間
$(document).ready(function () {
  $('#startTime').val(new Date().toDateInputValue());
  $('#endTime').val(new Date().toDateInputValue());
  // document.getElementById('startTime').valueAsDate = new Date();
  // document.getElementById('endTime').valueAsDate = new Date();
});