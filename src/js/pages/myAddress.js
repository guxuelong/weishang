/**
 * Created by carry on 2016/06/18
 */

$(function() {
    var page = {
        init: function() {
            // 页面初始化
            $.commonAjax({
                url: 'agent/shippingAddress/myShippingAddress',
                data: { agentId: $.ls("agentId") },
                success: function(data) {
                    data.data.isEdit = $.getRequestData().isEdit;
                    $.ls('shippingAddressList', data.data.shippingAddressList);
                    data.data.selectId = $.ls('selectedAddress') && $.ls('selectedAddress').id;
                    page.render(data.data);
                    page.bindEvent(data.data);
                }
            })

            // data.selectId = $.ls('selectedAddress') && $.ls('selectedAddress').id;
            // page.render(data);
            // page.bindEvent(data);
            // $.commonAjax({
            //     url: 'https://ynws.wilddogio.com/agent/shippingAddress/myShippingAddress.json',
            //     data: { agentId: $.ls("agentId") },
            //     success: function(data) {
            //         data.data.selectId = $.ls('selectedAddress') && $.ls('selectedAddress').id;
            //         page.render(data.data);
            //         page.bindEvent(data.data);
            //     }
            // })
        },
        render: function(data) {
            $('#view').append(template('template', data));
        },
        bindEvent: function(data) {
            $('body').on('touchend', '.js-select', function() {
                $.ls('selectedAddress', data.shippingAddressList[$(this).data('idx')]);
                history.go(-1);
            })

            $('body').on('touchend', '.js-edit', function() {
                $.ls('addressInfo', data.shippingAddressList[$(this).data('idx')])
                location.href = 'addAddress.html';
            })

            $('body').on('touchend', '.js-add', function() {
                $.ls('addressInfo', null)
                location.href = 'addAddress.html';
            })

            $('body').on('touchend', '.js-del', function() {
                $.commonAjax({
                    url: 'agent/shippingAddress/delAddress',
                    type: 'post',
                    data: {ids:$(this).data('id')},
                    // contentType: 'application/json',
                    success: function(data) {
                        location.reload();
                    }
                })
            })
        }
    };
    page.init();
})








// /**
//  * Created by xiewei on 16/5/25.
//  */
// var agentId = parseInt(localStorage.getItem("agentId"));
// $(document).ready(function () {
//     requestData();

//     $(".addAddr").on("click", function () {
//         window.location.href = "./shippingAddress.html";
//     });
// });
// function requestData() {
//     var param = [
//         {name:"agentId",value:agentId}
//     ];
//     /// 我的信息接口
//     bird.ajax('get', bird.url.testServer + '/agent/shippingAddress/myShippingAddress', function (result) {
//         var shippingAddressList = result.data.shippingAddressList;

//         showHtml(shippingAddressList);
//     },param);
// }
// function showHtml(shippingAddressList) {
//     var html = "";
//     for (var i = 0;i < shippingAddressList.length;i++) {
//         html += "<li>";
//         html += "<label class=\"label-checkbox item-content item-link\">";
//         //html += "<input type=\"radio\" name=\"my-radio\" checked>";
//         html += (i == 0 ? "<input type=\"radio\" name=\"my-radio\" checked>" : "<input type=\"radio\" name=\"my-radio\">");
//         html += "<div class=\"item-media\"><i class=\"icon icon-form-checkbox\"></i></div>";
//         html += "<div class=\"item-inner\">";
//         html += "<div class=\"item-subtitle\">"+shippingAddressList[i].combinAddress+"</div>";
//         html += "<div class=\"item-text\">"+shippingAddressList[i].shippingPeople+""+shippingAddressList[i].shippingMobile+"</div>";
//         html += "</div></label></li>";
//     }
//     $(".addr_list").html(html);
// }