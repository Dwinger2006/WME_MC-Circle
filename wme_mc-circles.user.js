// ==UserScript==
// @name         WME MC Circles
// @description  Adds the ability to create Map Comments in Waze Map Editor as circles
// @namespace    https://github.com/Dwinger2006/Dancingman81
// @version      2024.10.12.03
// @include      https://*.waze.com/editor*
// @include      https://*.waze.com/*editor*
// @grant        none
// @author       Dancingman81
// @license      MIT
// @syncURL      https://github.com/Dwinger2006/WME_MC-Circle/raw/main/wme_mc-circles.user.js
//
// ==/UserScript==

(function() {
    'use strict';

    let centerPoint = null;
    let tempCircleLayer = null;
    let drawing = false;

    // Create a temporary OpenLayers layer for drawing the circle
    function createTempLayer() {
        tempCircleLayer = new OpenLayers.Layer.Vector("Temp Circle Layer");
        W.map.addLayer(tempCircleLayer);
    }

    // Function to start drawing the circle
    function startDrawingCircle(event) {
        if (!drawing) {
            centerPoint = event.xy;  // Set the center point on the first click
            drawing = true;
            console.log("Center set: ", centerPoint);
        } else {
            // On the second click, calculate radius and draw the circle
            const radius = calculateDistance(centerPoint, event.xy);
            drawCircle(centerPoint, radius);
            drawing = false;
        }
    }

    // Calculate distance between two points to determine the radius
    function calculateDistance(center, point) {
        const dx = center.x - point.x;
        const dy = center.y - point.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Function to draw the circle as a map comment
    function drawCircle(center, radius) {
        const mapCenter = W.map.getLonLatFromViewPortPx(center);
        const circle = new OpenLayers.Geometry.Polygon.createRegularPolygon(
            new OpenLayers.Geometry.Point(mapCenter.lon, mapCenter.lat),
            radius,
            40, // Number of sides for a circle approximation
            0
        );

        const feature = new OpenLayers.Feature.Vector(circle, {
            comment: "Map Comment Circle"
        });

        const mapCommentLayer = W.map.getLayerByName("Map Comments");
        if (mapCommentLayer) {
            mapCommentLayer.addFeatures([feature]);
            tempCircleLayer.destroy();  // Clear the temporary layer
        } else {
            console.error('Map Comments layer not found');
        }
    }

    // Function to add a button to the toolbar
    function addCircleButton() {
        const toolbar = document.querySelector('.WazeControlPermalink');
        if (!toolbar) {
            console.error('Toolbar not found');
            return;
        }

        const button = document.createElement('button');
        button.innerHTML = 'Draw Circle';
        button.style.marginLeft = '10px';
        button.onclick = function() {
            createTempLayer();
            W.map.events.register('click', W.map, startDrawingCircle);
        };

        toolbar.appendChild(button);
    }

    // Wait for WME to load and then add the button
    function waitForWME() {
        if (document.querySelector('.WazeControlPermalink')) {
            addCircleButton();
        } else {
            setTimeout(waitForWME, 500);
        }
    }

    waitForWME();
})();
