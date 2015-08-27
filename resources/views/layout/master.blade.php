<!DOCTYPE html>
<html>
    <head>
	    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        @section('title')
        <title>壹校招一战到底</title>
        @show
        @section('css')
        <link href="/css/bootstrap.min.css" rel="stylesheet">
        @show
    </head>

    <body>
    	<div>
	        @yield('content')
	    </div>
	    @section('js')
	    <script type="text/javascript" src="/js/jquery-2.1.4.min.js"></script>
	    <script src="/js/bootstrap.min.js"></script>
        <script src="/js/jweixin-1.0.0.js"></script>
        <script src="/js/jquery.cookie.js"></script>
	    @show
        
    </body>
</html>