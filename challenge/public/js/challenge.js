$(document).ready(function(){
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
                if(dataObj.next_page_url!=null){
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
        $("#uid").val(1);
        var timestamp = parseInt(Date.parse(new Date())/1000);
        $("#timestamp").val(timestamp);
        $("#isSelf").val(true);
        var options = { 
            target:'#formRes', //后台将把传递过来的值赋给该元素 
            url:'/challengecommit', //提交给哪个执行 
            type:'GET', 
            success: function(data){ 
                window.location.href='/challengecheck?uid='+data.uid+'&cid='+data.cid+'&timestamp='+data.timestamp+'&isSelf='+data.isSelf;
                //$.cookie("cid", $('#formRes').text());
            } ,
             error:function(XMLHttpRequest, textStatus, errorThrown){
                console.log(XMLHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
            }
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