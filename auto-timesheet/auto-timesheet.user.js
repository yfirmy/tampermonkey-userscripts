// ==UserScript==
// @name         Auto Timesheet Filler
// @namespace    https://github.com/yfirmy/tampermonkey-userscripts
// @version      1.4.2
// @description  Automatic Timesheet Filler
// @author       Yohan FIRMY
// @match        https://*/psc/fsprda/EMPLOYEE/ERP/c/NUI_FRAMEWORK.PT_AGSTARTPAGE_NUI.GBL*
// @match        https://*/psc/ihprda/EMPLOYEE/EMPL/c/NUI_FRAMEWORK.PT_AGSTARTPAGE_NUI.GBL*
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.0/moment.min.js
// @grant        none
// @homepage     https://github.com/yfirmy/tampermonkey-userscripts/tree/main/auto-timesheet
// @downloadURL  https://raw.github.com/yfirmy/tampermonkey-userscripts/main/auto-timesheet/auto-timesheet.user.js
// @updateURL    https://raw.github.com/yfirmy/tampermonkey-userscripts/main/auto-timesheet/auto-timesheet.user.js
// ==/UserScript==

(
function() {
    'use strict';

    // Customize here after:
    const WORK_HOURS = '7,70';
    const LUNCH_HOURS = '1,00';

    // Constants
    const REMOTE_WORKING = 'T';
    const CLIENT_SITE = 'C';
    const CGI_SITE = 'O';
    const NOT_APPLICABLE = 'NA';

    var presenceByDay;
    var momentByDay;

    function fillTimesheet(doc) {

       // Working hours per day (in hours)
       fillField(doc, "Monday",    "input", "TIME2$0", WORK_HOURS, '');
       fillField(doc, "Tuesday",   "input", "TIME3$0", WORK_HOURS, '');
       fillField(doc, "Wednesday", "input", "TIME4$0", WORK_HOURS, '');
       fillField(doc, "Thursday",  "input", "TIME5$0", WORK_HOURS, '');
       fillField(doc, "Friday",    "input", "TIME6$0", WORK_HOURS, '');
       //fillField(doc, "Comments",  "textarea", "EX_TIME_HDR_COMMENTS", "", "(Timesheet préremplie automatiquement)");
    }

    function fillAdditionalInformations(doc) {

       // Daily rest (Y,N or NA)
       fillField(doc, "Monday",    "select", "UC_DAILYREST2$0", 'Y', 'NA');
       fillField(doc, "Tuesday",   "select", "UC_DAILYREST3$0", 'Y', 'NA');
       fillField(doc, "Wednesday", "select", "UC_DAILYREST4$0", 'Y', 'NA');
       fillField(doc, "Thursday",  "select", "UC_DAILYREST5$0", 'Y', 'NA');
       fillField(doc, "Friday",    "select", "UC_DAILYREST6$0", 'Y', 'NA');

       // Working start times (Y,N or NA)
       fillField(doc, "Monday",    "select", "UC_DAILYREST2$1", 'Y', 'NA');
       fillField(doc, "Tuesday",   "select", "UC_DAILYREST3$1", 'Y', 'NA');
       fillField(doc, "Wednesday", "select", "UC_DAILYREST4$1", 'Y', 'NA');
       fillField(doc, "Thursday",  "select", "UC_DAILYREST5$1", 'Y', 'NA');
       fillField(doc, "Friday",    "select", "UC_DAILYREST6$1", 'Y', 'NA');

       // Working more than a half day (Y,N or NA)
       fillField(doc, "Monday",    "select", "UC_DAILYREST2$2", 'Y', 'NA');
       fillField(doc, "Tuesday",   "select", "UC_DAILYREST3$2", 'Y', 'NA');
       fillField(doc, "Wednesday", "select", "UC_DAILYREST4$2", 'Y', 'NA');
       fillField(doc, "Thursday",  "select", "UC_DAILYREST5$2", 'Y', 'NA');
       fillField(doc, "Friday",    "select", "UC_DAILYREST6$2", 'Y', 'NA');

       // Lunch time (in hours)
       fillField(doc, "Monday",    "input", "UC_TIME_LIN_WRK_UC_DAILYREST12$0", LUNCH_HOURS, '');
       fillField(doc, "Tuesday",   "input", "UC_TIME_LIN_WRK_UC_DAILYREST13$0", LUNCH_HOURS, '');
       fillField(doc, "Wednesday", "input", "UC_TIME_LIN_WRK_UC_DAILYREST14$0", LUNCH_HOURS, '');
       fillField(doc, "Thursday",  "input", "UC_TIME_LIN_WRK_UC_DAILYREST15$0", LUNCH_HOURS, '');
       fillField(doc, "Friday",    "input", "UC_TIME_LIN_WRK_UC_DAILYREST16$0", LUNCH_HOURS, '');

       // Working location on mornings (P,T,C,O,E,VCGI,VCLI or NA)
       // Customize here after (replace the REMOTE_WORKING/CLIENT_SITE by your actual working place
       // (possible values : REMOTE_WORKING, CLIENT_SITE, CGI_SITE or NOT_APPLICABLE)
       fillField(doc, "Monday",    "select", "UC_LOCATION_A2$0", REMOTE_WORKING, 'NA');
       fillField(doc, "Tuesday",   "select", "UC_LOCATION_A3$0", REMOTE_WORKING, 'NA');
       fillField(doc, "Wednesday", "select", "UC_LOCATION_A4$0", CLIENT_SITE,    'NA');
       fillField(doc, "Thursday",  "select", "UC_LOCATION_A5$0", CLIENT_SITE,    'NA');
       fillField(doc, "Friday",    "select", "UC_LOCATION_A6$0", REMOTE_WORKING, 'NA');

       // Working location on afternoons (P,T,C,O,E,VCGI,VCLI or NA)
       // Customize here after (replace the REMOTE_WORKING/CLIENT_SITE by your actual working place
       // (possible values : REMOTE_WORKING, CLIENT_SITE, CGI_SITE or NOT_APPLICABLE)
       fillField(doc, "Monday",    "select", "UC_LOCATION_A2$1", REMOTE_WORKING, 'NA');
       fillField(doc, "Tuesday",   "select", "UC_LOCATION_A3$1", REMOTE_WORKING, 'NA');
       fillField(doc, "Wednesday", "select", "UC_LOCATION_A4$1", CLIENT_SITE,    'NA');
       fillField(doc, "Thursday",  "select", "UC_LOCATION_A5$1", CLIENT_SITE,    'NA');
       fillField(doc, "Friday",    "select", "UC_LOCATION_A6$1", REMOTE_WORKING, 'NA');
    }

    function fillField(doc, weekday, fieldType, fieldId, fieldValueIfPresent, fieldValueIfAbsent) {
       let element = doc.querySelector(fieldType + "[id='" + fieldId + "']");
       if(element) {
          if(presenceByDay && presenceByDay.get(weekday)) {
             element.value = fieldValueIfPresent;
          } else {
             element.value = fieldValueIfAbsent;
          }
          element.onchange();
       } else console.log("Element input[id='" + fieldId + "'] was not found");
    }

    function weekDayAsInt(weekday) {
        // Monday -> 0, Tuesday -> 1, ...
        return moment(weekday, 'dddd', true).day()+1;
    }

    function isPublicHoliday(momentDate) {
        let perpetualFrenchPublicHolidays = ["01/01", "01/05", "08/05", "14/07", "15/08", "01/11", "11/11", "25/12"];
        let otherFrenchPublicHolidays = ["01/04/2024", "09/05/2024", "20/05/2024",
                                         "21/04/2025", "29/05/2025", "09/06/2025",
                                         "06/04/2026", "14/05/2026", "25/05/2026",
                                         "29/03/2027", "06/05/2027", "17/05/2027",
                                         "17/04/2028", "25/05/2028", "05/06/2028",
                                         "02/04/2029", "10/05/2029", "21/05/2029"]
        return perpetualFrenchPublicHolidays.includes(momentDate.format("DD/MM")) ||
               otherFrenchPublicHolidays.includes(momentDate.format("DD/MM/YYYY"));
    }

    function fillPublicHoliday(doc, weekday, workHours) {
        if(isPublicHoliday(momentByDay.get(weekday))) {
           let day = weekDayAsInt(weekday);
           let publicHolidayElement = doc.querySelector("input[id='POL_TIME"+day+"$30']");
           let publicHolidayDescrElement = doc.querySelector("span[id='POL_DESCR$30']");
           if(publicHolidayDescrElement &&
              (publicHolidayDescrElement.innerHTML=="Jour férié" || publicHolidayDescrElement.innerHTML=="Public holiday")) {
               publicHolidayElement.value = workHours;
               publicHolidayElement.onchange();
           } else {
              console.log("Public holidays fields not found");
           }
        }
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

    function buildCalendar(endDate) {
        let result = new Map();
        result.set("Monday",    endDate.clone().subtract(5, 'days'));
        result.set("Tuesday",   endDate.clone().subtract(4, 'days'));
        result.set("Wednesday", endDate.clone().subtract(3, 'days'));
        result.set("Thursday",  endDate.clone().subtract(2, 'days'));
        result.set("Friday",    endDate.clone().subtract(1, 'days'));
        return result;
    }

    function checkTimesheet(changes, observer) {

       let iframeTimesheet = document.getElementById('main_target_win0');
       let iframeAdditionalInfo = document.querySelector("div.ps_modal_content.psc_has_iframe>iframe[id^=ptModFrame_]");

       if(iframeTimesheet) {
          let innerDocument = iframeTimesheet.contentDocument ? iframeTimesheet.contentDocument : iframeTimesheet.contentWindow.document;
          if(innerDocument.querySelector("input[id='TIME1$0']")){

              let dateElement = innerDocument.querySelector("span[id='EX_TIME_HDR_PERIOD_END_DT']");
              if(dateElement) {
                  let endDate = dateElement.innerHTML;
                  momentByDay = buildCalendar(moment(endDate, "DD/MM/YYYY"));
                  fillPublicHoliday(innerDocument, "Monday",    WORK_HOURS);
                  fillPublicHoliday(innerDocument, "Tuesday",   WORK_HOURS);
                  fillPublicHoliday(innerDocument, "Wednesday", WORK_HOURS);
                  fillPublicHoliday(innerDocument, "Thursday",  WORK_HOURS);
                  fillPublicHoliday(innerDocument, "Friday",    WORK_HOURS);
              }

              presenceByDay = checkPresence(innerDocument);
              fillTimesheet(innerDocument);
          }
       }

       if(iframeAdditionalInfo) {
          let innerDocument = iframeAdditionalInfo.contentDocument ? iframeAdditionalInfo.contentDocument : iframeAdditionalInfo.contentWindow.document;
          if(innerDocument.querySelector("select[id='UC_DAILYREST1$0']")){

              fillAdditionalInformations(innerDocument);
              let saveButton = innerDocument.getElementById("#ICSave");
              saveButton.addEventListener('click', function() {
                  //observer.disconnect();
              });
          }
       }
    }
    var observer = new MutationObserver(checkTimesheet);
    observer.observe(document.body, {attributes:true, childList: true, subtree: true});
})();
