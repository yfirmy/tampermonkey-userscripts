// ==UserScript==
// @name         Auto Timesheet
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatic Timesheet Filler
// @author       Yohan FIRMY (yfirmy)
// @match        https://*/psc/fsprda/EMPLOYEE/ERP/c/NUI_FRAMEWORK.PT_AGSTARTPAGE_NUI.GBL*
// @grant        none
// @homepage     https://github.com/yfirmy/tampermonkey-userscripts
// @downloadURL  https://raw.github.com/yfirmy/tampermonkey-userscripts/main/auto-timesheet.js
// @updateURL    https://raw.github.com/yfirmy/tampermonkey-userscripts/main/auto-timesheet.js
// ==/UserScript==

(
function() {
    'use strict';
    function fillField(doc, weekday, fieldId, fieldValue) {
       let element = doc.getElementById(fieldId)
       if(element) {
          element.value = fieldValue;
          element.onchange();
       } else console.log("Element " + fieldId + " was not found");
    }
    function checkTimesheet(changes, observer) {

       let iframeTimesheet = document.getElementById('main_target_win0');
       let iframeAdditionalInfo = document.querySelector("div.ps_modal_content.psc_has_iframe>iframe[id^=ptModFrame_]");

       if(iframeTimesheet) {
          let innerDocument = iframeTimesheet.contentDocument ? iframeTimesheet.contentDocument : iframeTimesheet.contentWindow.document;
          if(innerDocument.getElementById("TIME1$0")){
              // Working hours per day
              fillField(innerDocument, "Monday",    "TIME2$0", '7,70');
              fillField(innerDocument, "Tuesday",   "TIME3$0", '7,70');
              fillField(innerDocument, "Wednesday", "TIME4$0", '7,70');
              fillField(innerDocument, "Thursday",  "TIME5$0", '7,70');
              fillField(innerDocument, "Friday",    "TIME6$0", '7,70');
              fillField(innerDocument, "Comments", "EX_TIME_HDR_COMMENTS", "(Automatically filled timesheet - see github.com/yfirmy/tampermonkey-userscripts)");
          }
       }
       if(iframeAdditionalInfo) {
          let innerDocument = iframeAdditionalInfo.contentDocument ? iframeAdditionalInfo.contentDocument : iframeAdditionalInfo.contentWindow.document;
          if(innerDocument.getElementById("UC_DAILYREST1$0")){

              // Daily rest
              fillField(innerDocument, "Monday",    "UC_DAILYREST2$0", 'Y');
              fillField(innerDocument, "Tuesday",   "UC_DAILYREST3$0", 'Y');
              fillField(innerDocument, "Wednesday", "UC_DAILYREST4$0", 'Y');
              fillField(innerDocument, "Thursday",  "UC_DAILYREST5$0", 'Y');
              fillField(innerDocument, "Friday",    "UC_DAILYREST6$0", 'Y');

              // Working start times
              fillField(innerDocument, "Monday",    "UC_DAILYREST2$1", 'Y');
              fillField(innerDocument, "Tuesday",   "UC_DAILYREST3$1", 'Y');
              fillField(innerDocument, "Wednesday", "UC_DAILYREST4$1", 'Y');
              fillField(innerDocument, "Thursday",  "UC_DAILYREST5$1", 'Y');
              fillField(innerDocument, "Friday",    "UC_DAILYREST6$1", 'Y');

              // Working more than a half day
              fillField(innerDocument, "Monday",    "UC_DAILYREST2$2", 'Y');
              fillField(innerDocument, "Tuesday",   "UC_DAILYREST3$2", 'Y');
              fillField(innerDocument, "Wednesday", "UC_DAILYREST4$2", 'Y');
              fillField(innerDocument, "Thursday",  "UC_DAILYREST5$2", 'Y');
              fillField(innerDocument, "Friday",    "UC_DAILYREST6$2", 'Y');

              // Lunch time
              fillField(innerDocument, "Monday",    "UC_TIME_LIN_WRK_UC_DAILYREST12$0", '1,0');
              fillField(innerDocument, "Tuesday",   "UC_TIME_LIN_WRK_UC_DAILYREST13$0", '1,0');
              fillField(innerDocument, "Wednesday", "UC_TIME_LIN_WRK_UC_DAILYREST14$0", '1,0');
              fillField(innerDocument, "Thursday",  "UC_TIME_LIN_WRK_UC_DAILYREST15$0", '1,0');
              fillField(innerDocument, "Friday",    "UC_TIME_LIN_WRK_UC_DAILYREST16$0", '1,0');

              // Working location on mornings
              fillField(innerDocument, "Monday",    "UC_LOCATION_A2$0", 'T');
              fillField(innerDocument, "Tuesday",   "UC_LOCATION_A3$0", 'T');
              fillField(innerDocument, "Wednesday", "UC_LOCATION_A4$0", 'C');
              fillField(innerDocument, "Thursday",  "UC_LOCATION_A5$0", 'C');
              fillField(innerDocument, "Friday",    "UC_LOCATION_A6$0", 'T');

              // Working location on afternoons
              fillField(innerDocument, "Monday",    "UC_LOCATION_A2$1", 'T');
              fillField(innerDocument, "Tuesday",   "UC_LOCATION_A3$1", 'T');
              fillField(innerDocument, "Wednesday", "UC_LOCATION_A4$1", 'C');
              fillField(innerDocument, "Thursday",  "UC_LOCATION_A5$1", 'C');
              fillField(innerDocument, "Friday",    "UC_LOCATION_A6$1", 'T');

              let saveButton = innerDocument.getElementById("#ICSave");
              saveButton.addEventListener('click', function() {
                  observer.disconnect();
              });
          }
       }
    }
    var observer = new MutationObserver(checkTimesheet);
    observer.observe(document.body, {attributes:true, childList: true, subtree: true});
})();
