<?php

class wechat {
  private $appid = 'wxd8026f76755c7b19';
  private $scope = 'snsapi_userinfo';

  public function authorize() {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
    $uri = urlencode("$protocol$_SERVER[HTTP_HOST]/challenge/");
//    echo $uri;
    $redirect_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=".$this->appid."&redirect_uri=http%3A%2F%2F120.25.234.214%3A8080%2Fchallenge%2Ftest%2Findex.php&response_type=code&scope=".$this->scope."&state=STATE#wechat_redirect";
    header("Location: $redirect_url");
    exit;
  }
}
    

$wc = new wechat();
$wc->authorize();
