/**
 * Created by carry on 2016/06/18
 */

$(function() {
    var page = {
        init: function(status, text) {
            page.status = status;
            var url = text ? '/order/order/getOrderListByName' : 'order/order/getOrderList';

            // 页面初始化
            $.commonAjax({
                url: url,
                data: { 
                    agentId: $.ls("agentId"),
                    orderStatus: status,
                    goodsName: text,
                },
                success: function(data) {
                    var srcData = data.data;
                    srcData.imgUrl = Config.imgUrl;
                    srcData.status = status || 'all';
                    srcData.strToTime = $.strToTime2;
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
            $('body').on('touchend', '.js-status', function() {
                var status = $(this).data('status');
                status = (status == 'all' ? '' : status);
                page.init(status);
            })
            $('body').on('touchend', '.js-wuliu', function() {
                location.href = $.createUrl({
                    url: 'logisticsStatus.html',
                    orderId: $(this).data('id')
                });
            })

            $('body').on('touchend', '.js-confirmreceipt', function() {
                var orderId = $(this).data('id');
                $.confirm({ 
                    content: '<div style="text-align: center;">您是否确定进行确认收货操作？</div>', 
                    ok: function() {
                        $.commonAjax({
                            url: 'order/order/confirmReceipt',
                            type: 'post',
                            data: {
                                agentId: $.ls('agentId'),
                                orderId: orderId
                            },
                            success: function() {
                                $.alert('确认收货成功');
                                page.init(page.status);
                            }
                        })
                    }, 
                    cancel: function() {
                    } 
                })
            })

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

            $('body').on('touchend', '#searchBtn', function() {
                page.init(page.status, $('#text').val());
            })

        }
    };
    page.init($.getRequestData().status);
})