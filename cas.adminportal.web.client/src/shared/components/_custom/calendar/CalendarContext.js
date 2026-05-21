// CalendarContext.js

import { createContext, useContext } from "react";

export const CalendarContext = createContext(null);

export const useCalendarContext = () => useContext(CalendarContext);
