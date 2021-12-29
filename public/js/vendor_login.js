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

$('input[name="account"]').focus()

$('#account').focus(() => {
  $('.form_content').addClass('form_hover')
})
$('#account').focusout(() => {
  $('.form_content').removeClass('form_hover')
})
$('#password').focus(() => {
  $('.form_content').addClass('form_hover')
})
$('#password').focusout(() => {
  $('.form_content').removeClass('form_hover')
})

var Logout = () => {
  deleteAllCookies()
  location.href = './login'
}

var SendVal = () => {
  $('#login_msg').html('')
  // console.log($('input[name="account"]').val())
  // console.log($('input[name="password"]').val())
  // console.log('GOGOG')
  let acc, psw
  acc = $('input[name="account"]').val()
  psw = $('input[name="password"]').val()
  // console.log(acc, psw)
  if (acc && psw) {
    let value = JSON.stringify({
      AccountName: acc,
      Password: psw,
      LoginDateTime: new Date()
    })
    // console.log(value)
    $.ajax({
      url: `${EMSR_ip}/api/guard/login`,
      type: 'POST',
      async: true,
      dataType: 'JSON',
      contentType: 'application/json;charset=utf-8',
      data: value,
      timeout: 60000, // TimeOut 時間
      success: function (res) {
        console.log(res)
        if (res.StatusCode == 1) {
          if (res.ContentObject.loginResult) {
            console.log('Login Success')
            document.cookie = "_AccountName=" + acc + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // 警衛AccountName
            document.cookie = "_Acdn=" + res.ContentObject.token + ";path=/" + ';domain=' + '.tsmc.com' + cookie_time // Acdn

            location.href = './usercheck'
          } else {
            $("#dia_content").html(`
              <span>${i18n.t('Login Failed')}, ${i18n.t('Please Check AccountName and PassWord')}</span>
            `)
            $("#dialog").dialog("open")
            console.log('Login Failed')
          }
        }
      },
      error: function (xhr) {
        console.log(xhr)
        $("#dia_content").html(`
          <span>${i18n.t('Login Failed')}, ${i18n.t('Timeout Error')}</span>
        `)
        $("#dialog").dialog("open")
        console.log('Login Failed')
      }
    })
  } else {
    $("#dia_content").html(`
      <span>${i18n.t('Please Enter AccountName and PassWord')}</span>
    `)
    $("#dialog").dialog("open")
  }
}

var ClearVal = () => {
  $('input[name="account"]').val("")
  $('input[name="password"]').val("")
}


// 設定語言
function LangChange() {
  // 重新渲染側邊列表
  if (language == 'zh-TW') {
    $("#langIcon").attr('src', '../icon/EN.png')
    language = 'en-US'
    document.cookie = 'Language=' + language + ';path=/'
    i18n.set({
      'lang': 'zh-tw', //e.g. en-us, zh-tw. Default is auto detect from browser.
      'path': '../js/i18n/' // Default is empty (same level as i18n.js)
    })
  } else if (language == 'en-US') {
    $("#langIcon").attr('src', '../icon/TW.png')
    language = 'zh-TW'
    document.cookie = 'Language=' + language + ';path=/'
    i18n.set({
      'lang': 'en-us', //e.g. en-us, zh-tw. Default is auto detect from browser.
      'path': '../js/i18n/' // Default is empty (same level as i18n.js)
    })
  }
  // 重新渲染網頁文字
  // $('#hi').html(`${i18n.t('HI, ')}`)
  // $("#hi").append(`${getCookie('AccountName')}`)

  $('#title0').html(`${i18n.t('Login for Gurad')}`)
  $('#title1').html(`${i18n.t('Account')}`)
  $('#title2').html(`${i18n.t('Password')}`)
  $('#bttn_submit').html(`${i18n.t('Login')}`)
  $('#bttn_cancel').html(`${i18n.t('CANCEL')}`)

  $('#ui-id-1').html(i18n.t('SysInfo'))
  $("#dialog").html(`
    <div class="dia_content" id="dia_content">
    </div>
    <hr>
    <div class="dia_btngroup" id="dia_btngroup">
      <button type="button" id="next" class="btn btn-primary bttn_submit bttn_dia" onclick="CloseDia()">${i18n.t('OK')}</button>
    </div>
  `)

  $(document).attr('title', i18n.t('Login for Gurad')) // 修改網頁標題
}
LangChange()