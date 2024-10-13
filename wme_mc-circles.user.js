// ==UserScript==
// @name         WME MC Circles
// @description  Adds the possibility to create Map Comments in Waze Map Editor as a circle
// @namespace    https://github.com/Dwinger2006/Dancingman81
// @version      2024.10.13.07
// @include      https://*.waze.com/editor*
// @grant        none
// @author       Dancingman81
// @license      MIT
// @syncURL      https://github.com/Dwinger2006/WME_MC-Circle/raw/main/wme_mc-circles.user.js
// ==/UserScript==

(function() {
    'use strict';

    async function initializeMyUserscript() {
        const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("wme-mc-circles");

        tabLabel.innerText = 'MC Circles';
        tabLabel.title = 'Map Comment Circles';

        tabPane.innerHTML = "<div id='mp-circle-tab-content'>Content for MP Circle tab</div>";

        await W.userscripts.waitForElementConnected(tabPane);

        // Additional initialization code can go here
    }

    if (W?.userscripts?.state.isReady) {
        initializeMyUserscript();
    } else {
        document.addEventListener("wme-ready", initializeMyUserscript, { once: true });
    }
})();

