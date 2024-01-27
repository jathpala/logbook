<script>
import { onMount } from "svelte"
import { goto } from "$app/navigation"

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore"

import CircularProgress from "@smui/circular-progress"

import { user } from "$stores/user"

const auth = getAuth()
const db = getFirestore()

// Runs firebase authentication check for all protected routes
onMount(async () => {
    onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
            const d = await getDoc(doc(db, "users", currentUser.uid))
            if (d.exists() && d.data().authorised) {
                user.set({
                    firebase: currentUser,
                    isAuthenticated: true
                })
                // Breakout of the function if authenticated
                return
            } else {
                user.set({
                    firebase: currentUser,
                    isAuthenticated: false
                })
            }
        } else {
            user.set({
                firebase: null,
                isAuthenticated: false
            })
        }
        // If we didn't breakout earlier, the user isn't authenticated
        logout()
        goto("/")
    })
})

async function logout() {
    try {
        await signOut(auth)
    } catch (err) {
        console.log("Error logging out")
    }
}
</script>

<div class="screen">
    {#if $user.isAuthenticated }
        <nav>
            <a href="/home"><h1>Logbook<small>.md</small></h1></a>
            <a href="/cases">Cases</a>
            <a class="disabled">Templates</a>
            <span class="spacer"></span>
            <a href="/logout" on:click|preventDefault={logout}>Log Out</a>
        </nav>
        <main>
            <slot />
        </main>
    {:else}
        <main class="placeholder">
            <CircularProgress indeterminate style="height: 4rem; width: 4rem;" />
        </main>
    {/if}
</div>

<style lang="scss">
@use "$styles/theme";

div.screen {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
}

main {
    display: flex;
    flex-grow: 1;

    &.placeholder {
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: 100vw;
    }
}

nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.6rem;
    padding-inline: 1rem;
    padding-block: 0.3rem;
    font-family: theme.$heading-font;
    background-color: scale-color(theme.$background-color, $saturation: 10%, $lightness: -2.5%);
    border-color: theme.$accent-color;
    border-width: 2px;
    border-bottom-style: solid;
    box-shadow: 0px 2px 10px 2.5px rgba(0, 0, 0, 0.2);

    *:first-child {
        margin-right: 0.4rem;
    }

    span.spacer {
        flex-grow: 1;
    }

    h1 {
        font-family: theme.$brand-font;
        font-size: 1.4rem;
        color: theme.$brand-color;

        small {
            font-size: 0.4em;
            color: scale-color(theme.$brand-color, $saturation: -40%, $lightness: 40%);
        }
    }

    a {
        font-weight: 600;
        font-size: 1.1rem;
        text-underline-offset: 0.3rem;

        &.disabled {
            // pointer-events: none;
            color: scale-color(theme.$accent-color, $saturation: -80%, $lightness: 50%);
            cursor: not-allowed;

            &:hover {
                text-decoration: none;
            }
        }
    }
}

@media screen and (min-width: theme.$medium-breakpoint) {
    div.screen {
        flex-direction: row;
    }

    nav {
        order: 1;
        flex-direction: column;
        align-items: flex-start;
        gap: 1.2rem;
        min-width: 25vw;
        border-bottom-style: none;
        border-left-style: solid;
        box-shadow: -2px 0px 10px 5px rgba(0, 0, 0, 0.2);
        padding-inline: 2rem;
        padding-block: 1rem;


        *:first-child {
            margin-right: 0rem;
            margin-bottom: 0.4rem;
        }

        span.spacer {
            flex-grow: 0;
        }

        h1 {
            font-size: 2rem;
        }

        a {
            font-size: 1.3rem;
        }
    }
}

@media screen and (min-width: theme.$large-breakpoint) {
}

</style>
