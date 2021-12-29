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

let checked = $('[name="setting"]:checked').val()

$(document).ready(function () {
  change_radio()
  $('[name="setting"]').change(function () {
    clear_value()
    checked = $('[name="setting"]:checked').val()
    change_radio()
  })
})

$("#bttn_submit2").click(() => {
  seach_value()
})

let row_setting = 10 // 表格一次呈現多少列
var setPage = 10
let ajax_num
let getData
let rSiteCode = getCookie('rSiteCode')

function seach_value(offset, limit, pageIndex) {
  clear_value()
  if (offset < 0) {
    offset = 0
  }
  let AccountName = getCookie('AccountName')
  acdn = getCookie('acdn')
  console.log(rSiteCode)
  if (checked == 1) {
    let value = JSON.stringify({
      AccountName: AccountName,
      token: acdn,
      userRole: getCookie("role"),
    })
    console.log(value)
    $.ajax({
      url: `${WEBAPI_ip}/api/report/vendor/empl/number`,
      type: "POST",
      async: true,
      dataType: 'JSON',
      contentType: 'application/json;charset=utf-8',
      data: value,
      success: function (res) {
        console.log(res)
        if (res.StatusCode == 1) {
          getData = res.ContentObject.VendorEmpl_Number
          $('#person_total_list_form').append(`
            <tr class="text_center">
              <td scope="col">${i18n.t(rSiteCode)}</td>
              <td scope="col">${getData}</td>
            </tr>
          `)
          ajax_num = getData
          clientPrint(getData)
          exportReportToExcelClient(getData)
        } else if (res.StatusCode == -2 | res.StatusCode == -3) {
          $("#dia_content").html(`
              <span>${i18n.t('Token Expired or Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
            `)
          $("#dialog").dialog("open")
          $('#next').click(() => {
            redirectA4()
          })
        } else {
          $('#person_total_list_form').append(`
            <tr class="text_center">
              <td scope="col" colspan="12" id="result">${i18n.t('NO Result')}</td>
            </tr>
          `)
        }
      },
      error: function (xhr) {
        $("#dia_content").html(`
          <span>${i18n.t('Other Error')}, ${i18n.t('Error Code: ')}${xhr.status}</span>
        `)
        $("#dialog").dialog("open")
      }
    })
  } else if (checked == 2) {
    let value = JSON.stringify({
      AccountName: AccountName,
      token: acdn,
      userRole: getCookie("role"),
      offset: offset == undefined ? 0 : offset,
      limit: offset == undefined ? 100 : limit,
    })
    console.log(value)
    $.ajax({
      url: `${WEBAPI_ip}/api/report/vendor/empl`,
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
              $('#person_total_list_form').append(`
                <tr title="${i + 1} ${i18n.t("Line")}">
                  <td scope="col">${getData[i].vendorEmpl_No}</td>
                  <td scope="col">${getData[i].vendorEmpl_Name}</td>
                  <td scope="col">${getData[i].companyId}</td>
                  <td scope="col">${getData[i].companyName}</td>
                  <td scope="col">${getData[i].deptName}</td>
                  <td scope="col">${getData[i].receptionEmpl}</td>
                  <td scope="col">${getData[i].receptionEmpl_Name}</td>
                  <td scope="col">${getData[i].inTime}</td>
                  <td scope="col">${getData[i].insiteTime}</td>
                  <td scope="col">${getData[i].isCleanRoom == 0 ? i18n.t('Not') : i18n.t(getData[i].isCleanRoom.toString())}</td>
                  <td scope="col">${getData[i].inCleanRoomTime == null ? "" : getData[i].inCleanRoomTime}</td>
                </tr>
              `)
              // $('#person_total_list_form').append(`
              //   <tr class="">
              //     <td scope="col"></td>
              //     <td scope="col">${getData[i].vendorEmpl_No}</td>
              //     <td scope="col">${getData[i].vendorEmpl_Name}</td>
              //     <td scope="col">${getData[i].companyId}</td>
              //     <td scope="col">${getData[i].companyName}</td>
              //     <td scope="col">${getData[i].deptName}</td>
              //     <td scope="col">${getData[i].receptionEmpl}</td>
              //     <td scope="col">${getData[i].receptionEmpl_Name}</td>
              //     <td scope="col">${getData[i].inTime}</td>
              //     <td scope="col">${getData[i].insiteTime}</td>
              //     <td scope="col">${getData[i].isCleanRoom == 0 ? i18n.t('Not') : getData[i].isCleanRoom}</td>
              //     <td scope="col">${getData[i].inCleanRoomTime == null ? "" : getData[i].inCleanRoomTime}</td>
              //   </tr>
              // `)
            }
            if (limit == undefined) {
              $('#person_total_list_talbe').tablepage($("#table_btn_group"), row_setting, setPage, ajax_num, true, pageIndex)
            }
            else if (limit == row_setting * 10) {
              $('#person_total_list_talbe').tablepage($("#table_btn_group"), row_setting, setPage, ajax_num, false, pageIndex)
            }
            else {
              $('#person_total_list_talbe').tablepage($("#table_btn_group"), row_setting, limit, ajax_num, false, pageIndex)
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
        } else {
          $('#person_total_list_form').append(`
            <tr class="text_center">
              <td scope="col" colspan="12" id="result">${i18n.t('NO Result')}</td>
            </tr>
          `)
        }
      },
      error: function (xhr) {
        $("#dia_content").html(`
          <span>${i18n.t('Other Error')}, ${i18n.t('Error Code: ')}${xhr.status}</span>
        `)
        $("#dialog").dialog("open")
      }
    })
  }
}

