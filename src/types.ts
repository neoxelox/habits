export enum HabitColor {
  EMERALD = "emerald",
  AMBER = "amber",
  ROSE = "rose",
  SKY = "sky",
  VIOLET = "violet",
  FUCHSIA = "fuchsia",
  STONE = "stone",
}

export interface Habit {
  name: string;
  icon: string;
  color: HabitColor;
  marks: Date[];
}
