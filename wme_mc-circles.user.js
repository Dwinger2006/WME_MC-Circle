// ==UserScript==
// @name         WME MC Circles
// @description  Adds the ability to create Map Comments in Waze Map Editor as a circle
// @namespace    https://github.com/Dwinger2006/Dancingman81
// @version      2024.10.13.01
// @include      https://*.waze.com/editor*
// @grant        none
// @author       Dancingman81
// @license      MIT
// @syncURL      https://github.com/Dwinger2006/WME_MC-Circle/raw/main/wme_mc-circles.user.js
// @downloadURL  https://github.com/Dwinger2006/WME_MC-Circle/raw/main/wme_mc-circles.user.js
// @updateURL    https://github.com/Dwinger2006/WME_MC-Circle/raw/main/wme_mc-circles.meta.js
// ==/UserScript==

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
    function addCircleButton() {
        console.log("Adding Circle button");

        var toolbar = document.querySelector('.WazeControlPermalink');
        if (!toolbar) {
            console.error('Toolbar not found');
            return;
        }

        var circle_btn = document.createElement('button');
        circle_btn.style = "width: 100px;height: 24px; font-size:85%;color: blue;border-radius: 5px;border: 0.5px solid lightgrey; background: white; margin-left: 10px;";
        circle_btn.innerHTML = "Add Circle";

        circle_btn.addEventListener('click', function() {
            console.log('Circle button clicked');
            // Start circle creation here
            const center = { lon: 6.13, lat: 49.61 }; // Example center coordinates
            const radius = 100; // Example radius in meters
            const commentText = 'This is a map comment circle';
            createMapCommentCircle(center, radius, commentText);
        });

        toolbar.appendChild(circle_btn);
    }

    // Wait for the WME to load and then add the button
    function waitForWME() {
        if (document.querySelector('.WazeControlPermalink')) {
            addCircleButton();
        } else {
            setTimeout(waitForWME, 500);
        }
    }

    waitForWME();
})();
