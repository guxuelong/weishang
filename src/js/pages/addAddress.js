var addressInfo = $.ls('addressInfo');
if (addressInfo) {
	$('#zipcode').val(addressInfo.zipcode);
	$('#shippingPeople').val(addressInfo.shippingPeople);
	$('#shippingMobile').val(addressInfo.shippingMobile);
	$('#detailAddress').val(addressInfo.detailAddress);
	$('#city-picker').val(addressInfo.combinAddress);
}



$("#city-picker").cityPicker({
    toolbarTemplate: '<header class="bar bar-nav">\
<button class="button button-link fr close-picker">确定</button>\
<h1 class="title">选择收货地址</h1>\
</header>'
});


$('body').on('touchend', '#save', function() {
	$.commonAjax({
		url: 'agent/shippingAddress/addShippingAddress',
		type: 'post',
		data: {
			id: addressInfo && addressInfo.id,
			agentId: $.ls('agentId'),
			zipcode: $('#zipcode').val(),
			detailAddress: $('#detailAddress').val(),
			shippingPeople: $('#shippingPeople').val(),
			shippingMobile: $('#shippingMobile').val(),
			combinAddress: $('#city-picker').val()
		},
		success: function() {
			$.alert('保存成功', 2000,function() {
				$.ls('addressInfo',null);
				history.go(-1);
			})
		}
	})
})