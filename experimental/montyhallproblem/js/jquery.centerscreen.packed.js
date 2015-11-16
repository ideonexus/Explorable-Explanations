/*
 * CenterScreen v1.1 - jQuery plugin
 * 
 *  Copyright (c) 2009 - 2010 Andreas Grech
 *
 *  Dual licensed under the MIT and GPL licenses:
 *    http://www.opensource.org/licenses/mit-license.php
 *    http://www.gnu.org/licenses/gpl.html
 *
 * http://blog.dreasgrech.com
 */
 
(function($){$.fn.centerScreen=function(){return this.each(function(){var $this=$(this),$window=$(window),center=function(){var winWidth=$window.width(),winHeight=$window.height();$this.css({position:'absolute',left:((winWidth/2)-($this.outerWidth()/2)),top:((winHeight/2)-($this.outerHeight()/2))})};$window.resize(center);center()})}}(jQuery));
