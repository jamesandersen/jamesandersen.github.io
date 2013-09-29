---
author: jandersen
comments: true
layout: post
title: Mormon Trails in Processing
tags:
- data visualization, processing, books
---

<div class="update">
    <h3 class="icon-edit">&nbsp;Update - <a href="/mormontrails/">Now available online!</a></h3>
    <i>Not going to be pretty unless on a desktop... not mobile optimized</i>
    <p>At the time I originally created this visualization, I did so in <a href="http://processing.org/" target="blank">Processing "proper"</a>.  I just recently ported the original visualization over to <a href="http://processingjs.org/" target="_blank">processing.js</a> a javascript port of the original java based environment that uses the HTML canvas element.   I had used <a href="http://docs.oracle.com/javase/6/docs/api/java/util/Date.html" target="blank">java.util.Date</a> and a few other java specific classes (which Processing allows) in the original "sketch".  These java specific references in my code needed to be replaced with javascript equivalents which processing.js gracefully permits.</p>
</div>

Someone sent me a link to  the [GE Healthcare visualization](http://visualization.geblogs.com/visualization/health_visualizer/) and I thought it was awesome!  I entered into a slight man crush of [Ben Fry](https://benfry.com) and read his book [Visualizing Data](http://www.amazon.com/Visualizing-Data-Explaining-Processing-Environment/dp/0596514557).  Along with some solid data visualization concepts, the book introduces [Processing](http://processing.org/) a language/environment tailored for creating data visualizations created by [Ben Fry](https://benfry.com) and [Casey Reas](https://reas.com).  I decided to give Processing a whirl in an effort to make myself my "data visualization" savvy.

I always find it best to learn a new tech by finding some non-trivial application to apply it to.   In this case I took a shot at visualizing (with permission) the [Mormon Pioneer Overland Travel](http://history.lds.org/overlandtravels/) database.   This database contains details of all known Mormon pioneer companies who traveled to Utah between 1847 and 1869.  One of my ancestors, [Denmark Jensen](https://familysearch.org/photos/images/109975), was born in the middle of one of these journeys.

With my personal connection (noted above), seeing some of this data visualized (albeit by a rookie) was personally satisfying.   It was also entertaining at a technical level.  Here's a couple of the fun tasks involved:
<ul>
    <li>I wrote a C# console program to:<br/>
      <ol>
         <li>scrape data from the [source website](http://history.lds.org/overlandtravels/companydatelist)</li>
         <li>automate the geocoding (thanks <a href="http://msdn.microsoft.com/en-us/library/ff701715.aspx" target="_blank">Bing!</a>) of the departure locations</li>
         <li>write the results out to a .csv file</li>
      </ol>
    </li>
    <li>I got wrap my head around the <a href="http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Quadratic_B.C3.A9zier_curves" target="_blank">formula for quadratic bezier curves</a> to figure out how to animate them in the visualization</li>
</ul>

I'm happy with some things while still unsatisfied with others.  I intend to critique [the outcome](/mormontrails/) in a future post. 