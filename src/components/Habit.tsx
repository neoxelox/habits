import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import { useState } from "react";
import { useWritable } from "react-use-svelte-store";
import { habits } from "../stores";
import { type Habit } from "../types";
import Calendar from "./Calendar";
import "./Habit.scss";

const SHOWN_MARKS: number = 21 * 7;

export default function Habit(props: Habit) {
  const [, , updateHabits] = useWritable(habits);
  const [$deleteBtn, setDeleteBtn] = useState(false);
  const [$calendarOpen, setCalendarOpen] = useState(false);
  const [$deleteAnim, setDeleteAnim] = useState(false);
  const [$checkAnim, setCheckAnim] = useState(false);

  // Order columns of days starting on Mondays by displaying the rest of days to next Monday
  const DAYS_TO_NEXT_WEEK = Math.ceil(dayjs().add(1, "week").startOf("isoWeek").diff(dayjs(), "day", true));

  return (
    <>
      <li
        className="h-auto w-full rounded-xl bg-zinc-800 px-2.5 py-2.5 shadow-xl flex flex-col justify-start items-center gap-3 z-10"
        onContextMenu={(e) => {
          e.preventDefault();
          setDeleteBtn(!$deleteBtn);
          setDeleteAnim(true);
        }}
      >
        <div className="w-full flex flex-row justify-between items-center gap-5 z-20">
          <div
            className={`rounded-xl px-1.5 py-1.5 shadow-inner bg-${props.color}-300 shadow-${props.color}-500 ${
              $deleteAnim && "animate-wiggle"
            }`}
            onAnimationEnd={() => setDeleteAnim(false)}
          >
            {$deleteBtn ? (
              <XMarkIcon
                className={`h-5 w-auto self-center text-${props.color}-900`}
                onClick={() => updateHabits((habits) => habits.filter((habit) => habit.name !== props.name))}
              />
            ) : (
              <p className="h-5 w-5 leading-[1.25rem] self-center text-center align-middle select-none">{props.icon}</p>
            )}
          </div>

          <h1 className="text-slate-100 font-medium tracking-tight text-base text-center text-ellipsis truncate select-none">
            {props.name}
          </h1>

          <div
            className={`rounded-xl px-1.5 py-1.5 shadow-inner cursor-pointer ${
              props.marks.find((mark) => dayjs(mark).isToday())
                ? `bg-${props.color}-500 shadow-${props.color}-300`
                : `bg-${props.color}-300 shadow-${props.color}-500`
            } ${$checkAnim && "animate-wiggle"}`}
            onClick={() => {
              updateHabits((habits) =>
                habits.map((habit) => {
                  if (habit.name === props.name) {
                    if (habit.marks.find((mark) => dayjs(mark).isToday())) {
                      habit.marks = habit.marks.filter((mark) => !dayjs(mark).isToday());
                    } else {
                      habit.marks.push(dayjs().toDate());
                    }
                  }

                  return habit;
                }),
              );
              setCheckAnim(true);
            }}
            onAnimationEnd={() => setCheckAnim(false)}
          >
            <CheckIcon
              className={`h-5 w-auto self-center ${
                props.marks.find((mark) => dayjs(mark).isToday()) ? "text-white" : `text-${props.color}-900`
              }`}
            />
          </div>
        </div>
        <ul
          className={`h-[6.75rem] w-full flex flex-col flex-wrap justify-between items-center gap-1 overflow-y-hidden overflow-x-scroll no-scrollbar`}
          onClick={() => setCalendarOpen(true)}
        >
          {[...Array(SHOWN_MARKS)].map((_, i) => {
            const day = dayjs().subtract(SHOWN_MARKS - DAYS_TO_NEXT_WEEK - i, "day");
            const hasMark = props.marks.find((mark) => day.isSame(mark, "day"));

            return (
              <li
                key={i}
                className={`rounded-[0.250rem] px-1.5 py-1.5 relative z-30 ${
                  hasMark ? `bg-${props.color}-500` : `bg-${props.color}-100`
                }`}
              ></li>
            );
          })}
        </ul>
      </li>
      {$calendarOpen && (
        <Calendar
          {...props}
          onClose={(marks: Date[]) => {
            updateHabits((habits) =>
              habits.map((habit) => {
                if (habit.name === props.name) {
                  habit.marks = marks;
                }

                return habit;
              }),
            );
            setCalendarOpen(false);
          }}
        />
      )}
    </>
  );
}
