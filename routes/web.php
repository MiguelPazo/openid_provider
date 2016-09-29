<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

Route::get('/', 'Auth\LoginController@getLogin');
Route::post('/login', 'Auth\LoginController@postLogin');
Route::get('/frame', function () {
    return view('frame');
});

Route::group([
    'prefix' => 'token'
], function () {
    Route::get('/validate/', 'TokenController@getValidate');
    Route::get('/logout/', 'TokenController@getLogout');
});