function clear_value() {
  $('#seach_res').html('')
  $('#person_total_list_talbe').html(`
    <thead class="text_center bgc-orange fixTable" id="person_total_list_title">
    </thead>
    <tbody id="person_total_list_form">
    </tbody>
  `)
  onload = false
  change_radio()
}

function change_radio() {
  if (checked == 1) {
    console.log(checked)
    $('#person_total_list_title').html(`
      <tr>
        <th scope="col" id="col1">${i18n.t('Factory')}</th>
        <th scope="col" id="col2">${i18n.t('Total Staff')}</th>
      </tr>
    `)
    $('#table_btn_group').html('')
    onload = false
  } else if (checked == 2) {
    console.log(checked)
    $('#person_total_list_title').html(`
      <tr>
        <th scope="col" id="col4">${i18n.t('Vendor NO')}</th>
        <th scope="col" id="col5">${i18n.t('Vendor Name')}</th>
        <th scope="col" id="col6">${i18n.t('Vendor Company ID')}</th>
        <th scope="col" id="col7">${i18n.t('Vendor Company Name')}</th>
        <th scope="col" id="col8">${i18n.t('Department')}</th>
        <th scope="col" id="col9">${i18n.t('Receptionist ID')}</th>
        <th scope="col" id="col10">${i18n.t('Receptionist')}</th>
        <th scope="col" id="col11">${i18n.t('Check-In Time')}</th>
        <th scope="col" id="col12">${i18n.t('Staying Time')}</th>
        <th scope="col" id="col13">${i18n.t('Enter Cleanroom')}</th>
        <th scope="col" id="col14">${i18n.t('Enter Cleanroom Time')}</th>
      </tr>
    `)
    // $('#person_total_list_title').html(`
    //   <tr>
    //     <th scope="col" id="col3">${i18n.t('Reserve Category')}</th>
    //     <th scope="col" id="col4">${i18n.t('Vendor NO')}</th>
    //     <th scope="col" id="col5">${i18n.t('Vendor Name')}</th>
    //     <th scope="col" id="col6">${i18n.t('Vendor Company ID')}</th>
    //     <th scope="col" id="col7">${i18n.t('Vendor Company Name')}</th>
    //     <th scope="col" id="col8">${i18n.t('Department')}</th>
    //     <th scope="col" id="col9">${i18n.t('Receptionist ID')}</th>
    //     <th scope="col" id="col10">${i18n.t('Receptionist')}</th>
    //     <th scope="col" id="col11">${i18n.t('Check-In Time')}</th>
    //     <th scope="col" id="col12">${i18n.t('Staying Time')}</th>
    //     <th scope="col" id="col13">${i18n.t('Enter Cleanroom')}</th>
    //     <th scope="col" id="col14">${i18n.t('Enter Cleanroom Time')}</th>
    //   </tr>
    // `)
    onload = false
  }
}

