// ==UserScript==
// @name         WME MC Circles
// @description  Adds the possibility to create Map Comments in Waze Map Editor as a circle
// @namespace    https://github.com/Dwinger2006/Dancingman81
// @version      2024.10.13.02
// @include      https://*.waze.com/editor*
// @grant        none
// @author       Dancingman81
// @license      MIT
// @syncURL      https://github.com/Dwinger2006/WME_MC-Circle/raw/main/wme_mc-circles.user.js
// @downloadURL  https://update.greasyfork.org/scripts/510495/WME%20Link%20to%20Geoportal%20Luxembourg%20and%20Traffic%20Info.user.js
// @updateURL    https://update.greasyfork.org/scripts/510495/WME%20Link%20to%20Geoportal%20Luxembourg%20and%20Traffic%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isDrawing = false;
    let circleLayer;
    let mapCommentLayer;

    // Log to check if the script is running
    console.log('WME MC Circles script loaded');

    // Create the circle drawing function
    function drawCircle(center, radius) {
        const circle = new OpenLayers.Geometry.Polygon.createRegularPolygon(
            new OpenLayers.Geometry.Point(center.lon, center.lat),
            radius,
            40, // Sides to approximate a circle
            0
        );
        return circle;
    }

    // Function to add Map Comment as Circle
    function createMapCommentCircle(center, radius) {
        const layer = W.map.getLayerByName('Map Comments');
        if (!layer) {
            console.error('Map Comments layer not found');
            return;
        }

        const circleFeature = new OpenLayers.Feature.Vector(drawCircle(center, radius), {
            comment: 'Circle Comment'
        });

        layer.addFeatures([circleFeature]);
    }

    // Add the "Draw Circle" button
    function addCircleButton() {
        const toolbar = document.querySelector('.WazeControlPermalink');
        if (!toolbar) {
            console.error('Toolbar not found');
            return;
        }

        const button = document.createElement('button');
        button.innerHTML = 'Draw Circle';
        button.style.marginLeft = '10px';
        button.onclick = startDrawingCircle;

        toolbar.appendChild(button);
    }

    // Start drawing the circle by selecting the center
    function startDrawingCircle() {
        isDrawing = true;
        W.map.events.register('click', W.map, onMapClick);
    }

    function onMapClick(event) {
        if (!isDrawing) return;

        const lonlat = W.map.getLonLatFromPixel(event.xy);
        const center = { lon: lonlat.lon, lat: lonlat.lat };
        const radius = 100; // Default radius
        createMapCommentCircle(center, radius);

        isDrawing = false;
        W.map.events.unregister('click', W.map, onMapClick);
    }

    // Initialize when WME is ready
    function initialize() {
        console.log('WME is initializing...');
        if (typeof W !== 'undefined' && W.userscripts && W.userscripts.state.isReady) {
            addCircleButton();
        } else {
            console.log("WME is not ready yet, retrying...");
            document.addEventListener("wme-ready", initialize, { once: true });
        }
    }

    initialize();

})();
