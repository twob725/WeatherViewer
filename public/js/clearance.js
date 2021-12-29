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

$('#clearanceName').focus()

// 偵測ENTER鍵
//#inputTarget是你input的ID
$("#clearanceName").keypress(function (e) {
	code = (e.keyCode ? e.keyCode : e.which);
	if (code == 13) {
		//bttn_submit是按鈕名稱
		$("#bttn_submit").click();
	}
})
$("#groupName").keypress(function (e) {
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

// 查詢功能
function seach_value(offset, limit, pageIndex) {
	clear_value() // 清除table
	console.log($('#clearanceName').val().length)
	if ($('#clearanceName').val().length || $('#groupName').val().length) {
		console.log($('#clearanceName').val())
		let clearanceName = $('#clearanceName').val()
		let groupName = $('#groupName').val()
		let AccountName = getCookie('AccountName')
		acdn = getCookie('acdn')

		if (offset < 0) {
			offset = 0
		}

		let value = JSON.stringify({
			AccountName: AccountName,
			token: acdn,
			userRole: getCookie("role"),
			clearanceName: clearanceName,
			groupName: groupName,
			offset: offset == undefined ? 0 : offset,
			limit: offset == undefined ? 100 : limit,
		})

		console.log(value)
		// 取得結果總筆數 API
		$.ajax({
			url: `${WEBAPI_ip}/api/data/clearancename/config/number`,
			type: "POST",
			async: true,
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
		// WEB API
		$.ajax({
			url: `${WEBAPI_ip}/api/data/clearancename/config`,
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
							$('#clearance_form').append(`
								<tr title="${i + 1} ${i18n.t("Line")}">
									<td>${getData[i].clearanceType == null ? "" : i18n.t(getData[i].clearanceType)}</td>
									<td>${getData[i].clearanceName == null ? "" : getData[i].clearanceName}</td>
									<td id="${i}"></td>
								</tr>
							`)
							// $('#clearance_form').append(`
							// 	<tr>
							// 		<th>${getData[i].clearanceType}</th>
							// 		<td></td>
							// 		<td>${getData[i].clearanceName}</td>
							// 		<td id="${i}"></td>
							// 	</tr>
							// `)
							if (getData[i].groupNameList) {
								for (j = 0; j < getData[i].groupNameList.length; j++) {
									$(`#${i}`).append(` ${getData[i].groupNameList[j]},`)
								}
							} else {
								$(`#${i}`).append(` `)
							}
							let text = $(`#${i}`).text()
							text = text.slice(0, text.length - 1)
							$(`#${i}`).html(text)
						}

						if (limit == undefined) {
							$('#clearance_talbe').tablepage($("#table_btn_group"), row_setting, setPage, ajax_num, true, pageIndex)
						}
						else if (limit == row_setting * 10) {
							$('#clearance_talbe').tablepage($("#table_btn_group"), row_setting, setPage, ajax_num, false, pageIndex)
						}
						else {
							$('#clearance_talbe').tablepage($("#table_btn_group"), row_setting, limit, ajax_num, false, pageIndex)
						}
						onload = true
						clientPrint(getData)
						exportReportToExcelClient(getData)
					}
				} else if (res.StatusCode == -2 | res.StatusCode == -3) {
					$("#dia_content").html(`
            <span>${i18n.t('Token Expired or Error')}, ${i18n.t('Error Code:  ')}${res.StatusCode}</span>
          `);
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
					// $("#seach_res").html(`,共 0 筆`)
					$('#clearance_form').html(`
						<tr class="text_center">
							<td colspan="4" id="result">${i18n.t('NO Result')}</td>
						</tr>
					`)
					// $('#clearanceName').focus()
					$('#table_btn_group').html("")
				}
			},
			error: function (xhr) {
				$("#dia_content").html(`
					<span>${i18n.t('Other Error')}, ${i18n.t('Error Code: ')}${xhr.status}</span>
				`)
				$("#dialog").dialog("open")
			}
		})
	} else if (!$('#clearanceName').val()) {
		$("#dia_content").html(`
			<span>${i18n.t('Please Enter Clearance Name or Group Name')}</span>
		`)
		$("#dialog").dialog("open")
		$('#next').click(() => {
			$('#clearanceName').focus()
			$('#clearanceName').select()
		})
	}
}

function clear_value() {
	$('#seach_res').html('')
	$('#clearance_talbe').html(`
		<thead class="text_center bgc-orange fixTable">
			<tr>
				<th scope="col" id="title12">${i18n.t('Clearance Type')}</th>
				<th scope="col" id="title14">${i18n.t('Clearance Name')}</th>
				<th scope="col" id="title15">${i18n.t('Regional Combination')}</th>
			</tr>
		</thead>
		<tbody class="" id="clearance_form">
		</tbody>
	`)
	// $('#clearance_talbe').html(`
	// 	<thead class="text_center bgc-orange fixTable">
	// 		<tr>
	// 			<th scope="col" id="title12">${i18n.t('Clearance Type')}</th>
	// 			<th scope="col" id="title13">${i18n.t('Department ID')}</th>
	// 			<th scope="col" id="title14">${i18n.t('Clearance Name')}</th>
	// 			<th scope="col" id="title15">${i18n.t('Regional Combination')}</th>
	// 		</tr>
	// 	</thead>
	// 	<tbody class="text_center" id="clearance_form">
	// 	</tbody>
	// `)
	$('#table_btn_group').html("")
	onload = false
}

function clear_input() {
	$('#clearanceName').val("")
	$('#groupName').val("")
}

function clear_all() {
	clear_value()
	clear_input()
}


