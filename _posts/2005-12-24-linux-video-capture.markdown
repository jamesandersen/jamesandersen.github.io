---
author: jandersen
comments: true
date: 2005-12-24 05:03:27+00:00
layout: post
slug: linux-video-capture
title: Linux Video Capture
wordpress_id: 12
---

I just spent several hours getting my WinTV PVR USB2 video capture device up and running on my laptop running Fedora Core 4.Â  Here's the really quick rundown of what I did...



	
  1. I started with [Mike Isley's work](http://www.isely.net/pvrusb2.html) on the driver which seems to be the only one active still; or rather the latest iteration on this driver.

	
  2. I did not have to set up a kernel source tree as he describes (luckily because I didn't really know how to do that...).Â  Instead I had to install the kernel-devel package with yum and then I discovered that it had downloaded sources for the latest kernel and I needed to update mine before it worked.Â  See the [FC4 release notes](http://fedora.redhat.com/docs/release-notes/fc4/) for more detail.

	
  3. Once I had installed the kernel-devel package and made sure my kernel was up to date I was able to run make and make install for both the driver subfolder and the ivtv subfolder in the source code downloaded from Mike Isley's site.Â  I followed his instructions for loading the modules and checking for dependencies etc.Â  The first time I tried to load the module I got an error.Â  I restarted and tried again and got a slightly different error.Â  I was about to give up but decided to just plug the capture device in anyway to see what would happen and it seemed to work.

	
  4. UPDATE:Â  When I returned to this a few days later I found it no longer working and spent several more hours in utter frustration unable to figure out what had happened.Â  Many thanks to Julian and Mike from the PVRUSB2 mailing list for their quick responses which set me on track.Â  Apparently my problem was that I was loading the support modules provided by the driver (from Mike Isley's site above) rather than using those provided my kernel.Â  Specifically, I had renamed these modules in favor of those installed in /lib/modules/2.6.14-1.1653_FC4/pvrusb2 by the "make install" task when compiling the driver and support modules.Â  This was my problem...Â  Make sure you have the following modules and delete the modules of the same name in the pvrusb2 folder.


