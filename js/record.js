$(document).ready(function(){
$("#success").click(function(){
	var bh = $(window).height();
    var bw = $(window).width(); 
    $("#resultBg1").css({ 
        height:bh, 
        width:bw, 
        display:"block" 
    }); 
});
$("#resultBg1").click(function(){
	$("#resultBg1").hide();
});
$("#fail").click(function(){
	var bh = $(window).height();
    var bw = $(window).width(); 
    $("#resultBg2").css({ 
        height:bh, 
        width:bw, 
        display:"block" 
    }); 
});
$("#resultBg2").click(function(){
	$("#resultBg2").hide();
});

});