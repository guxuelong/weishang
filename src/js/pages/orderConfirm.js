/**
 * Created by carry on 2016/06/18
 */

$(function() {

    var page = {
        init: function() {
            // 解析待购买产品数量

            var shoppingCarts = $.ls('shoppingCarts');
            var selectedAddress = $.ls('selectedAddress');
            if (selectedAddress) {
                var data = {
                    shoppingCarts,
                    selectedAddress,
                    hasAddress: true,
                    imgUrl: Config.imgUrl
                }
                page.render(data);
                page.bindEvent(data);
                return;
            }
            // 页面初始化
            $.commonAjax({
                url: 'agent/shippingAddress/myShippingAddress',
                data: { agentId: $.ls("agentId") },
                success: function(data) {
                    var srcData = data.data,
                        shippingAddressList = srcData.shippingAddressList;
                    $.ls('shippingAddressList', shippingAddressList);
                    srcData.shoppingCarts = shoppingCarts;
                    srcData.imgUrl = Config.imgUrl;
                    srcData.hasAddress = shippingAddressList && shippingAddressList.length;
                    page.render(srcData);
                    page.bindEvent(srcData);
                }
            })
        },
        render: function(data) {
        
            $('#view').append(template('template', data));
            page.calculate();
        },
        bindEvent: function(data) {
            $('body').on('touchend', '.js-address', function() {
                location.href = "myAddress.html";
            })
            $('body').on('touchend', '#pay', function() {
                if ($(this).attr('disabled')) {
                    return;
                }
                var jsonData = {
                    agentId: $.ls("agentId"),
                    shippingAddressId: data.selectedAddress.id
                }
                var url = '';
                if ($.getRequestData().isShoppingcart) {
                    url = 'order/order/addOrder';
                } else {
                    url = 'order/order/directOrderBuy';
                    jsonData.goodsId = data.shoppingCarts[0].goodsId;
                    jsonData.goodsQuantity = data.shoppingCarts[0].goodsQuantity;
                }
                $.commonAjax({
                    url:url,
                    type: 'post',
                    data: jsonData,
                    //contentType: 'application/json',
                    success: function(data) {
                        data.data.redirectUrl = function() {
                            location.href = 'myOrder.html'
                        }
                        $.wxPay(data.data);
                    },
                    error: function(error) {
                        $.alert(error.info)
                    }
                })
            })

            // $.spinner(function(){
            //     page.calculate();
            // });
        },
        calculate: function() {
            var sum = 0;
            $.each($('.js-product'), function(index, item) {
                var price = parseFloat($(item).data('price'));
                var count = parseInt($(item).data('count'));;
                sum = $.add(sum, $.mult(price, count))
            })
            $('#totalAmount').html('￥' + sum);
        }
    };
    page.init();
})