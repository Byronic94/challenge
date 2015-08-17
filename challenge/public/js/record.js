$(document).ready(function(){
    var toid = '',toname='';
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
        return theRequest;
    }

    var res = GetRequest();
    $("#success").click(function(){
       $.ajax({
        type: 'GET',
        url: '/finishchallenge' ,
        data:{
            cid:res['cid'],
            uid:res['uid'],
            success:1
        } ,
        success: function(data){
            var dataObj = data;
            console.log(data);
            if(dataObj.success==true){
                var bh = $(window).height();
                var bw = $(window).width(); 
                $("#resultBg1").css({ 
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
    $("#fail").click(function(){
       $.ajax({
        type: 'GET',
        url: '/finishchallenge' ,
        data:{
            cid:res['cid'],
            uid:res['uid'],
            success:0
        } ,
        success: function(data){
            var dataObj = data;
            if(dataObj.success==true){
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
    $("#resultBg2").click(function(){
       $("#resultBg2").hide();
   });


    $("#like").click(function(){

       $.ajax({
        type: 'GET',
        url: '/comment' ,
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
                var fromspan = $("<span></span>").attr("class","from").text(fromname); 
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
           var fromspan = $("<span></span>").attr("class","from").text(fromname); 
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
        cid:1223,
        uid:2,
            //cid:$.cookie("cid"),
            //uid:$.cookie("uid"),
            //success:true
        } ,
        success: function(data){
            
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
        uid:1,
        cid:1223,
            //timestamp:2147483000,
            //uid:$.cookie("uid"),
            //cid:$.cookie("cid"),
            timestamp:parseInt(Date.parse(new Date())/1000)
        } ,
        success: function(data){
            
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
     data:{
        vote:2,
        cid:res['cid'],
        from_uid:res['uid'],
        to_uid:toid,
        content:$('#replyLine>input').val()
    } ,
    success: function(data){
        var dataObj = data;
        if(dataObj.success==true){
           var smallface = $("<div></div>").attr("class","smallFace");
           var smallcomment = $("<div></div>").attr("class","smallComment");
           var fromspan = $("<span></span>").attr("class","from").text(fromname); 
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

});