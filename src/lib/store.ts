import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export let lineRainbowStore: Writable<boolean> = writable(false);
