/**
 * Created by carry on 2016/06/18
 */

// 公共配置项
window.Config = {
  baseUrl: 'http://www.sijishiyuan.com/yn-wx/a/',
  //baseUrl: 'http://sunny123.ngrok.cc/yn-wx/a/',
}
Config.imgUrl = Config.baseUrl + 'db/mongod/picture/';



/**
 * HTML5 获取url中参数
 * $.getQueryString('openId')
 *
 */
$.getQueryString = (name) => { 
	let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	let r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}

// json to object
$.paseJson = (o) => {
    if($.isNumber(o)) {
        return o;
    }
    let result;
    try {
        result = JSON.parse(o);
        if (typeof(result) !== 'object') {
            return o;
        }
    } catch (e) {
        result = o;
    }
    return result;
}

/**
 * HTML5 LocalStorage 本地存储
 *
 * save     $.ls("sample","123")
 * get      $.ls("sample")
 * delete   $.ls("sample",null) *
 *
 *_prefix  批量删除前缀，不传则删除全部
 */
$.localStorage = (key, value) => {

		let ls = window.localStorage || window.sessionStorage;

		let save = (key, value) => {
      ls.setItem(key, value);
    }

    if (arguments.length > 1) {
        return value == null ? ls.removeItem(key) : typeof(value) != "object" ? save(key, value) : save(key, JSON.stringify(value));
    }
    return $.paseJson(ls.getItem(key));
}; 





//  微信隐藏
wx.config({jsApiList: ['hideOptionMenu']}); 
wx.ready(function(){wx.hideOptionMenu();});



$.showLoader = function() {
	if (!$('#loading').length) {
		$('body').append(
			`<div id="loading" class="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>`)
	} else {
		$('#loading').show();
	}
}

$.hideLoader = function() {
	$('#loading').hide();
}

/*** Ajax 统一处理方法 ***/
var lock = {};
$.commonAjax = function(options) {
  if (lock[options.url]) {
    return false;
  }
  lock[options.url] = 1;

  var ops = $.extend({}, $.commonAjax.defaults, options),
    dataJson = ops.data;

  // if (ops.type.toUpperCase() != "GET") {
  //     dataJson = JSON.stringify(ops.data);
  // }
  return $.ajax({
    type: ops.type ? ops.type : 'GET',
    url: (ops.host + ops.url),
    data: dataJson,
    dataType: 'json',
    headers: ops.headers,
    timeout: 15000,
    async: ops.async,
    cache: false,
    beforeSend: ops.beforeSend,
    success: function(data) {
      if (data.code == 0) {
        lock[options.url] = 0;              
        ops.success && ops.success(data); 
      } else {
        lock[options.url] = 0;
        if (ops.error) {
          ops.error(data.info);
        } else {
          $.toast(data.info);
        }
      }
    },
    contentType: ops.contentType,
    error: function(data) {
      lock[options.url] = 0;
      ops.error && ops.error(data.info);
    }
  });
};
$.commonAjax.defaults = {
  host: Config.baseUrl,
  type: 'GET',
  url: null,
  data: {},
  openDialog: true,
  processData: true,
  //contentType: 'application/json',
  //dataType: 'json',
  timeout: 3000,
  headers: {},
  defaultErrorMsg: '获取信息失败',
  async: true,
  global: true,
  context: window,
  traditional: false
};
/*** Ajax 统一处理方法 ***/




// var loading = $('#loading');
// $.showLoading = function() {
//     loading.show();
// };

// $.hideLoading = function() {
//     loading.hide();
// };
// /*
// *  微信支付
// */

// $.wxPay = function(options) {

//     function onBridgeReady(){
//        WeixinJSBridge.invoke(
//            'getBrandWCPayRequest', {
//                "appId" : options.appId,     //公众号名称，由商户传入     
//                "timeStamp" : options.timeStamp,         //时间戳，自1970年以来的秒数     
//                "nonceStr"  :  options.nonceStr, //随机串     
//                "package"  :  options.package,     
//                "signType" :  options.signType,         //微信签名方式：     
//                "paySign"  :  options.paySign //微信签名 
//            },
//            function(res){     
//                if(res.err_msg == "get_brand_wcpay_request:ok" ) {
//                     options.redirectUrl();
//                } else if (res.err_msg == "get_brand_wcpay_request:cancel" ) {
//                     $.alert('支付取消')
//                } else if (res.err_msg == "get_brand_wcpay_request:fail" ){
//                     $.alert('支付失败')
//                }
//            }
//        ); 
//     }
//     if (typeof WeixinJSBridge == "undefined"){
//        if( document.addEventListener ){
//            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
//        }else if (document.attachEvent){
//            document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
//            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
//        }
//     }else{
//        onBridgeReady();
//     }

