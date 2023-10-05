import { persisted } from "svelte-local-storage-store";
import { type Habit } from "./types";

export const habits = persisted<Habit[]>("habits", []);
