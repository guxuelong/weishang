/**
 * Created by carry on 2016/06/18
 */

$(function() {
    var page = {
        init: function(status) {
            // 页面初始化
            $.commonAjax({
                url: 'agent/CommissionHi/myCommissionHi',
                data: { 
                    agentId: $.ls("agentId")
                },
                success: function(data) {
                    page.render(data.data);
                    page.bindEvent(data.data);
                }
            })
        },
        render: function(data) {
            data.strToDate = $.strToDate;
            $('#view').append(template('template', data));
        },
        bindEvent: function(data) {

        }
    };
    page.init();
})