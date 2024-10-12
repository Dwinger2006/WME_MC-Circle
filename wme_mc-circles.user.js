// ==UserScript==
// @name         WME MC Circles
// @description  Adds the possibility to create Map Comments in Waze Map Editor as a circle
// @namespace    https://github.com/Dwinger2006/Dancingman81
// @version      2024.10.13.04
// @include      https://*.waze.com/editor*
// @grant        none
// @author       Dancingman81
// @license      MIT
// @syncURL      https://github.com/Dwinger2006/WME_MC-Circle/raw/main/wme_mc-circles.user.js
// ==/UserScript==

(function() {
    'use strict';

    let center = null;
    let radius = null;
    let circleLayer = null;

    function initializeMyUserscript() {
        console.log("WME MC Circle Initialized");

        // Add the button to the sidebar
        const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("mc-circle");
        tabLabel.innerText = 'MC Circle';
        tabLabel.title = 'Map Circle Creator';

        tabPane.innerHTML = "<h2>Click on the map to set center, then click again to set radius.</h2>";

        // Add event listeners for map clicks
        W.map.events.register("click", W.map, onMapClick);
    }

    // Function to handle map clicks
    function onMapClick(event) {
        if (!center) {
            // First click sets the center
            center = event.xy;
            console.log("Center set at:", center);
        } else if (!radius) {
            // Second click calculates the radius
            const clickPosition = event.xy;
            radius = calculateDistance(center, clickPosition);
            console.log("Radius set at:", radius);

            // Draw the circle
            drawCircle(center, radius);
        } else {
            // Reset the process if both center and radius are already set
            center = null;
            radius = null;
            console.log("Resetting center and radius.");
        }
    }

    // Helper function to calculate distance between two points (center and click)
    function calculateDistance(center, clickPosition) {
        const dx = center.x - clickPosition.x;
        const dy = center.y - clickPosition.y;
        return Math.sqrt(dx * dx + dy * dy); // Pythagorean theorem
    }

    // Function to draw the circle on the map
    function drawCircle(center, radius) {
        const olCircle = new OpenLayers.Geometry.Polygon.createRegularPolygon(
            new OpenLayers.Geometry.Point(center.x, center.y),
            radius,
            40, // number of sides for the approximation of the circle
            0
        );
        const circleFeature = new OpenLayers.Feature.Vector(olCircle);

        if (!circleLayer) {
            circleLayer = new OpenLayers.Layer.Vector("Circle Layer");
            W.map.addLayer(circleLayer);
        }

        circleLayer.addFeatures([circleFeature]);
        console.log("Circle drawn on the map.");
    }

    // Register to the WME initialization event
    if (W?.userscripts?.state.isReady) {
        initializeMyUserscript();
    } else {
        document.addEventListener("wme-ready", initializeMyUserscript, {
            once: true
        });
    }

})();
