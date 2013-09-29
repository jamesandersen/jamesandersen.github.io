---
author: jandersen
comments: true
date: 2005-11-27 04:45:00+00:00
layout: post
slug: fc4-on-dell-inspiron-8500-install-notes
title: FC4 on Dell Inspiron 8500 - Install Notes
wordpress_id: 11
tags:
- linux
- Windows
---

OK, so my XP pro install on my laptop cratered which was all I needed to finally get me to try installing linux on it which I'd been wanting to try for a while.Ã‚  I expected to hit some snags but that didn't really make the late hours combing the web any less frustrating... Maybe this will be useful to someone out there...



	
  * **Partitioning**- My first error was using automatic partitioning during the install...Ã‚  The install finished but it wouldn't even start up; it erred out with some kernel error related to lvm which I discovered was the logical volume manager.Ã‚  A little googling informed me that using manual rather than automatic partitioning is the way to get around this.Ã‚  Worked for me...

	
  * **Wireless**- I've got a PCMCIA wireless card made by 3COM (3CRSHPW196).Ã‚  It turns out this guy uses the atmel chipset and fortunately there is support for this hardware through the open source community.Ã‚  I followed [andydixon's notes](http://andydixon.com/3CRSHPW196.htm) and but have noticed that I can't set the wireless card (eth1) to activate on startup.Ã‚  It works ok if I activate it after I've logged in but I get firmware errors when I set it to load at startup...

	
  * **A****TI Radeon Mobility**- After searching around quite a bit without finding any good HOW-TOs that looked simple enough I just went straight to ati.com and followed the links to their proprietary [linux drivers for ATI video cards](https://support.ati.com/ics/support/default.asp?deptID=894&task=knowledge&folderID=300).Ã‚  They've got an automated installer that did the trick for me but be sure to backup your /etc/X11/xorg.conf file just in case...

	
  * **Slow Browsing**- OK, I was pretty disappointed to see how slow browsing was on my laptap after the FC4 install.Ã‚  I searched on this a bit and found that IP6 is somehow on by default in FC4 and can slow down network performance.Ã‚  I edited my /etc/modprobe.conf adding the following two lines intended to turn off ip6 in the kernel and rebooted.Ã‚  It seems a little better now...

	
    *         alias net-pf-10 off

	
    *         alias ipv6 off




	
  * **Sound card**- The anaconda installer seemed to do a good job of detecting my Intel 82801DB/DBL/DBM sound card but for some reason I couldn't hear any sound.Ã‚  Again, after much googling for me [the solution](http://or-media.com/orforum/viewtopic.php?t=13) was to unmute the "external amplifier".Ã‚  I did this by running alsamixer from a console.Ã‚  This brings up several ANSI volume guage type things.Ã‚  Use the right arrow to scroll to the right most gauge which should be the "External Amplifier" (scroll past what is originally displayed).Ã‚  Hit "m" to unmute it and then hit "ESC" to quit.Ã‚  That solved it for me.

	
  * **XMMS w/MP3 support**- Had to add the livna repo for yum to access by creating a livna.repo file in /etc/yum.repos.d with the following contents:


