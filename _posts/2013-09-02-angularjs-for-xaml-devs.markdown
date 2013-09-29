---
author: jandersen
comments: true
layout: post
title: AngularJS for XAML Devs
tags:
- angularjs 
- xaml
- javascript
- silverlight
- wpf
---

Not long ago I was selecting a javascript framework for a large client web project.  The client's existing applications made heavy use of Microsoft technologies so one factor in my choice was how would the framework "feel" coming from a background in Microsoft UI technologies.   Having built [Silverlight](http://www.microsoft.com/silverlight/), [WPF](http://msdn.microsoft.com/en-us/library/ms754130.aspx) and [Windows Phone](https://dev.windowsphone.com/en-US) apps myself, I felt particularly drawn to [AngularJS](http://angularjs.org/).  Below I'm calling out some core XAML concepts and their corresponding concepts in Angular.  Along the way I'll also note some key differences you should understand if you're coming from the world of XAML development.

DataContext => $scope
---------------------

The [Model-View-ViewModel](http://blogs.msdn.com/b/johngossman/archive/2005/10/08/478683.aspx) or MVVM pattern is the de facto standard for architecting applications using XAML technologies.   XAML's data-binding mechanisms facilitates keeping the "view"&mdash;a XAML document-in sync with the "view model"&mdash;some level of abstraction of the model that is constructed for the view. Typically the source of XAML data-bindings is the [`DataContext`](http://msdn.microsoft.com/en-us/library/system.windows.frameworkelement.datacontext.aspx) of parent element in a XAML document:

> Data context is a concept that allows elements to inherit information from their parent elements about the data source that is used for binding, as well as other characteristics of the binding, such as the path.

AngularJS provides a [`$scope`](http://docs.angularjs.org/api/ng.$rootScope.Scope) object whose function is very much like that of a DataContext (though the implementation is quite different).

* "$scope] is the glue between application controller and the view"; see [the Angular guide](http://docs.angularjs.org/guide/scope) for more information.
* Binding expressions are executed in the context of the `$scope` object
* `$scope`s are inherited; you can reference properties of the scope in binding expressions on elements contained by the element where the `$scope` is applied.

Unlike `DataContext` inheritance, `$scope` inheritance uses javascript's prototypal inheritance.  This is both more powerful (IMO) but also can introduce some unforeseen complexities.  Read [What are the nuances of scope prototypal / prototypical inheritance in AngularJS](http://stackoverflow.com/questions/14049480/what-are-the-nuances-of-scope-prototypal-prototypical-inheritance-in-angularjs) for more detail.


Data-binding &amp; INotifyPropertyChanged => $watch
------------

Alot of the grace and success of an "MV-whatever" application depends on the power of the data-binding between the view and the view model (or whatever you prefer...).   In XAML, the [`Binding`](http://msdn.microsoft.com/en-us/library/system.windows.data.binding.aspx) class (typically instantiated via attribute syntax during XAML parsing) is the core of databinding.  It gets the job done but I have to admit that, coming to XAML from the [Adobe Flex framework](http://www.adobe.com/products/flex.html), I felt the data-binding syntax was not as rich as I would've hoped (at least not without implementing an [`IValueConverter`](http://msdn.microsoft.com/en-us/library/system.windows.data.ivalueconverter.aspx) or other fairly awkward workarounds): 
* no logical expressions
* no math conversions
* no binding to method/function calls (when occasionally appropriate)
* no coallescing multiple model values into a single binding output
* etc.

With Angular [expressions](http://docs.angularjs.org/guide/expression) these limitations are removed and you can do something useful like this without a lot of extra headache:
{% highlight javascript %}
<div><span ng-bind="Math.round(parentTask.completedTasks / parentTask.totalTasks * 100)"/>% complete</div> 
{% endhighlight %}
Here are some quick points comparing XAML and Angular data-binding:

* Angular, like XAML, supports both one-way ([`ng-bind`](http://docs.angularjs.org/api/ng.directive:ngBind)) and two-way bind ([`ng-model`](http://docs.angularjs.org/api/ng.directive:ngModel)) values in the "view" to data in the `$scope`.
* Angular [expressions](http://docs.angularjs.org/guide/expression) (as implied above) are more flexible and forgiving than XAML expresssions
* With Angular, your model **DOESN'T** need to implement any special interface (like [`INotifyPropertyChanged`](http://msdn.microsoft.com/en-us/library/system.componentmodel.inotifypropertychanged.aspx)).  This is actually one of my favorite feature of Angular with respect to other javascript frameworks like [Backbone.js](http://backbonejs.org/) and [Knockout](http://knockoutjs.com/).  It doesn't use change listeners opting for [a dirty checking algorithm](http://stackoverflow.com/questions/9682092/databinding-in-angularjs) instead.
* AngularJS binding expression in HTML are **always** evaluated in the context of the `$scope` object; there isn't currently support for things like binding to `StaticResource`s or other elements in the markup using `ElementName`.  However, the [`$watch`](http://docs.angularjs.org/api/ng.$rootScope.Scope#$watch) API does provide you some more flexibility for creating "bindings" in code.


IValueConverter => Filter & NgModelController
---------------------------------------------

Before we move on from data-binding, let's take a quick second look at [`IValueConverter`](http://msdn.microsoft.com/en-us/library/system.windows.data.ivalueconverter.aspx).  When I wrote XAML apps I'd often have a list of a bunch of `IValueConverter`s linked into `App.xaml` that I could then reference throughout the app for common data-binding conversions:

{% highlight xml %}
<BooleanToVisibilityConverter x:Key="BoolToVisibilityConverter"/> 
<InverseVisibilityConverter x:Key="InverseVisibilityConverter"/> 
<VisibilityBoolConverter x:Key="VisibilityBoolConverter"/> 
<CurrencyFormatConverter x:Key="CurrencyFormatConverter"/> 
{% endhighlight %}

Angular has you covered here as well...  In Angular, common conversion or formatting that should be applied to the output of the data-binding before it is rendered in the view are called [filters](http://docs.angularjs.org/guide/dev_guide.templates.filters.using_filters).  Angular provides several built-in filters: [currency](http://docs.angularjs.org/api/ng.filter:currency), [date](http://docs.angularjs.org/api/ng.filter:date), etc and of course you can [create your own](http://docs.angularjs.org/guide/dev_guide.templates.filters.creating_filters).

`IValueConverter` actually supports conversions in both directions when applied on two-way bindings.  I found that most of the `IValueConverter`s I used and wrote had an unimplemented or very simplistic [`ConvertBack()`](http://msdn.microsoft.com/en-us/library/system.windows.data.ivalueconverter.convertback.aspx) method because they were only intended for use in one-way bindings.  However, if you do need fine-grained control of conversions in both directions in Angular, you'll want to add functions in the [`$parsers`](http://docs.angularjs.org/api/ng.directive:ngModel.NgModelController#$parsers) and/or [`$formatters`](http://docs.angularjs.org/api/ng.directive:ngModel.NgModelController#$formatters) arrays of the [`NgModelController`](http://docs.angularjs.org/api/ng.directive:ngModel.NgModelController) applied to that particular binding expression; `NgModelController` is somewhat analogous to [`BindingExpression`](http://msdn.microsoft.com/en-us/library/system.windows.data.bindingexpression.aspx).


Behaviors => Directives
-----------------------

In XAML a [`Behavior`](http://msdn.microsoft.com/en-us/library/ff726531.aspx) is used apply functionality, frequently some kind of visual interactivity, to an element within a XAML document. The [`AssociatedObject`](http://msdn.microsoft.com/en-us/library/system.windows.interactivity.behavior.associatedobject.aspx) which is available from the [`OnAttached`](http://msdn.microsoft.com/en-us/library/system.windows.interactivity.behavior.onattached.aspx) method provides access to the XAML element on which the Behavior has been applied.  You can listen for events on that element, update the properties of that element, modify the visual tree around that element, etc.  Implementing a Behavior would make sense when you have a common user interaction you'd like to reuse in several places in your application.  For example, if you have some contextual content that should be displayed when a [`TextBox`](http://msdn.microsoft.com/en-us/library/system.windows.controls.textbox.aspx) has focus, a behavior could be attached to the TextBox, listen for focus events and toggle the visibility state of another chunk of content.

In Angular, [directives](http://docs.angularjs.org/guide/directive) fill a function for HTML markup very similar to Behaviors for XAML markup.

{% highlight javascript %}
   angular.module('yourmodule', [])
  .directive('showContentOnFocus', function() {
    // Writing directives can range from a simple to a complex undertaking
    // This simple approach is just highlight some similarities to XAML Behaviors
    //
    // Angular provides both
    // - a scope ~= ((FrameworkElement)AssociatedObject).DataContext 
    // - an element ~= AssociateObject
    return function(scope, element, attrs) {
      
      // perform DOM manipulation, attach event handlers here...
 
      // listen on DOM destroy (removal) event
      element.on('$destroy', function() {
          // This is where you'd perform logic to 
          // remove event listeners like you would
          // in Behavior.OnDetaching()
      });
    }
  });
{% endhighlight %}


