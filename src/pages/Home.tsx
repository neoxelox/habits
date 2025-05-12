import AddButton from "../components/AddButton";
import HabitList from "../components/HabitList";
import { useLongPress } from "../hooks/useLongPress";

export default function Home() {
  return (
    <>
      <div className="w-full h-full bg-black overflow-hidden relative">
        <HabitList />
        <AddButton />
        <div
          className="bg-transparent w-10 h-10 fixed bottom-0 left-0 z-[99]"
          {...useLongPress(() => {
            alert("v1.2.0");
          })}
        ></div>
      </div>
    </>
  );
}
