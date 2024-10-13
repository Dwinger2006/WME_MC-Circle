// ==UserScript==
// @name         WME MC Circles
// @description  Adds the possibility to create Map Comments in Waze Map Editor as a circle
// @namespace    https://github.com/Dwinger2006/Dancingman81
// @version      2024.10.13.05
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

    // Bootstrap-Funktion, um sicherzustellen, dass WME und OpenLayers bereit sind
    function bootstrap() {
        if (typeof W === 'undefined' || typeof OpenLayers === 'undefined') {
            console.log("Waiting for WME and OpenLayers to load...");
            setTimeout(bootstrap, 500);  // Warte 500ms und prüfe erneut
        } else {
            console.log("WME and OpenLayers loaded, initializing script...");
            initializeMyUserscript();  // Initialisiere das Script, wenn WME bereit ist
        }
    }

    // Manuelle Methode, um den Tab zur Seitenleiste hinzuzufügen
    function addManualSidebarTab() {
        console.log("Attempting to add manual sidebar tab...");

        let userTabs = document.getElementById('user-info');
        if (!userTabs) {
            console.error("User info panel not found!");
            return;
        }

        let navTabs = document.getElementsByClassName('nav-tabs', userTabs)[0];
        let tabContent = document.getElementsByClassName('tab-content', userTabs)[0];

        if (!navTabs || !tabContent) {
            console.error("Navigation tabs or tab content not found!");
            return;
        }

        let tab = document.createElement('li');
        tab.innerHTML = '<a href="#sidepanel-mc-circle" data-toggle="tab">MC Circle</a>';
        navTabs.appendChild(tab);

        let addon = document.createElement('section');
        addon.id = "sidepanel-mc-circle";
        addon.className = "tab-pane";
        addon.innerHTML = '<h2>MC Circle Tool</h2><p>Klicke auf die Karte, um das Zentrum zu setzen, und erneut, um den Radius zu bestimmen.</p>';
        tabContent.appendChild(addon);

        console.log("Manual sidebar tab added successfully.");
    }

    // Hauptinitialisierungsfunktion
    function initializeMyUserscript() {
        console.log("Script initializing...");

        try {
            addManualSidebarTab();
            console.log("Manual sidebar tab added successfully.");
        } catch (error) {
            console.error("Error adding sidebar tab:", error);
        }

        // Füge Event-Listener für Klicks auf der Karte hinzu
        W.map.events.register("click", W.map, onMapClick);
    }

    // Funktion, um auf Klicks auf der Karte zu reagieren
    function onMapClick(event) {
        console.log("Map clicked at: ", event.xy);

        if (!center) {
            // Erster Klick setzt das Zentrum
            center = event.xy;
            console.log("Center set at:", center);
        } else if (!radius) {
            // Zweiter Klick berechnet den Radius
            const clickPosition = event.xy;
            radius = calculateDistance(center, clickPosition);
            console.log("Radius set at:", radius);

            // Zeichne den Kreis
            drawCircle(center, radius);
        } else {
            // Zurücksetzen, wenn sowohl Zentrum als auch Radius gesetzt sind
            center = null;
            radius = null;
            console.log("Resetting center and radius.");
        }
    }

    // Hilfsfunktion zur Berechnung des Abstands zwischen zwei Punkten
    function calculateDistance(center, clickPosition) {
        const dx = center.x - clickPosition.x;
        const dy = center.y - clickPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy); // Satz des Pythagoras
        console.log("Distance calculated: ", distance);
        return distance;
    }

    // Funktion, um den Kreis auf der Karte zu zeichnen
    function drawCircle(center, radius) {
        console.log("Drawing circle at center:", center, " with radius:", radius);

        const olCircle = new OpenLayers.Geometry.Polygon.createRegularPolygon(
            new OpenLayers.Geometry.Point(center.x, center.y),
            radius,
            40, // Anzahl der Seiten zur Annäherung an den Kreis
            0
        );
        const circleFeature = new OpenLayers.Feature.Vector(olCircle);

        if (!circleLayer) {
            circleLayer = new OpenLayers.Layer.Vector("Circle Layer");
            W.map.addLayer(circleLayer);
            console.log("Circle layer added to map.");
        }

        circleLayer.addFeatures([circleFeature]);
        console.log("Circle drawn on the map.");
    }

    // Starte den Bootstrap-Prozess
    bootstrap();

})();
