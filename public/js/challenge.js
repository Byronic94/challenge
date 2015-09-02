define(function(require, module, exports) {
	var Filter = require("common/filter"),
		MyPopUp = require("common/mypopup");

    var filter = new Filter({
        id: "filter-area",
        content: [
			{
				type: "search"
			}, {
          showName: "挑战名称",
          type: "inputText",
          id: "challenge_name",  
				  name: "challenge_name"
          },  {
            showName: "发布公司",
            type: "inputText",
            options: "publish_company",
            id: "publish_company"
          },{
          showName: "",
          type: "newline"
          }, {
          showName: "挑战类型",
          type: "inputText",
          id: "challenge_type",
          name: "challenge_type"
          },{
          showName: "行业分类",
          type: "inputText",
          id: "trade",  
          name: "trade"
          },{
            showName: "奖金范围",
            type: "inputText",
            name: "reward_low",
            id:"reward_low",
				    width: "100"
          }, {
            showName: "~",
            type: "inputText",
            name: "reward_up",
            id:"reward_up",
				    width: "100"
      }, {
        showName: "",
        type: "newline"
      }, {
			  showName: "",
			  type: "button",
			  id: "searchChallenge",
			  value: "搜索挑战"
			}, {
				showName: "",
				type: "button",
				id: "clearCond",
				value: "清空条件",
				class: "filter-greyword"
			}
        ]
    });
	
	var trade_popup = new MyPopUp({
        id: "trade_popup",
		buttonId: "trade",
        title: "行业选择",
        contentId: "trade",
		howmany: 1,
		confirm: {
			showName: "确定",
			type: "button",
			func: function(){
				if(trade_popup.selectedTrade.length>0)
					$("#trade")[0].value=trade_popup.selectedTrade[0];
			}
		},
		quit: {
			showName: "关闭",
			type: "button",
			func: function(){
				trade_popup.hide();
			}
		}
    });

  var functions_popup = new MyPopUp({
        id: "functions_popup",
    buttonId: "challenge_type",
        title: "职能选择",
        contentId: "functions",
    howmany: 1,
    confirm: {
      showName: "确定",
      type: "button",
      func: function(){
        if(functions_popup.selectedFunctions.length>0)
          $("#challenge_type")[0].value=functions_popup.selectedFunctions[0];
      }
    },
    quit: {
      showName: "关闭",
      type: "button",
      func: function(){
        functions_popup.hide();
      }
    }
    });

	//实现过滤器的折叠效果
	$('.search_input button').click(function()
		{
			$('.filter').toggleClass('hidden');
		});

	//实现清空过滤器输入框中的内容
  $('#clearCond').click(function()
	{
		$('#filter-area input[type="text"]').val('');
	});

  //实现提交搜索挑战表单
  $('#searchChallenge').click(function(){
    //输出来自请求页面的结果
        getData(1);
        $("#pagecount a").live('click',function(){
            var rel = $(this).attr("rel");
            if(rel){
                getData(rel);
            }
        });    
  });
  
  $('#searchBtn').click(function(){
        getData(1);
        $("#pagecount a").live('click',function(){
            var rel = $(this).attr("rel");
            if(rel){
                getData(rel);
            }
        }); 
  });
  //radio动态改变排序
  $('input[name="option"]').change(function()
  {
      var radioValue = $(this).val();
      $('#orderValue').val(radioValue);
      getData(1);
  });


//分页
    var curPage = 1; //当前页码
    var total,pageSize,totalPage;
//获取数据
function getData(page){
    var orderValue = $('#orderValue').val();
    console.log(orderValue);
    $.ajax({
        type: 'POST',
        url: '/challenge/showByOrder',
        data: {
          'pageNum':page-1,
          'orderValue':orderValue,
          'challenge_name':$('#challenge_name').val(),
          'publish_company':$('#publish_company').val(),
          'challenge_type':$('#challenge_type').val(),
          'trade':$('#trade').val(),
          'reward_low':$('#reward_low').val(),
          'reward_up':$('#reward_up').val(),
          'all':$('#search input').val()
        },
        dataType:'json',
        beforeSend:function(){
            $("#main-container").append("<li id='loading'>loading...</li>");
        },
        success:function(data){
            $('div.challenge-wrapper').empty();
            total = data.total; //总记录数
            pageSize = data.pageSize; //每页显示条数
            curPage = page; //当前页
            totalPage = data.totalPage; //总页数
            console.log(data['hots']);
            for(var i=0; i<data['hots'].length; i++){

                var ht = "<a href='/challenge/"+data['hots'][i].challenge_id+"'>"
                +"<div class='challenge'>"
                +"<div class='pic'>"
                +"<img src=uploads/challenges/pictures/"+data['hots'][i].picture+" width='228' height='172' />"
                +"</div>"
                +"<div class='price'>￥"+data['hots'][i].sum_reward+"</div>"
                +"<div class='title'>"+ data['hots'][i].name +"</div>"
                +"<div class='info'>"
                +"<span class='company'>"+data['companyName'][data['hots'][i].company_id]+"</span><br/>"
                +"<span class='date'>"+data['hots'][i].release_date+"</span>"
                +"</div>"
                +"<div class='data'>"
                +"<div class='data-item'>"
                +"<span>"+data['hots'][i].solution_limit+"</span>"
                +"<span>仅接受</span>"
                +"</div>"
                +"<div class='data-item'><span>"+data['hots'][i].sum_view+"</span><span>浏览</span></div>"
                +"<div class='data-item'><span>"+data['hots'][i].sum+"</span><span>参与</span></div>"
                +"</div>"
                +"</a>"
                console.log(ht);
                $('div.challenge-wrapper').append(ht);
            }

        },
        complete:function(){ //生成分页条
            getPageBar();
            totaltitle = " "+total+" ";
            $('#count').html(totaltitle);
        },
        error:function(){
            alert("数据加载失败");
        }
    });
 }
    //获取分页条
    function getPageBar(){
        //页码大于最大页数
        if(curPage>totalPage) curPage=totalPage;
        //页码小于1
        if(curPage<1) curPage=1;
        pageStr = "<span id='total_label'>共"+total+"条</span><span id='curPage_label'>"+curPage+"/"+totalPage+"</span>";

        //如果是第一页
        if(curPage==1){
            pageStr += "<span id='index_btn' style='color:#CBC7C7;border-color:#CBC7C7;'>首页</span><span id='last_btn' style='color:#CBC7C7;border-color:#CBC7C7;'>< 上一页</span>";
        }else{
            pageStr += "<a href='javascript:void(0)' rel='1'><span id='index_btn'>首页</span></a><a href='javascript:void(0)' rel='"+(curPage-1)+"'><span id='last_btn'>< 上一页</span></a>";
        }

        //如果是最后页
        if(curPage>=totalPage){
            pageStr += "<span id='next_btn' style='color:#CBC7C7;border-color:#CBC7C7;'>下一页 ></span><span id='final_btn' style='color:#CBC7C7;border-color:#CBC7C7;'>尾页</span>";
        }else{
            pageStr += "<a href='javascript:void(0)' rel='"+(parseInt(curPage)+1)+"'><span id='next_btn'>下一页 ></span></a><a href='javascript:void(0)' rel='"+totalPage+"'><span id='final_btn'>尾页</span></a>";
        }
        $("#pagecount").html(pageStr);
    }
    $(function(){
        getData(1);
        $("#pagecount a").live('click',function(){
            var rel = $(this).attr("rel");
            if(rel){
                getData(rel);
            }
        });
    });
});

/***********************新增搜索点击 **********************************/
    $(".gray").bind("click",function(){
            var $this=$(this).html();

           /* var $i=$(".you-search input").index()+1;
            var $state=false;*/
             /*****获得父节点类名*****/
            $className=$(this).parent().attr("class");
            var $name;
            if($className=="challenge-type") $name="挑战类型：";
            else if($className=="industry-choose") $name="行业选择：";
            else if($className=="reward-area") $name="奖金范围：";

            /*****添加选中项******/
             $(".you-search").append("<span class='choose'>"+$name+$this+"×</span>");
          
           /* count++;
            if(count<=4){
              $(".you-search").append("<span class='choose'>"+$name+$this+"×</span>");
            }
            else{
              $(".you-search").append("<br><span class='choose'>"+$name+$this+"×</span>");
              count=0;
            }*/
            
             /***点击后移出该项****/
            $(".choose").bind("click",function(){
                count--;
                $(this).remove();
            });
        });  


 /***************************结束**************************************/
