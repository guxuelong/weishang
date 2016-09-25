/**
 * Created by carry on 2016/06/18
 */

$(function() {
    var page = {
        init: function(status) {
            // 页面初始化
            var data = {
            	agent: $.ls('agent')
            }
            page.render(data);
           page.bindEvent(data);
        },
        render: function(data) {
            $('#view').append(template('template', data));
        },
        bindEvent: function(data) {
            $('body').on('touchend', '.js-status', function() {
                var status = $(this).data('status');
                page.init(status);
            })
            $('body').on('touchend', '.js-href', function() {
                location.href = $(this).data('href');
            })

            $('body').on('touchend', '#qr', function() {
                $.commonAjax({
                    url: 'userQRcode/getQrcode',
                    data: {
                        agentId: $.ls('agentId')
                    },
                    success: function(data) {
                        $.fullImage(data.qrcodeUrl);
                    }
                })
            })
        }
    };
    page.init();
})