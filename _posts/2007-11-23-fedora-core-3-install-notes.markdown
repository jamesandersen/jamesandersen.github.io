---
author: jandersen
comments: true
date: 2007-11-23 04:11:19+00:00
layout: post
slug: fedora-core-3-install-notes
title: Fedora Core 3 Install Notes
wordpress_id: 21
tags:
- linux
- fedora
---

Fedora Core 3 Installation Notes
open up some basic ports in iptables with system-config-securitylevel

cd /rootmkdir .sshvi .ssh/authorized_keys and add my public key

downloaded postgres rpms from postgres site and installed with rpm -Uvh  had to start with libs then did server and the rest
problem with postgresql-pl  was dependent on tcl package tried yum install tcl but got message about no GPG keys imported
went surfing and ran across the jpackage repo info so added
