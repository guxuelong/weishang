/**
 * Created by carry on 2016/06/20
 */


 $(function() {
	  var page = {
	  	view: $('#view'),
		init: function(isEdit) {
			// 页面初始化
			$.commonAjax({
				url: 'agent/shoppingCart/myShoppingCarts',
				data: { agentId: $.ls("agentId") },
				success: function(data) {
					if (data.code == 2) {
						// return $.alert(data.info);
						data.data = {
							ShoppingCarts: []
						}
					}
					page.data = data.data;
					page.data.imgUrl = Config.imgUrl;
					page.data.isEdit = isEdit;
					page.render(page.data);
					!isEdit && page.bindEvent();
				}
			})
		},
		render: function(data) {
			//  页面加载
			page.view.removeChildren()
			page.view.append(template('template', data));
			!data.isEdit && page.calculate();
		},
		bindEvent: function() {
			$('body').off('touchend');
			// 产品详情与产品参数的切换
			$('body').on('touchend', '#edit', function() {
				if (page.data.isEdit) {
					var updateShoppingCarts = [];
					$.each($('.js-product'), function(index, item) {
						var that = $(item);
						updateShoppingCarts.push({
							id: that.data('id'),
							agentId: $.ls("agentId"),
							goodsId: that.data('goodsId'),
							goodsQuantity: that.find('.count').val()
						})
					})
					$.commonAjax({
						url: 'agent/shoppingCart/updateMyShoppingCarts',
						type: 'post',
						data: JSON.stringify({
							updateShoppingCarts: updateShoppingCarts
						}),
						contentType: 'application/json',
						success: function(data) {
							$.alert('编辑成功', 2000, function() {
								page.init(false);
							});
						}
					})
				} else {
					page.data.isEdit = !page.data.isEdit;
					page.view.removeChildren()
					page.view.append(template('template', page.data));
				}
			})
			$('body').on('touchend', '.checkbox', function() {
				var that = $(this);
				if (that.hasClass('checkbox-s')) {
					that.removeClass('checkbox-s');
					console.log(that.hasClass('kid'));
					if (that.hasClass('kid')) {
						$('.parent').removeClass('checkbox-s');
					} else {
						$('.checkbox-s').removeClass('checkbox-s');
					}
				} else {
					that.addClass('checkbox-s');
					if (that.hasClass('kid')) {
						if ($('.kid.checkbox').length == $('.kid.checkbox.checkbox-s').length) {
							$('.parent').addClass('checkbox-s');
						}
					} else {
						$('.checkbox').addClass('checkbox-s');
					}
				}
				!page.data.isEdit && page.calculate();
			})
			$('body').on('touchend', '#balance', function() {
				var shoppingCarts = [];
				$.each($('.js-product'), function(index, item) {
					shoppingCarts.push(page.data.ShoppingCarts[$(item).data('idx')]);
				})
				$.ls('shoppingCarts', shoppingCarts);
				location.href = "orderConfirm.html?isShoppingcart=true";
			})
			$('body').on('touchend', '#delAll', function() {
					var array = [];
					$.each($('.kid.checkbox.checkbox-s'), function(index, item) {
						array.push($(item).data('id'))
					})

					$.commonAjax({
						url: 'agent/shoppingCart/clearCartByCartId',
						data: {
							agentId: $.ls("agentId"),
							cartIds: array.join(',')
						},
						type: 'post',
						success: function(data) {
							$.alert('删除成功', 2000, function() {
								page.init(page.data.isEdit);
							});
						}
					})
			})
			// 注册数量控件
			$.spinner();
		},
		calculate: function() {
			var sum = 0;
			$.each($('.js-product'), function(index, item) {
				var price = parseFloat($(item).data('price'));
				var count = parseInt($(item).data('count'));;
				sum = $.add(sum, $.mult(price, count))
			})
			$('#totalAmount').html('￥' + sum);
		}
	};
	page.init();
 })