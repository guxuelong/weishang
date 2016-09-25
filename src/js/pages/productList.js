/**
 * Created by carry on 2016/06/18
 */

$(function() {
    var page = {
        sortTypeA: 0,
        sortTypeB: 2,
        sortTypeC: 4,
        init: function(sort) {
            var jsonData = {
                agentId: $.ls("agentId"),
                sortType: sort || 0,
            };
            if ($.ls('typeId')) {
                jsonData.typeId = $.ls('typeId');
            }
            if ($('#text').val() || $.ls('text')) {
                jsonData.title = $('#text').val() || $.ls('text');
            }
            $.showLoading();
            // 页面初始化
            $.commonAjax({
                url: 'goods/goods/goodsList',
                data: jsonData,
                success: function(data) {
                    $.hideLoading();
                    data.data.imgUrl = Config.imgUrl;
                    data.data.text = $('#text').val() || $.ls('text');
                    data.data.sort = sort || 0;
                    data.data.sortTypeA = page.sortTypeA;
                    data.data.sortTypeB = page.sortTypeB;
                    data.data.sortTypeC = page.sortTypeC;
                    page.render(data.data);
                    page.bindEvent(data.data);
                },
                error: function(error) {
                    $.hideLoading();
                    $.alert(error.info)
                }
            })
        },
        render: function(data) {
            $('#view').removeChildren();
            $('#view').append(template('template', data));
        },
        bindEvent: function(data) {
            $('body').off('touchend');
            $('body').on('touchend', '.js-sort', function() {
                var sort = $(this).data('sort');

                if ( sort == 'A') {
                    if (page.sortType == 0 || page.sortType == 1) {
                        if (page.sortType == 0 ) {
                            $(this).find('p').removeClass('up');
                            page.sortType = 1;
                            page.sortTypeA = 1;
                        } else {
                            $(this).find('p').addClass('up');
                            page.sortType = 0;
                            page.sortTypeA = 0;
                        }
                    } else {
                        page.sortType = page.sortTypeA;
                    }
                } else if ( sort == 'B') {
                    if (page.sortType == 2 || page.sortType == 3) {
                        if (page.sortType == 2 ) {
                            $(this).find('p').removeClass('up');
                            page.sortType = 3;
                            page.sortTypeB = 3;
                        } else {
                            $(this).find('p').addClass('up');
                            page.sortType = 2;
                            page.sortTypeB = 2;
                        }
                    } else {
                        page.sortType = page.sortTypeB;                      
                    }
                } else if ( sort == 'C') {
                    if (page.sortType == 4 || page.sortType == 5) {
                        if (page.sortType == 4 ) {
                            $(this).find('p').removeClass('up');
                            page.sortType = 5;
                            page.sortTypeC = 5;
                        } else {
                            $(this).find('p').addClass('up');
                            page.sortType = 4;
                            page.sortTypeC = 4;
                        }
                    } else {
                        page.sortType = page.sortTypeC;                       
                    }
                } 
                page.init(page.sortType);
            })

            $('body').on('touchend', '#searchBtn', function() {
                $.ls('text' , $('#text').val())
                page.init();
            })

            $('body').on('tap', '.js-detail', function() {
                location.href = $.createUrl({
                    url: 'productDetail.html',
                    goodsId: $(this).data('id')
                });
            })
        }
    };
    page.init();
})