@extends('layout.master')

@section('title')
    <title>挑战首页</title>
@stop

@section('css')
    @parent
    <link rel="stylesheet" type="text/css" href="/css/initial.css">
@stop

@section('content')
    <button id="challengeSelf">挑战自己</button>
	<button id="challengeFriends">挑战他人</button>
	<div id="ad"><div id="logo"></div><a>来壹校招，挑战找工作</a></div>
@stop

@section('js')
    @parent
    <script type="text/javascript" src="/js/initial.js"></script>
@stop