// 設定語言
function LangChange() {
  LangInit()
  // 重新渲染網頁文字
  $('#title1').html(`${i18n.t('Resident On-Site Person Statistics')}`) //駐廠人員今日進廠記錄查詢
  $('#title2').html(`${i18n.t('Factory')}`) //廠區
  $('#title3').html(`${i18n.t('Query Data')}`) //查詢資訊
  $('#title4').html(`${i18n.t('Number Of On-Site Vendor')}`) //廠內廠商人數
  $('#title5').html(`${i18n.t('List Of On-Site Vendor')}`) //廠內廠商列表

  $('#result').html(`${i18n.t('Result')}`) //查詢結果
  // $('#title7').html(`${i18n.t('Custom display number')}`) //自訂顯示筆數
  $('#export').html(`${i18n.t('Export XLS')}`) //匯出XLS
  $('#printbtn').html(`${i18n.t('Print')}`) //列印

  $('#col1').html(`${i18n.t('Factory')}`) //廠區
  $('#col2').html(`${i18n.t('Total Staff')}`) //公司統編

  $('#col3').html(`${i18n.t('Reserve Category')}`) //
  $('#col4').html(`${i18n.t('Vendor NO')}`) //
  $('#col5').html(`${i18n.t('Vendor Name')}`) //
  $('#col6').html(`${i18n.t('Vendor Company ID')}`) //
  $('#col7').html(`${i18n.t('Vendor Company Name')}`) //
  $('#col8').html(`${i18n.t('Department')}`) //
  $('#col9').html(`${i18n.t('Receptionist ID')}`) //
  $('#col10').html(`${i18n.t('Receptionist')}`) //
  $('#col11').html(`${i18n.t('Check-In Time')}`) //
  $('#col12').html(`${i18n.t('Staying Time')}`) //
  $('#col13').html(`${i18n.t('Enter Cleanroom')}`) //
  $('#col14').html(`${i18n.t('Enter Cleanroom Time')}`) //


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

  $(document).attr('title', i18n.t('Resident On-Site Person Statistics')) // 修改網頁標題

  // 切換中英重新搜尋結果
  if (onload) {
    seach_value()
  }
}

LangChange()

// 測試用
if (TestOrTSMC == 0) {
  $('[name="setting"]').change(() => {
    checked = $('[name="setting"]:checked').val()
    if (checked == 1) {
      clear_value()
      console.log(checked)
      $('#person_total_list_form').append(`
          <tr class="text_center">
            <td scope="col">rSiteCode rSiteCode</td>
            <td scope="col">getData getData</td>
          </tr>
        `)
      // $('#person_total_list_talbe').tablepage($("#table_btn_group"), 10)
    } else if (checked == 2) {
      console.log(checked)
      clear_value()
      for (i = 0; i < 18; i++) {
        $('#person_total_list_form').append(`
            <tr class="">
              <td scope="col">vendorEmpl_No vendorEmpl_No vendorEmpl_NovendorEmpl_No</td>
              <td scope="col">vendorEmpl_Name vendorEmpl_Name vendorEmpl_Name vendorEmpl_Name</td>
              <td scope="col">companyId companyId companyId companyId</td>
              <td scope="col">companyName companyName companyName companyName</td>
              <td scope="col">deptName deptName deptName deptName</td>
              <td scope="col">receptionEmpl receptionEmpl receptionEmpl receptionEmpl</td>
              <td scope="col">receptionEmpl_Name receptionEmpl_Name receptionEmpl_Name</td>
              <td scope="col">inTime inTime inTime inTime</td>
              <td scope="col">insiteTime insiteTime insiteTime</td>
              <td scope="col">isCleanRoom isCleanRoom isCleanRoom</td>
              <td scope="col">inCleanRoomTime inCleanRoomTime inCleanRoomTime</td>
            </tr>
          `)
      }
      $('#person_total_list_talbe').tablepage($("#table_btn_group"), 10)
    }
  })

} else if (TestOrTSMC == 1) {
  seach_value()
}




