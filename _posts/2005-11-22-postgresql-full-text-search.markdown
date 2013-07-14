---
author: jandersen
comments: true
date: 2005-11-22 22:11:19+00:00
layout: post
slug: postgresql-full-text-search
title: PostgreSQL Full Text Search
wordpress_id: 8
---

[Implementing Full Text Indexing with PostgreSQL](http://www.devx.com/opensource/Article/21674/0/page/1)



	
  1. on Fedora Core 3
rpm -ql postgresql-contrib

	
  2. read the tsearch2.README

	
  3.     psql blikidb < /usr/share/pgsql/contrib/tsearch2.sql


ALTER TABLE public.wikipage   ADD COLUMN vectors tsvector;
CREATE INDEX markup_index    ON wikipage    USING gist(vectors);
SELECT set_curcfg('default');
UPDATE wikipage SET vectors = to_tsvector('default', markup);
SELECT entry_id,headline(description,q),
