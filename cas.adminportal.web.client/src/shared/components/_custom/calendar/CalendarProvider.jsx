// CalendarProvider.js
import { useState } from "react";

import { CalendarContext } from "./CalendarContext";
import { useCalendar } from "./useCalendar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import listPlugin from "@fullcalendar/list";

export const CalendarProvider = ({ children }) => {
  const {
    calendarRef,
    view,
    date,
    onDatePrev,
    onDateNext,
    onDateToday,
    onDropEvent,
    onChangeView,
    onSelectRange,
    onClickEvent,
    onResizeEvent,
    onInitialView,
    openForm,
    onOpenForm,
    onCloseForm,
    selectEventId,
    selectedRange,
    onClickEventInFilters,
  } = useCalendar();

  const updateEvent = () => {};

  const [currentWeek, setCurrentWeek] = useState([]);
  // Add Custom Table For User Calendar <CustomComponent /> : import set to /Day/Week

  const Calendar = ({ isShow = true, events, renderEventContent }) => (
    <FullCalendar
      weekends
      editable
      droppable
      selectable
      rerenderDelay={10}
      allDayMaintainDuration
      eventResizableFromStart
      ref={calendarRef}
      initialDate={date}
      initialView={view}
      dayMaxEventRows={3}
      eventDisplay="block"
      events={events}
      headerToolbar={false}
      height={isShow ? "auto" : 0}
      allDaySlot={isShow ? true : false}
      dayHeaders={isShow ? true : false}
      select={onSelectRange}
      eventContent={renderEventContent}
      eventClick={onClickEvent}
      aspectRatio={3}
      eventDrop={(arg) => onDropEvent(arg, updateEvent)}
      eventResize={(arg) => onResizeEvent(arg, updateEvent)}
      datesSet={(arg) => {
        const start = new Date(arg.start);
        const end = new Date(arg.end);
        const week = [];

        let day = new Date(start);
        while (day < end) {
          week.push({
            day: day.toLocaleString("en-US", { weekday: "short" }),
            date: `${day.getMonth() + 1}/${day.getDate()}`,
          });
          day.setDate(day.getDate() + 1);
        }

        function isSameWeek(a, b) {
          return (
            a.length === b.length &&
            a.every((v, i) => v.day === b[i].day && v.date === b[i].date)
          );
        }

        setCurrentWeek((prev) => (isSameWeek(prev, week) ? prev : week));
      }}
      plugins={[
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin,
        multiMonthPlugin,
        listPlugin,
      ]}
    />
  );

  return (
    <CalendarContext.Provider
      value={{
        date,
        view,
        openForm,
        currentWeek,
        calendarRef,
        onOpenForm,
        onCloseForm,
        onChangeView,
        onDateNext,
        onDatePrev,
        onInitialView,
        onDateToday,
        selectEventId,
        selectedRange,
        onClickEvent,
        onClickEventInFilters,
        Calendar,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
