/**
 * Created by carry on 2016/06/18
 */
$(function() {
    var page = {
        init: function() {
        	
        	$.commonAjax({
                url: 'order/order/getOrderDetail',
                data: { 
                    agentId: $.ls("agentId"),
                    orderId: $.getRequestData().orderId
                },
                success: function(data) {
                    var srcData = data.data;
                    srcData.imgUrl = Config.imgUrl;
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
            $('body').on('touchend', '#submit', function() {
                var goodsCommentVoList = [];
                $.each($('.js-goods'), function(index, item) {
                    var idx = $(item).data('idx');
                    goodsCommentVoList.push({
                        skuId: data.order.orderGoosResps[idx].goodsId,
                        commentContent: $(item).find('.js-text').val(),
                        commentLevel: $("input[name='my-radio-"+ idx +"']:checked").val(),
                        commentImage: $(item).find('.js-file').data('file')
                    })
                })

                console.log(goodsCommentVoList)
            	var query = $.getRequestData();
                $.commonAjax({
                    url: 'goods/goodsComment/saveComment',
                    type: 'post',
                    data: JSON.stringify({ 
                            "goodsCommentVoList": goodsCommentVoList, 
                            "agentId": $.ls("agentId"), 
                            "orderId": $.getRequestData().orderId 
                        }),
                    contentType: 'application/json',
                    success: function(data) {
                        $.alert('评价成功', 2000, function() {
                            history.go(-1);
                        })
                    }
                })

            })
            $('.js-file').on('change', function() {
                var that = $(this);
            	if(window.FormData) {　
			　　　　var formData = new FormData();
			　　　　// 建立一个upload表单项，值为上传的文件
			　　　　formData.append('apkFile', that[0].files[0]);
			　　　　var xhr = new XMLHttpRequest();
			　　　　xhr.open('POST', Config.baseUrl + 'db/mongod/upload');
			　　　　// 定义上传完成后的回调函数
			　　　　xhr.onload = function () {
			　　　　　　if (xhr.status === 200) {
                            that.data('file', JSON.parse(xhr.responseText).mongoid)
			　　　　　　} else {
			　　　　　　　　$.alert('上传失败，请重新选择')
			　　　　　　}
			　　　　};
			　　　　xhr.send(formData);
			　　}
            })
        }
    };
    page.init();
})


	