/**
 * Created by carry on 2016/06/18
 */

$(function() {
    var page = {
        init: function(status) {
            // 页面初始化
            $.commonAjax({
                url: 'agent/agent/myMessage',
                data: { 
                    agentId: $.ls("agentId")
                },
                success: function(data) {
                    $.ls('agent', data.data.agent);
                    page.render(data.data);
                    page.bindEvent(data.data);
                }
            })
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
            $('body').on('touchend', '.js-share', function() {
                $.showLoading();
                $.commonAjax({
                    url: 'userQRcode/getQrcode',
                    data: {
                        agentId: $.ls('agentId')
                    },
                    success: function(data) {
                        $.commonAjax({
                            url: 'recCode/recCode/getRecCode',
                            success: function(dataInfo) {
                                var url = $.createUrl({
                                    url: 'share.html',
                                    qrcodeUrl: data.qrcodeUrl,
                                    recCode: dataInfo.data.recCode
                                });
                                location.href = url;
                            }
                        })
                    }
                })
            })
        }
    };
    page.init();
})