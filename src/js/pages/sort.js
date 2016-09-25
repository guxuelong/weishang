/**
 * Created by carry on 2016/06/18
 */

$(function() {
    var page = {
        init: function(status) {

            // 页面初始化
            $.commonAjax({
                url: 'goods/goodsType/goodsTypeList',
                data: {},
                success: function(data) {
		              $.commonAjax({
		                url: 'goods/goodsType/goodsTypeList',
		                data: {
		                	typeId: data.data.goodstypeList[0].id
		                },
		                success: function(dataInfo) {
                            data.data.imgUrl = Config.imgUrl;
                            data.data.text = $.ls('text');
		                	data.data.childrenList = dataInfo.data.goodstypeList;
		                    page.render(data.data);
		                    page.bindEvent(data.data);
		                }
		            	})
                }
            })
        },
        render: function(data) {
            $('#view').removeChildren();
            $('#view').append(template('template', data));
        },
        bindEvent: function(data) {
            $('body').on('touchend', '.js-list', function() {
                $.ls('typeId', $(this).data('id'));
                $.ls('text' , null);
                location.href = "productList.html";
            })

            $('body').on('touchend', '#searchBtn', function() {
                $.ls('text', $('#text').val());
                location.href = 'productList.html';
            })

            $('body').on('touchend', '.js-change', function() {
            		$(this).addClass('active').siblings().removeClass('active');
              	$.commonAjax({
	                url: 'goods/goodsType/goodsTypeList',
	                data: {
	                	typeId: $(this).data('id')
	                },
	                success: function(data) {
                        data.data.imgUrl = Config.imgUrl;
	                    $('#children').removeChildren();
            			$('#children').append(template('childTemplate', data.data));
	                }
	            	})
            })
        }
    };
    page.init();
})
// /**
//  * Created by xiewei on 16/4/21.
//  */
// var dataArr = new Array();
// $(document).ready(function () {
//     requestData();

//     /// 初始化右侧内容
//     showRightContent(0);
// });
// /// 向右侧插入内容
// function showRightContent(tabIndex) {
//     console.log(tabIndex);
//     //$(".menutype").html(tabIndex);
//     rightContent(tabIndex);
// }
// function rightContent(tabIndex) {
//     var html = "";
//     html += "<div class=\"part1\">";
//     // html += "<div class=\"title_name\">热门推荐</div>";
//     html += "<div class=\"row\">";
//     html += "<div class=\"col-33 text-center mb10\"><img src=\"images/pic3.jpg\"><p>精品燕窝</p></div>";
//     html += "<div class=\"col-33 text-center mb10\"><img src=\"images/pic3.jpg\"><p>一级燕窝</p></div>";
//     html += "<div class=\"col-33 text-center mb10\"><img src=\"images/pic3.jpg\"><p>进口燕窝</p></div>";
//     html += "<div class=\"col-33 text-center mb10\"><img src=\"images/pic3.jpg\"><p>进口燕窝</p></div>";
//     html += "<div class=\"col-33 text-center mb10\"><img src=\"images/pic3.jpg\"><p>进口燕窝</p></div>";
//     html += "<div class=\"col-33 text-center mb10\"><img src=\"images/pic3.jpg\"><p>进口燕窝</p></div>";
//     html += "</div>";
//     html += "</div>";

//     $(".menutype").html(html);
// }
// function requestData() {
//     /// 产品分类接口
//     bird.ajax('get', bird.url.testServer + '/goods/goodsType/goodsTypeList', function (result) {
//         var goodstypeList = result.data.goodstypeList;
//         //console.log(goodstypeList);
//         for (var i = 0;i < goodstypeList.length; i++) {
//             dataArr[i] = goodstypeList[i];
//             //console.log(dataArr[i].typeName);
//         }
//         leftMenu();
//     });
//     /// 热门推荐接口TODO
// }
// /// 左侧菜单样式
// function leftMenu() {
//     var html = "<ul>";
//     for (var i = 0;i < dataArr.length;i++) {
//         if (i === 0) {
//             html += "<li class=\"active\"><a href=\"#\">"+dataArr[i].typeName+"</a></li>";
//         } else {
//             html += "<li><a href=\"#\">"+dataArr[i].typeName+"</a></li>";
//         }
//         html += ""
//     }
//     html += "</ul>";
//     document.getElementById("scroller").innerHTML = html;

//     leftMenuEffect();
// }
// /// 左侧菜单点击效果
// function leftMenuEffect() {
//     $(".ot-menu  li").click(function () {
//         tabIndex = $(this).index();
//         $(this).siblings("li").removeClass("active");
//         $(this).addClass("active");
//         $(".ot-maininfo").children(".menutype").hide();
//         $(".ot-maininfo").children(".menutype").eq(tabIndex).show();

//         showRightContent(tabIndex);
//     });
// }
