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

// $("#bttn_submit2").click(() => {
//   seach_value()
// })

let checked = $('[name="setting"]:checked').val()


// 預設查詢的時間
let dt = new Date()
let submit_year, submit_month, table_day
table_day = new Date(dt.getFullYear(), dt.getMonth() + 1, 0)

// 設定INPUT當前時間
$(document).ready(() => {
  submit_year = dt.getFullYear()
  submit_month = paddingLeft((dt.getMonth() + 1).toString(), 2)
  $('#month')[0].value = `${submit_year}-${submit_month}`
  // $('#month').val(new Date().toDateInputValueMonth()) // 實驗性功能

  $('#month').change(() => {
    submit_year = $('#month').val().split('-')[0]
    submit_month = $('#month').val().split('-')[1]
  })
  if (TestOrTSMC == 1) {
    seach_value(checked)
  } else if (TestOrTSMC == 0) {
    ChangeValue()
  }
})

function seach_value(checked) {

  submit_year = $('#month').val().split('-')[0]
  submit_month = $('#month').val().split('-')[1]
  table_day = new Date(submit_year, submit_month, 0)

  clear_value(table_day)

  let getData
  let AccountName = getCookie('AccountName')
  acdn = getCookie('acdn')

  let value = JSON.stringify({
    AccountName: AccountName,
    token: acdn,
    userRole: getCookie("role"),
    year: submit_year,
    month: submit_month,
  })
  console.log(value)

  if (checked == 1) {
    $.ajax({
      url: `${WEBAPI_ip}/api/report/check/inout/count`,
      type: "POST",
      async: true,
      dataType: 'JSON',
      contentType: 'application/json;charset=utf-8',
      data: value,
      success: function (res) {
        console.log(res)
        if (res.StatusCode == 1) {
          getData = res.ContentObject
          $("#seach_res").html(`${i18n.t(', Total:')}${getData.length}`)
          for (i = 0; i < getData.length; i++) {
            // 先建立一個ROW
            $('#card_statistics_list_form').append(`
              <tr class="" id="list_${i}">
                <td scope="col">${i18n.t(getData[i].areaName == null ? "" : getData[i].areaName)}</td>
                <td scope="col">${getData[i].computerName.toUpperCase()}</td>
              </tr>
            `)
            //
            // $('#card_statistics_list_form').append(`
            //   <tr class="" id="list_${i}">
            //     <td scope="col">${i18n.t(getData[i].areaName == null ? "" : getData[i].areaName)}</td>
            //     <td scope="col">${getData[i].computerName.toUpperCase()}</td>
            //     <td scope="col"></td>
            //   </tr>
            // `)
            // 針對上個ROW塞入值
            for (j = 0; j < getData[i].CheckInOutCountList.length; j++) {
              $(`#list_${i}`).append(`
                <td scope="col">${getData[i].CheckInOutCountList[j].openCount}</td>
                <td scope="col">${getData[i].CheckInOutCountList[j].closeCount}</td>
              `)
            }
          }
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
          $("#dia_content").html(`
              <span>${i18n.t('Other Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
            `)
          $("#dialog").dialog("open")
        }
      },
      error: function (xhr) {
        $("#dia_content").html(`
            <span>${i18n.t('Other Error')}, ${i18n.t('Error Code: ')}${xhr.status}</span>
          `)
        $("#dialog").dialog("open")
      },
    })
  } else if (checked == 2) {
    $.ajax({
      url: `${WEBAPI_ip}/api/report/check/inout/number`,
      type: "POST",
      async: true,
      dataType: 'JSON',
      contentType: 'application/json;charset=utf-8',
      data: value,
      success: function (res) {
        console.log(res)
        if (res.StatusCode == 1) {
          getData = res.ContentObject
          $("#seach_res").html(`,共${getData.length}筆`)
          for (i = 0; i < getData.length; i++) {
            // 先建立一個ROW
            $('#card_statistics_list_form').append(`
              <tr class="" id="list_${i}">
                <td scope="col">${i18n.t(getData[i].areaName == null ? "" : getData[i].areaName)}</td>
                <td scope="col">${getData[i].computerName.toUpperCase()}</td>
              </tr>
            `)
            // $('#card_statistics_list_form').append(`
            //   <tr class="" id="list_${i}">
            //     <td scope="col">${i18n.t(getData[i].areaName == null ? "" : getData[i].areaName)}</td>
            //     <td scope="col">${getData[i].computerName.toUpperCase()}</td>
            //     <td scope="col"></td>
            //   </tr>
            // `)
            // 針對上個ROW塞入值
            for (j = 0; j < getData[i].CheckInOutCountList.length; j++) {
              $(`#list_${i}`).append(`
                <td scope="col">${getData[i].CheckInOutCountList[j].openCount}</td>
                <td scope="col">${getData[i].CheckInOutCountList[j].closeCount}</td>
              `)
            }
          }
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
          $("#dia_content").html(`
              <span>${i18n.t('Other Error')}, ${i18n.t('Error Code: ')}${res.StatusCode}</span>
            `)
          $("#dialog").dialog("open")
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
// }

function clear_value(table_day) {
  console.log(table_day.getDate())
  $('#seach_res').html('')
  $('#card_statistics_list_talbe').html(`
    <thead class="text_center bgc-orange fixTable" id="card_statistics_list_title">
    <tr id="tr01">
      <th scope="col" rowspan="2" id="col1">${i18n.t('Factory')}</th>
      <th scope="col" rowspan="2" id="col2">${i18n.t('Computer Name')}</th>
  `)
  // $('#card_statistics_list_talbe').html(`
  // <thead class="text_center bgc-orange fixTable" id="card_statistics_list_title">
  // <tr id="tr01">
  //   <th scope="col" rowspan="2" id="col1">${i18n.t('Factory')}</th>
  //   <th scope="col" rowspan="2" id="col2">${i18n.t('Computer Name')}</th>
  //   <th scope="col" rowspan="2" id="col3">${i18n.t('Check Point')}</th>
  // `)
  for (i = 0; i < table_day.getDate(); i++) {
    $('#tr01').append(`
      <th colspan="2">${i + 1}</th>
    `)
  }
  $('#card_statistics_list_title').append(`
    </tr>
    <tr id="tr02">
  `)
  for (i = 0; i < table_day.getDate(); i++) {
    $('#tr02').append(`
      <td class="opentd">${i18n.t('Open')}</td>
      <td class="closetd">${i18n.t('Close')}</td>
    `)
  }
  $('#card_statistics_list_talbe').append(`
    </tr>
    </thead>
    <tbody class="" id="card_statistics_list_form">
    </tbody>
  `)

  // change_radio()
}

// function change_radio() {
//   // console.log(checked)
//   $('#card_statistics_list_title').html(`
//     <tr>
//       <th scope="col" rowspan="2">${i18n.t('Factory')}</th>
//       <th scope="col" rowspan="2">${i18n.t('Computer Name')}</th>
//   `)
//   // $('#card_statistics_list_title').html(`
//   //   <tr>
//   //     <th scope="col" rowspan="2">${i18n.t('Factory')}</th>
//   //     <th scope="col" rowspan="2">${i18n.t('Computer Name')}</th>
//   //     <th scope="col" rowspan="2">${i18n.t('Check Point')}</th>
//   // `)
//   for (i = 0; i < table_day.getDate(); i++) {
//     $('#card_statistics_list_title').append(`
//       <th>${i}</th>
//     `)
//   }
//   $('#card_statistics_list_title').append(`
//     </tr>
//     <tr>
//       <th>${i18n.t('Open')}</th>
//       <th>${i18n.t('Close')}</th>
//     </tr>
//   `)
// }

// function clear_input() {
//   $('[type="month"]').val('')
// }

// function clear_all() {
//   clear_value()
//   clear_input()
// }


// 設定語言
function LangChange() {
  LangInit()
  // 重新渲染網頁文字
  $('#title1').html(`${i18n.t('Check In/Out Counter Statistics')}`) //各開關卡點廠商刷卡統計表
  $('#title2').html(`${i18n.t('Factory')}`) //廠別:
  $('#title3').html(`${i18n.t('Month')}`) //查詢月份:
  $('#title4').html(`${i18n.t('Query Data')}`) //查詢資訊:
  $('#title5').html(`${i18n.t('By Numbers')}`) //依人數
  $('#title6').html(`${i18n.t('By Times')}`) //依人次

  $('#result').html(`${i18n.t('Result')}`) //查詢結果
  $('#export').html(`${i18n.t('Export XLS')}`) //匯出XLS
  $('#printbtn').html(`${i18n.t('Print')}`) //列印

  $('#col1').html(`${i18n.t('Factory')}`) //廠區
  $('#col2').html(`${i18n.t('Computer Name')}`) //電腦名稱
  $('#col3').html(`${i18n.t('Check Point')}`) //開關卡點

  $('.opentd').html(`${i18n.t('Open')}`) //開
  $('.closetd').html(`${i18n.t('Close')}`) //關

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
  $('#result').html(`${i18n.t('NO Result')}`) //查詢結果

  // $('#select option[value="1"]').text(`${i18n.t('FAB AP03')}`)
  $('#select').val(`${i18n.t('FAB AP03')}`)

  $(document).attr('title', i18n.t('Check In/Out Counter Statistics')) // 修改網頁標題
}
LangChange()

// 測試用
var ChangeValue = () => {
  checked = $('[name="setting"]:checked').val()

  submit_year = $('#month').val().split('-')[0]
  submit_month = $('#month').val().split('-')[1]
  table_day = new Date(submit_year, submit_month, 0)
  clear_value(table_day)
  console.log(checked)

  console.log(submit_year)
  console.log(submit_month)

  for (i = 0; i < 5; i++) {
    // 先建立一個ROW
    $('#card_statistics_list_form').append(`
        <tr class="" id="list_${i}">
          <td scope="col">rSiteCode</td>
          <td scope="col">computerName</td>
        </tr>
      `)
    // 針對上個ROW塞入值
    for (j = 0; j < table_day.getDate(); j++) {
      $(`#list_${i}`).append(`
          <td scope="col">open</td>
          <td scope="col">close</td>
        `)
    }
  }
}

if (TestOrTSMC == 0) {
  $('[name="setting"]').change(() => {
    ChangeValue()
  })
  $('#month').change(() => {
    ChangeValue()
  })

} else if (TestOrTSMC == 1) {
  $('[name="setting"]').change(() => {
    checked = $('[name="setting"]:checked').val()
    seach_value(checked)
  })
  $('#month').change(() => {
    checked = $('[name="setting"]:checked').val()
    seach_value(checked)
  })
}

let printContent
// 列印功能(用開始新tab的方式，新建一個<table>並事先放入 result 直接 onload=print())
var clientPrint = (obj) => {
  /* 標題區塊 */
  printContent = `
    <table>
    <thead class="text_center bgc-orange fixTable" id="card_statistics_list_title">
      <tr id="table01">
        <th scope="col" rowspan="2" id="col1">${i18n.t('Factory')}</th>
        <th scope="col" rowspan="2" id="col2">${i18n.t('Computer Name')}</th>
  `
  for (i = 0; i < table_day.getDate(); i++) {
    printContent += `
      <th colspan="2">${i + 1}</th>
    `
  }
  printContent += `
    </tr>
    <tr id="table02">
  `
  for (i = 0; i < table_day.getDate(); i++) {
    printContent += `
      <td class="opentd">${i18n.t('Open')}</td>
      <td class="closetd">${i18n.t('Close')}</td>
    `
  }
  printContent += `
       </tr>
      </thead>
    <tbody>
    </tbody>
  `
  /* 標題區塊 */
  if (obj) {
    for (i = 0; i < obj.length; i++) {
      // 先建立一個ROW
      printContent += `
        <tr id="list_${i}">
          <td scope="col">${i18n.t(obj[i].areaName == null ? "" : obj[i].areaName)}</td>
          <td scope="col">${obj[i].computerName.toUpperCase()}</td>
        </tr>
      `
      // 針對上個ROW塞入值
      for (j = 0; j < obj[i].CheckInOutCountList.length; j++) {
        printContent += `
          <td scope="col">${obj[i].CheckInOutCountList[j].openCount}</td>
          <td scope="col">${obj[i].CheckInOutCountList[j].closeCount}</td>
        `
      }
    }
    printContent += `
      </tbody>
      </table>`
    console.log(printContent)
  } else {
    for (i = 0; i < 15; i++) {
      // 先建立一個ROW
      printContent += `
        <tr id="list_${i}">
          <td scope="col">${i}</td>
          <td scope="col">${i}</td>
        </tr>
      `
      // 針對上個ROW塞入值
      for (j = 0; j < 30; j++) {
        printContent += `
          <td scope="col">A-${j}</td>
          <td scope="col">B-${j}</td>
        `
      }
    }
    printContent += `
      </tbody>
      </table>`
    // console.log(printContent)
  }
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
  /* 標題區塊 */
  printContent = `
    <table>
    <thead class="text_center bgc-orange fixTable" id="card_statistics_list_title">
      <tr id="table01">
        <th scope="col" rowspan="2" id="col1">${i18n.t('Factory')}</th>
        <th scope="col" rowspan="2" id="col2">${i18n.t('Computer Name')}</th>
  `
  for (i = 0; i < table_day.getDate(); i++) {
    printContent += `
      <th colspan="2">${i + 1}</th>
    `
  }
  printContent += `
    </tr>
    <tr id="table02">
  `
  for (i = 0; i < table_day.getDate(); i++) {
    printContent += `
      <td class="opentd">${i18n.t('Open')}</td>
      <td class="closetd">${i18n.t('Close')}</td>
    `
  }
  printContent += `
       </tr>
      </thead>
  `
  /* 標題區塊 END */

  if (obj) {
    for (i = 0; i < obj.length; i++) {
      // 先建立一個ROW
      printContent += `
        <tr id="list_${i}">
          <td scope="col">${i18n.t(obj[i].areaName == null ? "" : obj[i].areaName)}</td>
          <td scope="col">${obj[i].computerName.toUpperCase()}</td>
      `
      // 針對上個ROW塞入值
      for (j = 0; j < obj[i].CheckInOutCountList.length; j++) {
        printContent += `
          <td scope="col">${obj[i].CheckInOutCountList[j].openCount}</td>
          <td scope="col">${obj[i].CheckInOutCountList[j].closeCount}</td>
        `
      }
      printContent += `
        </tr>
      `
    }
  } else {
    printContent += `
      <tbody>
    `
    for (i = 0; i < 100; i++) {
      printContent += `
        <tr id="list_${i}">
          <td scope="col">AAAA-${i}</td>
          <td scope="col">BBBB-${i}</td>
      `
      // 針對上個ROW塞入值
      for (j = 0; j < table_day.getDate(); j++) {
        printContent += `
          <td scope="col">開</td>
          <td scope="col">關</td>
        `
      }
      printContent += `
        </tr>
      `
    }
  }
  printContent += `
      </tbody>
    </table>
  `
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