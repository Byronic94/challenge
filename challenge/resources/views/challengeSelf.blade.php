@extends('layout.master')

@section('title')
    <title>挑战首页</title>
@stop

@section('css')
    @parent
    <link rel="stylesheet" type="text/css" href="/css/challenge.css">
@stop

@section('content')
    <div id="form">
        <form id="challengeForm"  accept-charset="UTF-8">
        <input type="hidden" id="uid" name="uid"></input>
        <input type="hidden" id="timestamp" name="timestamp"></input>
        <input type="hidden" id="isSelf" name="isSelf"></input>
        <div class="edit">
            <div class="head">
                <div class="label">
                    您的名字
                </div>
                <div class="triangle">
                </div>
            </div>
            <textarea name="name" form="challengeForm" id="name" rows="1" maxlength="7" placeholder="弘桂"></textarea>  
        </div>  
        <div class="edit">
            <div class="head">
                <div class="label">
                    关键字
                </div>
                <div class="triangle">
                </div>
            </div>

            <textarea name="keyword" form="challengeForm" id="keyword" rows="1" maxlength="7" placeholder="瘦身"></textarea>  
        </div>  
        <div class="edit">
            <div class="head">
                <div class="label">
                    挑战内容
                </div>
                <div class="triangle">
                </div>
            </div>
            <textarea name="content" form="challengeForm" id="challengeContent" rows="2" maxlength="36" placeholder="一个月内不瘦十斤，我请所有为我点赞的人吃饭"></textarea>  
        </div>
        <div class="edit">
            <div class="head">
                <div class="label">
                    赌注
                </div>
                <div class="triangle">
                </div>
            </div>

            <textarea name="bet" form="challengeForm" id="stake" rows="2" maxlength="28" placeholder="请所有为我点赞的人吃饭"></textarea>  
        </div>  
        <div class="edit">
            <div class="head">
                <div class="label">
                    看看别人都在挑战什么
                </div>
                <div class="triangle">
                </div>
            </div>
            <div id="recommend" ><p></p></div>
        </div>
        <div id="formRes"></div>
        </form>
    </div>  
    <button id="challengeGo">挑战自己</button>
    <div id="ad"><div id="logo"></div><a>来壹校招，挑战找工作</a></div>
@stop

@section('js')
    @parent
    <script type="text/javascript" src="/js/challenge.js"></script>
    <script type="text/javascript" src="/js/jquery.form.js"></script>
@stop