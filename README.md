# Daily check G-Sheets & create G-CalendarEvent
This document is used to guide you how to use this App script!

----
Currently, I create a sample sheet for note something (Like this)

![](https://i.imgur.com/Qh2Pr7h.png)

It has some columns:
- **NOTE DATE**: Like `Created at`, when you created this note.
- **EXPIRE DATE**: When send a notification to you! (You can rename it to `NOTIFY DATE` if need).
- **NOTE TITLE**: What you note, like `Go out with best friend`,...
- **NOTE DESCRIPTION**: Note details, like `Time: ___, With @thi_maaps, @thy_beos`,...
- **PIC**: You can remove (if not need), describe who create this note, in case more than one person uses your sheet.

> You can reuse my sheet, or create a new one!
> -> If you reuse it, go to `Section 1: Use my sheet`.
> -> If not, you want to create a new one?, go to `Section 2: Setup from a new one`.

## 1. Use my sheet

1. Go to my shared folder in G-Driver by clicking [here](https://drive.google.com/drive/folders/1MgrW4pdvVXsk1DqA11PYFzCooNZRjDs7?usp=sharing).
2. You will see a sheet with name `main`. Right click to it, and select `Make a copy`.
3. Done? Now, go to your `My Driver`, and move that sheet to a new folder (For sharing purpose, in the case more than one person need to use it).
4. Double click to it, to edit your sheet's content!

| **NOTE:** You can edit your sheet by any ways, with any contents,...

In your sheet, I configured:
- Date validation for `NOTE DATE` and `EXPIRE DATE`.
- PIC's options

In my sheet, I setup a script, which run daily, check the sheet, and create a new calendar event.

To view script, on the top bar, click to `Extension` and click to `App Scripts`.

![](https://i.imgur.com/5wWeoYm.png)

`Section 3: Script and how to use`.

## 2. Setup from a new one!
1. Of course, you need to have a new sheet first.
   - Create a new sheet in your drive.
   - Custom, or edit content
   - ...
2. Done? Let's setup script!
3. On the top bar, click to `Extensions` and select `App scripts`
   ![](https://i.imgur.com/5wWeoYm.png)
4. Copy code in the file `script.js` (in this source), and paste to it.
5. Add `moment` library:
   - Click to add library:
   ![](https://i.imgur.com/i9WYMj0.png)
   - In `Script ID` input, paste `15hgNOjKHUG4UtyZl9clqBbl23sDvWMS8pfDJOyIapZk5RBqwL3i-rlCo` and click button **Look up**.
     ![](https://i.imgur.com/7cGQKKM.png)
6. Add **Service** (Google Calendar & Google Sheets):
   - Click to add **Service**.
   - In the list of service, find and select **Google Sheets API**, and click to button **Add** at the bottom.
     ![](https://i.imgur.com/BYsvJDo.png)
   - One more, in that list, find and select **Google Calendar API**, and click to button **Add** at the bottom.
     ![](https://i.imgur.com/vVrZrMd.png)

Now, your project is ready to run!

![](https://i.imgur.com/j5iwoOu.png)

## 3. Script and how to use
> This step is so **IMPORTANT**!

To known more about Google script, view [here](https://developers.google.com/apps-script).

In the script's code:
```js
// Line 2-5: Script
const DATA_SHEET_ID = "1j1dlqv5z3og4vWr8CzfEzs2nUxNj-QW9VB4W1-YQoLo";
const DATA_RANGE = "A6:E"; // NOTE DATE | EXPIRE DATE | NOTE TITLE | NOTE DESCRIPTION | PIC
const EVENT_TIME_START = "073000"; // HHmmss
const EVENT_TIME_FINISH = "083000"; // HHmmss
```
### Data sheet ID:
In your sheet's URL:
```
https://docs.google.com/spreadsheets/d/{YOUR_SHEET_ID}/edit#gid=0
```

### Date range
Why `DATA_RANGE=A6:E`? Let's see the sheet (red area):

![](https://i.imgur.com/RlpajyW.png)
### Event time start & finish
Structure is `HHmmss`, example, you need create an event every day, start at **11h30** and finish at **17h30**, you need to change 2 variables to:
```js
const EVENT_TIME_START = "113000";
const EVENT_TIME_FINISH = "173000";
```

### Calendar event's title
Edit line 100 in script, if you need to change calendar-event's title.
```js
const eventTitle = `Has ${dataExpireToday.length} notes will be expired today`;
```

### Calendar event's content
Edit lines 34-38 to change event's content:
```js
const dataMapping = {
  noteDate: dataDate[0] ? new Date(dataDate[0]) : "", // Column NOTE DATE
  expDate, // dateDate[1]: Column EXPIRE DATE
  title: dataDate[2], // Column NOTE TITLE
  description: dataDate[3], // Column NOTE DESCRIPTION
  pic: dataDate[4], // Column PIC
};
```

Edit lines 106-109 to change event's structure:
```js
const contentByDate =
  `<b>PIC:</b> <i>${dataByDate.pic || "<small>&lt;No PIC&gt;</small>"}</i>\r\n` +
  `<b>Title:</b> <i>${dataByDate.title || "<small>&lt;No title&gt;</small>"}</i>.\r\n` +
  `<b>Description:</b> \r\n<i>${dataByDate.description || "<small>&lt;No description&gt;</small>"}</i>\r\n` +
  `<b>Noted at:</b> \r\n<i>${notedAtFormatted || "<small>&lt;No description&gt;</small>"}</i>\r\n`;
```

## 4. Schedule run script
In Google App Script, click to `Trigger`

![](https://i.imgur.com/l1z9fHh.png)

After, click to the button **Add Trigger** (Bottom right corner).

![](https://i.imgur.com/2YgdHap.png)
In this example, script will run automatic at a time between 1am and 2am.

## 5. Deploy
At the top right corner, click **Deploy**. Create a new deploy:

![](https://i.imgur.com/Q3tsyP0.png)


![](https://i.imgur.com/KIieIYE.png)