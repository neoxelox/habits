import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useCallback, useMemo, useRef, useState } from "react";
import { useWritable } from "react-use-svelte-store";
import { habits } from "../stores";
import Habit from "./Habit";

export default function HabitList() {
  const [$habits, , updateHabits] = useWritable(habits);
  const [dragMode, setDragMode] = useState(false);
  const [activeHabitId, setActiveHabitId] = useState<string | null>(null);
  const [deleteMode, setDeleteMode] = useState<string | null>(null);
  const scrollableContainerRef = useRef<HTMLUListElement>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 8 pixels before activating
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 300ms, with a tolerance of 8px of movement
      activationConstraint: {
        delay: 300,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveHabitId(event.active.id as string);
      if (scrollableContainerRef.current) {
        scrollableContainerRef.current.style.overflowY = "hidden";
      }
    },
    [setActiveHabitId],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = $habits.findIndex((h) => h.id === active.id);
        const newIndex = $habits.findIndex((h) => h.id === over.id);
        updateHabits((habits) => arrayMove(habits, oldIndex, newIndex));
      }
      if (scrollableContainerRef.current) {
        scrollableContainerRef.current.style.overflowY = "scroll";
      }
      setActiveHabitId(null);
      setDragMode(false);
    },
    [$habits, updateHabits, setActiveHabitId, setDragMode],
  );

  const handleDragCancel = useCallback(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.style.overflowY = "scroll";
    }
    setActiveHabitId(null);
    setDragMode(false);
  }, [setActiveHabitId, setDragMode]);

  const handleLongPress = useCallback(() => {
    setDragMode((prev) => !prev);
    setDeleteMode(null);
  }, [setDragMode, setDeleteMode]);

  const habitIds = useMemo(() => $habits.map((h) => h.id), [$habits]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={habitIds} strategy={verticalListSortingStrategy}>
        <ul
          ref={scrollableContainerRef}
          className="w-full h-full overflow-y-scroll no-scrollbar px-3.5 py-3.5 flex flex-col justify-start items-center gap-3"
        >
          {$habits.map((habit) => (
            <Habit
              key={habit.id}
              {...habit}
              dragMode={dragMode}
              deleteMode={deleteMode === habit.id}
              setDeleteMode={setDeleteMode}
              onLongPress={handleLongPress}
            />
          ))}
        </ul>
      </SortableContext>
      <DragOverlay>
        {activeHabitId && (
          <Habit
            {...$habits.find((habit) => habit.id === activeHabitId)!}
            dragMode={dragMode}
            deleteMode={false}
            setDeleteMode={() => {}}
            onLongPress={() => {}}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
