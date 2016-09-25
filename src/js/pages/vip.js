/**
 * Created by carry on 2016/06/18
 */

$(function() {
    var page = {
        init: function(status) {
            // 页面初始化
            $.commonAjax({
                url: 'agent/agentRole/findAgentRole',
                data: {
                    agentId:  $.ls('agentId')
                },
                success: function(data) {
                    page.render(data.data);
                    page.bindEvent(data.data);
                }
            })
            
        },
        render: function(data) {
            $('#view').append(template('template', data));
        },
        bindEvent: function(data) {
            $('body').on('touchend', '.js-pay', function(){
                $.commonAjax({
                    url:'agent/agent/toBeMembers',
                    type: 'post',
                    data: {
                       agentId:  $.ls('agentId'),
                       membersId: $(this).data('id') 
                    },
                    //contentType: 'application/json',
                    success: function(data) {
                        data.data.redirectUrl = function() {
                            history.go(-1);
                        }
                        $.wxPay(data.data);
                    },
                    error: function(error) {
                        $.alert(error.info)
                    }
                })
            })
        }
    };
    page.init();
})