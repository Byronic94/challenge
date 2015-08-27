$(document).ready(function(){
    var uid = $(".hidden").text();
    $.cookie('uid', uid, { expires: 7, path: '/' });

    $.ajax({
        type: 'GET',
        url: '/getwxsignpack' ,
        success: function(data){
         wx.config({
            debug: false, 
            appId: data.appId, 
            timestamp: data.timestamp, 
            nonceStr: data.nonceStr, 
            signature: data.signature,
            jsApiList: [
            'checkJsApi',    
            'onMenuShareTimeline',    
            'onMenuShareAppMessage',    
            'onMenuShareQQ',    
            'onMenuShareWeibo',    
            'hideMenuItems',    
            'showMenuItems',    
            'hideAllNonBaseMenuItem',    
            'showAllNonBaseMenuItem',    
            'translateVoice',    
            'startRecord',    
            'stopRecord',    
            'onRecordEnd',    
            'playVoice',    
            'pauseVoice',    
            'stopVoice',    
            'uploadVoice',    
            'downloadVoice',    
            'chooseImage',    
            'previewImage',    
            'uploadImage',    
            'downloadImage',    
            'getNetworkType',    
            'openLocation',    
            'getLocation',    
            'hideOptionMenu',    
            'showOptionMenu',    
            'closeWindow',    
            'scanQRCode',    
            'chooseWXPay',    
            'openProductSpecificView',    
            'addCard',    
            'chooseCard',    
            'openCard' 
            ]
        });
        } ,
        error:function(XMLHttpRequest, textStatus, errorThrown){
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown)
        }
    }); 

    

	$('#challengeSelf').click(function(){

    $.ajax({
        type: 'GET',
        url: '/challenge/self' ,
        success: function(data){
        	location.href="/challenge/self";
        } ,
        error:function(XMLHttpRequest, textStatus, errorThrown){
        	console.log(XMLHttpRequest);
        	console.log(textStatus);
        	console.log(errorThrown)
        }
    }); 
});
	$('#challengeFriends').click(function(){
    $.ajax({
        type: 'GET',
        url: '/challenge/other' ,
        success: function(data){
        	location.href="/challenge/other";
        } ,
        error:function(XMLHttpRequest, textStatus, errorThrown){
                console.log(XMLHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
        }
    }); 
});
});

wx.ready(function () {
    var sharetitle =  '壹校招一战到底，你也来试试？';
    var sharedesc = '只需30秒，向身边人或自己发出挑战，让大家一起来见证你的挑战历程！';
    var sharelink = '/authorize/0/0';
        wx.onMenuShareTimeline({
        title: sharetitle,
        link: sharelink,
        imgUrl: '../image/share.jpg',
        success: function () { 

        },
        cancel: function () { 

        }
    });


    wx.onMenuShareAppMessage({
        title: sharetitle,
        desc: sharedesc, 
        link: sharelink,
        imgUrl: '../image/share.jpg',
        type: 'link', // 分享类型,music、video或link，不填默认为link
        success: function () { 
            // 用户确认分享后执行的回调函数
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
        }
    });

    wx.onMenuShareQQ({
        title: sharetitle,
        desc: sharedesc, 
        link: sharelink,
        imgUrl: '../image/share.jpg',
        success: function () { 
           // 用户确认分享后执行的回调函数
       },
       cancel: function () { 
           // 用户取消分享后执行的回调函数
       }
    });
    
    wx.onMenuShareWeibo({
        title: sharetitle,
        desc: sharedesc, 
        link: sharelink,
        imgUrl: '../image/share.jpg',
        success: function () { 
           // 用户确认分享后执行的回调函数
        },
       cancel: function () { 
            // 用户取消分享后执行的回调函数
        }
    });
    
    wx.onMenuShareQZone({
        title: sharetitle,
        desc: sharedesc, 
        link: sharelink,
        imgUrl: '../image/share.jpg',
        success: function () { 
           // 用户确认分享后执行的回调函数
       },
       cancel: function () { 
            // 用户取消分享后执行的回调函数
        }
    });
});