//     // wx.config({
//     //     debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//     //     appId: options.appId, // 必填，公众号的唯一标识
//     //     timestamp: options.timestamp, // 必填，生成签名的时间戳
//     //     nonceStr: options.nonceStr, // 必填，生成签名的随机串
//     //     signature: options.signature,// 必填，签名，见附录1
//     //     jsApiList: [
//     //         'chooseWXPay'
//     //     ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
//     // });

//     // wx.ready(function(){
//     //     wx.chooseWXPay({
//     //         timestamp: options.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
//     //         nonceStr: options.nonceStr, // 支付签名随机串，不长于 32 位
//     //         package: options.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
//     //         signType: options.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
//     //         paySign: options.paySign, // 支付签名
//     //         success: function (res) {
//     //             // 支付成功后的回调函数
//     //             alert('pay success')
//     //         }
//     //     });
//     // });

//     // wx.error(function(res){
//     //     alert('error')
//     // });
// }


// /* 防重复提交 */

// // json to object
// $.paseJson = function(o) {
//     if($.isNumber(o)) {
//         return o;
//     }
//     var result;
//     try {
//         result = JSON.parse(o);
//         if (typeof(result) !== 'object') {
//             return o;
//         }
//     } catch (e) {
//         result = o;
//     }
//     return result;
// }
// /**
//  * HTML5 LocalStorage 本地存储
//  *
//  * save     $.ls("sample","123")
//  * get      $.ls("sample")
//  * delete   $.ls("sample",null) *
//  *
//  *_prefix  批量删除前缀，不传则删除全部
//  */
// $.ls = function(key, value) {

//     var ls = window.localStorage || window.sessionStorage;

//     if (arguments.length > 1) {
//         return value == null ? ls.removeItem(key) : typeof(value) != "object" ? save(key, value) : save(key, JSON.stringify(value));
//     }
//     return $.paseJson(ls.getItem(key));

//     function save(key, value) {
//         ls.setItem(key, value);
//     }
// };
// $.isNumber = function(string) {
//     return /^[0-9]*$/.test(string);
// }

// $.ls_del_prefix = function(_prefix) {
//     var ls = window.localStorage || window.sessionStorage;
//     if (_prefix == undefined || _prefix == null) {
//         ls.clear();
//         return;
//     }
//     var leng = ls.length;
//     for (var i = 0; i < leng; i++) {
//         var key = ls.key(i);
//         if (key && key.indexOf(_prefix) == 0) {
//             ls.removeItem(ls.key(i));
//         }
//     }
// }

// // 数量控件
// $.spinner = function(callback) {
//     // if ($(".plus").data("limit") === 0) {
//     //     $(".plus").data("limit", 99);
//     // } else if ($(".plus").data("limit") === 1) {
//     //     $(".plus").addClass('disabled');
//     //     $(".count").addClass('disabled').attr('readonly', true);
//     // }
//     $('body').on("touchend", '.plus:not(.disabled)', function() {
//         var _this = $(this),
//             input = _this.prev();
//         if (!parseInt(input.val())) {
//             input.val(0);
//         }
//         input.val(parseInt(input.val()) + 1);
//         if (parseInt(input.val()) >= parseInt(_this.data("limit"))) {
//             input.val(_this.data("limit"));
//             _this.addClass("disabled");
//         }
//         if (input.val() > 1) {
//             _this.parent().find(".minus").removeClass("disabled");
//         }
//         callback && callback(this);
//     });
//     $('body').on("touchend", '.minus:not(.disabled)', function() {

//         var _this = $(this),
//             input = _this.next();
//         if (!parseInt(input.val())) {
//             input.val(2);
//         }
//         input.val(parseInt(input.val()) - 1);
//         if (parseInt(input.val()) == 1) {
//             _this.addClass("disabled");
//         }
//         _this.parent().find(".plus").removeClass("disabled");
//         callback && callback();
//     });
//     $("body").on("keyup", '.count', function(event) {
//         var _this = $(this),
//             minus = _this.parent().find(".minus"),
//             plus = _this.parent().find(".plus");
//         window.last = event.timeStamp; //利用event的timeStamp来标记时间，这样每次的keyup事件都会修改last的值，注意last必需为全局变量
//         setTimeout(function() { //设时延迟0.5s执行
//             if (window.last - event.timeStamp == 0) //如果时间差为0（也就是你停止输入0.5s之内都没有其它的keyup事件发生）则做你想要做的事
//             {
//                 //做你要做的事情
//                 minus.addClass("disabled");
//                 plus.addClass("disabled");
//                 var temp = parseInt(_this.val());

