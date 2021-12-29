let taggle = false
let side_content // 將要組成的 side tree
$(document).ready(function () {
  // 開關卡功能
  let usercheck = `
    <div class="card-header" id="side_tree_1">
      <div id="ST1" class="side_tree_btn" data-toggle="collapse" data-target="#side_tree_content_1" aria-expanded="false" aria-controls="side_tree_content_1">
        
      </div>
    </div>
    <div class="collapse" id="side_tree_content_1">
      <div class="card-body">
        <a href="/usercheck" id="usercheck" class="btn btn-lg btn-outline-dark col-12 tree_list">出入開關卡</a>
        <a href="/cleanroomcheck" id="cleanroomcheck" class="btn btn-lg btn-outline-dark col-12 tree_list">潔淨室開卡</a>
      </div>
    </div>
  `
  // 資料查詢
  let clearance = `<a href="/clearance" id="clearance" class="btn btn-lg btn-outline-dark col-12 tree_list">Clearance Name 設定查詢</a>`
  let doorinfo = `<a href="/doorinfo" id="doorinfo" class="btn btn-lg btn-outline-dark col-12 tree_list">門禁基本資料查詢</a>`
  let doorpass = `<a href="/doorpass" id="doorpass" class="btn btn-lg btn-outline-dark col-12 tree_list">門禁通行權查詢</a>`

  let dataquery_start = `
  <div class="card-header" id="side_tree_2">
    <div id="ST2" class="side_tree_btn" data-toggle="collapse" data-target="#side_tree_content_2" aria-expanded="false" aria-controls="side_tree_content_2">
      
    </div>
  </div>
  <div class="collapse" id="side_tree_content_2">
    <div class="card-body">`
  let dataquery_end = `      
    </div>
  </div>`

  // 記錄查詢
  let cardswitch = `<a href="/cardswitch" id="cardswitch" class="btn btn-lg btn-outline-dark col-12 tree_list">開關卡記錄查詢</a>`
  let personenter = `<a href="/personenter" id="personenter" class="btn btn-lg btn-outline-dark col-12 tree_list">駐廠人員今日進廠記錄查詢</a>`
  let person30 = `<a href="/person30" id="person30" class="btn btn-lg btn-outline-dark col-12 tree_list">駐廠人員出入廠30天記錄查詢</a>`
  let cleanroom30 = `<a href="/cleanroom30" id="cleanroom30" class="btn btn-lg btn-outline-dark col-12 tree_list">潔淨室開關卡30天記錄查詢</a>`
  let personvisit = `<a href="/personvisit" id="personvisit" class="btn btn-lg btn-outline-dark col-12 tree_list">預約駐廠人員今日進廠記錄查詢</a>`

  let historyquery_start = `
  <div class="card-header" id="side_tree_3">
    <div id="ST3" class="side_tree_btn" data-toggle="collapse" data-target="#side_tree_content_3" aria-expanded="false" aria-controls="side_tree_content_3">
      
    </div>
  </div>
  <div class="collapse" id="side_tree_content_3">
    <div class="card-body">`
  let historyquery_end = `  
    </div>
  </div>`

  // 報表管理
  let person_total_list = `<a href="/person_total_list" id="person_total_list" class="btn btn-lg btn-outline-dark col-12 tree_list">廠區駐廠人員總數與列表</a>`
  let reservation = `<a href="/reservation" id="reservation" class="btn btn-lg btn-outline-dark col-12 tree_list">廠商預約及實際入廠通知</a>`
  let inout_info = `<a href="/inout_info" id="inout_info" class="btn btn-lg btn-outline-dark col-12 tree_list">個人廠商出入廠資訊明細</a>`
  let card_statistics = `<a href="/card_statistics" id="card_statistics" class="btn btn-lg btn-outline-dark col-12 tree_list">各開關卡點廠商刷卡統計表</a>`

  let reportmanage_start = `
  <div class="card-header" id="side_tree_4">
    <div id="ST4" class="side_tree_btn" data-toggle="collapse" data-target="#side_tree_content_4" aria-expanded="false" aria-controls="side_tree_content_4">
      
    </div>
  </div>
  <div class="collapse" id="side_tree_content_4">
    <div class="card-body">`
  let reportmanage_end = `      
    </div>
  </div>
`
  let get_role = getCookie('role')
  if (get_role == "ADMIN" | get_role == "SMD") { // 全部權限
    side_content = `
  <!-- SIDE TREE ROW 1 -->
  ${usercheck}
  <!-- SIDE TREE ROW 2 -->
  ${dataquery_start}
  ${clearance}
  ${doorinfo}
  ${doorpass}
  ${dataquery_end}
  <!-- SIDE TREE ROW 3 -->
  ${historyquery_start}
  ${cardswitch}
  ${personenter}
  ${person30}
  ${cleanroom30}
  ${personvisit}  
  ${historyquery_end}
  <!-- SIDE TREE ROW 4 -->
  ${reportmanage_start}
  ${person_total_list}
  ${reservation}
  ${inout_info}
  ${card_statistics}
  ${reportmanage_end}
  `
  } else if (get_role == 'User') { // 一般使用者權限
    side_content = `
  <!-- SIDE TREE ROW 1 -->
  <!-- SIDE TREE ROW 2 -->
  <!-- SIDE TREE ROW 3 -->
  ${historyquery_start}
  ${person30}
  ${cleanroom30}
  ${personenter}
  ${historyquery_end}
  <!-- SIDE TREE ROW 4 -->
  ${reportmanage_start}
  ${reservation}
  ${inout_info}
  ${reportmanage_end}
  `
  } else if (get_role == 'CheckInOut') { // 廠商開關卡
    side_content = `
  <!-- SIDE TREE ROW 1 -->
  ${usercheck}
  <!-- SIDE TREE ROW 2 -->
  <!-- SIDE TREE ROW 3 -->
  ${historyquery_start}
  ${cardswitch}
  ${personenter}
  ${historyquery_end}
  <!-- SIDE TREE ROW 4 -->`
  }
  side_taggle()
})

