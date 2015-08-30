$(document).ready(function(){

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

    var target = '/challengelist';
    getMoreInfo();
    setInterval (getMoreInfo, 200000);
    function getMoreInfo()
    {
        $.ajax({
            type: 'GET',
            url: target,
            success: function(data){
                var num = 0;
                var dataObj = data;
                $('#recommend>p').html(dataObj.data[num].content.substr(0,20));
                num = num + 1;
                console.log(dataObj);
                setInterval (function(){
                    if(num==dataObj.data.length){
                        num=0;
                    }
                    $('#recommend>p').html(dataObj.data[num].content.substr(0,20));
                    num = num + 1;
                }, 5000);
                $('#recommend>p').click(function(){
                    $('#keyword').val(dataObj.data[num].keyword);
                    $('#challengeContent').val(dataObj.data[num].content);
                    $('#stake').val(dataObj.data[num].bet);
                });
                if(dataObj.next_page_url != null){
                    target = dataObj.next_page_url;
                } else {
                    target = '/challengelist';
                }
            } ,
            error:function(XMLHttpRequest, textStatus, errorThrown){
                console.log(XMLHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
            },
            dataType: 'json',
        });
    }   



    $("#challengeGo").click(function(){
        $("#uid").val($.cookie('uid'));
        var timestamp = parseInt(Date.parse(new Date())/1000);
        $("#timestamp").val(timestamp);
        $("#isSelf").val(0);
        var options = { 
            target:'#formRes', //后台将把传递过来的值赋给该元素 
            url:'/challengecommit', //提交给哪个执行 
            type: 'GET',
            clearForm: true,
            resetForm: true,
            success: function(){ 
                var bh = $(window).height();
                var bw = $(window).width(); 
                $("#resultBg").css({ 
                    height:bh, 
                    width:bw, 
                    display:"block" 
                });
            } ,
             error:function(XMLHttpRequest, textStatus, errorThrown){
                console.log(XMLHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
            },
        }; 
        var name = $('#name').val();
        var keyword = $('#keyword').val();
        var content = $('#challengeContent').val();
        var bet = $('#stake').val();
        if(!name){
            $('#name').focus();
        } else if(!keyword){
            $('#keyword').focus();
        } else if(!content){
            $('#challengeContent').focus();
        } else if(!bet){
            $('#stake').focus();
        } else {
            $('#challengeForm').ajaxSubmit(options);
        } 
        
    });
});

wx.ready(function () {
    var sharetitle =  '壹校招一战到底，你也来试试？';
    var sharedesc = '只需30秒，向身边人或自己发出挑战，让大家一起来见证你的挑战历程！';
    var sharelink = '/authorize/0/0/0';
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