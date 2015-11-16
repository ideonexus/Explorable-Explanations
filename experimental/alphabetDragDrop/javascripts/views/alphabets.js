/**
 * Created: User: sanjeev.musafir    Date: 9/21/12    Time: 5:52 PM
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
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/alphabets.html'
], function($, _, Backbone, AlphabetTemplate){
    var AlphabetView = Backbone.View.extend({

        //... is a list tag.
        tagName:  "li",
        // Cache the template function for a single item.
        template: _.template(AlphabetTemplate),
        // The DOM events specific to an item.


        initialize: function() {
            this.model.bind('change', this.render, this);
            this.model.view = this;
        },

        // Re-render the contents of the todo item.
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
                return this;
        }


    });
    return AlphabetView;
});