//                 if (_this.val() === '') {
//                     return;
//                 }
//                 if (isNaN(temp) || temp === 0) {
//                     _this.val(1);
//                             callback && callback();
//                     return;
//                 }

//                 _this.val(temp);

//                 if (parseInt(_this.val()) >= _this.next().data("limit")) {
//                     _this.val(_this.next().data("limit"));
//                     if (_this.val() > 1) {
//                         minus.removeClass("disabled");
//                     }
//                             callback && callback();
//                     return;
//                 }

//                 if (_this.val() > 1) {
//                     minus.removeClass("disabled");
//                 }

//                 plus.removeClass("disabled");

//                 callback && callback();
//             }
//         }, 500);
//     });
//     $("body").on("blur", '.count', function() {
//         var _this = $(this),
//             minus = _this.parent().find(".minus");
//         if (_this.val() === '') {
//             minus.addClass("disabled");
//              _this.val(1);
//             return;
//         }
//     });
// };

// // 删除该父节点的子节点
// $.fn.removeChildren = function() {
//     $(this).children().remove();
// };

// // 从url中取参数
// $.getRequestData = function(url) {
//     if (url) {
//         if (url.indexOf("?") == -1) {
//             return {};
//         } else {
//             url = '?' + url.split('?').pop();   
//         }
//     } else {
//         //获取url中"?"符后的字串
//         url = location.search;
//     }
//     var theRequest = {};
//     if (url.indexOf("?") != -1) {
//         var str = url.substr(1);
//         var strs = str.split("&");
//         for (var i = 0; i < strs.length; i++) {
//             theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
//         }
//     }
//     return theRequest;
// };
// // 对象生成url
// $.createUrl = function(obj) {
//     var length = obj && obj.length,
//         idx = 0,
//         url = obj.url + '?';
//     for (var key in obj) {
//         if(key != 'url' && obj[key] !== null){
//             url += (key + '=' + encodeURIComponent(obj[key]) + '&');
//         }
//     }
//     return url.substring(0,url.lastIndexOf('&'));
// };



// /**
//  * 弹出框框
//  *
//  */
// ;
// (function($, window, undefined) {

//     var win = $(window),
//         doc = $(document),
//         count = 1,
//         isLock = false;

//     var Dialog = function(options) {
//         this.settings = $.extend({}, Dialog.defaults, options);
//         this.init();
//     };

//     Dialog.prototype = {
//         /**
//          * 初始化
//          */
//         init: function() {
//             this.create();
//         },
//         /**
//          * 创建
//          */
//         create: function() {
//             if (this.settings.type == 'confirm') {
//                 var title = this.settings.title;
//                 var source = [
//                 '<div id="dialog" class="ui-pop-box ui-align-end">',
//                 '   <div class="ui-pop-confirm">',
//                 '       <div class="ui-confirm-top">',
//                 '           <%=# data.content %>',
//                 '       </div>',
//                 '       <div class="ui-confirm-bottom">',
//                 '           <button style="',
//                 'display: <%= data.showOk ? "block" : "none"%>',
//                 '" class="js-confirm-ok ok"><%= data.okText %></button>',
//                 '           <button style="',
//                 'display: <%= data.showCancel ? "block" : "none"%>',
//                 '" class="js-confirm-cancel"><%= data.cancelText %></button>',
//                 '       </div>',
//                 '   </div>',
//                 '</div>'].join('');
//                 var render = template.compile(source);
//                 var  html = render({
//                     data: {
//                         title:this.settings.title,
//                         content:this.settings.content,
//                         okText: this.settings.okText,
//                         cancelText: this.settings.cancelText,
//                         showOk: !!this.settings.ok,
//                         showCancel: !!this.settings.cancel
//                     }
//                 });
//                 $('body').append(html);
//                 // 设置cancel按钮
//                 if ($.isFunction(this.settings.cancel)) {
//                     this.cancel();
//                 }

//                 // 设置ok按钮
//                 if ($.isFunction(this.settings.ok)) {
//                     this.ok();
//                 }
//                 return;
//             }
            
