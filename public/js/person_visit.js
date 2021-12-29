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

// 設定語言
function LangChange() {
    LangInit()
    // 重新渲染網頁文字
    $('#title1').html(`${i18n.t("Reservated On-site Persons' Visit List")}`) //門禁基本資料查詢
    $('#title2').html(`${i18n.t('Factory')}`) // 廠區
    $('#title3').html(`${i18n.t('Department ID')}`) // 部門代碼
    $('#title4').html(`${i18n.t('Receptionist NO')}`) // 接待員工工號
    $('#title5').html(`${i18n.t('Receptionist Name')}`) // 接待員工姓名
    $('#title6').html(`${i18n.t('Vendor Company ID')}`) // 公司編號
    $('#title7').html(`${i18n.t('Vendor Company Name')}`) // 公司名稱
    $('#title8').html(`${i18n.t('Start from 00:00')}`) //從00:00算起
  
    $('#result').html(`${i18n.t('Result')}`) //查詢結果
    $('#custom').html(`${i18n.t('Custom display number')}`) //自訂顯示筆數
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
    // $('#result').html(`${i18n.t('NO Result')}`) //查詢結果
  
    // $('#select option[value="1"]').text(`${i18n.t('FAB AP03')}`)
    $('#select').val(`${i18n.t('FAB AP03')}`)
  
    $(document).attr('title', i18n.t("Reservated On-site Persons' Visit List")) // 修改網頁標題
  
    // 切換中英重新搜尋結果
    if (onload) {
      seach_value()
    }
  }
  LangChange()