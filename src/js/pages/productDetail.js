/**
 * Created by carry on 2016/06/18
 */


$(function() {

    var page = {
        init: function() {
            // 页面初始化
            $.commonAjax({
                url: 'goods/goods/goodsDetails',
                data: { 
                    agentId: $.ls("agentId"),
                    goodsId: $.getRequestData().goodsId 
                },
                success: function(data) {
                    // 辅助产品详情参数
                    //data.data.goodstypeList = dataInfo.data.goodstypeList;
                    // 创建价格管理模型
                    data.data.imgUrl = Config.imgUrl;
                    data.data.priceObj = page.managePrice(data.data.Goods.goodsJson, data.data.agentLevel,data.data.goodsAttrs);
                    page.render(data.data);
                    page.bindEvent(data.data);
                }
            })
        },
        render: function(data) {
            //  轮播图片加载
            $('#view').append(template('template', data));
            // 启动轮播图
            new Swiper('#swiper', {
                loop: true,
                autoplay: 3000,
                pagination: '.swiper-pagination',
                paginationClickable: true,
                autoplayDisableOnInteraction: false
            });


            var iframe = document.createElement("iframe");
            iframe.height = $(window).height() - 143;
            iframe.width = '100%';
            iframe.frameBorder = 0;
            iframe.scrolling = "yes";
            $('#detail').append(iframe);
            var iframeDoc = iframe.contentWindow.document;
            iframe.onload = function() {
                var h = $(iframeDoc.body).find('div').eq('0').height();
                $(iframeDoc.body).find('div').eq('0').height(h);
                iframe.height = h - 143;
            };
            iframeDoc.open();
            iframeDoc.write('<body style="overflow-x:hidden; -webkit-user-select:none; margin:0; padding: 10px; line-height:150%; width:100%;"><style>img{width:100% !important; height: auto !important!}</style><div>' + $.htmlDecodeByRegExp(data.goodsDetails) + '</div></body>');
            iframeDoc.close();
            // 注册数量控件
            $.spinner();
        },
        bindEvent: function(data) {
            // 产品详情与产品参数的切换
            $('body').on('touchend', '.js-switch', function() {
                $(this).addClass('on').siblings().removeClass('on');
                $('#' + this.title).show().siblings().hide();
            })

            $('body').on('touchend', '#addCart', function() {

                $.commonAjax({
                    url: 'agent/shoppingCart/addGoodsToShoppingCart',
                    type: 'post',
                    data: { 
                        agentId: $.ls("agentId"),
                        goodsSkuId: page.priceObj.skuId,
                        goodsQuantity: $('.count').val()
                    },
                    success: function(data) {
                        $.alert('加入购物车成功')
                    }
                })
                
                //location.href = "shoppingcartList.html"
            })

            $('body').on('touchend', '#buy', function() {
                $.ls('shoppingCarts', [{
                    goodAttrsDisp: page.goodAttrsDisp,
                    goodAttrs:page.goodAttrs,
                    goodsId:page.priceObj.skuId,
                    goodsName:data.Goods.title,
                    goodsPrice:page.priceObj.presentPrice,
                    originalPrice: page.priceObj.originalPrice,
                    goodsQuantity:$('.count').val(),
                    mongoId:data.goodsImagesList[0].imagesMongoid}]);
                location.href = "orderConfirm.html";
            })

            $('body').on('touchend', '.js-select', function() {
                $(this).addClass('on').siblings().removeClass('on');
                var attrs = [];
                    page.goodAttrsDisp = [];
                $.each($('.js-select.on'), function(index, item) {
                    var that = $(item);
                    page.goodAttrsDisp.push({
                        attributeKey: that.parent().data('name'),
                        attributeValue: that.data('value')
                    })
                    attrs.push(that.data('id'));
                })
                page.goodAttrs = attrs.join(',') + ',';
                page.priceObj = page.goodsJson[page.goodAttrs];
                $('#presentPrice').html('￥' + page.priceObj.presentPrice);
                $('#originalPrice').html('￥' + page.priceObj.originalPrice);
                $('#surplusStock').html('库存' + page.priceObj.surplusStock);
                $('.plus').data('limit', page.priceObj.surplusStock);
                if (parseInt($('.count').val()) > parseInt(page.priceObj.surplusStock)) {
                    $('.count').val(page.priceObj.surplusStock);
                }
            })

            $('body').on('touchend', '#lookOverComment', function() {
                location.href = "commentList.html?goodsId=" + $(this).data('id');
            })     
        },
        managePrice: function(goodsJson, agentLevel, goodsAttrs) {
            agentLevel = agentLevel || 1;
            goodsJson = JSON.parse(goodsJson);
            if (!page.goodsJson) {
                page.goodsJson = {};
                for (var key in goodsJson) {
                    var item = goodsJson[key];
                    page.goodsJson[item.attrs] = {
                        originalPrice: item.originalPrice,
                        presentPrice: item.presentPrice.split(',')[agentLevel-1],
                        surplusStock: item.surplusStock,
                        skuId: item.skuId
                    }
                }

                var attrs = [];
                page.goodAttrsDisp = [];
                for (var kk in goodsAttrs) {
                    page.goodAttrsDisp.push({
                        attributeKey: goodsAttrs[kk].attrName,
                        attributeValue: goodsAttrs[kk].goodsAttrvalueRespList[0].attrValue
                    })
                    attrs.push(goodsAttrs[kk].goodsAttrvalueRespList[0].id);
                }
                page.goodAttrs = attrs.join(',') + ',';
                page.priceObj = page.goodsJson[page.goodAttrs];
                return page.priceObj;
            }
        }
    };
    page.init();
})







