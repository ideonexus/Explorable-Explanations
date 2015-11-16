readme.md
# Letters

My one-year-old daughter likes to bash my coomputer keyboard. I can't stop her without there being tears, so I've made an app that teaches her letters and how they sound. 

It's a web application, built with HTML, CSS and JavaScript because these are my core languages. It uses [Require][] and [Backbone][] because I wanted to practice with them - though they're both overkill for such a simple app. The app may end up in a portfolio website, where Require may appear a wise choice.

[Require]: http://requirejs.org/
[Backbone]: http://backbonejs.org/

## Changelog
- 2013-01 sometime - recorded and edited some audio. The lost the edits.
- 2012-09-02 re-worked into a simple MVC structure, using Backbone
- 2012-08-30-ish wrapped it up in RequireJS. There's a main.js to start the app and the core functionality is now a `define()`'d module
- 2012-08-27 created a basic layout and letter-expansion animation, using HTML5Boilerplate.