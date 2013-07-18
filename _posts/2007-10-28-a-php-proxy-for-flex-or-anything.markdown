---
author: jandersen
comments: true
date: 2007-10-28 04:46:09+00:00
layout: post
slug: a-php-proxy-for-flex-or-anything
title: A PHP Proxy for Flex (or anything...)
wordpress_id: 20
categories:
- Flex
- PHP
---

...Yes, I know there are many examples already out there... so why bother with one more?  Well, I was using a slightly tweaked version of [Abdul Qabiz' php proxy scrip](http://www.abdulqabiz.com/blog/archives/general/php_proxy_script_for.php)t to good effect for most traditional requests (e.g. XML, HTML, etc.)  However, I ran into the following limitations:



	
  1. the proxy script just didn't seem to work at all for large files... no response

	
  2. the script was loading the contents of the proxied file into memory.  This isn't so good for large files...

	
  3. The remote file's Content-Length header is not passed back to the client.  This prevents  the use of progress bars, etc. to gauge the progress of loading the resource...




In the version provided below I've tried to solve these problems by:

	
  1. removing the use of the CURLOPT_RETURNTRANSFER and instead letting curl just stream the response directly.  (I actually don't know if this solves the memory problem... if someone does know, please share...).  

	
  2. Rather than telling the proxy whether to include headers or dictate the content-type, I've added a function which will perform a HEAD request on the remote resource and then place the remote response headers in the response being returned from the proxy (essentially making the proxy more transparent...).

	
  3. I also added a little logic that will read the Content-Length header from the remote server and remove the script execution time out if a file over 50Kb is detected



Let me know if this is of any value and of course if there are improvements.  (I reluctantly know a bit more about curl now than I did a few days ago... so much to learn...).

[Simple PHP Proxy](http://www.jandersen.org/wp-content/uploads/2007/10/proxyphp.txt)
