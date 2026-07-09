import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export const lineRainbowStore: Writable<boolean> = writable(false);
