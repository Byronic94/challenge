<?php

namespace App\Http\Controllers;
    
use DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\Redirector;

class ChallengeController extends Controller {

    private $appId = 'wxd8026f76755c7b19';
    private $appSecret = 'f9e85f1ef49f3e85d420ad3e386713b9';
    private $scope = 'snsapi_userinfo';
    private $state = 'challenge';
    private $usertype = -1;//0发起者 1接受者 2路人

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
    
    public function authorize($cid=0,$uid=0) {
        if ($cid != 0) {
            $u = DB::table('challenges')->select('uid')->where('cid', $cid)->first();
            if ($u == $uid) {
                $this->usertype = 0;
            } else {
                $ul = DB::table('acchallenge')->select('to_uid')->where('cid',$cid)->get();
                foreach ($ul as $u) {
                    if ($u == $uid) {
                        $this->usertype = 1;
                        break;
                    }
                }
            }
            if ($this->usertype == -1) $this->usertype = 2;
        }
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";

        $uri = "$protocol$_SERVER[HTTP_HOST]/play/$gameId";

        $redirect_uri = urlencode("$protocol$_SERVER[HTTP_HOST]/getwxchtoken");

        $authUrl =  'https://open.weixin.qq.com/connect/oauth2/authorize?appid='
                    . $this->appId
                    . '&redirect_uri='
                    . $redirect_uri
                    . '&response_type=code&scope='
                    . $this->scope
                    . '&state='
                    . $this->state
                    . '#wechat_redirect';

        return redirect($authUrl);
    }

    public function getWechatToken() {
        $code = Input::get("code");
        $state = Input::get("state");

        $uri = "http://120.25.234.214:8080/getuserinfo?code=$code&state=$state";

        // 获取微信userinfo
        $data = $this->httpGet($uri);
        $tbl = DB::table('user');
        $a = $tbl->select('uid')->where('openid', $data->openid)->get();
        if (count($a) == 0) {
            $tbl->insertGetId(
                ['openid'=>$data->openid,'username'=>$data->nickname,'sex'=>$data->sex,'imgurl'=>$data->headimgurl],
                'uid');
        }
        

        // 判断$this->usertype 渲染不同页面
        return view('home', $data);
    }

    // get 分页显示挑战列表
    public function getChallengeList() {
        $list = DB::table('challenges')
                    ->select('cid','keyword','content','bet')
                    ->simplePaginate(5);
        // $list->setPath('challengelist/pagedurl');
        return response()->json($list);
        // return view('challengeSelf', $list);
    }

    public function commitachallenge(Request $request) {
    	$tos = $request->input('isSelf');
        $uid = $request->input('uid');
        $kw = $request->input('keyword');
        $ct = $request->input('content');
        $bet = $request->input('bet');
        $name = $request->input('name');
        $ts = $request->input('timestamp');

        $a = DB::table('challenges')->insertGetId(
        		['uid'=>$uid,'name'=>$name,'keyword'=>$kw,'content'=>$ct,'bet'=>$bet,'timestamp'=>$ts],
        		'cid');
        if (!$a) return response()->json(array('success'=>false));

        if ($tos) {
        	$cid = intval(DB::getPdo()->lastInsertId());
        	$b = DB::table('acchallenge')->insertGetId(
        				['cid'=>$cid,'from_uid'=>$uid,'to_uid'=>$uid], 'acid');
        	if (!$b) return response()->json(array('success'=>false));
        	else return response()->json(['uid'=>$uid,'cid'=>$cid,'timestamp'=>time(),'isSelf'=>$tos]);
        }
        // return redirect()->action('ChallengeController@checkchallenge',
        // 		['uid'=>$uid,'cid'=>$cid,'timestamp'=>time(),'isSelf'=>$tos]);
        return response()->json(array('success'=>true));
    }