function side_taggle() {
  if (taggle) { // 關閉
    $('.side_tree').removeClass('open_side')
    $('.side_tree').html()
    $('.bttn_taggle').addClass('scale')
    $('.header_start').removeClass('move_btn_right')
    taggle = false
  } else { // 打開
    $('.side_tree').addClass('open_side')
    $('.side_tree').html(side_content)
    // 根據URL，點亮list
    let href_traget = location.href.split('/')[3]
    // console.log(href_traget)
    for (i = 0; i < side_tree_role.length; i++) {
      $(`#side_tree_content_${i + 1}`).addClass('show')
    }
    if (href_traget == 'userpriv') {
      $(`#usercheck`).addClass('active')
      $(`#usercheck`).parent().parent().removeClass('collapse')
      $(`#usercheck`).parent().parent().addClass('collapsed')
    } if (href_traget == 'cleanroom') {
      $(`#cleanroomcheck`).addClass('active')
      $(`#cleanroomcheck`).parent().parent().removeClass('collapse')
      $(`#cleanroomcheck`).parent().parent().addClass('collapsed')
    } else {
      $(`#${href_traget}`).addClass('active')
      $(`#${href_traget}`).parent().parent().removeClass('collapse')
      $(`#${href_traget}`).parent().parent().addClass('collapsed')
    }
    $('.bttn_taggle').removeClass('scale')
    $('.header_start').addClass('move_btn_right')
    taggle = true
    LangLocal()
  }
}

// 按下按鈕時
$('#taggle_btn').click(function () {
  side_taggle()
})

// 展開按鈕
$('#open_list').click(function () {
  for (i = 0; i < side_tree_role.length; i++) {
    $(`#side_tree_content_${i + 1}`).addClass('show')
  }
})

// 登出功能
$('#logout_btn').click(function () {
  let yes_no = confirm('確定要登出？')
  if (yes_no) {
    document.cookie = "location=;expires=Thu, 01 Jan 1970 00:00:00 GMT" + ";path=/" + ";domain=" + ".tsmc.com";
    redirectA4Login()
  }
})

// 使用者大頭照
if (TestOrTSMC == 1) {
  let image_url = `${EMSR_ip}/api/emsr/photo/jpg?id=${getCookie('loginEmplId')}`
  console.log(image_url)
  // $.ajax({
  //   url: image_url,
  //   type: 'GET',
  //   async: false,
  //   dataType: 'JSON',
  //   timeout: 5000,
  //   contentType: 'application/json;charset=utf-8',
  //   success: function (res) {
  //     console.log(res)
  //     $('#userimage').attr('src', res)
  //   },
  //   error: function (xhr) {
  //     console.log(xhr)
  //     $('#userimage').attr('src', 'user1.png')
  //   }
  // })
  if (getCookie('loginEmplId') != undefined) {
    $('#userimage').attr('src', image_url)
  }
}


$('#openclose1').click(() => {
  $('#side_tree_content_1').collapse('toggle');
  $('#side_tree_content_2').collapse('toggle');
})
$('#openclose2').click(() => {
  $('.side_tree_btn').collapse('show');
})
$('#openclose3').click(() => {
  $('.side_tree_btn').collapse('show');
})
$('#openclose4').click(() => {
  $('.side_tree_btn').collapse('show');
})

