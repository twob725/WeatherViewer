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

$('#input_value').focus()

// 偵測ENTER鍵
//#inputTarget是你input的ID
$("#input_value").keypress(function (e) {
  code = (e.keyCode ? e.keyCode : e.which);
  if (code == 13) {
    //bttn_submit是按鈕名稱
    $("#bttn_submit").click();
  }
})
$('[name="setting"]').keypress(function (e) {
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
var setPage = 10 // 表格一次呈現多少頁
let ajax_num

let getData // 從WEBAPI取得回來的資料
// let table_count = 50
function seach_value(offset, limit, pageIndex) {
  clear_value()
  getData = []
  if (offset < 0) {
    offset = 0
  }
  console.log('seach_value:offset' + offset)
  if ($("#input_value").val()) {
    let AccountName = getCookie('AccountName')
    acdn = getCookie('acdn')
    let target_url = $('[name="setting"]:checked').val()
    let value = {}

    if (target_url == "door") {
      value = {
        AccountName: AccountName,
        token: acdn,
        userRole: getCookie("role"),
        doorName: $('#input_value').val(),
        offset: offset == undefined ? 0 : offset,
        limit: offset == undefined ? 100 : limit,
      }
    } else if (target_url == "clearance") {
      value = {
        AccountName: AccountName,
        token: acdn,
        userRole: getCookie("role"),
        clearanceName: $('#input_value').val(),
        offset: offset == undefined ? 0 : offset,
        limit: offset == undefined ? 100 : limit,
      }
    } else if (target_url == "doorgroup") {
      value = {
        AccountName: AccountName,
        token: acdn,
        userRole: getCookie("role"),
        doorgroupName: $('#input_value').val(),
        offset: offset == undefined ? 0 : offset,
        limit: offset == undefined ? 100 : limit,
      }
    }
    value = JSON.stringify(value)
    console.log(value)
    // 取得結果總筆數 API
    $.ajax({
      url: `${WEBAPI_ip}/api/data/access/control/${target_url}/name/number`,
      type: "POST",
      async: true,
      dataType: 'JSON',
      contentType: 'application/json;charset=utf-8',
      data: value,
      success: function (res) {
        console.log(res)
        if (res.ContentObject.length > 1) { // 因應API回傳為Object
          ajax_num = res.ContentObject.length
        } else {
          ajax_num = res.ContentObject
        }

        $.ajax({
          url: `${WEBAPI_ip}/api/data/access/control/${target_url}/name`,
          type: "POST",
          async: true,
          dataType: 'JSON',
          contentType: 'application/json;charset=utf-8',
          data: value,
          success: function (res) {
            console.log(res)
            if (res.StatusCode == 1) { // 回傳資料成功
              getData = res.ContentObject
              if (getData) {
                // 廠商基本通行權
                $("#seach_res").html(`,共${getData.length}筆`)
                if (getData.length == 0) {
                  $('#door_pass_form').append(`
                  <tr class="text_center">
                    <th colspan="10">${i18n.t('NO Result')}</th>
                  </tr>
                `)
                } else {
                  for (i = 0; i < getData.length; i++) {
                    $('#door_info_form').append(`
                    <tr title="${i + 1} ${i18n.t("Line")}">
                      <td>${i18n.t(getData[i].areaName == null ? "" : getData[i].areaName)}</td>
                      <td>${getData[i].doorId}</td>
                      <td>${getData[i].doorName}</td>
                      <td>${getData[i].doorDes}</td>
                      <td>${getData[i].clearanceId == null ? "" : getData[i].clearanceId}</td>
                      <td>${getData[i].clearanceName == null ? "" : getData[i].clearanceName}</td>
                      <td>${getData[i].doorgroupId == null ? "" : getData[i].doorgroupId}</td>
                      <td>${getData[i].doorgroupName == null ? "" : getData[i].doorgroupName}</td>
                      <td>${getData[i].doorgroupDes == null ? "" : getData[i].doorgroupDes}</td>
                    </tr>
                  `)
                  }
                  if (limit == undefined) {
                    $('#door_info_table').tablepage($("#table_btn_group"), row_setting, setPage, ajax_num, true, pageIndex)
                  }
                  else if (limit == row_setting * 10) {
                    $('#door_info_table').tablepage($("#table_btn_group"), row_setting, setPage, ajax_num, false, pageIndex)
                  }
                  else {
                    $('#door_info_table').tablepage($("#table_btn_group"), row_setting, limit, ajax_num, false, pageIndex)
                  }
                  onload = true
                  clientPrint(getData)
                  exportReportToExcelClient(getData)
                }
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
            } else if (res.StatusCode == -6) {
              // $("#seach_res").html(`,共 0 筆`)
              $('#door_info_form').append(`
                <tr class="text_center">
                  <th colspan="9" id="result">${i18n.t('NO Result')}</th>
                </tr>
              `)
              // $('#input_value').focus()
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
      },
      error: function (xhr) {
        console.log(xhr)
      }
    })
    // WEB API

  } else {
    $("#dia_content").html(`
      <span>${i18n.t('Please Enter Query Information')}</span>
    `)
    $("#dialog").dialog("open")
    $('#next').click(() => {
      $('#input_value').focus()
      $('#input_value').select()
    })
  }
}

function clear_value() {
  $('#seach_res').html('')
  $('#door_info_table').html(`
  <thead class="text_center bgc-orange fixTable">
    <tr>
      <th scope="col" id="col1">${i18n.t('Factory')}</th>
      <th scope="col" id="col2">${i18n.t('Door ID')}</th>
      <th scope="col" id="col3">${i18n.t('Door Name')}</th>
      <th scope="col" id="col4">${i18n.t('Door Description')}</th>
      <th scope="col" id="col5">${i18n.t('Clearance ID')}</th>
      <th scope="col" id="col6">${i18n.t('Clearance Name')}</th>
      <th scope="col" id="col7">${i18n.t('Group ID')}</th>
      <th scope="col" id="col8">${i18n.t('Group Name')}</th>
      <th scope="col" id="col9">${i18n.t('Group Description')}</th>
    </tr>
  </thead>
  <tbody class="text_center" id="door_info_form">
  </tbody>
  `)
  onload = false
}


function clear_input() {
  $('#input_value').val("")
}

function clear_all() {
  clear_value()
  clear_input()
}

// 設定語言
function LangChange() {
  LangInit()
  // 重新渲染網頁文字
  $('#title1').html(`${i18n.t('Entrance Information Inquery')}`) //門禁基本資料查詢
  $('#title2').html(`${i18n.t('Factory')}`) // 廠區
  $('#title3').html(`${i18n.t('Condition')}`) // 選擇查詢條件
  $('#title4').html(`${i18n.t('Door Name')}`) // 門禁名稱
  $('#title5').html(`${i18n.t('Clearance Name')}`) // 權限名稱
  $('#title6').html(`${i18n.t('Group Name')}`) // 門群名稱
  $('#title7').html(`${i18n.t('Enter Data')}`) // 輸入查詢資料

  $('#result').html(`${i18n.t('Result')}`) //查詢結果
  // $('#title9').html(`${i18n.t('Custom display number')}`) //自訂顯示筆數
  $('#export').html(`${i18n.t('Export XLS')}`) //匯出XLS
  $('#printbtn').html(`${i18n.t('Print')}`) //列印

  $('#col1').html(`${i18n.t('Factory')}`) //廠別
  $('#col2').html(`${i18n.t('Door ID')}`) //門禁代號
  $('#col3').html(`${i18n.t('Door Name')}`) //門群名稱
  $('#col4').html(`${i18n.t('Door Description')}`) //門禁描述
  $('#col5').html(`${i18n.t('Clearance ID')}`) //權限代號
  $('#col6').html(`${i18n.t('Clearance Name')}`) //權限名稱
  $('#col7').html(`${i18n.t('Group ID')}`) //門群代號
  $('#col8').html(`${i18n.t('Group Name')}`) //門群名稱
  $('#col9').html(`${i18n.t('Group Description')}`) //門群描述

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

  $(document).attr('title', i18n.t('Entrance Information Inquery')) // 修改網頁標題

  // 切換中英重新搜尋結果
  if (onload) {
    seach_value()
  }
}
LangChange()


if (TestOrTSMC == 0) {
  // 測試用
  for (i = 0; i < 15; i++) {
    $('#door_info_form').append(`
      <tr>
        <td>【${i}】rsite, rs, rse, rsiteCode rsiteCode rsiteCode</td>
        <td>【${i}】doorId doorId doorId</td>
        <td>【${i}】doorName doorName doorName</td>
        <td>【${i}】doorDes doorDes doorDes</td>
        <td>【${i}】clearanceId clearanceId clearanceId</td>
        <td>【${i}】clearanceName clearanceName clearanceName</td>
        <td>【${i}】doorgroupId doorgroupId doorgroupId</td>
        <td>【${i}】doorgroupName doorgroupName doorgroupNamedoorgroupName</td>
        <td>【${i}】doorgroupDes doorgroupDes doorgroupDes</td>
      </tr>
    `)
  }
  $('#door_info_table').tablepage($("#table_btn_group"), 10)
}


let printContent
// 列印功能(用開始新tab的方式，新建一個<table>並事先放入 result 直接 onload=print())
var clientPrint = (obj) => {
  printContent = `
    <table>
      <thead class="text_center bgc-orange fixTable">
        <tr>
          <th scope="col" id="col1">${i18n.t('Factory')}</th>
          <th scope="col" id="col2">${i18n.t('Door ID')}</th>
          <th scope="col" id="col3">${i18n.t('Door Name')}</th>
          <th scope="col" id="col4">${i18n.t('Door Description')}</th>
          <th scope="col" id="col5">${i18n.t('Clearance ID')}</th>
          <th scope="col" id="col6">${i18n.t('Clearance Name')}</th>
          <th scope="col" id="col7">${i18n.t('Group ID')}</th>
          <th scope="col" id="col8">${i18n.t('Group Name')}</th>
          <th scope="col" id="col9">${i18n.t('Group Description')}</th>
        </tr>
      </thead>
      <tbody>`
  if (obj) {
    for (i = 0; i < obj.length; i++) {
      printContent += `
        <tr>
          <td>${i18n.t(getData[i].areaName == null ? "" : getData[i].areaName)}</td>
          <td>${getData[i].doorId}</td>
          <td>${getData[i].doorName}</td>
          <td>${getData[i].doorDes}</td>
          <td>${getData[i].clearanceId == null ? "" : getData[i].clearanceId}</td>
          <td>${getData[i].clearanceName == null ? "" : getData[i].clearanceName}</td>
          <td>${getData[i].doorgroupId == null ? "" : getData[i].doorgroupId}</td>
          <td>${getData[i].doorgroupName == null ? "" : getData[i].doorgroupName}</td>
          <td>${getData[i].doorgroupDes == null ? "" : getData[i].doorgroupDes}</td>
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
          <th scope="col" id="col1">${i18n.t('Factory')}</th>
          <th scope="col" id="col2">${i18n.t('Door ID')}</th>
          <th scope="col" id="col3">${i18n.t('Door Name')}</th>
          <th scope="col" id="col4">${i18n.t('Door Description')}</th>
          <th scope="col" id="col5">${i18n.t('Clearance ID')}</th>
          <th scope="col" id="col6">${i18n.t('Clearance Name')}</th>
          <th scope="col" id="col7">${i18n.t('Group ID')}</th>
          <th scope="col" id="col8">${i18n.t('Group Name')}</th>
          <th scope="col" id="col9">${i18n.t('Group Description')}</th>
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
          <td>${getData[i].doorId}</td>
          <td>${getData[i].doorName}</td>
          <td>${getData[i].doorDes}</td>
          <td>${getData[i].clearanceId == null ? "" : getData[i].clearanceId}</td>
          <td>${getData[i].clearanceName == null ? "" : getData[i].clearanceName}</td>
          <td>${getData[i].doorgroupId == null ? "" : getData[i].doorgroupId}</td>
          <td>${getData[i].doorgroupName == null ? "" : getData[i].doorgroupName}</td>
          <td>${getData[i].doorgroupDes == null ? "" : getData[i].doorgroupDes}</td>
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