    public function checkchallenge(Request $request) {
    	$tos = $request->input('isSelf'); 
        $uid = $request->input('uid');
        $cid = $request->input('cid');
        if (isset($_GET['sh_uid'])) {
            $sh_uid = $request->input('sh_uid');
        }
        $ts = time();

        $ch = DB::table('challenges')
                    ->join('user', 'user.uid', '=', 'challenges.uid')
                    ->select('challenges.*', 'username', 'imgurl')
                    ->where('cid', $cid)
                    ->first();
        $ach = DB::table('acchallenge')
                    ->join('user', 'acchallenge.to_uid', '=', 'user.uid')
                    ->select('acid','uid','username','imgurl','ups','downs','success','imgpath')
                    ->where('cid', $cid)
                    ->get();
        $flist = DB::table('comments')
                    ->join('user', 'comments.from_uid', '=', 'user.uid')
                    ->select('comid', 'uid', 'content', 'imgurl', 'username')
                    ->where('cid', $cid)
                    ->get();
        $tlist = DB::table('comments')
                    ->join('user', 'comments.to_uid', '=', 'user.uid')
                    ->select('comid', 'username')
                    ->where('cid', $cid)
                    ->get();

        $state = 0;
        $flag = 1;
        if (count($ach) == 0) $state = 2;
        $aci = null;
        $sh_ac = null;
        foreach ($ach as $acitem) {
            if ($acitem->success == -1) $state = 1;

            if ($acitem->uid == $uid) {
                if ($acitem->imgpath != null) $imgpath = $acitem->imgpath;
                $aci = $acitem;
            }
            if (isset($sh_uid))
                if ($acitem->uid == $sh_uid) {
                    $flag = 2;
                    $sh_ac = $acitem;
                }
        }
        $timeout = 0;
        if ($state != 0) {
            if ($ts > $ch->timestamp+3*24*3600) {
                $state = 0;
                $timeout = 1;
            }
        }
        if (isset($sh_uid)) {
            if ($ch->uid == $sh_uid) {
                $flag = 1;
            }
        }
        
        if ($ch->uid == $uid) {
            $type = 0;
        } elseif (count($ach) == 0 || !$aci) {
            $type = 2;
        } else {
            $type = 1;
            $acid = $aci->acid;
            $toname = $aci->username;
            $tourl = $aci->imgurl;
            $ups = $aci->ups;
            $downs = $aci->downs;
            $success = $aci->success;
            $imgpath = $aci->imgpath;
        }
        if ($flag == 1) {
            $imgurl = $ch->imgurl;
        } elseif ($flag == 2) {
            $imgurl = $sh_ac->imgurl;
        }
        
        if ($type == 0) 
            $data = array('type'=>$type,
                      'state'=>$state,
                      'from_name'=>$ch->username,
                      'imgurl'=>$ch->imgurl,
                      'up'=>$ch->ups,
                      'down'=>$ch->downs,
                      'aclist'=>$ach,
                      'name'=>$ch->name,
                      'keyword'=>$ch->keyword,
                      'content'=>$ch->content,
                      'bet'=>$ch->bet,
                      'timestamp'=>$ch->timestamp,
                      'commentlist'=>[$flist, $tlist]
                      );
        elseif ($type == 2)
            $data = array('type'=>$type,
                      'state'=>$state,
                      'from_name'=>$ch->username,
                      'imgurl'=>$imgurl,
                      'up'=>$ch->ups,
                      'down'=>$ch->downs,
                      'aclist'=>$ach,
                      'name'=>$ch->name,
                      'keyword'=>$ch->keyword,
                      'content'=>$ch->content,
                      'bet'=>$ch->bet,
                      'timestamp'=>$ch->timestamp,
                      'commentlist'=>[$flist, $tlist]
                      );
        else
            $data = array('type'=>$type,
                      'state'=>$state,
                      'from_name'=>$ch->username,
                      'to_name'=>$toname,
                      'imgurl'=>$imgurl,
                      'acid'=>$acid,
                      'up'=>$ups,
                      'down'=>$downs,
                      'success'=>$success,
                      'name'=>$ch->name,
                      'keyword'=>$ch->keyword,
                      'content'=>$ch->content,
                      'bet'=>$ch->bet,
                      'timestamp'=>$ch->timestamp,
                      'imgpath'=>$imgpath,
                      'commentlist'=>[$flist, $tlist]
                      );
//        return response()->json($data);
        if ($state == 0) {
            if ($timeout == 1) $data['timeout'] = 1;
            else $data['timeout'] = 0;
            $data['isSelf']=$tos;
            return view('result', $data);
        }
        if (!$tos) return view('challengeOthersState', $data);
        return view('challengeSelfState', $data);
    }

