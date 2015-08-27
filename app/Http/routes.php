<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('home');
});
    
Route::get('/challenge/{object}', function ($object) {
    if ($object == 'self') {
        return view('challengeSelf');
    } else {
        return view('challengeOthers');
    }
});

Route::get('/authorize/{cid}/{uid}', 'ChallengeController@authorize');
    
Route::get('/op', function () {
    return view('result',array('isSelf'=>0,'type'=>0,'success' => 1,'timeout'=>0,'from_name'=>'ben','to_name'=>'jack','content'=>'一分钟内吃十碗饭','bet'=>'请大家伙儿吃饭' ));
});

    
Route::get('/challengelist', 'ChallengeController@getChallengeList');

Route::get('/challengecheck', 'ChallengeController@checkchallenge');
Route::get('/challengecommit', 'ChallengeController@commitachallenge');


Route::get('/finishchallenge', 'ChallengeController@shutdownchallenge');

Route::get('/acceptchallenge', 'ChallengeController@acceptchallenge');

Route::get('/comment', 'ChallengeController@makecomment');

