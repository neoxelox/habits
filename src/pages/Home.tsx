import AddButton from "../components/AddButton";
import HabitList from "../components/HabitList";

export default function Home() {
  return (
    <>
      <div className="w-full h-full bg-black overflow-hidden relative">
        <HabitList />
        <AddButton />
        <div
          className="bg-transparent w-10 h-10 fixed bottom-0 left-0 z-[99]"
          onContextMenu={(e) => {
            e.preventDefault();
            alert("v1.0.0");
          }}
        ></div>
      </div>
    </>
  );
}
