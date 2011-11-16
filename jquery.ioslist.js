/**
 * Copyright (c) 2011 Ken Colton
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * License available in GPL-LICENSE.txt or <http://www.gnu.org/licenses/>.
 */
 
/**
 * A jQuery UI widget for creating iOS style lists with headers that stick to the
 * top of the window after they get scrolled past
 */

$.widget('ui.iOSList', {
    /**
     * Widget entry point.
     */
    _create: function()
    {
        var self = this;
        
        // Add the proper styling to this list 
        // The included stylesheet can act as a base for your to work off of
        self.element.addClass('iOSList');
        
        // Create a container for all of our category proxies. Just to keep them in one neat place
        self.$proxyContainer = $('<div class="iOSList_ProxyContainer"></div>').appendTo('body');

        // Grab the categories
        self.$categories = self.element.find('> li > div');

        // Create the category proxies
        self.$categories.each(function() {
            var $category = $(this);
            
            // Clone the category, add the class marker and set the width
            var $proxy = $category.clone().addClass('iOSList_Proxy').css('width', $category.width());
            
            // Store a reference to the proxy with the category
            $category.data('proxy', $proxy);
            
            // Add the proxy to the container
            $proxy.appendTo(self.$proxyContainer);
        });
        
        // There are a few browser events that we are interested in
        // because they will trigger us to refresh our display of things
        $(window).bind('resize', function() {
            self._refreshDisplay();
        });

        $(window).bind('scroll', function() {
            self._refreshDisplay();
        });
        
        // Do a refresh of the display now, and also have it schedule future updates
        self._refreshDisplay(true);
    },
    
    /**
     * Checks the position of all of the categories. hides and shows proxies as appropriate
     * and aligns the proxies at the correct position on the screen
     */
    _refreshDisplay: function(scheduleUpdate)
    {
        var self = this;
        
        // Put the proxy container at the right horizontal location
        var listLeftOffset = self.element.offset().left;
        
        // Grab the window scroll top
        var windowScrollTop = parseInt($(window).scrollTop());
        
        // Loop through the categories
        self.$categories.each(function() {
            
            var $category = $(this); 
            var $categoryProxy = $category.data('proxy');
            var categoryTop = parseInt($category.offset().top);
            
            if (categoryTop < windowScrollTop) {
                // This category is being scrolled off screen
                
                // Hide the original and show the proxy
                $category.css('visibility', 'hidden');
                $categoryProxy.css('left', listLeftOffset).show();

            } else {
                // The category is in normal view
                
                // Show the original and hide the proxy
                $category.css('visibility', 'visible');
                $categoryProxy.hide();
            }
        });
        
        // Check if we should schedule another update
        // We do updated every 3 seconds just to make sure the position hasnt changed
        // through some events we are not or can not watch
        if (scheduleUpdate) {
            setTimeout(function()
            {
                console.log('auto update');
                self._refreshDisplay(true);
            }, 3000);
        }
        
    }
});

