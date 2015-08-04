$(document).ready(function(){
  $("#sub").click(function(){
    if($("#challengeForm").is(":hidden")){
  	    $("#challengeForm").show();
        
    } else {
      $("#challengeForm").submit();
    }
  });
});