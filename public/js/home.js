// 放入背景
$('#table_content').append(`<img src="/Home acs.png" alt="">`)

// 設定語言
function LangChange() {
  LangInit()
  // 重新渲染網頁文字
  $(document).attr('title', i18n.t('Home')) // 修改網頁標題
}
LangChange()