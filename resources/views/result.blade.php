@extends('layout.master')

@section('title')
     <title>壹校招一战到底</title>
@stop

@section('css')
    @parent
    <link rel="stylesheet" type="text/css" href="/static/css/result.css">
@stop

@section('content')
    @if($success==1)
        <div id="success"></div>
    @else
        <div id="fail"></div>
    @endif
    <div id="outline">
        <div id="face"  style="background-image:url({{$imgurl}})"></div>
        <div id="content">
            @if($isSelf==1)
                <div class="firstline"><span id="fromname">{{$name}}</span>发起了挑战</div>
            @elseif($type==0)
                <div class="firstline"><span id="fromname">{{$from_name}}</span>向{{$to_name}}发起了挑战</div>
            @endif
            <div class="secondline">{{$content}}</div>
        </div>
        <div id="stake">
            <p class="firstline">他的赌注是</p>
            <p class="secondline">{{$bet}}</p>
        </div>
        @if($timeout==0)
            <div id="evidence" style="background-image:url({{$imgpath}})"></div>
        @endif
        <div id="back"></div>
    </div>
    <div id="ad"><div id="logo"></div><a>来壹校招，挑战找工作</a></div>
@stop
@section('js')
    @parent
    <script type="text/javascript" src="/static/js/record.js"></script>
@stop