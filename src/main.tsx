import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isToday from "dayjs/plugin/isToday";
import isoWeek from "dayjs/plugin/isoWeek";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import ReactDOM from "react-dom/client";
import "./main.scss";
import Router from "./routes";

dayjs.extend(isoWeek);
dayjs.extend(isToday);
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
);