//             if (this.settings.lock) {
//                 this.lock();
//             }

//             if (!isNaN(this.settings.time) && this.settings.time != null) {
//                 this.time();
//             }

//             var title = this.settings.title;
//             var divHeader = {
//                 'alert': ' ',
//                 null: ' '
//             }[title] || '<div class="rDialog-header-' + this.settings.title + '"></div>';

//             // HTML模板
//             var wrap = 'rDialog-wrap' + {
//                 'alert': '-alert'
//             }[title];
//             var divContent = title === 'load' ? "" : ('<div class="rDialog-content">' + this.settings.content + '</div>');
//             var templates = '<div class="' + wrap + '">' +
//                 divHeader +
//                 divContent +
//                 '<div class="rDialog-footer"></div>' +
//                 '</div>';

//             // 追回到body
//             this.dialog = $('<div>').addClass('rDialog').css({
//                 zIndex: this.settings.zIndex + (count++)
//             }).html(templates).prependTo('body');


//             // 设置cancel按钮
//             if ($.isFunction(this.settings.cancel)) {
//                 this.cancel();
                
//             }

//             // 设置ok按钮
//             if ($.isFunction(this.settings.ok)) {
//                 this.ok();
//             }


//             // 设置大小
//             this.size();

//             // 设置位置
//             this.position();
//         },


//         /**
//          * cancel
//          */
//         cancel: function() {

//             var _this = this;
//             $('.js-confirm-cancel').on("touchend", function() {
//                 var cancelCallback = _this.settings.cancel();
//                 if (cancelCallback == undefined || cancelCallback) {
//                     _this.autoClose && _this.close();
//                 }
//             });
//         },

//         /**
//          * ok
//          */

//         ok: function() {
//             var _this = this;
//             $('.js-confirm-ok').on("touchend", function() {
//                 var okCallback = _this.settings.ok();
//                 if (okCallback == undefined || okCallback) {
//                     _this.autoClose && _this.close();
//                 }
//             });
//         },

//         /**
//          * 设置大小
//          */
//         size: function() {

//             var content = this.dialog.find('.rDialog-content'),
//                 wrap = this.dialog.find('.rDialog-wrap');

//             content.css({
//                 width: this.settings.width,
//                 height: this.settings.height
//             });
//             //wrap.width(content.width());
//         },

//         /**
//          * 设置位置
//          */
//         position: function() {

//             var _this = this,
//                 winWidth = win.width(),
//                 winHeight = win.height(),
//                 scrollTop = 0;

//             this.dialog.css({
//                 left: (winWidth - _this.dialog.width()) / 2,
//                 top: (winHeight - _this.dialog.height()) / 2 + scrollTop
//             });

//         },

//         /**
//          * 设置锁屏
//          */
//         lock: function() {

//             if (isLock) return;
//             var style = this.settings.title != 'load' ? "rDialog-mask" : "rDialog-white";
//             this.lockSelect = $('<div>').css({
//                 zIndex: this.settings.zIndex
//             }).addClass(style);
//             this.lockSelect.appendTo('body');

//             isLock = true;

//         },

//         /**
//          * 关闭锁屏
//          */
//         unLock: function() {
//             if (this.settings.lock) {
//                 if (isLock) {
//                     this.lockSelect.remove();
//                     isLock = false;
//                 }
//             }
//         },

//         /**
//          * 关闭方法
//          */
//         close: function() {
//             if (this.settings.type == 'confirm') {
//                 return $('#dialog').remove();
//             }
//             this.dialog.remove();
//             this.unLock();
//             var colseCallBack = this.settings.colseCallBack;
//             if (colseCallBack != undefined && colseCallBack != null) {
//                 this.settings.colseCallBack();
//             }
//         },

//         /**
//          * 定时关闭
//          */
//         time: function() {

//             var _this = this;

//             this.closeTimer = setTimeout(function() {
//                 _this.close();
//             }, this.settings.time);

//         }
//     };

//     /**
//      * 默认配置
//      */
//     Dialog.defaults = {

//         // 内容
//         content: '加载中...',

//         // 标题
//         title: 'load',

//         // 宽度
//         width: 'auto',

//         autoClose: true,

//         // 高度
//         height: 'auto',

//         // 取消按钮回调函数
//         cancel: null,

//         // 确定按钮回调函数
//         ok: null,

//         // 确定按钮文字
//         okText: '确定',

//         // 取消按钮文字
//         cancelText: '取消',

