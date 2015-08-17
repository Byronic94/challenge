$(document).ready(function(){
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