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
    

    
Route::get('/challengelist', 'ChallengeController@getChallengeList');

Route::get('/challengecheck', 'ChallengeController@checkchallenge');
Route::get('/challengecommit', 'ChallengeController@commitachallenge');


Route::get('/finishchallenge', 'ChallengeController@shutdownchallenge');

Route::get('/acceptchallenge', 'ChallengeController@acceptchallenge');

Route::get('/comment', 'ChallengeController@makecomment');