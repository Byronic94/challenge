<?php

define("TOKEN", "weixin");

class HomeController extends BaseController {

    private $appId = 'wxd8026f76755c7b19';
    private $appSecret = 'f9e85f1ef49f3e85d420ad3e386713b9';
    // private $scope = 'snsapi_base';
    private $scope = 'snsapi_userinfo';
    private $state = 'gasgirl';

    private function httpGet($url) {
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

    public function getWechatAuth($gameId) {

        // 注意 URL 一定要动态获取，不能 hardcode.
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";

        $game_uri = "$protocol$_SERVER[HTTP_HOST]/play/$gameId";

        $redirect_uri = urlencode("$protocol$_SERVER[HTTP_HOST]/getwechattoken");

        // echo urldecode($redirect_uri);

        $authUrl =  'https://open.weixin.qq.com/connect/oauth2/authorize?appid='
                    . $this->appId
                    . '&redirect_uri='
                    . $redirect_uri
                    . '&response_type=code&scope='
                    . $this->scope
                    . '&state='
                    . $this->state
                    . '#wechat_redirect';

        echo $authUrl;

        // return Redirect::to($authUrl);
    }

    public function getWechatToken() {

        $code = Input::get("code");
        $state = Input::get("state");

        $uri = "http://120.25.234.214:8080/getuserinfo?code=$code&state=$state";

        // 获取微信openid or userinfo
        $res = $this->httpGet($uri);

        return View::make('hello')->with('data', $res);

    }

    public function play($gameId) {

        // return Response::json(array("gameid" => 1));
        $data = array('wechat' => Session::get('data'), 'gameid' => $gameId);
        return View::make('hello')->with("data", $data);
    }


    /**
     * 获取游戏信息
     * @param  int $gameid 游戏id
     * @return json->data   game_id: 2,
     *                      game_express_name: "周婉萍",
     *                      game_express_addr: "广州琶洲",
     *                      game_express_mobile: "13588880000",
     *                      activity_id: 1,
     *                      user_id: "oAujut8zR_W2xfzsB7ygcL9v5MNk",
     *                      doll_id: 1
     */
    public function getGameInfo($gameid) {

        $results = DB::table('game')->where('game_id', $gameid)->first();

        if ($results) {

            $this->ajaxReturn(1, $results, null);


        } else {

            $this->ajaxReturn(0, null, 'data not found');

        }


        // TODO echo $results;

    }


    /**
     * 创建娃娃数据
     * @param  int $doll_breast 胸
     * @param  int $doll_eyes   眼睛
     * @param  int $doll_nose   鼻子
     * @param  int $doll_brow   眉毛
     * @param  int $doll_face   脸
     * @param  int $doll_gas    充气度
     * @return int              该条数据的doll_id
     */
    public function createDoll(
                                $doll_breast,
                                $doll_eyes,
                                $doll_nose,
                                $doll_brow,
                                $doll_face,
                                $doll_gas) {

        $id = DB::table('doll')->insertGetId(
            array(
                'doll_breast' => $doll_breast,
                'doll_eyes' => $doll_eyes,
                'doll_nose' => $doll_nose,
                'doll_brow' => $doll_brow,
                'doll_face' => $doll_face,
                'doll_gas' => 0,
            )
        );

        return $id ? $id : false;

    }

    /**
     * 创建游戏数据
     * @param  int $activity_id 活动id
     * @param  string $user_id     微信openid
     * @param  int $doll_id     doll_id
     * @return int              该条数据的game_id
     */
    public function createGame($activity_id, $user_id, $doll_id) {

        $id = DB::table('game')->insertGetId(
            array(
                'activity_id' => $activity_id,
                'user_id' => $user_id,
                'doll_id' => $doll_id,
                'game_state' => 1,
                'game_express_name' => '',
                'game_express_addr' => '',
                'game_express_mobile' => ''
            )
        );

        return $id ? $id : false;


    }

    /**
     * 设置游戏信息：createDoll + createGame = setGameInfo
     * @param int $activity_id    活动id
     * @param string $user_id     微信openid
     * @return                    是否设置成功
     */
    public function setGameInfo($activity_id, $user_id){

        $doll_id = $this->createDoll(
                            $doll_breast,
                            $doll_eyes,
                            $doll_nose,
                            $doll_brow,
                            $doll_face,
                            $doll_gas);

        if ($doll_id) {

            $results = $this->createGame($activity_id, $user_id, $doll_id);

            return $results ? true : false;

        } else {

            return false;
        }




    }

    /**
     * 创建礼物数据
     * @param  string $gift_name  礼物的名字
     * @param  decimal $gift_price 礼物的售价
     * @return int             该条数据的gift_id
     */
    public function createGift($gift_name, $gift_price) {

        $id = DB::table('gift')->insertGetId(
            array(
                'gift_name' =>  $gift_name,
                'gift_price' =>  $gift_price,
                'game_id' =>  0
            )
        );

        return $id ? $id : false;


    }


    /**
     * 为娃娃充气
     * @param  string $user_id 微信openid
     * @param  int $game_id game_id
     * @param  int $gas_pct 充气百分比
     * @return int          娃娃充气量
     */
    public function fillGas($user_id, $game_id, $gas_pct) {

        // 读取配置，得到每次充气量
        $per_gas_pct = DB::table('config')->where('name', 'gas_pct')->pluck('value');

        // 查询游戏娃娃的充气度，看看是否充满气了
        $gas_pct = DB::table('gasfill')->where(array('user_id' => $user_id, 'game_id' => $game_id))->pluck('gas_pct');

        // 充满气返回错误，未充满继续充气
        if ($gas_pct === 100) {
            return 0;
        } else {
            // TODO，查看返回的$oll_pct是什么
            $doll_pct = DB::table('gasfill')->where(array('user_id' => $user_id, 'game_id' => $game_id))->increment('gas_pct', $per_gas_pct);

            if ($doll_pct === 100) {
                return 1;
            } else {
                return 2;
            }


        }

        return $doll_pct ? $doll_pct : false;
    }

    /**
     * 设置配置信息
     * @param string $name  键名
     * @param string $value 键值
     */
    public function setConfig($name, $value) {

        $results = DB::table('config')->where('name', $name)->get();

        if ($results) {
            DB::table('config')->where('name', $name)->update(array('value' => $value));
            return ture;
        } else {
            DB::table('config')->insert(array('name' => $name, 'value' => $value));
            return false;

        }

    }

    /**
     * 读取配置信息
     * @param  string $name 配置键名
     * @return [type]       配置键值
     */
    public function getConfig($name) {

        $results = DB::table('config')->where('name', $name)->get();

        if ($results) {
            DB::table('config')->where('name', $name)->update(array('value' => $value));
            return ture;
        } else {


            return false; // TODO errMsg

        }
    }

    /**
     * ajax返回json数据给前端
     * @param  int $status 1成功，0失败
     * @param  [type] $data   返回的数据
     * @param  string $errMsg 错误信息
     * @return json         返回的json响应
     */
    public function ajaxReturn($status, $data, $errMsg) {

        return Response::json(array('stauts' => $status, 'data' => $data, 'errMsg' => $errMsg));

    }

    /**
     * 读取娃娃充气度
     * @param  int $doll_id 娃娃的doll_id
     * @return int          娃娃的充气度
     */
    public function getDollGasPct($doll_id) {

        $doll_gas = DB::table('doll')->where('doll_id', $doll_id)->pluck('doll_gas');


        return $doll_gas ? $doll_gas : false;

    }

    /**
     * 获取娃娃的身体部件组成
     * @param  int $doll_id 娃娃的doll_id
     * @return array          TODO返回值类型？
     */
    public function getDollParts($doll_id) {

        $doll_parts = DB::table('doll')->where('doll_id', $doll_id)->pluck('doll_breast', 'doll_nose', 'doll_eyes', 'doll_brow', 'doll_face');

        return $doll_part ? $doll_parts : false;

    }

}
