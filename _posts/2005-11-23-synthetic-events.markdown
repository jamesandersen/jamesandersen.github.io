---
author: jandersen
comments: true
date: 2005-11-23 04:55:48+00:00
layout: post
slug: synthetic-events
title: Synthetic Events
wordpress_id: 9
tags:
- javascript
---

Here's a snippet for generating synthetic JS events; works in at least mozilla browsers and IE6, haven't tried others...


**Explanation**: This is what I came up with for a cross-browser way to generate synthetic events. I'm sure someone can improve on it and encapsulate it but this is straight out of Eclipse where I just put it togetherâ€¦ Works in Firefox 1.0 and IE6, haven't tested it elsewhere. I figure anyone interested in this doesn't need further explanation...

{% highlight javascript %}
    //create an event object with appropriate property values
    if (document.createEvent){
        evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("mousedown",false, //can bubble
    	true,
    	document.defaultView,
    	1,
    	findPosX(deferer), //screen x
    	findPosY(deferer), //screen y
    	findPosX(deferer), //client x
    	findPosY(deferer), //client y
    	false,
    	false,
    	false,
    	1,
    	deferer);
    	to.dispatchEvent(evt);
    } else {
    	var evt = document.createEventObject();
        // Set an expando property on the event object.
        // This will be used by the
        // event handler to determine what element was clicked on.
    	evt.clientX = findPosX(deferer);
    	evt.clientY = findPosY(deferer);
    	to.fireEvent("onmousedown",evt);
    	evt.cancelBubble = true;
    }
{% endhighlight %}