    public function makecomment(Request $request) {
    	$from_uid = $request->input('from_uid');
        $to_uid = $request->input('to_uid');
        $vote = $request->input('vote');
        $cid = $request->input('cid');
        $content = $request->input('content');
        $tbl = DB::table('acchallenge');
        $tbl1 = DB::table('challenges');
        if ($vote == 1) {
            $a = $tbl->where('cid', $cid)->increment('ups');
            $b = $tbl1->where('cid', $cid)->increment('ups');
        } else if ($vote == 0) {
            $a = $tbl->where('cid', $cid)->increment('downs');
            $b = $tbl1->where('cid', $cid)->increment('downs');
        }
        $a = DB::table('comments')->insertGetId(
                        ['cid'=>$cid,'from_uid'=>$from_uid,'to_uid'=>$to_uid,'content'=>$content],
                        'comid'
                        );

        $name = DB::table('user')->select('username')->where('uid',$from_uid)->first();
        if (!$a) return response()->json(array('success'=>false));
        return response()->json(array('success'=>true,'username'=>$name));
    }

    public function acceptchallenge(Request $request) {
    	$uid = $request->input('uid');
        $cid = $request->input('cid');
        $success = $request->input('success');

        // 每接受一个挑战插入一条数据
        $tbl = DB::table('acchallenge');

        if ($success == 0) {
            $co = $tbl->where('cid', $cid)->count();
            if ($co > 0) return response()->json(['state'=>1]);
            else return response()->json(['state'=>0]);
        }

        $count = $tbl->where('cid', $cid)
                     ->where('to_uid', $uid)
                     ->count();
        if ($count == 0) {
            $from_uid = DB::table('challenges')
                            ->where('cid', $cid)
                            ->pluck('uid');
            // return response()->json($from_uid);
            $tbl->insertGetId(
                    ['cid'=>$cid,'from_uid'=>$from_uid,'to_uid'=>$uid], 'acid');
        }
//        return response()->json(array('success'=>2));
        return response()->json(['uid'=>$uid,'cid'=>$cid,'isSelf'=>0,'state'=>1]);
    }

    public function shutdownchallenge(Request $request) {
    	$uid = $request->input('uid');
        $cid = $request->input('cid');
        $acid = $request->input('acid');
        $success = $request->input('success');
        $tbl = DB::table('acchallenge');
        if (Request::hasFile('photo')) {
            $file = Request::file('photo');
            if ($file->isValid()) {
                $mime = $file->getClientMimeType();
                $destinationPath = 'uploadimgs/';
                $filename = $cid.'_'.time().$mime;
                $file->move($destinationPath, $fileName);
                if ($type = 0) {
                    $tbl->where('cid', $cid)->where('from_uid', $uid)
                        ->update(['imgpath'=>$destinationPath.$filename]);
                } else {
                    $tbl->where('cid', $cid)->where('to_uid', $uid)
                        ->update(['imgpath'=>$destinationPath.$filename]);
                }
            }
        }
        
        $chl = $tbl->select('from_uid','to_uid')
                    ->where('cid', $cid)
                    ->get();
        foreach ($chl as $ch) {
            if ($uid == $ch->to_uid || $uid == $ch->from_uid) {
                $a = $tbl->where('cid', $cid)->update(['success'=>$success]);
                return response()->json(array('success'=>true));
            }
            
        }
        return response()->json(array('success'=>false));
    }

}