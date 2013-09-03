---
author: jandersen
comments: true
date: 2005-11-23 04:59:33+00:00
layout: post
slug: sorting-dom-nodes
title: Sorting DOM Nodes
wordpress_id: 10
excerpt: A routine for sorting DOM nodes
excerpt_separator: ""
categories:
- javascript
---

{% highlight javascript %}

    /**********************************
    **  Functions to sort children of DOM nodes
    **  James Andersen 2-25-05
    **  No license, if you'd like to mention me, that'd be great
    **  http://jander.me
    **********************************/
    
    function sortChildren(el){
    	//bubbleSortNodes(el.childNodes);
    	insertionSortNodes(el.childNodes);
    }
    
    //sort nodes based on bubbleSort algorithm
    function bubbleSortNodes(children) {
    	for(var k=0; k < children.length; k++){
    		if(children[k].nodeType ==3){
    			children[k].parentNode.removeChild(children[k]);
    		}
    	}
    	var rest = children.length -1;
    	for (var i = rest - 1; i >= 0;  i--) {
    	for (var j = 0; j <= i; j++) {
    		if(gt(children[j+1], children[j])) {
    			children[j].parentNode.insertBefore(children[j+1],children[j]);
    	      }
    	   }
    	}
    }
    
    //sort nodes based on insertion sort algorithm
    function insertionSortNodes(children)
    {
      prepareChildren(children);
    
      var i, j, index, tmp;
      var array_size = children.length;
    
      for (i=1; i < array_size; i++)
      {
        index = children[i].cloneNode(true);
        j = i;
        while ((j > 0) && !gt(children[j-1], index))
        {
          tmp = children[j-1].cloneNode(true);
          children[j].parentNode.replaceChild(tmp, children[j]);
          j = j - 1;
        }
        children[j].parentNode.replaceChild(index, children[j]);
      }
    }
    
    //determine whether node1 is greater than node2
    function gt(node1, node2){
    	var sort1 = node1.sortval;
    	var sort2 = node2.sortval;
    
    	if(typeof node1 == 'object'){
    		sort1 = node1.sortval ? node1.sortval : getSortVal(node1);
    		node1.sortval = sort1;
    	}
    	if(typeof node2 == 'object'){
    		sort2 = node2.sortval ? node2.sortval : getSortVal(node2);
    		node2.sortval = sort2;
    	}
    	return (sort1 < sort2);
    }
    
    //get the value of the first text node
    function getSortVal(mynode){
    	var tmp;
    	if(mynode.nodeType == 3){
    		return trim(mynode.nodeValue.toLowerCase());
    	}else if(mynode.childNodes.length > 0){
    		for(var i = 0; i < mynode.childNodes.length; i++){
    			tmp = getSortVal(mynode.childNodes[i]);
    			if(tmp != null && tmp != ''){
    				return tmp;
    			}
    		}
    	}else{
    		return null;
    	}
    }
    
    function prepareChildren(children){
    	if(!children[0].parentNode.prepared){
    		for(var k =0; k < children.length; k++){
    			if(children[k].nodeType ==3){
    				if(trim(children[k].nodeValue) == ''){
    					children[k].parentNode.removeChild(children[k]);
    				}
    			}
    		}
    		children[0].parentNode.prepared = true;
    	}
    }
    
    function alertArray(children){
    	var msg = '';
    	for(var x = 0; x < children.length; x++){
    		msg += 'Element ' + x + '-->' + (children[x].sortval ? children[x].sortval : children[x]) + 'n';
    	}
    	alert(msg);
    }
    
    function trim(str)
    {
       return str.replace(/^s*|s*$/g,"");
    }
{% endhighlight %}