let printContent
// 列印功能(用開始新tab的方式，新建一個<table>並事先放入 result 直接 onload=print())
var clientPrint = (obj) => {
  if (checked == 1) {
    printContent = `
      <table>
        <thead class="text_center bgc-orange fixTable">
          <tr>
            <th scope="col" id="col1">${i18n.t('Factory')}</th>
            <th scope="col" id="col2">${i18n.t('Total Staff')}</th>
          </tr>
          </thead>
          <tbody>
    `
    console.log(printContent)
    for (i = 0; i < 1; i++) {
      printContent += `
          <tr class="text_center">
            <td scope="col">${i18n.t(rSiteCode)}</td>
            <td scope="col">${obj}</td>
          </tr>
        `
    }
  } else if (checked == 2) {
    printContent = `
  <table>
    <thead class="text_center bgc-orange fixTable">
      <tr>
        <th scope="col" id="col4">${i18n.t('Vendor NO')}</th>
        <th scope="col" id="col5">${i18n.t('Vendor Name')}</th>
        <th scope="col" id="col6">${i18n.t('Vendor Company ID')}</th>
        <th scope="col" id="col7">${i18n.t('Vendor Company Name')}</th>
        <th scope="col" id="col8">${i18n.t('Department')}</th>
        <th scope="col" id="col9">${i18n.t('Receptionist ID')}</th>
        <th scope="col" id="col10">${i18n.t('Receptionist')}</th>
        <th scope="col" id="col11">${i18n.t('Check-In Time')}</th>
        <th scope="col" id="col12">${i18n.t('Staying Time')}</th>
        <th scope="col" id="col13">${i18n.t('Enter Cleanroom')}</th>
        <th scope="col" id="col14">${i18n.t('Enter Cleanroom Time')}</th>
      </tr>
      </thead>
      <tbody>
    `

    if (obj) {
      for (i = 0; i < obj.length; i++) {
        printContent += `
        <tr>
          <td scope="col">${obj[i].vendorEmpl_No}</td>
          <td scope="col">${obj[i].vendorEmpl_Name}</td>
          <td scope="col">${obj[i].companyId}</td>
          <td scope="col">${obj[i].companyName}</td>
          <td scope="col">${obj[i].deptName}</td>
          <td scope="col">${obj[i].receptionEmpl}</td>
          <td scope="col">${obj[i].receptionEmpl_Name}</td>
          <td scope="col">${obj[i].inTime}</td>
          <td scope="col">${obj[i].insiteTime}</td>
          <td scope="col">${obj[i].isCleanRoom == 0 ? i18n.t('Not') : i18n.t(obj[i].isCleanRoom.toString())}</td>
          <td scope="col">${obj[i].inCleanRoomTime == null ? "" : obj[i].inCleanRoomTime}</td>
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
  // $('#tableExport').html(`
  //   <table id="table">
  //     <thead class="text_center bgc-orange fixTable">
  //       <tr>
  //         <th scope="col" id="col7">${i18n.t('Vendor Name')}</th>
  //         <th scope="col" id="col8">${i18n.t('Vendor ID/User ID')}</th>
  //         <th scope="col" id="col9">${i18n.t('Vendor Company Name')}</th>
  //         <th scope="col" id="col10">${i18n.t('Vendor Card ID')}</th>
  //         <th scope="col" id="col2">${i18n.t('Date Card')}</th>
  //         <th scope="col" id="col3">${i18n.t('Factory')}</th>
  //         <th scope="col" id="col4">${i18n.t('Check In/Out')}</th>
  //         <th scope="col" id="col5">${i18n.t('Description')}</th>
  //         <th scope="col" id="col6">${i18n.t('Check-In/Out Computer Name')}</th>
  //       </tr>
  //     </thead>
  //     <tbody>
  //     </tbody>
  // `)
  // if (obj) {
  //   for (i = 0; i < obj.length; i++) {
  //     $('#tableExport').append(`
  //       <tr>
  //         <td>${obj[i].userName}</th>
  //         <td>${obj[i].userId}</td>
  //         <td>${obj[i].companyName}</td>
  //         <td>${obj[i].cardId}</td>
  //         <td>${obj[i].cardTime}</td>
  //         <td>${i18n.t(obj[i].areaName == null ? "" : obj[i].areaName)}</td>
  //         <td>${obj[i].enable_disable == 1 ? i18n.t('Card Disable') : i18n.t('Card Enable')}</td>
  //         <td>${obj[i].description == "" ? i18n.t('Success') : obj[i].description}</td>
  //         <td>${obj[i].computerName.toUpperCase()}</td>
  //       </tr>`
  //     )
  //   }
  // } else {
  //   for (i = 0; i < 100; i++) {
  //     $('#tableExport').append(`
  //       <tr>
  //         <td>areaName areaName areaName</td>
  //         <td>companyId companyId companyId</td>
  //         <td>companyName companyName companyName</td>
  //         <td>userId userId userId</td>
  //         <td>userName userName userName</td>
  //         <td>inTime inTime inTime</td>
  //         <td>outTime outTime outTime</td>
  //         <td>receptionEmpl receptionEmpl receptionEmpl</td>
  //         <td>deptId deptId deptId</td>
  //       </tr>`
  //     )
  //   }
  // }
  // $('#tableExport').append(`
  // </tbody>
  // </table>
  // `)
  $('#tableExport').html(printContent)
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