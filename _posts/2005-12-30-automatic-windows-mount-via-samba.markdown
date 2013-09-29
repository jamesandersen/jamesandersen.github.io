---
author: jandersen
comments: true
date: 2005-12-30 04:07:27+00:00
layout: post
slug: automatic-windows-mount-via-samba
title: Automatic Windows Mount via Samba?
wordpress_id: 13
tags:
- linux
- samba
---

OK, I can mount a Windows share just fine with smbmount as a normal user but I've having trouble getting the fstab mount method described [here](http://www.justlinux.com/nhf/Filesystems/Mounting_smbfs_Shares_Permanently.html) to work...Ã‚  It's been a useful article overall...UPDATE:Ã‚  I got the fstab mount to work (partially), the problem was that I was initializing my wireless connection through an rc.local script AFTER the attempt to mount the samba drive... DUH!Ã‚  Still working on making the mount read-write for all users...