//  //轮播图
//             var mySwiper = new Swiper('#banner',{
//                 loop: true,
//                 autoplay: 3000,
//                 pagination:'.swiper-pagination',
//                 paginationClickable:true,
//                 autoplayDisableOnInteraction:false
//             });

// var agentId = parseInt(localStorage.getItem("agentId"));
// $(document).ready(function() {
//     swiperContainer();
//     requestData();
//     requestProParamData();

//     $("#addBtn").on("click",function() {
//         requestFinishData();
//     });
//     $(".commentAmount").on("click", function () {
//         window.location.href = "./commentList.html";
//     });
//     $(".buyBtn").on("click", function () {
//         window.location.href = "./buyCart.html";
//     });
// });
// function requestFinishData() {
//     var param = [
//         {name: "agentId", value: agentId},
//         {name:"goodsId",value:28},
//         {name:"goodsQuantity",value:5},
//         {name:"goodAttrs",value:'24,25'}
//     ];
//     //alert("requestFinishData");
//     bird.ajax('post', bird.url.testServer + '/agent/shoppingCart/addGoodsToShoppingCart', function (result) {
//         var code = result.code;

//         if (code == 0) {
//             alert("添加成功");
//         }
//     },param);
// }
// function requestData() {
//     /// 我的信息接口
//     bird.ajax('get', bird.url.testServer + '/goods/goods/goodsDetails?userId=1&goodsId=25', function (result) {
//         var goodsImagesList = result.data.goodsImagesList;
//         var commentNum = result.data.commentNum;
//         var commentTwoList = result.data.commentTwoList;
//         var goodsDetails = result.data.goodsDetails;
//         var Goods = result.data.Goods;

//         showSwiperHtml(goodsImagesList);
//         showCommentTwoList(commentNum,commentTwoList);
//         showGoods(Goods);
//     });
// }
// function requestProParamData() {
//     var param = [
//         {name:"goodsId",value:24}
//     ];
//     bird.ajax('get', bird.url.testServer + '/goods/goodsAttr/goodsAttrList', function (result) {
//         var goodstypeList = result.data.goodstypeList;

//         showProParamHtml(goodstypeList);
//     },param);
// }
// function showProParamHtml(goodstypeList) {
//     var html = "";
//     for (var i = 0;i < goodstypeList.length;i++) {
//         var attributeKey = goodstypeList[i].attributeKey;
//         var attributeValue = goodstypeList[i].attributeValue;

//         html += "<li class=\"item-content\"><div class=\"item-inner\">";
//         html += "<div class=\"item-title\">"+attributeKey+"</div>";
//         html += "<div class=\"item-after\">"+attributeValue+"</div>";
//         html += "</div></li>";
//     }
//     $(".production_param").html(html);
// }
// function showGoods(Goods) {
//     console.log(Goods);
//     $(".content_pro_parameter_title_big").html(Goods.title);
//     $(".content_pro_parameter_title_small").html(Goods.subTitle);
//     $(".content_pro_parameter_price").html(Goods.presentPrice);
//     $(".surplusStock").html("库存"+Goods.surplusStock);
// }
// function showSwiperHtml(goodsImagesList) {
//     var html = "";
//     for (var i = 0;i < goodsImagesList.length;i++) {
//         //alert(bird.url.testServer);
//         html += "<div class=\"swiper-slide\"><img src=\""+bird.url.testServer+""+goodsImagesList[i].imagesMongoid+"\" alt=\"产品图片\"></div>";
//     }
//     $(".swiper-wrapper").html(html);
// }
// function showCommentTwoList(commentNum,commentTwoList) {
//     $(".content_pro_parameter_comment").html("评价:"+commentNum+"条");
//     $(".commentNum").html("共"+commentNum+"条评价");

//     var html = "";
//     for (var i = 0;i < commentTwoList.length;i++) {
//         var createDate = transformData(commentTwoList[i].createDate);
//         var y = createDate.getFullYear();
//         var m = createDate.getMonth() + 1;
//         var d = createDate.getDate();
//         createDate = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);

//         html += "<div class=\"part1\"><ul><li><a href=\"#\" class=\"item-content\">";
//         html += "<div class=\"item-customize-media\"><img src=\""+bird.url.testServer+""+commentTwoList[i].agentImage+"\"></div>";
//         html += "<div class=\"item-inner\"><div class=\"item-title-row\">";
//         html += "<div class=\"item-title\">"+commentTwoList[i].agentName+"<span>&nbsp;vip"+commentTwoList[i].agentLevel+"</span></div>";
//         html += "<div class=\"item-after\">"+createDate+"</div>";
//         html += "</div><div class=\"item-subtitle\">"+commentTwoList[i].commentContent+"</div>";
//         html += "<div class=\"item-text\">"+commentTwoList[i].goodsAttrList+"</div>";
//         html += "</div></a></li></ul></div>";
//     }
//     $(".part_title").after(html);
// }



// function showHtml(commissionHis) {
//     var html = "";
//     for (var i = 0;i < commissionHis.length;i++) {
//         //var createDate = transformData(commissionHis[i].createDate);
//         //var y = createDate.getFullYear();
//         //var m = createDate.getMonth() + 1;
//         //var d = createDate.getDate();
//         //createDate = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);

//     }
//     $(".content").html(html);
// }


// function btnClick(id) {
//     $(id).siblings().removeClass('on');
//     $(id).addClass('on');
// };
// $('.para-select li').on('click',function(){
//   var _this=$(this);
//   btnClick(_this);
// });
//  // 商品增减按钮
//     $(".decrease").click(function(){
//       var goodsNum = $(this).siblings().find("input").val();
//       goodsNum = parseInt(goodsNum) - 1;
//       if(goodsNum < 0){
//         goodsNum = 0
//       }
//       $(this).siblings().find("input").val(goodsNum);
//     })
//     $(".increase").click(function(){
//       var goodsNum = $(this).siblings().find("input").val();
//       goodsNum = parseInt(goodsNum) + 1;
//       $(this).siblings().find("input").val(goodsNum);
//       //库存不足
//       if(goodsNum>1){
//         $(".stock_tip").show();
//       }
//     }) ;
//  //tab切换
//      window.onload = function(){
//       var $li = $('.pros_tab li');
//       var $tabs = $('.pro_tab_con');             
//       $li.click(function(){
//         var $this = $(this);
//         var $t = $this.index();
//         $li.removeClass();
//         $this.addClass('on');
//         $tabs.css({"display":"none"});
//         $tabs.eq($t).css({"display":"block"});
//         return false;         
//       })        
//     }
