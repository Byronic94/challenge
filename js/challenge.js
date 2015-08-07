$(document).ready(function(){
 (function($){  

    jQuery.fn.select = function(options){  
        return this.each(function(){  
            var $this = $(this);  
            var $shows = $this.find(".shows");  
            var $selectOption = $this.find(".selectOption");  
            var $el = $this.find("ul > li");  

            $this.click(function(e){  
                $(this).toggleClass("zIndex");  
                $(this).children("ul").toggleClass("dis");  
                e.stopPropagation();  
            });  

            $el.bind("click",function(){  
                var $this_ = $(this);  

                $this.find("span").removeClass("gray");  
                $this_.parent().parent().find(".selectOption").text($this_.text());  
            });  

            $("body").bind("click",function(){  
                $this.removeClass("zIndex");  
                $this.find("ul").removeClass("dis");      
            })  

        //eahc End    
    });  

    }  

})(jQuery);   
$(".selectContainer").select();  

$("#challengeGo").click(function(){
	var bh = $(window).height();
    var bw = $(window).width(); 
    $("#tipBg").css({ 
        height:bh, 
        width:bw, 
        display:"block" 
    }); 
});
$("#tipBg").click(function(){
	$("#tipBg").hide();
});

});