// 設定語言
function LangChange() {
	LangInit()
	// 重新渲染網頁文字
	$('#title1').html(`${i18n.t('Clearance Name Inquery')}`) //通行權設定查詢
	$('#title2').html(`${i18n.t('Factory')}`) //廠區
	$('#title3').html(`${i18n.t('Status')}`) //設定狀況
	$('#title4').html(`${i18n.t('Seted')}`) //已設定
	$('#title5').html(`${i18n.t('Not Set')}`) //待設定
	$('#title6').html(`${i18n.t('Clearance Name')}`) //權限名稱
	$('#title7').html(`${i18n.t('Group')}`) //群組名稱

	$('#result').html(`${i18n.t('Result')}`) //查詢結果
	// $('#title9').html(`${i18n.t('Custom display number')}`) //自訂顯示筆數
	$('#export').html(`${i18n.t('Export XLS')}`) //匯出XLS
	$('#printbtn').html(`${i18n.t('Print')}`) //列印

	$('#title12').html(`${i18n.t('Clearance Type')}`) //權限型態
	$('#title13').html(`${i18n.t('Department ID')}`) //部門代號
	$('#title14').html(`${i18n.t('Clearance Name')}`) //權限名稱
	$('#title15').html(`${i18n.t('Regional Combination')}`) //區域組合

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
	$('#result').html(`${i18n.t('NO Result')}`) //查無資料

	// $('#select option[value="1"]').text(`${i18n.t('FAB AP03')}`)
	$('#select').val(`${i18n.t('FAB AP03')}`)

	$(document).attr('title', i18n.t('Clearance Name Inquery')) // 修改網頁標題

	// 切換中英重新搜尋結果
	if (onload) {
		seach_value()
	}
}
LangChange()


if (TestOrTSMC == 0) {
	// 測試用
	for (i = 0; i < 12; i++) {
		$('#clearance_form').append(`
			<tr>
				<td>clearance Type clearance Type clearance Type</td>
				<td>clearance Name clearance Name clearance Name</td>
				<td id="${i}"></td>
			</tr>
		`)
		for (j = 0; j < 10; j++) {
			$(`#${i}`).append(` groupNameList,`)
		}
		let text = $(`#${i}`).text()
		text = text.slice(0, text.length - 5)
		$(`#${i}`).html(text)
	}
	$('#clearance_talbe').tablepage($("#table_btn_group"), 10)
}



let printContent
// 列印功能(用開始新tab的方式，新建一個<table>並事先放入 result 直接 onload=print())
var clientPrint = (obj) => {
	printContent = `
    <table>
      <thead class="text_center bgc-orange fixTable">
        <tr>
					<th scope="col" id="title12">${i18n.t('Clearance Type')}</th>
					<th scope="col" id="title14">${i18n.t('Clearance Name')}</th>
					<th scope="col" id="title15">${i18n.t('Regional Combination')}</th>
				</tr>
      </thead>
      <tbody>`
	if (obj) {
		for (i = 0; i < obj.length; i++) {
			printContent += `
			<tr title="${i + 1} ${i18n.t("Line")}">
				<td>${obj[i].clearanceType == null ? "" : i18n.t(obj[i].clearanceType)}</td>
				<td>${obj[i].clearanceName == null ? "" : obj[i].clearanceName}</td>
				<td id="${i}">
			`
			if (obj[i].groupNameList) {
				let count = 0
				for (j = 0; j < obj[i].groupNameList.length; j++) {
					printContent += `${obj[i].groupNameList[j]},`
					count += 1
					if (count == obj[i].groupNameList.length) {
						printContent = printContent.slice(0, printContent.length - 1)
					}
				}
			} else {
				console.log('append END!!')
			}
			printContent += `
					</td>
				</tr>
			`
		}
	} else {
		for (i = 0; i < 20; i++) {
			printContent += `
			<tr title="${i + 1} ${i18n.t("Line")}">
				<td>${i}</td>
				<td>${i}</td>
				<td id="${i}">
			`
			let count = 0

			for (j = 0; j < 8; j++) {
				printContent += `content_${j},`
				count += 1
				console.log(count)
				if (count == 8) {
					printContent = printContent.slice(0, printContent.length - 1)
				}
			}
			let text = $(`#${i}`).text()
			text = text.slice(0, text.length - 1)
			$(`#${i}`).html(text)

			printContent += `
					</td>
				</tr>
			`
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
	printContent = `
    <table>
      <thead class="text_center bgc-orange fixTable">
        <tr>
					<th scope="col" id="title12">${i18n.t('Clearance Type')}</th>
					<th scope="col" id="title14">${i18n.t('Clearance Name')}</th>
					<th scope="col" id="title15">${i18n.t('Regional Combination')}</th>
				</tr>
      </thead>
      <tbody>`
	if (obj) {
		for (i = 0; i < obj.length; i++) {
			printContent += `
			<tr title="${i + 1} ${i18n.t("Line")}">
				<td>${obj[i].clearanceType == null ? "" : i18n.t(obj[i].clearanceType)}</td>
				<td>${obj[i].clearanceName == null ? "" : obj[i].clearanceName}</td>
				<td id="${i}">
			`
			if (obj[i].groupNameList) {
				for (j = 0; j < obj[i].groupNameList.length; j++) {
					printContent += `${obj[i].groupNameList[j]},`
				}
			} else {
				printContent = printContent.slice(0, printContent.length - 1)
			}
			printContent += `
					</td>
				</tr>
			`
		}
	} else {
		for (i = 0; i < 20; i++) {
			printContent += `
			<tr title="${i + 1} ${i18n.t("Line")}">
				<td>${i}</td>
				<td>${i}</td>
				<td id="${i}">
			`
			let count = 0

			for (j = 0; j < 8; j++) {
				printContent += `content_${j},`
				count += 1
				if (count == 8) {
					printContent = printContent.slice(0, printContent.length - 1)
				}
			}
			printContent += `
					</td>
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