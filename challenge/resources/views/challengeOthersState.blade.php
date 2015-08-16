@extends('layout.master')

@section('title')
     <title>壹校招一战到底</title>
@stop

@section('css')
    @parent
    <link rel="stylesheet" type="text/css" href="/css/record.css">
    <link rel="stylesheet" type="text/css" href="/css/battleRecord.css">
@stop

@section('content')
    <div id="resultBg1"></div>
    <div id="resultBg2"></div>
    <div id="outline">
        <div id="face"></div>
        <div id="content">
        <div class="firstline"><span id="fromname">{{$from_name}}</span>向{{$to_name}}({{$name}})发起了挑战</div>
            <div class="secondline">{{$content}}</div>
        </div>
        <div id="stake">
            <p class="firstline">他的赌注是</p>
            <p class="secondline">{{$bet}}</p>
        </div>
        @if ($type==2)
            <button id="back"></button>
        @else
            <div id="currentState">点赞：{{$up}}看扁:{{$down}}</div>
        @endif
    </div>
    @if($state==1)
        @if ($type!=2)
            <button id="success"></button>
            <button id="fail"></button>
        @else
            <button id="like"></button>
            <button id="unlike"></button>
        @endif
        <div id="comment">
            围观群众们：
            <ul id="commentList">
                @foreach ($commentlist[0] as $comment)
                    <li class="singleComment">
                    <div class="smallFace"></div>
                    <?php /* */$flag=false;/* */ ?>
                    @foreach ($commentlist[1] as $to)
                        @if ($comment->comid == $to->comid)
                            <?php /* */$flag=true;/* */ ?>
                            <div class="smallComment"><span class="from">{{$comment->username}}</span><span>回复</span><span id="to">{{$to->username}}</span><span class="content">:{{$comment->content}}</span></div>
                    @endif
                @endforeach
                @if (!$flag)
                    <div class="smallComment"><span class="from">{{$comment->username}}</span><span class="content">:{{$comment->content}}</span></div>
                @endif

                    <div class="reply">回复</div>
                     <div class="hidden">{{$comment->uid}}</div>
                    </li>
                @endforeach
            </ul>
        </div>
        <div id="replyLine">
            <input row="1"></input>
            <button id="replyBTN">回复</button>
        </div>
    @elseif($state==2&$type==0)
        <div id="state">所有人都可以接受挑战</div>
    @elseif($state==2&$type!=0)
        <button id="accept">接受挑战</button>
        <button id="reject">我要围观</button>
    @else
        <div id="state">此挑战已经结束</div>
    @endif
    <div id="ad"><div id="logo"></div><a>来壹校招，挑战找工作</a></div>
@stop
@section('js')
    @parent
    <script type="text/javascript" src="/js/record.js"></script>
@stop