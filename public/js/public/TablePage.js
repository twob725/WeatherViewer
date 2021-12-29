
(function ($) {

	var offsetPage = 0
	$.fn.tablepage = function (oObj, rowPage, setPage, totalCount, reset, pageIndex) {
		if (reset) {
			offsetPage = 0
		}
		var dPageIndex = 1;
		var dNowIndex = 1;
		var sPageStr = "";
		var dCount = 0; // 物件資料筆數(舊的總數)
		var oSource = $(this);
		// var sNoSelColor = "#CCCCCC";
		// var sSelColor = "black";
		// var sFontColor = "white";


		console.log("rowPage: " + rowPage) // 表格一次呈現多少列
		console.log("totalCount: " + totalCount)
		console.log("setPage: " + setPage)

		change_page_content(pageIndex);

		function change_page_content(PGIndex) {
			//取得資料筆數
			dCount = oSource.children().children().length - 1;

			if (totalCount !== setPage) {
				sPageStr = `
				<table>
					<tr>				
						<td>
							<table class='outer table'>
								<tr>
									<td class='tablepage tablepageNotSelect tdHover td_margin_right' >
										<div>${i18n.t('First Page')}</div>
									</td>
								</tr>
							</table>
						</td>
				`
			} else {
				sPageStr = `
					<table>
						<tr>			
				`
			}
			//顯示頁碼
			// sPageStr = `
			// <table>
			// 	<tr>				
			// 		<td>
			// 			<table class='outer table'>
			// 				<tr>
			// 					<td class='tablepage tablepageNotSelect tdHover td_margin_right' >
			// 						<div>${i18n.t('First Page')}</div>
			// 					</td>
			// 				</tr>
			// 			</table>
			// 		</td>
			// `
			// sPageStr = `
			// <table>
			// 	<tr>
			// 		<td class='td_margin'>
			// 			<b>${i18n.t("The")}</b>
			// 		</td>
			// `
			// dPageIndex = 0
			// dNowIndex = 0
			console.log("PGIndex: " + PGIndex)
			console.log("dPageIndex(IN)(BEFORT): " + dPageIndex)
			console.log("dNowIndex(IN)(BEFORT): " + dNowIndex)
			if (!PGIndex) {
				console.log(PGIndex)
				dPageIndex = 1
			} else if (PGIndex > 0) {
				PGIndex = PGIndex % 10
				if (PGIndex == 0) {
					PGIndex = 10
				}
				dPageIndex = Number(((PGIndex - 1) / 10).toString().split('.')[0]) * 10 + 1;
				console.log(Number((PGIndex / 10)))
				dNowIndex = PGIndex;
			} else {
				dPageIndex = 1 * setPage
				dNowIndex = 1 * setPage
			}
			console.log("dPageIndex(IN)(AFTER): " + dPageIndex)
			console.log("dNowIndex(IN)(AFTER): " + dNowIndex)
			console.log("offsetPage: " + offsetPage)
			console.log((offsetPage + 1) * rowPage * setPage)
			if (offsetPage > 0) {
				if (totalCount !== setPage) {
					sPageStr += `
					<td>
						<table class='outer table'>
							<tr>
								<td class='tablepage tablepageNotSelect tdHover td_margin_right'>
									<div>${i18n.t('Front 10')}</div>
								</td>
							</tr>
						</table>
					</td>
				`
				}
			}
			// console.log("dCount: "+dCount)
			console.log("rowPage: " + rowPage)

			if (setPage == totalCount) {
				dCount = 0
				rowPage = totalCount
			}
			for (var i = 1; i <= dCount; i += rowPage) {
				console.log('Enter For Loop')
				if (dNowIndex == dPageIndex) {
					sPageStr += `
						<td>
							<table class='outer table'>
								<tr>
									<td class='tablepage tdHover'>
										<div>${(dPageIndex++) + (offsetPage * setPage)}</div>
									</td>
								</tr>
							</table>
						</td>
					`
				} else if (i < (rowPage * setPage)) {
					sPageStr += `
						<td>
							<table class='outer table'>
								<tr>
									<td class='tablepage tablepageNotSelect tdHover'>
										<div>${(dPageIndex++) + (offsetPage * setPage)}</div>
									</td>
								</tr>
							</table>
						</td>
					`
					// break
					// } else if (i > dCount) {
					// 	break
				}
				// else if ((offsetPage + 1) * rowPage * setPage < totalCount) {
				// 	sPageStr += `
				// 		<td>
				// 			<table class='outer table'>
				// 				<tr>
				// 					<td class='tablepage tablepageNotSelect tdHover td_margin_right' >
				// 						<div>${i18n.t('Next 10')}</div>
				// 					</td>
				// 				</tr>
				// 			</table>
				// 		</td>
				// 	`
				// 	break

				// } 
				// else {
				// 	sPageStr += `
				// 		<td>
				// 			<table class='outer table'>
				// 				<tr>
				// 					<td class='tablepage tablepageNotSelect tdHover td_margin_right' >
				// 						<div>${i18n.t('Next 10')}</div>
				// 					</td>
				// 				</tr>
				// 			</table>
				// 		</td>
				// 	`
				// 	break
				// }


			}
			if ((offsetPage + 1) * rowPage * setPage < totalCount) {
				sPageStr += `
					<td>
						<table class='outer table'>
							<tr>
								<td class='tablepage tablepageNotSelect tdHover td_margin_right' >
									<div>${i18n.t('Next 10')}</div>
								</td>
							</tr>
						</table>
					</td>
				`
			}
			if ((Number(dPageIndex) + Number(offsetPage * setPage)) != (Number(((totalCount) / 10).toString().split('.')[0]) + 1)) {
				sPageStr += `
					<td>
						<table class='outer table'>
							<tr>
								<td class='tablepage tablepageNotSelect tdHover td_margin_right' >
									<div>${i18n.t('Last Page')}</div>
								</td>
							</tr>
						</table>
					</td>
				`
			}
			// if (totalCount !== setPage) {
			// 	sPageStr += `
			// 			<td class="align_right">
			// 				<table class='outer table'>
			// 					<tr>
			// 						<td class='tablepage tablepageNotSelect tdHover td_margin_right' >
			// 							<div>${i18n.t('Get All')}</div>
			// 						</td>
			// 					</tr>
			// 				</table>
			// 			</td>
			// `
			// }

			// console.log((dCount / rowPage).toString().split('.')[0])
			// console.log((dCount / rowPage).toString().split('.')[1])
			// console.log((dCount / rowPage) + 1)
			console.log(totalCount)
			console.log("totalCount: " + totalCount + ",rowPage: " + rowPage)
			if (setPage !== totalCount) {
				sPageStr += `
							<td class='td_margin_sm'>
								<b> </b>
							</td>
							<td class=' td_margin_end table'>
								<b>, ${i18n.t("Total")} ${(totalCount / rowPage).toString().split('.')[1] == undefined ? (totalCount / rowPage).toString().split('.')[0] : ((totalCount / rowPage) + 1).toString().split('.')[0]} ${i18n.t("Pages")}</b>
							</td>
						</tr>
					</table>
				`
			} else {
				sPageStr += `
							<td class='td_margin_sm'>
								<b> </b>
							</td>
							<td class=' td_margin_end table'>
								<b> ${i18n.t("Total")} ${(totalCount / rowPage).toString().split('.')[1] == undefined ? (totalCount / rowPage).toString().split('.')[0] : ((totalCount / rowPage) + 1).toString().split('.')[0]} ${i18n.t("Pages")}</b>
							</td>
						</tr>
					</table>
				`
			}



			oObj.html(sPageStr);
			// dPageIndex = 1;
			var dPageIndex2 = 1;
			console.log("dPageIndex(IN)-2: " + dPageIndex2)

			//過濾表格內容
			oSource.children().children("tr").each(function () {

				if (dPageIndex2 <= (((dNowIndex - 1) * rowPage) + 1) || dPageIndex2 > ((dNowIndex * rowPage) + 1)) {
					$(this).hide();
				}
				else {
					$(this).show();
				}

				dPageIndex2++;
			});
			console.log("dPageIndex2(IN)-3: " + dPageIndex2)
			console.log("******************************")

			oSource.children().children("tr").first().show(); //head一定要顯示

			//加入換頁事件
			oObj.children().children().children().children().each(function () {

				$(this).click(function () {

					var _dNowIndex = $(this).find("div").text();
					console.log("dNowIndex(OUT): " + _dNowIndex)

					if (_dNowIndex > 0) {
						change_page_content(_dNowIndex);
					} else if (_dNowIndex == "顯示全部" || _dNowIndex == "Get All") {
						seach_value(0, totalCount)
						// console.log('sync btn onclick!!')
					} else if (_dNowIndex == "Next 10" || _dNowIndex == "後10頁") {
						console.log("Next 10 offsetPage" + (offsetPage++))
						// console.log("Next 10 pa" + (offsetPage * rowPage * setPage))
						if (offsetPage > 0)
							seach_value((offsetPage * rowPage * setPage + 1), rowPage * setPage)
						else
							seach_value((offsetPage * rowPage * setPage), rowPage * setPage)
						console.log("Next 10 " + _dNowIndex)
						//change_page_content(1);
					} else if (_dNowIndex == "Front 10" || _dNowIndex == "前10頁") {
						console.log("Front 10 offsetPage" + (offsetPage--))
						// console.log("Next 10 pa" + (offsetPage * rowPage * setPage))
						if (offsetPage > 0)
							seach_value((offsetPage * rowPage * setPage + 1), rowPage * setPage)
						else
							seach_value((offsetPage * rowPage * setPage), rowPage * setPage)
						console.log("Front 10 " + _dNowIndex)
						// change_page_content(dPageIndex - 20);
					} else if (_dNowIndex == "First Page" || _dNowIndex == "最前頁") {
						offsetPage = 0
						seach_value(offsetPage, rowPage * setPage)
					} else if (_dNowIndex == "Last Page" || _dNowIndex == "最末頁") {
						// offsetPage = Number(((totalCount) / rowPage * setPage).toString().split('.')[0])
						// console.log('offsetPage'+offsetPage)
						offsetPage = Number(((totalCount) / (rowPage * setPage)).toString().split('.')[0])
						if (Number(totalCount / rowPage) == Number(Number(totalCount / rowPage).toString().split('.')[0])) {
							_dNowIndex = (Number((totalCount) / (rowPage)) % setPage).toString().split('.')[0]
						}
						else {
							_dNowIndex = (Number((totalCount) / (rowPage)) % setPage + 1).toString().split('.')[0]
						}
						if (offsetPage > 0)
							seach_value((offsetPage * rowPage * setPage + 1), rowPage * setPage, _dNowIndex)
						else
							seach_value((offsetPage * rowPage * setPage), rowPage * setPage, _dNowIndex)
					}

				});
			});
		}
	};
})(jQuery);


// function click_btn() {
// 	console.log('sync btn onclick!!')
// 	change_page_content()
// 	// $('#door_info_table').tablepage($("#table_btn_group"), 10)
// }