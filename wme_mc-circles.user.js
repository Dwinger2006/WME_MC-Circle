// ==UserScript==
// @name         WME MC Circles
// @description  Adds the possibility to create Map Comments in Waze Map Editor as a circle
// @namespace    https://github.com/Dwinger2006/Dancingman81
// @version      2024.10.13.06
// @include      https://*.waze.com/editor*
// @grant        none
// @author       Dancingman81
// @license      MIT
// @syncURL      https://github.com/Dwinger2006/WME_MC-Circle/raw/main/wme_mc-circles.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the WME to be fully loaded
    function waitForWME() {
        if (typeof W === 'undefined' || typeof W.map === 'undefined' || typeof W.loginManager === 'undefined' || !W.loginManager.user) {
            setTimeout(waitForWME, 500);
        } else {
            initMPCircleTab();
        }
    }

    // Initialize the MP Circle tab
    function initMPCircleTab() {
        const tabLabel = 'MP Circle';
        const tabContent = '<div id="mp-circle-tab-content">Content for MP Circle tab</div>';

        // Create the tab
        const tab = $('<li>', { class: 'nav-item' }).append(
            $('<a>', { class: 'nav-link', href: '#', text: tabLabel })
        );

        // Add the tab to the script tabs
        $('#user-tabs ul.nav-tabs').append(tab);

        // Create the tab content
        const tabPane = $('<div>', { class: 'tab-pane', id: 'mp-circle-tab' }).html(tabContent);

        // Add the tab content to the script tab content
        $('#user-tabs .tab-content').append(tabPane);

        // Handle tab click event
        tab.on('click', function(e) {
            e.preventDefault();
            $('#user-tabs .tab-pane').removeClass('active');
            tabPane.addClass('active');
            $('#user-tabs ul.nav-tabs .nav-link').removeClass('active');
            tab.find('.nav-link').addClass('active');
        });
    }

    // Start waiting for WME to be fully loaded
    waitForWME();
})();