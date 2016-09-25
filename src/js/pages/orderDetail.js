/**
 * Created by carry on 2016/06/18
 */

$(function() {
    var page = {
        init: function() {
            // 页面初始化
            $.commonAjax({
                url: 'order/order/getOrderDetail',
                data: { 
                    agentId: $.ls("agentId"),
                    orderId: $.getRequestData().orderId
                },
                success: function(data) {
                    var srcData = data.data;
                    srcData.imgUrl = Config.imgUrl;
                    srcData.order.orderInvalDate = page.setTime(srcData.order.orderInvalDate);
                    page.render(srcData);
                    page.bindEvent(srcData);
                }
            })
        },
        render: function(data) {
            $('#view').removeChildren();
            $('#view').append(template('template', data));
        },
        bindEvent: function(data) {
            $('body').off('touchend');
            $('body').on('touchend', '.js-refund', function() {
                var orderId = $(this).data('id');
                $.confirm({ 
                    content: '<div style="text-align: center;">您是否确定进行申请退货操作？</div>', 
                    ok: function() {
                        $.commonAjax({
                            url: 'order/order/applyRefund',
                            type: 'post',
                            data: {
                                orderId: orderId
                            },
                            success: function() {
                                $.alert('申请退货成功');
                                page.init(page.status);
                            }
                        })
                    }, 
                    cancel: function() {
                    } 
                })
            })

            $('body').on('touchend', '.js-comment', function() {
                var orderId = $(this).data('id');
                location.href = $.createUrl({
                    url: 'comment.html',
                    orderId: $(this).data('id')
                });
            })

            $('body').on('touchend', '.js-pay', function() {
                $.commonAjax({
                    url:'order/order/confirmPay',
                    type: 'post',
                    data: {
                        orderId: $(this).data('id')
                    },
                    //contentType: 'application/json',
                    success: function(data) {
                        data.data.redirectUrl = function() {
                            location.reload();
                        }
                        $.wxPay(data.data);
                    },
                    error: function(error) {
                        $.alert(error.info)
                    }
                })
            })
        },
        setTime: function(value) {
            var theTime = parseInt(value);// 秒 
            var theTime1 = 0;// 分 
            var theTime2 = 0;// 小时 
            // alert(theTime); 
            if(theTime > 60) { 
            theTime1 = parseInt(theTime/60); 
            theTime = parseInt(theTime%60); 
            // alert(theTime1+"-"+theTime); 
            if(theTime1 > 60) { 
            theTime2 = parseInt(theTime1/60); 
            theTime1 = parseInt(theTime1%60); 
            } 
            } 
            var result = ""+parseInt(theTime)+"秒"; 
            if(theTime1 > 0) { 
            result = ""+parseInt(theTime1)+"分"+result; 
            } 
            if(theTime2 > 0) { 
            result = ""+parseInt(theTime2)+"小时"+result; 
            } 
            return result; 
        }
    };
    page.init();
})