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

$("#userId").focus()

// 偵測ENTER鍵
//#inputTarget是你input的ID
$("#userId").keypress(function (e) {
  code = (e.keyCode ? e.keyCode : e.which);
  if (code == 13) {
    //bttn_submit是按鈕名稱
    $("#bttn_submit").click();
  }
})
$("#userName").keypress(function (e) {
  code = (e.keyCode ? e.keyCode : e.which);
  if (code == 13) {
    //bttn_submit是按鈕名稱
    $("#bttn_submit").click();
  }
})

$("#vendorCompany").keypress(function (e) {
  code = (e.keyCode ? e.keyCode : e.which);
  if (code == 13) {
    //bttn_submit是按鈕名稱
    $("#bttn_submit").click();
  }
})
$("#cardId").keypress(function (e) {
  code = (e.keyCode ? e.keyCode : e.which);
  if (code == 13) {
    //bttn_submit是按鈕名稱
    $("#bttn_submit").click();
  }
})
$("#receptionEmpl").keypress(function (e) {
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

let CallFunction = (value, limit, pageIndex) => {
  $.ajax({
    url: `${WEBAPI_ip}/api/log/in/out/factory/number`,
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
  $.ajax({
    url: `${WEBAPI_ip}/api/log/in/out/factory`,
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
          $("#seach_res").html(`,共${getData.length}筆`)
          // 廠商基本通行權
          for (i = 0; i < getData.length; i++) {
            $('#person30_form').append(` // userId改成receptionEmpl了
              <tr title="${i + 1} ${i18n.t("Line")}">
                <td>${i18n.t(getData[i].areaName == null ? "" : getData[i].areaName)}</td>
                <td>${getData[i].userId}</td>
                <td>${getData[i].userName}</td>
                <td>${getData[i].companyId == null ? "" : getData[i].companyId}</td>
                <td>${getData[i].companyName == null ? "" : getData[i].companyName}</td>
                <td>${getData[i].receptionEmpl == null ? "" : getData[i].receptionEmpl} ${getData[i].receptionEmplName == null ? "" : getData[i].receptionEmplName}</td>
                <td>${getData[i].deptId == null ? "" : getData[i].deptId}</td>
                <td>${getData[i].deptName == null ? "" : getData[i].deptName}</td>
                <td>${getData[i].inTime == null ? "" : getData[i].inTime}</td>
                <td>${getData[i].outTime == null ? "" : getData[i].outTime}</td>
                <td>${getData[i].computerName.toUpperCase()}</td>
              </tr>
            `)
          }

          if (limit == undefined) {
            $('#person30_table').tablepage($("#table_btn_group"), row_setting, setPage, ajax_num, true, pageIndex)
          }
          else if (limit == row_setting * 10) {
            $('#person30_table').tablepage($("#table_btn_group"), row_setting, setPage, ajax_num, false, pageIndex)
          }
          else {
            $('#person30_table').tablepage($("#table_btn_group"), row_setting, limit, ajax_num, false, pageIndex)
          }
          onload = true
          clientPrint(getData)
          exportReportToExcelClient(getData)
        }
      } else if (res.StatusCode == -2 | res.StatusCode == -3) {
        $("#dia_content").html(`
          <span>${i18n.t('Token Expired or Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
        `)
        $("#dialog").dialog("open")
        $('#next').click(() => {
          redirectA4()
        })
      } else if (res.StatusCode == -5) {
        $("#dia_content").html(`
          <span>${i18n.t('No required information')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
        `)
        $("#dialog").dialog("open")
      } else {
        $('#person30_form').append(`
          <tr class="text_center">
            <th colspan="15" id="result">${i18n.t('NO Result')}</th>
          </tr>
        `)
      }
    },
    error: function (xhr) {
      $("#dia_content").html(`
        <span>${i18n.t('Other Error')}, ${i18n.t('Error Code: ')}${xhr.status}</span>
      `)
      $("#dialog").dialog("open")
    },
  })
}


function seach_value(offset, limit, pageIndex) {
  // if ($('#cardId').val()) {
  if ($("#userId").val() || $("#vendorCompany").val() || $("#receptionEmpl").val()) {
    clear_value()
    if (offset < 0) {
      offset = 0
    }
    let AccountName = getCookie('AccountName')
    acdn = getCookie('acdn')
    let cardId = $('#cardId').val()
    let userId = $('#userId').val()
    let userName = $('#userName').val()
    let vendorCompany = $('#vendorCompany').val()
    let receptionEmpl = $('#receptionEmpl').val()
    let startTime = $('#startTime').val().replace("T", " ")+" :00";
    let endTime = $('#endTime').val().replace("T", " ")+ " :59";
    let value
    if (startTime || endTime) {
      if (startTime && endTime) {
        value = JSON.stringify({
          AccountName: AccountName,
          token: acdn,
          userRole: getCookie("role"),
          cardId: cardId,
          userId: userId,
          userName: userName,
          vendorCompany: vendorCompany,
          receptionEmpl: receptionEmpl,
          startTime: startTime,
          endTime: endTime,
          offset: offset == undefined ? 0 : offset,
          limit: offset == undefined ? 100 : limit,
        })
        console.log(value)
        CallFunction(value, limit)
      } else {
        $("#dia_content").html(`
            <span>${i18n.t('Please Enter the start and end time')}</span>
          `)
        $("#dialog").dialog("open")
      }
    } else {
      value = JSON.stringify({
        AccountName: AccountName,
        token: acdn,
        userRole: getCookie("role"),
        cardId: cardId,
        userId: userId,
        userName: userName,
        vendorCompany: vendorCompany,
        receptionEmpl: receptionEmpl,
        startTime: startTime,
        endTime: endTime,
        offset: offset == undefined ? 0 : offset,
        limit: offset == undefined ? 100 : limit,
      })
      console.log(value)
      CallFunction(value, limit)
    }

  } else {
    $("#dia_content").html(`
        <span>${i18n.t('Please Enter Vendor ID, Company Name or Receptionist NO')}</span>
      `)
    $("#dialog").dialog("open")
    $("#next").click(() => {
      $("#dialog").dialog("close");
      $("#userId").focus()
    })
  }
  // } else {
  //   $("#dia_content").html(`
  //     <span>${i18n.t('Please Enter Card Id')}</span>
  //   `)
  //   $("#dialog").dialog("open")
  //   $("#next").click(() => {
  //     $("#dialog").dialog("close");
  //     $("#cardId").focus()
  //   })
  // }
}

function clear_value() {
  $('#seach_res').html('')
  $('#person30_table').html(`
  <thead class="text_center bgc-orange fixTable">
    <tr>
      <th scope="col" id="col1">${i18n.t('Factory')}</th>
      <th scope="col" id="col6">${i18n.t('Vendor NO')}</th>
      <th scope="col" id="col7">${i18n.t('Vendor Name')}</th>
      <th scope="col" id="col8">${i18n.t('Vendor Company ID')}</th>
      <th scope="col" id="col9">${i18n.t('Vendor Company Name')}</th>
      <th scope="col" id="col10">${i18n.t('Receptionist NO')}</th>
      <th scope="col" id="col11">${i18n.t('Department ID')}</th>
      <th scope="col" id="col12">${i18n.t('Department')}</th>
      <th scope="col" id="col13">${i18n.t('ENTER')}</th>
      <th scope="col" id="col14">${i18n.t('OUT')}</th>
      <th scope="col" id="col5">${i18n.t('Check-In/Out Computer Name')}</th>
    </tr>
  </thead>
  <tbody id="person30_form">
  </tbody>
  `)
  onload = false
}

function clear_input() {
  $('#startTime').val("")
  $('#endTime').val("")
  $('#receptionEmpl').val("")
  $('#receptionEmpl').val("")
  $('#cardId').val("")
  $('#vendorCompany').val("")
  $('#userName').val("")
  $('#userId').val("")
}

function clear_all() {
  clear_value()
  clear_input()
}


// 設定語言
function LangChange() {
  LangInit()
  // 重新渲染網頁文字
  $('#title1').html(`${i18n.t("30 days' Resident Status")}`) //駐廠人員出入廠30天記錄查詢
  $('#title2').html(`${i18n.t('Vendor NO')}`) //駐廠人員編號
  $('#title3').html(`${i18n.t('Vendor Name')}`) //駐廠人員姓名
  $('#title4').html(`${i18n.t('Vendor Company Name')}`) //公司名稱
  $('#title5').html(`${i18n.t('Door Card ID')}`) //門禁卡號
  $('#title6').html(`${i18n.t('Receptionist NO')}`) //接待人員工號
  $('#title7').html(`${i18n.t('Factory')}`) //所屬廠區
  $('#title8').html(`${i18n.t('Time Segment')}`) //檢查時間區段
  $('#title9').html(`${i18n.t('Form')}`) //起始時間
  $('#title10').html(`${i18n.t('To')}`) //結束時間

  $('#result').html(`${i18n.t('Result')}`) //查詢結果
  // $('#title12').html(`${i18n.t('Custom display number')}`) //自訂顯示筆數
  $('#export').html(`${i18n.t('Export XLS')}`) //匯出XLS
  $('#printbtn').html(`${i18n.t('Print')}`) //列印
  // $('#title15').html(`${i18n.t('History')}`) //歷史記錄

  $('.requiredone').html(`${i18n.t('*Required One')}`) //必選其一

  $('#col1').html(`${i18n.t('Factory')}`) //所屬廠區
  $('#col2').html(`${i18n.t('Vendor')}`) //駐廠人員
  $('#col3').html(`${i18n.t('Receptionist')}`) //接待員工
  $('#col4').html(`${i18n.t('InOut')}`) //出入廠
  $('#col5').html(`${i18n.t('Check-In/Out Computer Name')}`) //開卡電腦名稱
  $('#col6').html(`${i18n.t('Vendor NO')}`) //編號
  $('#col7').html(`${i18n.t('Vendor Name')}`) //姓名
  $('#col8').html(`${i18n.t('Vendor Company ID')}`) //公司統編
  $('#col9').html(`${i18n.t('Vendor Company Name')}`) //公司名稱
  $('#col10').html(`${i18n.t('Receptionist NO')}`) //工號
  $('#col11').html(`${i18n.t('Department ID')}`) //部門代號
  $('#col12').html(`${i18n.t('Department')}`) //部門名稱
  $('#col13').html(`${i18n.t('ENTER')}`) //實際入廠
  $('#col14').html(`${i18n.t('OUT')}`) //實際出廠

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

  // $('#select option[value="1"]').text(`${i18n.t('FAB AP03')}`)
  $('#select').val(`${i18n.t('FAB AP03')}`)

  $(document).attr('title', i18n.t("30 days' Resident Status")) // 修改網頁標題

  // 切換中英重新搜尋結果
  if (onload) {
    seach_value()
  }
}

LangChange()

if (TestOrTSMC == 0) {
  // 測試用
  for (i = 0; i < 15; i++) {
    $('#person30_form').append(`
    <tr class="">
      <td>【${i}】rSiteCode rSiteCode rSiteCode</td>
      <td>【${i}】cardId cardId cardId</td>
      <td>【${i}】userName userName userName</td>
      <td>【${i}】companyId companyId companyId</td>
      <td>【${i}】companyName companyName companyName</td>
      <td>【${i}】userId userId userId userId</td>
      <td>【${i}】deptId deptId deptId deptId</td>
      <td>【${i}】deptName deptName deptName</td>
      <td>【${i}】inTime inTime inTime inTime</td>
      <td>【${i}】outTime outTime outTime outTime</td>
      <td>【${i}】computerName computerName computerName</td>
    </tr>
  `)
  }
  $('#person30_table').tablepage($("#table_btn_group"), 10)
}



let printContent
// 列印功能(用開始新tab的方式，新建一個<table>並事先放入 result 直接 onload=print())
var clientPrint = (obj) => {
  printContent = `
    <table>
      <thead class="text_center bgc-orange fixTable">
        <tr>
          <th scope="col" id="col1">${i18n.t('Factory')}</th>
          <th scope="col" id="col6">${i18n.t('Vendor NO')}</th>
          <th scope="col" id="col7">${i18n.t('Vendor Name')}</th>
          <th scope="col" id="col8">${i18n.t('Vendor Company ID')}</th>
          <th scope="col" id="col9">${i18n.t('Vendor Company Name')}</th>
          <th scope="col" id="col10">${i18n.t('Receptionist NO')}</th>
          <th scope="col" id="col11">${i18n.t('Department ID')}</th>
          <th scope="col" id="col12">${i18n.t('Department')}</th>
          <th scope="col" id="col13">${i18n.t('ENTER')}</th>
          <th scope="col" id="col14">${i18n.t('OUT')}</th>
          <th scope="col" id="col5">${i18n.t('Check-In/Out Computer Name')}</th>
        </tr>
      </thead>
      <tbody>`
  if (obj) {
    for (i = 0; i < obj.length; i++) {
      printContent += `
        <tr>
          <td>${i18n.t(getData[i].areaName == null ? "" : getData[i].areaName)}</td>
          <td>${getData[i].userId}</td>
          <td>${getData[i].userName}</td>
          <td>${getData[i].companyId == null ? "" : getData[i].companyId}</td>
          <td>${getData[i].companyName == null ? "" : getData[i].companyName}</td>
          <td>${getData[i].receptionEmpl == null ? "" : getData[i].receptionEmpl} ${getData[i].receptionEmplName == null ? "" : getData[i].receptionEmplName}</td>
          <td>${getData[i].deptId == null ? "" : getData[i].deptId}</td>
          <td>${getData[i].deptName == null ? "" : getData[i].deptName}</td>
          <td>${getData[i].inTime == null ? "" : getData[i].inTime}</td>
          <td>${getData[i].outTime == null ? "" : getData[i].outTime}</td>
          <td>${getData[i].computerName.toUpperCase()}</td>
        </tr>
      `
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
          <th scope="col" id="col1">${i18n.t('Factory')}</th>
          <th scope="col" id="col6">${i18n.t('Vendor NO')}</th>
          <th scope="col" id="col7">${i18n.t('Vendor Name')}</th>
          <th scope="col" id="col8">${i18n.t('Vendor Company ID')}</th>
          <th scope="col" id="col9">${i18n.t('Vendor Company Name')}</th>
          <th scope="col" id="col10">${i18n.t('Receptionist NO')}</th>
          <th scope="col" id="col11">${i18n.t('Department ID')}</th>
          <th scope="col" id="col12">${i18n.t('Department')}</th>
          <th scope="col" id="col13">${i18n.t('ENTER')}</th>
          <th scope="col" id="col14">${i18n.t('OUT')}</th>
          <th scope="col" id="col5">${i18n.t('Check-In/Out Computer Name')}</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
  `)
  if (obj) {
    for (i = 0; i < obj.length; i++) {
      $('#tableExport').append(`
        <tr>
          <td>${i18n.t(getData[i].areaName == null ? "" : getData[i].areaName)}</td>
          <td>${getData[i].userId}</td>
          <td>${getData[i].userName}</td>
          <td>${getData[i].companyId == null ? "" : getData[i].companyId}</td>
          <td>${getData[i].companyName == null ? "" : getData[i].companyName}</td>
          <td>${getData[i].receptionEmpl == null ? "" : getData[i].receptionEmpl} ${getData[i].receptionEmplName == null ? "" : getData[i].receptionEmplName}</td>
          <td>${getData[i].deptId == null ? "" : getData[i].deptId}</td>
          <td>${getData[i].deptName == null ? "" : getData[i].deptName}</td>
          <td>${getData[i].inTime == null ? "" : getData[i].inTime}</td>
          <td>${getData[i].outTime == null ? "" : getData[i].outTime}</td>
          <td>${getData[i].computerName.toUpperCase()}</td>
        </tr>
      `)
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
  // console.log(new Date().toDateInputValue())
  $('#startTime').val(new Date().toDateInputValue30d());
  $('#endTime').val(new Date().toDateInputValueLocal());
  // document.getElementById('startTime').valueAsDate = new Date();
  // document.getElementById('endTime').valueAsDate = new Date();
});