import { writable } from "svelte/store"

export const user = writable({
  firebase: null,
  isAuthenticated: false
})
