<?php

function httpGet($url) {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_TIMEOUT, 500);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($curl, CURLOPT_URL, $url);
        
    $res = curl_exec($curl);
    curl_close($curl);
        
    return $res;
}
$code = $_GET['code'];
$state = $_GET['state'];
$url = "http://120.25.234.214:8080/getuserinfo?code=$code&state=$state";
$content = httpGet($url);
if (isset($content['access_token'])) {
    echo $content['access_token'];
} else {
    echo "no at";
}