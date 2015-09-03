$(document).ready(function(){

        $.ajax({
        type: 'GET',
        url: "http://www.1xiaozhao.com:8080/getwxsignpack?callback=?&url=" 
        + encodeURIComponent(window.location.href),
        dataType:"json",
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
            'chooseImage'
            ]
        });
         wx.ready(function () {
    var sharetitle =  $("#content").text()+" 快来看看！";
    var sharedesc = $("#content").text()+$("#stake").text()+" 挑战成功与否，你怎么看？";
    var sharelink = '/authorize/'+res['uid']+"/"+res['cid']+res['isSelf'];
    if($("#typeof").text()=='2'){
        sharelink = '/authorize/'+$("#shareuid").text()+"/"+res['cid']+res['isSelf'];
    }
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
        } ,
        error:function(XMLHttpRequest, textStatus, errorThrown){
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown)
        }
    }); 

    var toid = '',toname='',result;
    function GetRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
            }
        }
        theRequest['cid'] = parseInt(theRequest['cid']);
        theRequest['uid'] = parseInt(theRequest['uid']);
        return theRequest;
    }

    var res = GetRequest();
    $("#success").click(function(){
        result = 1;
        $("#success,#fail,#comment,#replyLine").hide();
        $("#upload").show();
    });
    $("#fail").click(function(){
        result = 0;
        $("#success,#fail,#comment,#replyLine").hide();
        $("#upload").show();
    });

    $("#imgurl").click(function(){
        wx.chooseImage({
            count: 1,
            sizeType: 'compressed',
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                $("#imgurl").val(localIds[0]);
            }
        })
    });

    $("#choose").click(function(){
        if($(this).text()=='+'){
            wx.chooseImage({
                count: 1,
                sizeType: 'compressed',
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    $("#imgurl").val(localIds[0]);
                    $(this).text()='X';
                }
            })
        }
        if($(this).text()=='x'){
            $("#imgurl").val("");
            $(this).text()='+';
        }

    })

    $("#submit").click(function(){
     $.ajax({
        type: 'GET',
        url: '/finishchallenge' ,
        data:{
            cid:res['cid'],
            uid:res['uid'],
            success:result,
            imgurl:$("#imgurl").val(),
        } ,
        success: function(data){
            var dataObj = data;
            console.log(data);
            if(dataObj.success==true){
                if(result==1)
                var bh = $(window).height();
                var bw = $(window).width(); 
                $("#resultBg1").css({ 
                    height:bh, 
                    width:bw, 
                    display:"block" 
                });
            } else {
                var bh = $(window).height();
                var bw = $(window).width(); 
                $("#resultBg2").css({ 
                    height:bh, 
                    width:bw, 
                    display:"block" 
                }); 
            }
        } ,
        error:function(XMLHttpRequest, textStatus, errorThrown){
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown)
        }
    });

 });
    $("#resultBg1").click(function(){
     $("#resultBg1").hide();
 });
    $("#resultBg2").click(function(){
     $("#resultBg2").hide();
 });


$("#like").click(function(){

     $.ajax({
        type: 'GET',
        url: '/comment' ,
        dataType: 'json',
        data:{
            vote:1,
            cid:res['cid'],
            from_uid:res['uid'],
            to_uid:0,
            content:"加油，你一定能成功"
        } ,
        success: function(data){
            var dataObj = data;
            if(dataObj.success==true){
                var smallface = $("<div></div>").attr("class","smallFace");
                var smallcomment = $("<div></div>").attr("class","smallComment");
                var fromspan = $("<span></span>").attr("class","from").text(dataObj.username.username); 
                var contentspan = $("<span></span>").attr("class","content").text(":"+"加油，你一定能成功"); 
                smallcomment.append(fromspan,contentspan);
                var reply = $("<div></div>").attr("class","reply");
                reply.text("回复");
                var hid = $("<div></div>").attr("class","hidden");
                hid.text(res['uid']);
                var newli = $("<li></li>").attr("class","singleComment").append(smallface,smallcomment,reply,hid);
                $("#commentList").append(newli);
            }
        } ,
        error:function(XMLHttpRequest, textStatus, errorThrown){
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown)
        },
    });
 });

