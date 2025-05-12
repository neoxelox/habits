import { CheckIcon } from "@heroicons/react/24/solid";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { useState } from "react";
import { useWritable } from "react-use-svelte-store";
import { useLongPress } from "../hooks/useLongPress";
import { habits } from "../stores";
import { HabitColor, type Habit } from "../types";
import "./AddButton.scss";

const createNewHabit = (): Habit => ({
  id: Math.random().toString(36).substring(2, 9),
  name: "",
  icon: "🚀",
  color: HabitColor.STONE,
  marks: [],
});

export default function AddButton() {
  const [$habits, , updateHabits] = useWritable(habits);
  const [$modalOpen, setModalOpen] = useState(false);
  const [$modalAnim, setModalAnim] = useState(false);
  const [$newHabit, setNewHabit] = useState<Habit>(createNewHabit());
  const [$colorAnim, setColorAnim] = useState(false);
  const [$emojiOpen, setEmojiOpen] = useState(false);
  const [$emojiAnim, setEmojiAnim] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`h-auto w-auto rounded-2xl bg-zinc-900 ${
          !$modalOpen && "shadow-xl"
        } fixed bottom-8 right-8 z-50 cursor-pointer"`}
        onClick={() => {
          if ($modalOpen && $emojiOpen) {
            setEmojiOpen(false);
            setEmojiAnim(true);
          }
          setModalOpen(!$modalOpen);
          setModalAnim(true);
        }}
      >
        <img src={$modalOpen ? "/icon-modal-close.png" : "/icon-modal-open.png"} className="h-14 w-auto" />
      </button>

      <div
        className={`h-14 w-[calc(100vw-4.75rem)] rounded-2xl bg-zinc-900 pl-2.5 pr-12 py-2.5 ${
          !$modalAnim && "shadow-xl"
        } fixed bottom-8 right-11 z-40 transform origin-right ${$modalOpen ? "scale-x-100" : "scale-x-0"} ${
          $modalAnim && ($modalOpen ? "animate-modal-open" : "animate-modal-close")
        }`}
        onAnimationEnd={() => setModalAnim(false)}
      >
        <div className="w-full flex flex-row justify-between items-center gap-5">
          <div
            className={`rounded-xl px-1.5 py-1.5 shadow-inner bg-${$newHabit.color}-300 shadow-${
              $newHabit.color
            }-500 cursor-pointer ${$colorAnim && "animate-wiggle"}`}
            onClick={() => {
              setEmojiOpen(!$emojiOpen);
              setEmojiAnim(true);
            }}
            {...useLongPress(() => {
              const colors = Object.values(HabitColor);
              setNewHabit({ ...$newHabit, color: colors[(colors.indexOf($newHabit.color) + 1) % colors.length] });
              setColorAnim(true);
            })}
            onAnimationEnd={() => setColorAnim(false)}
          >
            <p className="h-5 w-5 leading-[1.25rem] self-center text-center align-middle select-none">
              {$newHabit.icon}
            </p>
          </div>

          <input
            type="text"
            className="block w-full rounded-xl border-0 ring-0 focus:ring-0 py-1.5 text-slate-100 placeholder:text-slate-800 bg-zinc-500 shadow-inner shadow-zinc-800 font-medium tracking-tight text-base text-center sm:text-sm sm:leading-6"
            placeholder="Do some exercise"
            value={$newHabit.name}
            onChange={(event) => setNewHabit({ ...$newHabit, name: event.target.value })}
          />

          <div
            className={`rounded-xl px-1.5 py-1.5 shadow-inner cursor-pointer bg-${$newHabit.color}-500 shadow-${$newHabit.color}-300`}
            onClick={() => {
              if ($newHabit.name && !$habits.find((habit) => habit.name === $newHabit.name)) {
                updateHabits((habits) => [...habits, $newHabit]);
                setNewHabit(createNewHabit());
                if ($emojiOpen) {
                  setEmojiOpen(false);
                  setEmojiAnim(true);
                }
                setModalOpen(false);
                setModalAnim(true);
              }
            }}
          >
            <CheckIcon className="h-5 w-auto self-center text-white" />
          </div>
        </div>
      </div>

      {($emojiOpen || $emojiAnim) && (
        <div
          className="fixed inset-0 flex items-end px-8 py-8 z-[35]"
          onClick={() => {
            setEmojiOpen(false);
            setEmojiAnim(true);
          }}
        >
          <div
            className={`rounded-2xl w-full mb-16 z-40 transform origin-bottom ${
              !$emojiOpen ? "translate-y-24 opacity-0" : "translate-y-0 opacity-1"
            } ${$emojiAnim && ($emojiOpen ? "animate-calendar-open" : "animate-calendar-close")}`}
            onClick={(e) => e.stopPropagation()}
            onAnimationEnd={() => setEmojiAnim(false)}
          >
            <EmojiPicker
              width={"100%"}
              theme={Theme.DARK}
              emojiStyle={EmojiStyle.NATIVE}
              lazyLoadEmojis={true}
              autoFocusSearch={false}
              previewConfig={{ showPreview: false }}
              onEmojiClick={({ emoji }) => {
                setNewHabit({ ...$newHabit, icon: emoji });
                setEmojiOpen(false);
                setEmojiAnim(true);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
