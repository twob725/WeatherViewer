let dt = new Date();
// 設定語言
function LangChange(lan) {
  LangInit()

  let gettime = GetTime(dt, i18n.t('NOW TIME:'))

  // 重新渲染網頁文字
  $('#t1').html(`${i18n.t('WEB Server')} <span>${i18n.t('ALIVE')}</span>!!`)
  $('#dt_now').html(`${i18n.t('NOW TIME:')} ${i18n.t(gettime)}`)

  $(document).attr('title', i18n.t('WEB ALIVE TEST PAGE')) // 修改網頁標題

}

LangChange()

// JPG 轉 Bach64
// function getBase64Image(img) {
//   var canvas = document.createElement("canvas");
//   canvas.width = img.width;
//   canvas.height = img.height;
//   var ctx = canvas.getContext("2d");
//   ctx.drawImage(img, 0, 0, img.width, img.height);
//   var ext = img.src.substring(img.src.lastIndexOf("."), 1).toLowerCase();
//   var dataURL = canvas.toDataURL("image/jpeg", ext);
//   // var dataURL = canvas.toDataURL();
//   return dataURL;
// }

// var img = $('#img').attr("src")
// img = 'data:image/jpeg;base64,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'
// var image = new Image();
// image.src = img;
// image.setAttribute("crossOrigin", 'Anonymous')
// image.onload = function () {
//   var base64 = getBase64Image(image);
//   console.log(base64);
//   $('#canvas').append("<img src='" + base64 + "'>")
// }
// $('#maindiv').html(`
//   <button onclick="RunAPI()"> RUN </button>
// `)
// const RunAPI = () =>{
//   let value = JSON.stringify({
  
//   })
//   $.ajax({
//     url: `${EMSR_ip}/api/emsr/post/check/user/role`,
//     type: 'POST',
//     async: false,
//     dataType: 'JSON',
//     contentType: 'application/json;charset=utf-8',
//     data: value,
//     success: function (res) {
//       console.log(res)
//     }
//   })
// }