//         // 自动关闭时间(毫秒)
//         time: null,

//         // 是否锁屏
//         lock: true,

//         // z-index值
//         zIndex: 9999,

//         //关闭后的回调事件
//         colseCallBack: null

//     };

//     var rDialog = function(options) {
//         return new Dialog(options);
//     };

//     window.rDialog = $.rDialog = $.dialog = rDialog;

// })(window.jQuery || window.Zepto, window);

// $.confirm = function(options) {
//     options.type = 'confirm';
//     return $.dialog(options);
// };

// $.alert = function(err, time, callback) {
//     if (!err) {
//         err = "系统繁忙，请稍候再试";
//     }
//     return $.dialog({
//         content: "<p style='color:#fff'>" + err + "</p>",
//         title: "alert",
//         time: time || 2500,
//         colseCallBack: callback
//     });
// };

// // 加法
// Number.prototype.add = function(arg) {
//     return $.add(arg, this);
// };
// // 乘法
// Number.prototype.mult = function(arg) {
//     return $.mult(arg, this);
// };

// // 加法
// $.add = function() {
//     var total = 0;
//     $.each(arguments, function(index, item) {
//         total += parseFloat(item);
//     });
//     return total;
// };

// // 减法
// $.subtr = function() {
//     var total = 0;
//     $.each(arguments, function(index, item) {
//         if (index === 0) {
//             total = parseFloat(item);
//         } else {
//             total = total -  parseFloat(item);
//         }
//     });
//     return total;
// }; 
// // 乘法
// $.mult = function () {
//     var total = 1;
//     $.each(arguments, function(index, item) {
//         total = total *  parseFloat(item);
//     });
//     return Math.round(total*100)/100;
// };

// $.strToDate = function(time) {
//     time = new Date(parseInt(time, 10));
//     return time.getFullYear() + "-" + ((time.getMonth() + 1) < 10 ? "0" + (time.getMonth() + 1) : (time.getMonth() + 1)) + "-" + (time.getDate() < 10 ? "0" + time.getDate() : time.getDate());
// }

// $.strToTime2 = function(time) {
//     time = new Date(parseInt(time, 10));
//     return time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes());
// }


// // $.commonAjax({
// //     url: 'checkAgent',
// //     success: function(data) {
// //         if (data.data.isCheck) {
// //             //do nothing
// //         } else {
// //             location.href = Config.baseUrl +  "authentra"
// //         }
// //     }
// // })

// /*1.用正则表达式实现html转码*/
// $.htmlEncodeByRegExp = function (str){  
//      var s = "";
//      if(str.length == 0) return "";
//      s = str.replace(/&/g,"&amp;");
//      s = s.replace(/</g,"&lt;");
//      s = s.replace(/>/g,"&gt;");
//      s = s.replace(/ /g,"&nbsp;");
//      s = s.replace(/\'/g,"&#39;");
//      s = s.replace(/\"/g,"&quot;");
//      return s;  
// };
// /*2.用正则表达式实现html解码*/
// $.htmlDecodeByRegExp = function (str){  
//      var s = "";
//      if(str.length == 0) return "";
//      s = str.replace(/&amp;/g,"&");
//      s = s.replace(/&lt;/g,"<");
//      s = s.replace(/&gt;/g,">");
//      s = s.replace(/&nbsp;/g," ");
//      s = s.replace(/&#39;/g,"\'");
//      s = s.replace(/&quot;/g,"\"");
//      return s;  
// };

// $.fullImage = function(url) {

//     //slideTab.fnStopSlide();
//     var fullImage = $("#fullImage");
//     if (!fullImage.length) {
//         $('body').append('<div id="fullImage" class="load-shadow" style="background: rgba(0, 0, 0, 1);"></div>');
//         fullImage = $("#fullImage");
//     }
//     if (fullImage.attr('disabled')) {
//         return false;
//     }
//     fullImage.attr('disabled', 'disabled');
//     var image = new Image();
//     image.src = url;
//     image.id = "image";
//     image.onload = function() {
//         var rate = image.width / image.height;
//         image.width = $(window).width();
//         image.height = $(window).width() / rate;
//         fullImage.append(image);
//         $("#image").css("marginTop", ($(window).height() - image.height) / 2);
//         fullImage.show();
//     };
//     fullImage.on("tap", function() {
//         fullImage.children().remove();
//         fullImage.off("tap");
//         fullImage.removeAttr('disabled');
//         fullImage.hide();
//     });
// };
