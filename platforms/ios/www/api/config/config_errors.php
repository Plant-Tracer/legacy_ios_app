<?php
/*
--------------------D.R.E.A.M. 2.0-------------------------
    Designed and Developed by NYU CREATE (c) 2015
-----------------------------------------------------------
*/
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

// error handler function
function myErrorHandler($errno, $errstr, $errfile, $errline)
{
    if (!(error_reporting() & $errno)) {
        // This error code is not included in error_reporting
        return;
    }

    // echo "erroNo ".$errno;
    // echo "<br>";
    // echo "errstr ".$errstr;
    // echo "<br>";
    // echo "errfile ".$errfile;
    // echo "<br>";
    // echo "errline ".$errline;
    // echo "<br>";

    switch ($errno) {
    case E_USER_ERROR:
         echo "<b>My ERROR</b> [$errno] $errstr<br />\n";
        // echo "  Fatal error on line $errline in file $errfile";
        // echo ", PHP " . PHP_VERSION . " (" . PHP_OS . ")<br />\n";
        // echo "Aborting...<br />\n";
        exit(1);
        break;

    case E_USER_WARNING:
        echo "<b>My WARNING</b> [$errno] $errstr<br />\n";

        break;

    case E_USER_NOTICE:
        echo "<b>My NOTICE</b> [$errno] $errstr<br />\n";

        break;

        // case 8:
        //     echo "<script>window.location.href='404.html';</script>";
        //     break;

    default:
        //echo "Unknown error type: [$errno] $errstr<br />\n";
    	//echo "<script>window.location.href='404.html';</script>";
        break;
    }

    /* Don't execute PHP internal error handler */
    return true;
}

$old_error_handler = set_error_handler("myErrorHandler");

?>