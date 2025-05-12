import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { useWritable } from "react-use-svelte-store";
import { useLongPress } from "../hooks/useLongPress";
import { habits } from "../stores";
import { type Habit as HabitType } from "../types";
import Calendar from "./Calendar";

const SHOWN_MARKS = 21 * 7;

interface HabitProps extends HabitType {
  dragMode: boolean;
  deleteMode: boolean;
  setDeleteMode: (id: string | null) => void;
  onLongPress: () => void;
}

export default function Habit(props: HabitProps) {
  const [, , updateHabits] = useWritable(habits);
  const [$calendarOpen, setCalendarOpen] = useState(false);
  const [$deleteAnim, setDeleteAnim] = useState(false);
  const [$checkAnim, setCheckAnim] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.id,
    disabled: !props.dragMode,
  });

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.7 : 1,
      zIndex: isDragging ? 50 : 10,
      cursor: props.dragMode ? "grab" : undefined,
    }),
    [transform, transition, isDragging, props.dragMode],
  );

  const toggleTodayMark = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      updateHabits((habits) =>
        habits.map((habit) => {
          if (habit.id === props.id) {
            const todayMarked = habit.marks.some((mark) => dayjs(mark).isToday());
            habit.marks = todayMarked
              ? habit.marks.filter((mark) => !dayjs(mark).isToday())
              : [...habit.marks, dayjs().toDate()];
          }
          return habit;
        }),
      );
      setCheckAnim(true);
    },
    [props.id, updateHabits],
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      updateHabits((habits) => habits.filter((habit) => habit.id !== props.id));
    },
    [props.id, updateHabits],
  );

  const DAYS_TO_NEXT_WEEK = useMemo(
    () => Math.ceil(dayjs().add(1, "week").startOf("isoWeek").diff(dayjs(), "day", true)),
    [],
  );

  const deleteLongPressProps = useLongPress(
    () => {
      if (!props.dragMode) {
        props.setDeleteMode(props.deleteMode ? null : props.id);
        setDeleteAnim(true);
      }
    },
    { ms: 500, stopPropagationOnStart: true },
  );

  const dragLongPressProps = useLongPress(
    () => {
      if (!props.deleteMode) {
        props.onLongPress();
      }
    },
    { ms: 800 },
  );

  return (
    <>
      <li
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`h-auto w-full rounded-xl bg-zinc-800 px-2.5 py-2.5 shadow-xl flex flex-col justify-start items-center gap-3 transition-all duration-200 ease-out ${
          props.dragMode ? "ring-2 ring-white/50" : ""
        }`}
      >
        <div className="w-full flex flex-row justify-between items-center gap-5" {...dragLongPressProps}>
          <div
            {...deleteLongPressProps}
            className={`rounded-xl px-1.5 py-1.5 shadow-inner bg-${props.color}-300 shadow-${props.color}-500 ${
              $deleteAnim && "animate-wiggle"
            }`}
            onAnimationEnd={() => setDeleteAnim(false)}
          >
            {props.deleteMode ? (
              <XMarkIcon className={`h-5 w-auto text-${props.color}-900 cursor-pointer`} onClick={handleDelete} />
            ) : (
              <p className="h-5 w-5 text-center select-none">{props.icon}</p>
            )}
          </div>

          <h1 className="text-slate-100 font-medium tracking-tight text-base truncate select-none">{props.name}</h1>

          <div
            className={`rounded-xl px-1.5 py-1.5 shadow-inner cursor-pointer ${
              props.marks.some((mark) => dayjs(mark).isToday())
                ? `bg-${props.color}-500 shadow-${props.color}-300`
                : `bg-${props.color}-300 shadow-${props.color}-500`
            } ${$checkAnim && "animate-wiggle"}`}
            onClick={toggleTodayMark}
            onAnimationEnd={() => setCheckAnim(false)}
          >
            <CheckIcon
              className={`h-5 w-auto ${
                props.marks.some((mark) => dayjs(mark).isToday()) ? "text-white" : `text-${props.color}-900`
              }`}
            />
          </div>
        </div>
        <ul
          className="h-[6.75rem] w-full flex flex-col flex-wrap gap-1 overflow-y-hidden overflow-x-scroll no-scrollbar cursor-pointer"
          onClick={() => setCalendarOpen(true)}
        >
          {[...Array(SHOWN_MARKS)].map((_, i) => {
            const day = dayjs().subtract(SHOWN_MARKS - DAYS_TO_NEXT_WEEK - i, "day");
            const hasMark = props.marks.some((mark) => day.isSame(mark, "day"));
            return (
              <li
                key={i}
                className={`rounded-[0.25rem] px-1.5 py-1.5 ${
                  hasMark ? `bg-${props.color}-500` : `bg-${props.color}-100`
                }`}
              />
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
                if (habit.id === props.id) {
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
