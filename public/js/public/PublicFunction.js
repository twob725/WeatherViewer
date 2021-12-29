function _timestamp() {
  var dt = new Date();
  var nowdatetime = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  // console.log("nowdatetime: " + nowdatetime);
  const dateTime = dt.getTime();
  const timestamp = Math.floor(dateTime / 1000);

  return timestamp;
}

function _uuid() {
  var d = Date.now();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function _encrypt(data, key) {

  var encryKey = CryptoJS.SHA256(key);

  var content = data;
  var encrypted = CryptoJS.AES.encrypt(JSON.stringify(content), encryKey, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString();
  // console.log(encryKey)
  // console.log(content)
  // console.log(encrypted)

  // CryptoJS.AES.encrypt( JSON.stringify({
  //   username: username,
  //   text: text,
  //   createdAt: new Date().getTime()
  // }), '123456').toString();

  return encrypted;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// 偵測ENTER鍵
//#inputTarget是你input的ID
$("#input_time").keypress(function (e) {
  code = (e.keyCode ? e.keyCode : e.which);
  if (code == 13) {
    //bttn_submit是按鈕名稱
    $("#bttn_submit").click();
  }
})

// 清除 cookies
function deleteAllCookies(value) {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    console.log(name)
    let name_fliter
    if (value) {
      name_fliter = name.indexOf(value)
    } else {
      name_fliter = 1
    }
    if (name_fliter == 1) {
      if (name == ' location') {
        console.log('pass..')
      } else {
        console.log('clear cookie')
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT" + ";path=/" + ";domain=" + ".tsmc.com";
      }
    } else {
      console.log('pass..')
    }
    // document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}