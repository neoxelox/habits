import { useReadable } from "react-use-svelte-store";
import { habits } from "../stores";
import Habit from "./Habit";
import "./HabitList.scss";

export default function HabitList() {
  const $habits = useReadable(habits);

  return (
    <>
      <ul className="w-full h-full overflow-y-scroll no-scrollbar px-3.5 py-3.5 flex flex-col justify-start items-center gap-3">
        {$habits.map((habit) => (
          <Habit key={habit.name} {...habit} />
        ))}
      </ul>
    </>
  );
}
