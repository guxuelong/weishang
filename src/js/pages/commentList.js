/**
 * Created by carry on 2016/06/18
 */

$(function() {
    var page = {
        init: function(commentType) {
            page.commentType = commentType;
            // 页面初始化
            $.commonAjax({
                url: 'goods/goodsComment/goodsCommentList',
                data: { 
                    goodsId: $.getRequestData().goodsId,
                    commentType: commentType
                },
                success: function(data) {
                    var srcData = data.data;
                    srcData.imgUrl = Config.imgUrl;
                    srcData.commentType = commentType || '0';
                    srcData.split = function(str) { 
                        if (!str) return [];
                        return str.split(',')
                    }
                    srcData.strToDate = $.strToDate;
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
            $('body').on('touchend', '.js-type', function() {
                var commentType = $(this).data('type');
                commentType = (commentType == '0' ? '' : commentType);
                page.init(commentType);
            })
        }
    };
    page.init($.getRequestData().commentType);
})