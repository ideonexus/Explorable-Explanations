# Letters notes

## 2013-02-06
Some time ago I recorded myself speaking the alphabet in phonetic form. I've now marked up this file and exported each phoneme separately. 

Initially, the idea was to use one audio file, with a [WebVTT][] file in an HTML5 track element to help define timing within the application. However, I decided recently this wasn't maintainable enough. I might want to re-record just one phoneme, so it would be easier to manage if they were all separate. 

I may revisit this post 1.0.

## 2012-09-01
- tried various methods of triggering a custom event on a view
	- all failed until...
- read [this StackOverflow discussion][1]
	- the chosen answer and the one from James Brown point out that the events list in a view is used to define events triggered *on the view.el* not on the view object itself. This is not made explicit in the bbjs docs
	- so to get the view to respond, I simply triggered the custom event on the view.el. 
	- i suspect there's a better way to do it. [Another discussion][2] on SO and [this, linked from it][3], which I actually read before the other one, suggest using an event aggregator. 


[1]: http://stackoverflow.com/questions/5379290/how-to-trigger-bind-custom-events-in-backbone-js-views/8630126#answer-8029660 
	 "How to trigger / bind custom events in Backbone.js views?"

[2]: http://stackoverflow.com/questions/6930621/backbone-js-binding-from-one-view-to-another
	 "Backbone.js - Binding from one view to another?"

[3]: http://lostechies.com/derickbailey/2012/04/03/revisiting-the-backbone-event-aggregator-lessons-learned/
	 "Revisiting The Backbone Event Aggregator: Lessons Learned"

[webVTT]: http://www.html5rocks.com/en/tutorials/track/basics/
     "Getting started with the track element - HTML5 ROCKS"