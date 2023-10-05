import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import dayjs from "dayjs";
import { useState } from "react";
import { type Habit } from "../types";
import "./Calendar.scss";

const SHOWN_DAYS: number = 6 * 7;

function classNames(...classes: Array<undefined | boolean | string>) {
  return classes.filter(Boolean).join(" ");
}

interface Props extends Habit {
  onClose(marks: Date[]): void;
}

export default function Calendar(props: Props) {
  const [$calendarOpen, setCalendarOpen] = useState(true);
  const [$calendarAnim, setCalendarAnim] = useState(true);
  const [$habitMarks, setHabitMarks] = useState<Date[]>(props.marks);
  const [$selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs>(dayjs().date(1));

  return (
    <>
      <div
        className="fixed inset-0 flex items-end px-8 py-8 z-[60]"
        onClick={() => {
          setCalendarOpen(false);
          setCalendarAnim(true);
        }}
      >
        <div
          className={`h-auto w-full rounded-2xl bg-zinc-900 shadow-xl px-2.5 py-2.5 overflow-hidden z-[70] transform origin-bottom ${
            !$calendarOpen && "translate-y-24 opacity-0"
          } ${$calendarAnim && ($calendarOpen ? "animate-calendar-open" : "animate-calendar-close")}`}
          onClick={(e) => e.stopPropagation()}
          onAnimationEnd={() => {
            setCalendarAnim(false);
            if (!$calendarOpen) {
              props.onClose($habitMarks);
            }
          }}
        >
          <div className="text-center">
            <div className="flex items-center">
              <button
                type="button"
                className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-slate-400"
                onClick={() => setSelectedMonth($selectedMonth.subtract(1, "month"))}
              >
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="flex-auto text-sm text-slate-100 font-semibold">{$selectedMonth.format("MMMM")}</div>
              <button
                type="button"
                className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-slate-400"
                onClick={() => setSelectedMonth($selectedMonth.add(1, "month"))}
              >
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-7 text-xs leading-6 text-slate-500">
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
              <div>S</div>
            </div>
            <div className="isolate mt-2 grid grid-cols-7 gap-[2.5px] rounded-xl text-sm">
              {[...Array(SHOWN_DAYS)].map((_, i) => {
                const day = $selectedMonth.subtract($selectedMonth.isoWeekday() - 1, "day").add(i, "day");
                const hasMark = $habitMarks.find((mark) => day.isSame(mark, "day"));

                return (
                  <button
                    key={i}
                    type="button"
                    className={classNames(
                      "py-1.5",
                      day.isSame($selectedMonth, "month") ? "bg-zinc-800" : "bg-zinc-700",
                      (hasMark || day.isToday()) && "font-semibold",
                      hasMark && !day.isToday() && `text-${props.color}-900`,
                      !hasMark && day.isSame($selectedMonth, "month") && !day.isToday() && "text-slate-200",
                      !hasMark && !day.isSame($selectedMonth, "month") && !day.isToday() && "text-slate-400",
                      day.isToday() && !hasMark && `text-${props.color}-500`,
                      day.isToday() && hasMark && "text-white",
                      i === 0 && "rounded-tl-xl",
                      i === 6 && "rounded-tr-xl",
                      i === SHOWN_DAYS - 7 && "rounded-bl-xl",
                      i === SHOWN_DAYS - 1 && "rounded-br-xl",
                    )}
                    onClick={() => {
                      if (hasMark) {
                        setHabitMarks($habitMarks.filter((mark) => !day.isSame(mark, "day")));
                      } else {
                        setHabitMarks([...$habitMarks, day.toDate()]);
                      }
                    }}
                  >
                    <time
                      dateTime={day.toISOString()}
                      className={classNames(
                        "mx-auto flex h-7 w-7 items-center justify-center rounded-lg",
                        hasMark && day.isToday() && `bg-${props.color}-500`,
                        hasMark && !day.isToday() && `bg-${props.color}-300`,
                      )}
                    >
                      {day.date()}
                    </time>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
