import AddButton from "../components/AddButton";
import HabitList from "../components/HabitList";
import "./Home.scss";

export default function Home() {
  return (
    <>
      <div className="w-full h-full bg-black overflow-hidden relative">
        <HabitList />
        <AddButton />
      </div>
    </>
  );
}
