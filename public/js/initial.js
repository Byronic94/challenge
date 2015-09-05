$(document).ready(function(){
    var uid = $(".hidden").text();
    $.cookie('uid', uid, { expires: 7, path: '/' });
    $.ajax({
        type: 'GET',
        url: "http://www.1xiaozhao.com:8080/getwxsignpack?callback=?&url=" 
        + encodeURIComponent(window.location.href),
        dataType:"json",
        success: function(data){
            wx.config({
                debug: true, 
                appId: data.appId, 
                timestamp: data.timestamp, 
                nonceStr: data.nonceStr, 
                signature: data.signature,
                jsApiList: [
                'checkJsApi',    
                'onMenuShareTimeline',    
                'onMenuShareAppMessage',    
                'onMenuShareQQ',    
                'onMenuShareWeibo'
                ]
            });

            wx.ready(function () {
                var sharetitle =  '壹校招一战到底，你也来试试？';
                var sharedesc = '只需30秒，向身边人或自己发出挑战，让大家一起来见证你的挑战历程！';
                var sharelink = 'http://120.25.234.214:8080/authorize/0/0';
                var shareimgurl = '../image/share.jpg';
                wx.onMenuShareTimeline({
                    title: sharetitle,
                    link: sharelink,
                    imgUrl: shareimgurl,
                    success: function () { 

                    },
                    cancel: function () { 

                    }
                });


                wx.onMenuShareAppMessage({
                    title: sharetitle,
                    desc: sharedesc, 
                    link: sharelink,
                    imgUrl: shareimgurl,
                    type: 'link', 
                    success: function () { 

                        alert("success");
                    },
                    cancel: function () { 

                    }
                });

                wx.onMenuShareQQ({
                    title: sharetitle,
                    desc: sharedesc, 
                    link: sharelink,
                    imgUrl: shareimgurl,
                    success: function () { 

                    },
                    cancel: function () { 

                    }
                });

                wx.onMenuShareWeibo({
                    title: sharetitle,
                    desc: sharedesc, 
                    link: sharelink,
                    imgUrl: shareimgurl,
                    success: function () { 

                    },
                    cancel: function () { 
                    }

                });

                wx.onMenuShareQZone({
                    title: sharetitle,
                    desc: sharedesc, 
                    link: sharelink,
                    imgUrl: shareimgurl,
                    success: function () { 
                    },
                    cancel: function () { 
                    }
                });
            });
        }, 
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
