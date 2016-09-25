$(function() {

	$.showLoader()

	let page = {
		ajaxCount: 0,
		agentId: $.getQueryString('agentId') || $.localStorage('agentId'),
		agentStatus: $.getQueryString('agentStatus') || $.localStorage('agentStatus')
	}

	page.checkCode = () => {
		$.prompt('请输入推荐码', (value) => {
	    $.showIndicator();
	    $.commonAjax({
	      url: 'recCode/recCode/checkRecCode',
	      data: {
	        agentId: page.agentId,
	        recCode: value
	      },
	      success: function(data) {
	        return ($.hideIndicator(),$.localStorage('agentStatus', 20))
	      },
	      error: function(error) {
	        return ($.hideIndicator(), $.toast(error), page.checkCode())
	      }
	  	}) 
	  }, () => {
	  	page.checkCode()
	  })
	}

	page.checkAjaxCount = () => {
		page.ajaxCount == 1 ? ($.hideLoader(), $.init()) : (page.ajaxCount ++)
	}

	page.errorCheck = () => {
		// 异常处理
		if (!page.agentId)
	  return ($.hideLoader(), $.toast('系统异常'))
		// 保存agentId到本地
	  $.localStorage('agentId', page.agentId);
	  //$.hideLoader()
		// 10代表未输入推荐码，20代表已经输入推荐码
	  if (page.agentStatus == 10)
		return ($.hideLoader(), page.checkCode())
		// 保存agentStatus到本地
		$.localStorage('agentStatus', 20)
	}

	page.renderActive = () => {
		$.commonAjax({
	    url: 'goods/goodsType/goodsTypeLimit',
	    success: (data) => {
	    	page.checkAjaxCount()
	    },
	    error: (error) => {
	      $.toast(error.info);
	    }
		}) 
	}

	page.renderSwiper = () => {
		$.commonAjax({
	    url: 'indexImage/indexImage/getIndexImg',
	    success: function(data) {
	    	let imageList= data.data.indexImgList,
	    			swiperDom = ''
	    	for (let key in imageList) {
	    			swiperDom += `<div class="swiper-slide"><img src="${Config.imgUrl + imageList[key].mongoid}" alt=""></div>`
	    	}
	    	$('#swiper').append(swiperDom)
	    	page.checkAjaxCount()
	    },
	    error: function(error) {
	      $.toast(error.info);
	    }
	  })
	}

	page.bindEvent = () => {
		$(document).on("pageInit", ".page-index", (e, id, page) => {
			$('.content').on('scroll',e => {
				if (e.target.scrollTop > 10) {
			    // 向下滚动
			    $(".fixed").css({ background: "rgba(238,238,238,1)", "border-bottom": "1px solid #eef3f5" });
			  } else {
			    // 向上滚动
			    $(".fixed").css({ background: "rgba(238,238,238,0)", "border-bottom": "none" });
			  }
    	});
		})
		// $(".content").on('scroll', e => {
		//   if (e.target.scrollTop > 10) {
		//     // 向下滚动
		//     $(".fixed").css({ background: "rgba(238,238,238,1)", "border-bottom": "1px solid #eef3f5" });
		//   } else {
		//     // 向上滚动
		//     $(".fixed").css({ background: "rgba(238,238,238,0)", "border-bottom": "none" });
		//   }
	 //  });

	  $('#search').on('focus', e => {
	  	$(".fixed").css({ background: "rgba(238,238,238,1)", "border-bottom": "1px solid #eef3f5" });
	  })

	 	$('#search').on('blur', e => {
	  	$(".fixed").css({ background: "rgba(238,238,238,0)", "border-bottom": "none" });
	  })


	}

	page.init = () => {
		page.errorCheck();
		page.renderSwiper();
		page.renderActive();
		page.bindEvent();
	}

	page.init();

	// //


 //  let page = {
 //  	agentId: $.getQueryString('agentId') || $.localStorage('agentId'),
 //  	agentStatus: $.getQueryString('agentStatus') || $.localStorage('agentStatus'),
 //    init: () => {
 //      //var agentId = $.getQueryString('agentId') || $.localStorage('agentId');
 //      //var agentStatus = $.getQueryString('agentStatus') || $.localStorage('agentStatus');
 //      let agentId = page.agentId, agentStatus = page.agentStatus;

 //      if (!agentId)
 //      return ($.hideLoader(), $.toast('系统异常'))
      
 //      // 保存agentId到本地
 //      $.localStorage('agentId', agentId);
 //      $.hideLoader()
 //      // 10代表未输入推荐码，20代表已经输入推荐码
 //      if (agentStatus == 10)
 //    	return $.prompt('请输入推荐码', function (value) {
 //    		console.log(13)
 //        //$.alert('Your name is "' + value + '". You clicked Ok button');
 //        $.showIndicator();
 //        $.commonAjax({
 //          url: 'recCode/recCode/checkRecCode',
 //          data: {
 //            agentId: agentId,
 //            recCode: value
 //          },
 //          success: function(data) {
 //            return ($.hideIndicator(),$.localStorage('agentStatus', 20))
 //          },
 //          error: function(error) {
 //            return ($.hideIndicator(), $.toast(error))
 //          }
 //      	}) 
 //      });

 //    	$.localStorage('agentStatus', 20)

 //      // if (agentId) {
 //      //     $.localStorage('agentId', agentId)
 //      //     if (agentStatus != 20) {
 //      //         $.hideLoader();
 //      //         $.confirm({
 //      //             content:'<div style="text-align:center;">请输入推荐码</div><div  style="margin-top:5px;text-align:center;"><input id="code" /></div>',
 //      //             ok: function() {

 //      //                 $.showLoading();
 //      //                 $.commonAjax({
 //      //                     url: 'recCode/recCode/checkRecCode',
 //      //                     data: {
 //      //                         agentId: agentId,
 //      //                         recCode: $('#code').val()
 //      //                     },
 //      //                     success: function(data) {
 //      //                         $.hideLoader();
 //      //                         $('#dialog').remove();
 //      //                         $.localStorage('agentStatus', 20);
 //      //                     },
 //      //                     error: function(error) {
 //      //                         $.hideLoader();
 //      //                         $.alert(error, 3000);
 //      //                     }
 //      //                 }) 
 //      //             },
 //      //             autoClose: false
 //      //         }) 
 //      //     } else {
 //      //       $.localStorage('agentStatus', 20);
 //      //       $.hideLoader();  
 //      //     }
 //      // } else {
 //      //     $.hideLoader();
 //      //     return $.alert('系统异常')
 //      // }
 //      // $.commonAjax({
 //      //     url: 'goods/goodsType/goodsTypeLimit',
 //      //     success: function(dataInfo) {
 //      //         $.commonAjax({
 //      //             url: 'indexImage/indexImage/getIndexImg',
 //      //             success: function(dataInfo2) {
 //      //                 var data = {"activeList":[{"imageUrl":"http://img18.poco.cn/mypoco/myphoto/20160624/10/17939244520160624103217088.jpg?749x417_120","webview":""},{"imageUrl":"http://img18.poco.cn/mypoco/myphoto/20160624/10/17939244520160624103217088.jpg?749x417_120","webview":""},{"imageUrl":"http://img18.poco.cn/mypoco/myphoto/20160624/10/17939244520160624103217088.jpg?749x417_120","webview":""}],"brandSaleList":[{"imageUrl":"http://img18.poco.cn/mypoco/myphoto/20160625/11/17939244520160625111128035.png?220x395_130","webview":""},{"imageUrl":"http://img18.poco.cn/mypoco/myphoto/20160625/11/17939244520160625111151073.jpg?525x208_120","webview":""},{"imageUrl":"http://img18.poco.cn/mypoco/myphoto/20160625/11/17939244520160625111229093.jpg?525x187_120","webview":""}],"dailySpecialList":[{"imageUrl":"http://img18.poco.cn/mypoco/myphoto/20160625/11/17939244520160625110201051.png?750x132_130","webview":""},{"imageUrl":"http://img18.poco.cn/mypoco/myphoto/20160625/11/17939244520160625110236090.png?475x340_130","webview":""},{"imageUrl":"http://img18.poco.cn/mypoco/myphoto/20160625/11/17939244520160625110315036.png?270x340_130","webview":""}],"hotList":[{"imageUrl":"http://img18.poco.cn/mypoco/myphoto/20160624/18/17939244520160624182159096.png?100x100_130","title":"燕窝","webview":""},{"imageUrl":"http://img18.poco.cn/mypoco/myphoto/20160624/18/1793924452016062418221804.png?100x100_130","title":"鹿茸","webview":""},{"imageUrl":"http://img18.poco.cn/mypoco/myphoto/20160624/18/17939244520160624182250042.png?100x100_130","title":"当归","webview":""},{"imageUrl":"http://img18.poco.cn/mypoco/myphoto/20160624/18/1793924452016062418231005.png?100x100_130","title":"鱼翅","webview":""},{"imageUrl":"http://img18.poco.cn/mypoco/myphoto/20160624/18/17939244520160624182334067.png?100x100_130","title":"海参","webview":""}]}
 //      //                 data.activeList = dataInfo2.data.indexImgList;
 //      //                 data.hotList = dataInfo.data.goodstypeList;
 //      //                 data.imgUrl = Config.imgUrl;
 //      //                 page.render(data);
 //      //                 page.bindEvent();
 //      //             },
 //      //             error: function(error) {
 //      //                 $.hideLoader();
 //      //                 $.alert(error.info);
 //      //             }
 //      //         })
 //      //     },
 //      //     error: function(error) {
 //      //         $.hideLoader();
 //      //         $.alert(error.info);
 //      //     }
 //      // }) 
 //    },
 //    render: function(data) {
 //        //  轮播图片加载
 //        $('#swiper').append(template('swiperTemplate', data));
 //        // 启动轮播图
 //        new Swiper('#swiper', {
 //            loop: true,
 //            autoplay: 3000,
 //            pagination: '.swiper-pagination',
 //            paginationClickable: true,
 //            autoplayDisableOnInteraction: false
 //        });
 //        $('text').val($.localStorage('text'))
 //        // 热门分类列表
 //        $('#hotList').append(template('hotListTemplate', data));

 //        // 今日特价列表
 //        $('#dailySpecialList').append(template('dailySpecialListTemplate', data));

 //        // 品牌特卖列表
 //        $('#brandSaleList').append(template('brandSaleListTemplate', data));

 //        // 滚动改变头部
 //        $(window).scroll(function() {
 //            var scrollY = $(window).scrollTop(); // 获取垂直滚动的距离，即滚动了多少        
 //            var slideHeight = $("#swiper").height();
 //            if (scrollY > 0) {
 //                // 向下滚动
 //                $(".search-box").css({ background: "rgba(238,238,238,1)", "border-bottom": "1px solid #eef3f5", transitionDuration: "1s", transitionProperty: "all", transitionTimingFunction: "ease-in-out" });
 //            } else {
 //                // 向上滚动
 //                $(".search-box").css({ background: "rgba(238,238,238,0)", "border-bottom": "none", transitionDuration: "1s", transitionProperty: "all", transitionTimingFunction: "ease-in-out" });
 //            }
 //        });
 //    },
 //    bindEvent: function() {
 //        $('body').on('touchend', '#searchBtn', function() {
 //            $.localStorage('typeId', null);
 //            $.localStorage('text', $('#text').val());
 //            location.href = 'productList.html';
 //        })

 //        $('body').on('touchend', '.js-list', function() {
 //            $.localStorage('typeId', $(this).data('id'));
 //            location.href = 'productList.html';
 //        })
        
 //    }
 //  }

  //page.init();


	// //$.showPreloader('');
	// // $.hidePreloader();
	// $.showLoader();

 //  $(".content").on('scroll',function(e){
	//   if (e.target.scrollTop > 0) {
	//     // 向下滚动
	//     $(".fixed").css({ background: "rgba(238,238,238,1)", "border-bottom": "1px solid #eef3f5", transitionDuration: "1s", transitionProperty: "all", transitionTimingFunction: "ease-in-out" });
	//   } else {
	//     // 向上滚动
	//     $(".fixed").css({ background: "rgba(238,238,238,0)", "border-bottom": "none", transitionDuration: "1s", transitionProperty: "all", transitionTimingFunction: "ease-in-out" });
	//   }
 //  });


	//$.init();
	//$.showIndicator();

});