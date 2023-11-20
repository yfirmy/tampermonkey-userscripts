// ==UserScript==
// @name         Auto Timesheet
// @namespace    http://tampermonkey.net/
// @version      1.1
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
    var presenceByDay;

    function fillField(doc, weekday, fieldType, fieldId, fieldValueIfPresent, fieldValueIfAbsent) {
       let element = doc.querySelector(fieldType + "[id='" + fieldId + "']");
       if(element) {
           console.log(presenceByDay);
          if(presenceByDay && presenceByDay.get(weekday)) {
             element.value = fieldValueIfPresent;
          } else {
             element.value = fieldValueIfAbsent;
          }
          element.onchange();
       } else console.log("Element input[id='" + fieldId + "'] was not found");
    }
    function weekDayAsInt(weekday) {
        let result;
        switch(weekday) {
            case 'Sunday':    result=1; break;
            case 'Monday':    result=2; break;
            case 'Tuesday':   result=3; break;
            case 'Wednesday': result=4; break;
            case 'Thursday':  result=5; break;
            case 'Friday':    result=6; break;
            case 'Saturday':  result=7; break;
            default:          result=undefined;
        }
        return result;
    }
    function checkPresenceOnDay(doc, weekday) {
        let result = true;
        let day = weekDayAsInt(weekday);
        let line = 0;
        let absenceElementOnSameDay;
        do {
            absenceElementOnSameDay = doc.querySelector("input[id='POL_TIME"+day+"$"+line+"']");
            if(absenceElementOnSameDay && absenceElementOnSameDay.value && absenceElementOnSameDay.value!='') {
              result = false;
              break;
            }
            line = line + 1;
        } while(absenceElementOnSameDay);
        return result;
    }
    function checkPresence(doc) {
        let result = new Map();
        result.set("Monday",    checkPresenceOnDay(doc, "Monday"));
        result.set("Tuesday",   checkPresenceOnDay(doc, "Tuesday"));
        result.set("Wednesday", checkPresenceOnDay(doc, "Wednesday"));
        result.set("Thursday",  checkPresenceOnDay(doc, "Thursday"));
        result.set("Friday",    checkPresenceOnDay(doc, "Friday"));
        return result;
    }
    function checkTimesheet(changes, observer) {

       let iframeTimesheet = document.getElementById('main_target_win0');
       let iframeAdditionalInfo = document.querySelector("div.ps_modal_content.psc_has_iframe>iframe[id^=ptModFrame_]");

       if(iframeTimesheet) {
          let innerDocument = iframeTimesheet.contentDocument ? iframeTimesheet.contentDocument : iframeTimesheet.contentWindow.document;
          if(innerDocument.querySelector("input[id='TIME1$0']")){

              presenceByDay = checkPresence(innerDocument);

              // Working hours per day (in hours)
              fillField(innerDocument, "Monday",    "input", "TIME2$0", '7,70', '');
              fillField(innerDocument, "Tuesday",   "input", "TIME3$0", '7,70', '');
              fillField(innerDocument, "Wednesday", "input", "TIME4$0", '7,70', '');
              fillField(innerDocument, "Thursday",  "input", "TIME5$0", '7,70', '');
              fillField(innerDocument, "Friday",    "input", "TIME6$0", '7,70', '');
              fillField(innerDocument, "Comments",  "textarea", "", "EX_TIME_HDR_COMMENTS", "(Automatically filled timesheet - see github.com/yfirmy/tampermonkey-userscripts)");
          }
       }
       if(iframeAdditionalInfo) {
          let innerDocument = iframeAdditionalInfo.contentDocument ? iframeAdditionalInfo.contentDocument : iframeAdditionalInfo.contentWindow.document;
          if(innerDocument.querySelector("select[id='UC_DAILYREST1$0']")){

              // Daily rest (Y,N or NA)
              fillField(innerDocument, "Monday",    "select", "UC_DAILYREST2$0", 'Y', 'NA');
              fillField(innerDocument, "Tuesday",   "select", "UC_DAILYREST3$0", 'Y', 'NA');
              fillField(innerDocument, "Wednesday", "select", "UC_DAILYREST4$0", 'Y', 'NA');
              fillField(innerDocument, "Thursday",  "select", "UC_DAILYREST5$0", 'Y', 'NA');
              fillField(innerDocument, "Friday",    "select", "UC_DAILYREST6$0", 'Y', 'NA');

              // Working start times (Y,N or NA)
              fillField(innerDocument, "Monday",    "select", "UC_DAILYREST2$1", 'Y', 'NA');
              fillField(innerDocument, "Tuesday",   "select", "UC_DAILYREST3$1", 'Y', 'NA');
              fillField(innerDocument, "Wednesday", "select", "UC_DAILYREST4$1", 'Y', 'NA');
              fillField(innerDocument, "Thursday",  "select", "UC_DAILYREST5$1", 'Y', 'NA');
              fillField(innerDocument, "Friday",    "select", "UC_DAILYREST6$1", 'Y', 'NA');

              // Working more than a half day (Y,N or NA)
              fillField(innerDocument, "Monday",    "select", "UC_DAILYREST2$2", 'Y', 'NA');
              fillField(innerDocument, "Tuesday",   "select", "UC_DAILYREST3$2", 'Y', 'NA');
              fillField(innerDocument, "Wednesday", "select", "UC_DAILYREST4$2", 'Y', 'NA');
              fillField(innerDocument, "Thursday",  "select", "UC_DAILYREST5$2", 'Y', 'NA');
              fillField(innerDocument, "Friday",    "select", "UC_DAILYREST6$2", 'Y', 'NA');

              // Lunch time (in hours)
              fillField(innerDocument, "Monday",    "input", "UC_TIME_LIN_WRK_UC_DAILYREST12$0", '1,0', '');
              fillField(innerDocument, "Tuesday",   "input", "UC_TIME_LIN_WRK_UC_DAILYREST13$0", '1,0', '');
              fillField(innerDocument, "Wednesday", "input", "UC_TIME_LIN_WRK_UC_DAILYREST14$0", '1,0', '');
              fillField(innerDocument, "Thursday",  "input", "UC_TIME_LIN_WRK_UC_DAILYREST15$0", '1,0', '');
              fillField(innerDocument, "Friday",    "input", "UC_TIME_LIN_WRK_UC_DAILYREST16$0", '1,0', '');

              // Working location on mornings (P,T,C,O,E,VCGI,VCLI or NA)
              fillField(innerDocument, "Monday",    "select", "UC_LOCATION_A2$0", 'T', 'NA');
              fillField(innerDocument, "Tuesday",   "select", "UC_LOCATION_A3$0", 'T', 'NA');
              fillField(innerDocument, "Wednesday", "select", "UC_LOCATION_A4$0", 'C', 'NA');
              fillField(innerDocument, "Thursday",  "select", "UC_LOCATION_A5$0", 'C', 'NA');
              fillField(innerDocument, "Friday",    "select", "UC_LOCATION_A6$0", 'T', 'NA');

              // Working location on afternoons (P,T,C,O,E,VCGI,VCLI or NA)
              fillField(innerDocument, "Monday",    "select", "UC_LOCATION_A2$1", 'T', 'NA');
              fillField(innerDocument, "Tuesday",   "select", "UC_LOCATION_A3$1", 'T', 'NA');
              fillField(innerDocument, "Wednesday", "select", "UC_LOCATION_A4$1", 'C', 'NA');
              fillField(innerDocument, "Thursday",  "select", "UC_LOCATION_A5$1", 'C', 'NA');
              fillField(innerDocument, "Friday",    "select", "UC_LOCATION_A6$1", 'T', 'NA');

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