$("#unlike").click(function(){
     $.ajax({
        type: 'GET',
        url: '/comment' ,
        dataType: 'json',
        data:{
            vote:0,
            cid:res['cid'],
            from_uid:res['uid'],
            to_uid:0,
            content:"我觉得你根本完成不了"
        } ,
        success: function(data){
            var dataObj = data;
            if(dataObj.success==true){
                 var smallface = $("<div></div>").attr("class","smallFace");
                 var smallcomment = $("<div></div>").attr("class","smallComment");
                var fromspan = $("<span></span>").attr("class","from").text(dataObj.username.username); 
                var contentspan = $("<span></span>").attr("class","content").text(":"+"我觉得你根本完成不了"); 
                smallcomment.append(fromspan,contentspan);
                var reply = $("<div></div>").attr("class","reply");
                reply.text("回复");
                var hid = $("<div></div>").attr("class","hidden");
                hid.text(res['uid']);
                var newli = $("<li></li>").attr("class","singleComment").append(smallface,smallcomment,reply,hid);
                $("#commentList").append(newli);
            }
        } ,
        error:function(XMLHttpRequest, textStatus, errorThrown){
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown)
        },
    });
 });


$("#accept").click(function(){
     $.ajax({
        type: 'GET',
        url: '/acceptchallenge' ,
        data:{
            cid:res['cid'],
            uid:res['uid'],
            success:1
        } ,
        success: function(data){
            window.location.reload();
            
        } ,
        error:function(XMLHttpRequest, textStatus, errorThrown){
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown)
        },
    });
 });


$("#reject").click(function(){
     $.ajax({
        type: 'GET',
        url: '/challengecheck' ,
        data:{
            uid:res['uid'],
            cid:res['cid'],
            success:0
        } ,
        success: function(data){
            if(data.success){
                window.location.reload();
            } else {
                $("#accept,#reject").hide();
                $("#state").attr("class","");
            }
            
        } ,
        error:function(XMLHttpRequest, textStatus, errorThrown){
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown)
        },
    });
 });



    $(document).delegate('.reply', 'click',function(){
        toid = $(this).parent().find(".hidden").text();
        toname = $(this).parent().find(".from").text();
        console.log(toid);
        if(toid!=res['uid']){
            $("#replyLine").show();
        }
    })

    $("#replyBTN").click(function(){
        $("#replyLine").hide();
        $.ajax({
       type: 'GET',
        url: '/comment' ,
        dataType: 'json',
        data:{
            vote:2,
            cid:res['cid'],
            from_uid:res['uid'],
            to_uid:toid,
            content:$('#replyLine>input').val()
        } ,
        success: function(data){
            var dataObj = data;
            console.log(dataObj);
            if(dataObj.success==true){
                var smallface = $("<div></div>").attr("class","smallFace");
                var smallcomment = $("<div></div>").attr("class","smallComment");
                var fromspan = $("<span></span>").attr("class","from").text(dataObj.username.username); 
                var tospan = $("<span></span>").attr("class","to").text(toname); 
                var replyspan = $("<span></span>").text("回复"); 
                var contentspan = $("<span></span>").attr("class","content").text(":"+$('#replyLine>input').val()); 
                smallcomment.append(fromspan,replyspan,tospan,contentspan);
                
                var reply = $("<div></div>").attr("class","reply");
                reply.text("回复");
                var hid = $("<div></div>").attr("class","hidden");
                hid.text(res['uid']);
                var newli = $("<li></li>").attr("class","singleComment").append(smallface,smallcomment,reply,hid);
                $("#commentList").append(newli);
            }
        } ,
        error:function(XMLHttpRequest, textStatus, errorThrown){
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown)
        },
    });
    })

    $("#back").click(function(){
        window.location.href="/home";
    })






});