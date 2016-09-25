/**
 * Created by carry on 2016/06/18
 */

$(function() {
    var page = {
        init: function() {
            // 页面初始化
            $.commonAjax({
                url: 'order/order/expressQuery',
                data: { orderId: $.getRequestData().orderId },
                success: function(data) {
                	var express = JSON.parse(data.data.expressJson);
                	express.status = {
                		'0':'在途',
										'1':'揽件',
										'2':'疑难',
										'3':'签收',
										'4':'退签',
										'5':'派件',
										'6':'退回',
                	}[express.state];
                  page.render({expressJson:express});
                }
            })
        },
        render: function(data) {
            $('#view').append(template('template', data));
        }
    };
    page.init();
})