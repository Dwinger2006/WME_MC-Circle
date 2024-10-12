// ==UserScript==
// @name         WME MC Circles
// @description  Adds posibility of Map Comment to Waze Map Editor as a circle
// @namespace    https://github.com/Dwinger2006/Dancingman81
// @version      2024.10.12.01
// @include      https://*.waze.com/editor*
// @include      https://*.waze.com/*editor*
// @grant        none
// @author       Dancingman81
// @license      MIT
// @syncURL      https://github.com/Dwinger2006/WME_MC-Circle/raw/main/wme_mc-circles.user.js
//
// ==/UserScript==

// @downloadURL  https://update.greasyfork.org/scripts/510495/WME%20Link%20to%20Geoportal%20Luxembourg%20and%20Traffic%20Info.user.js
// @updateURL    https://update.greasyfork.org/scripts/510495/WME%20Link%20to%20Geoportal%20Luxembourg%20and%20Traffic%20Info.meta.js


(function() {
    'use strict';

    // Function to create a map comment as a circle
    function createMapCommentCircle(center, radius, commentText) {
        const map = W.map;
        const layer = map.getLayerByName('Map Comments');
        if (!layer) {
            console.error('Map Comments layer not found');
            return;
        }

        const circle = new OpenLayers.Geometry.Polygon.createRegularPolygon(
            new OpenLayers.Geometry.Point(center.lon, center.lat),
            radius,
            40, // Number of sides for the circle approximation
            0
        );

        const feature = new OpenLayers.Feature.Vector(circle, {
            comment: commentText
        });

        layer.addFeatures([feature]);
    }

    // Function to add a button to the WME toolbar
    function addButtonToToolbar() {
        const toolbar = document.querySelector('.WazeControlPermalink');
        if (!toolbar) {
            console.error('Toolbar not found');
            return;
        }

        const button = document.createElement('button');
        button.innerHTML = 'Add Circle';
        button.style.marginLeft = '10px';
        button.onclick = function() {
            const center = { lon: 6.13, lat: 49.61 }; // Center coordinates of the circle
            const radius = 100; // Radius in meters
            const commentText = 'This is a map comment circle';
            createMapCommentCircle(center, radius, commentText);
        };

        toolbar.appendChild(button);
    }

    // Wait for the WME to load and then add the button
    function waitForWME() {
        if (document.querySelector('.WazeControlPermalink')) {
            addButtonToToolbar();
        } else {
            setTimeout(waitForWME, 500);
        }
    }

    waitForWME();
})();