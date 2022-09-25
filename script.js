// Sheet config
const DATA_SHEET_ID = "1j1dlqv5z3og4vWr8CzfEzs2nUxNj-QW9VB4W1-YQoLo";
const DATA_RANGE = "A6:E"; // NOTE DATE | EXPIRE DATE | NOTE TITLE | NOTE DESCRIPTION | PIC
const EVENT_TIME_START = "073000"; // HHmmss
const EVENT_TIME_FINISH = "083000"; // HHmmss
// Date time format
const DATETIME_FORMAT = "DDMMYYYY HHmmss";
// Moment define
const moment = Moment.load();

/**
 * Get sheet value by range
 */
const getCheckInData = function() {
  try {
    const result = Sheets.Spreadsheets.Values.get(DATA_SHEET_ID, DATA_RANGE);
    const numRows = result.values ? result.values.length : 0;
    if (numRows === 0) {
      Logger.log(`[getCheckInData] - Sheet (#${DATA_SHEET_ID}) with range "${DATA_RANGE}" is empty!`);
      return {};
    }
    const dataByDates = result.values;
    const res = {};
    dataByDates.forEach(dataDate => {
      const expDateValue = dataDate[1];
      if (!expDateValue) {
        // Invalid -> Continue;
        return;
      }
      // Calc data
      const expDate = new moment(Date(expDateValue));
      const expDateFormatted = expDate.format('DDMMYYYY');
      const dataMapping = {
        noteDate: dataDate[0] ? new Date(dataDate[0]) : "",
        expDate, // dateDate[1]
        title: dataDate[2],
        description: dataDate[3],
        pic: dataDate[4],
      };

      // Add data to res
      if (res[expDateFormatted]) {
        // Already exist this finish date
        res[expDateFormatted].push(dataMapping);
        return;
      }
      res[expDateFormatted] = [dataMapping];
    });
    return res;
  } catch (err) {
    Logger.log('Error when handle [getCheckInData] %s', err.message);
    return {};
  }
};

/**
 * This func will create a new event in default calendar
 * @param {String} title Event's title
 * @param {String} description Event's description
 * @param {Date} start Event will start at ___
 * @param {Date} finish Event will finish at ___
 * @param {Object} options Event options. View [here](https://developers.google.com/apps-script/reference/calendar/calendar#advanced-parameters_3)
 * @returns {Event} Event just created!
 */
function createCalendarEvent(title, description, start, finish, options = {}) {
  const ev = CalendarApp.getDefaultCalendar().createEvent(
    title,
    start,
    finish,
    {
      ...options,
      description,
    },
  );
  // Do any actions with this event here...
  // View actions here: https://developers.google.com/apps-script/reference/calendar/calendar-event
  Logger.log(`Created a new calendar-event (#${ev.getId()})`);
  return ev;
}

// Run daily -> Check sheet -> Create calendar
const dailyCheckAndCreateCalendar = function() {
  try {
    const today = new moment();
    const todayFormatted = today.format('DDMMYYYY - HHmmss Z');
    const eventStart = new moment(`${todayFormatted} ${EVENT_TIME_START}`, DATETIME_FORMAT).toDate();
    const eventFinish = new moment(`${todayFormatted} ${EVENT_TIME_FINISH}`, DATETIME_FORMAT).toDate();
    Logger.log(`======================================= ${todayFormatted} =======================================`);

    const dataMapping = getCheckInData();
    
    const dataExpireToday = dataMapping[todayFormatted];
    if (!dataExpireToday) {
      Logger.log('[dailyCheckAndCreateCalendar] - No note expire today');
      return;
    }
    Logger.log(`[dailyCheckAndCreateCalendar] - Has ${dataExpireToday.length} note(s) will be expired today!`);
    
    // Define event's content
    const eventTitle = `Has ${dataExpireToday.length} notes will be expired today`;
    const eventDescByNotes = [];
    dataExpireToday.forEach(dataByDate => {
      const notedAt = dataByDate.noteDate ? new moment(dataByDate.noteDate) : "";
      const notedAtFormatted = notedAt ? notedAt.format('DD/MM/YYYY') : "";
      const contentByDate =
        `<b>PIC:</b> <i>${dataByDate.pic || "<small>&lt;No PIC&gt;</small>"}</i>\r\n` +
        `<b>Title:</b> <i>${dataByDate.title || "<small>&lt;No title&gt;</small>"}</i>.\r\n` +
        `<b>Description:</b> \r\n<i>${dataByDate.description || "<small>&lt;No description&gt;</small>"}</i>\r\n` +
        `<b>Noted at:</b> \r\n<i>${notedAtFormatted || "<small>&lt;No description&gt;</small>"}</i>\r\n`;
      eventDescByNotes.push(contentByDate);
    })
    const eventDesc = "Please update your notes before it expire!\r\n" +
      "\r\n---------------------------------\r\n\r\n" +
      eventDescByNotes.join("\r\n---------------------------------\r\n");
    createCalendarEvent(eventTitle, eventDesc, eventStart, eventFinish);
  } catch (err) {
    Logger.log('Error when handle [dailyCheckAndCreateCalendar] %s', err.message);
  }
};
