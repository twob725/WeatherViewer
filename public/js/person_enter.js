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

$("#receptionEmpl").focus()

// 偵測ENTER鍵
//#inputTarget是你input的ID
$("#deptId").keypress(function (e) {
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

$("#receptionEmpName").keypress(function (e) {
  code = (e.keyCode ? e.keyCode : e.which);
  if (code == 13) {
    //bttn_submit是按鈕名稱
    $("#bttn_submit").click();
  }
})
$("#companyId").keypress(function (e) {
  code = (e.keyCode ? e.keyCode : e.which);
  if (code == 13) {
    //bttn_submit是按鈕名稱
    $("#bttn_submit").click();
  }
})
$("#companyName").keypress(function (e) {
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
  clear_value()
  if (offset < 0) {
    offset = 0
  }
  let AccountName = getCookie('AccountName')
  acdn = getCookie('acdn')
  let companyId = $('#companyId').val()
  let deptId = $('#deptId').val()
  let receptionEmpName = $('#receptionEmpName').val()
  let companyName = $('#companyName').val()
  let isNight = $('#isNight')[0].checked
  isNight = isNight == true ? "1" : "0"
  let receptionEmpl = $('#receptionEmpl').val()
  if (receptionEmpl.length == 0) {
    $("#dia_content").html(`
			<span>${i18n.t('Please Enter Receptionist NO')}</span>
		`)
    $("#dialog").dialog("open")
    $('#next').click(() => {
      $('#receptionEmpl').focus()
      $('#receptionEmpl').select()
    })
  } else {
    let value = JSON.stringify({
      AccountName: AccountName,
      token: acdn,
      userRole: getCookie("role"),
      receptionEmpl: receptionEmpl,
      companyId: companyId,
      deptId: deptId,
      receptionEmpName: receptionEmpName,
      companyName: companyName,
      isNight: isNight,
      offset: offset == undefined ? 0 : offset,
      limit: offset == undefined ? 100 : limit,
    })
    console.log(value)
    // 取得結果總筆數 API
    $.ajax({
      url: `${WEBAPI_ip}/api/log/in/out/factory/date/number`,
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
      url: `${WEBAPI_ip}/api/log/in/out/factory/date`,
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
            for (i = 0; i < getData.length; i++) {
              $('#person_enter_form').append(`
                <tr title="${i + 1} ${i18n.t("Line")}">
                  <td>${i18n.t(getData[i].areaName)}</td>
                  <td>${getData[i].companyId == null ? "" : getData[i].companyId}</td>
                  <td>${getData[i].companyName == null ? "" : getData[i].companyName}</td>
                  <td>${getData[i].userId}</td>
                  <td>${getData[i].userName}</td>
                  <td>${getData[i].inTime == null ? "" : getData[i].inTime}</td>
                  <td>${getData[i].outTime == null ? "" : getData[i].outTime}</td>
                  <td>${getData[i].receptionEmpl}</td>
                  <td>${getData[i].deptId}</td>
                  <td>${getData[i].deptName}</td>
                </tr>
              `)
              clientPrint(getData) // 列印功能
              exportReportToExcelClient(getData) // 匯出XLS
            }
            if (limit == undefined) {
              $('#person_table').tablepage($("#table_btn_group"), row_setting, setPage, ajax_num, true, pageIndex)
            }
            else if (limit == row_setting * 10) {
              $('#person_table').tablepage($("#table_btn_group"), row_setting, setPage, ajax_num, false, pageIndex)
            }
            else {
              $('#person_table').tablepage($("#table_btn_group"), row_setting, limit, ajax_num, false, pageIndex)
            }
            onload = true
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
          // $("#dialog").html(`查無資料，錯誤代碼: ${res.StatusCode}`);
          // $("#dialog").dialog("open");
          // setTimeout(function () {
          //   $("#dialog").dialog("close");
          // }, setTime)
          $("#seach_res").html(`,共 0 筆`)
          $('#person_enter_form').append(`
            <tr class="text_center">
              <th colspan="10" id="result">${i18n.t('NO Result')}</th>
            </tr>
          `)
          // $("#receptionEmpl").focus()
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


}

function clear_value() {
  $("#seach_res").html(``)
  $('#person_table').html(`
    <thead class="text_center bgc-orange fixTable">
      <tr>
        <th scope="col" id="col1">${i18n.t('Factory')}</th>
        <th scope="col" id="col2">${i18n.t('Vendor Company ID')}</th>
        <th scope="col" id="col3">${i18n.t('Vendor Company Name')}</th>
        <th scope="col" id="col4">${i18n.t('Vendor NO')}</th>
        <th scope="col" id="col5">${i18n.t('Vendor Name')}</th>
        <th scope="col" id="col6">${i18n.t('Check-In Time')}</th>
        <th scope="col" id="col7">${i18n.t('Check-Out Time')}</th>
        <th scope="col" id="col8">${i18n.t('Receptionist Employee')}</th>
        <th scope="col" id="col9">${i18n.t('Department ID')}</th>
        <th scope="col" id="col10">${i18n.t('Department')}</th>
      </tr>
    </thead>
    <tbody id="person_enter_form">
    </tbody>
  `)
  onload = false
}

function clear_input() {
  $('#deptId').val("")
  $('#receptionEmpl').val("")
  $('#receptionEmpName').val("")
  $('#companyId').val("")
  $('#companyName').val("")
}

function clear_all() {
  clear_value()
  clear_input()
}

// 設定語言
function LangChange() {
  LangInit()
  // 重新渲染網頁文字
  $('#title1').html(`${i18n.t('On-Site Person Resident Status')}`) //駐廠人員今日進廠記錄查詢
  $('#title2').html(`${i18n.t('Factory')}`) //廠區:
  $('#title3').html(`${i18n.t('Department ID')}`) //部門代碼:
  $('#title4').html(`${i18n.t('Receptionist NO')}`) //接待員工工號:
  $('#title5').html(`${i18n.t('Receptionist Name')}`) //接待員工姓名:
  $('#title6').html(`${i18n.t('Vendor Company ID')}`) //公司統編:
  $('#title7').html(`${i18n.t('Vendor Company Name')}`) //公司姓名:
  $('#title8').html(`${i18n.t('Start from 00:00')}`) //從00:00算起

  $('#result').html(`${i18n.t('Result')}`) //查詢結果
  // $('#title10').html(`${i18n.t('Custom display number')}`) //自訂顯示筆數
  $('#export').html(`${i18n.t('Export XLS')}`) //匯出XLS
  $('#printbtn').html(`${i18n.t('Print')}`) //列印

  $('#col1').html(`${i18n.t('Factory')}`) //廠區
  $('#col2').html(`${i18n.t('Vendor Company ID')}`) //公司統編
  $('#col3').html(`${i18n.t('Vendor Company Name')}`) //公司名稱
  $('#col4').html(`${i18n.t('Vendor NO')}`) //駐廠人員編號
  $('#col5').html(`${i18n.t('Vendor Name')}`) //駐廠人員姓名
  $('#col6').html(`${i18n.t('Check-In Time')}`) //進廠時間
  $('#col7').html(`${i18n.t('Check-Out Time')}`) //離廠時間
  $('#col8').html(`${i18n.t('Receptionist Employee')}`) //接待員工
  $('#col9').html(`${i18n.t('Department ID')}`) //部門代碼
  $('#col10').html(`${i18n.t('Department')}`) //部門名稱

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

  $(document).attr('title', i18n.t('On-Site Person Resident Status')) // 修改網頁標題

  // 切換中英重新搜尋結果
  if (onload) {
    seach_value()
  }
}

LangChange()

if (TestOrTSMC == 0) {
  // 測試用
  // for (i = 0; i < 15; i++) {
  //   $('#person_enter_form').append(`
  //     <tr class="">
  //       <td>rSiteCode rSiteCode rSiteCode</td>
  //       <td>companyId companyId companyId</td>
  //       <td>companyName companyName companyName</td>
  //       <td>userId userId userId</td>
  //       <td>userName userName userName</td>
  //       <td>inTime inTime inTime</td>
  //       <td>outTime outTime outTime</td>
  //       <td>receptionEmpl receptionEmpl receptionEmpl</td>
  //       <td>deptId deptId deptId</td>
  //       <td>deptName deptName deptName</td>
  //     </tr>
  //   `)
  // }
  // $('#person_table').tablepage($("#table_btn_group"), 10)
}

let printContent
// 列印功能(用開始新tab的方式，新建一個<table>並事先放入 result 直接 onload=print())
var clientPrint = (obj) => {
  printContent = `
    <table>
      <thead class="text_center bgc-orange fixTable">
        <tr>
          <th scope="col" id="col1">${i18n.t('Factory')}</th>
          <th scope="col" id="col2">${i18n.t('Vendor Company ID')}</th>
          <th scope="col" id="col3">${i18n.t('Vendor Company Name')}</th>
          <th scope="col" id="col4">${i18n.t('Vendor NO')}</th>
          <th scope="col" id="col5">${i18n.t('Vendor Name')}</th>
          <th scope="col" id="col6">${i18n.t('Check-In Time')}</th>
          <th scope="col" id="col7">${i18n.t('Check-Out Time')}</th>
          <th scope="col" id="col8">${i18n.t('Receptionist Employee')}</th>
          <th scope="col" id="col9">${i18n.t('Department ID')}</th>
          <th scope="col" id="col10">${i18n.t('Department')}</th>
        </tr>
      </thead>
      <tbody>`
  for (i = 0; i < obj.length; i++) {
    printContent += `
      <tr>
        <td>${i18n.t(obj[i].areaName)}</td>
        <td>${obj[i].companyId == null ? "" : obj[i].companyId}</td>
        <td>${obj[i].companyName == null ? "" : obj[i].companyName}</td>
        <td>${obj[i].userId}</td>
        <td>${obj[i].userName}</td>
        <td>${obj[i].inTime == null ? "" : obj[i].inTime}</td>
        <td>${obj[i].outTime == null ? "" : obj[i].outTime}</td>
        <td>${obj[i].receptionEmpl}</td>
        <td>${obj[i].deptId}</td>
        <td>${obj[i].deptName}</td>
      </tr>`
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
          <th scope="col" id="col2">${i18n.t('Vendor Company ID')}</th>
          <th scope="col" id="col3">${i18n.t('Vendor Company Name')}</th>
          <th scope="col" id="col4">${i18n.t('Vendor NO')}</th>
          <th scope="col" id="col5">${i18n.t('Vendor Name')}</th>
          <th scope="col" id="col6">${i18n.t('Check-In Time')}</th>
          <th scope="col" id="col7">${i18n.t('Check-Out Time')}</th>
          <th scope="col" id="col8">${i18n.t('Receptionist Employee')}</th>
          <th scope="col" id="col9">${i18n.t('Department ID')}</th>
          <th scope="col" id="col10">${i18n.t('Department')}</th>
        </tr>
      </thead>
      <tbody>
  `)
  if (obj) {
    for (i = 0; i < obj.length; i++) {
      $('#tableExport').append(`
        <tr>
          <td>${i18n.t(obj[i].areaName)}</td>
          <td>${obj[i].companyId == null ? "" : obj[i].companyId}</td>
          <td>${obj[i].companyName == null ? "" : obj[i].companyName}</td>
          <td>${obj[i].userId}</td>
          <td>${obj[i].userName}</td>
          <td>${obj[i].inTime == null ? "" : obj[i].inTime}</td>
          <td>${obj[i].outTime == null ? "" : obj[i].outTime}</td>
          <td>${obj[i].receptionEmpl}</td>
          <td>${obj[i].deptId}</td>
          <td>${obj[i].deptName}</td>
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
          <td>deptName deptName deptName</td>
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