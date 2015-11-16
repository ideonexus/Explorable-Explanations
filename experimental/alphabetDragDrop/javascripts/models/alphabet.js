/**
 * Created: User: sanjeev.musafir    Date: 9/21/12    Time: 2:37 PM
 * Copyright (C) 2012  Sanjeev Musafir
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */

define(['underscore', 'backbone'], function(_, Backbone) {
var ScreenItemModel = Backbone.Model.extend( {
    defaults: {
        title: "",
        image: "default.jpg",
        sound: "default.avi",
        coordinates:[0,0]
      },

    initialize: function(){
       // console.log('Model ScreenItem has been initialized');
     }



});
    return ScreenItemModel;
});