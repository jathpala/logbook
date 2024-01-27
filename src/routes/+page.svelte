<script>
import { goto } from "$app/navigation"

import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import TextField from "@smui/textfield"
import Button, { Label } from "@smui/button"
import CircularProgress from "@smui/circular-progress"

const auth = getAuth()

let email = null
let password = null

let error = null
let loading = false

async function login() {
    error = null
    loading = true
    try {
        await signInWithEmailAndPassword(auth, email, password)
        goto("/home")
    } catch (err) {
        loading = false
        if (["auth/user-not-found", "auth/wrong-password", "auth/invalid-email"].some(
            substr => err.message.includes(substr)
        )) {
            error = "Invalid email/password"
        } else if (["auth/missing-email", "auth/invalid-json-payload-received", "auth/missing-password"].some(
            substr => err.message.includes(substr)
        )) {
            error = "Enter email and password"
        } else {
            error = "Problem with sign in"
            console.log(err.message)
        }
    }
}
</script>

<main>
    {#if loading}
        <CircularProgress indeterminate style="height: 4rem; width: 4rem;" />
    {:else}
        <h1>Logbook<small>.md</small></h1>
        <form>
            {#if error}
                <span class="flash">{error}</span>
            {/if}
            <fieldset class="inputs">
                <TextField label="Email" type="email" bind:value={email} required />
                <TextField label="Password" type="password" bind:value={password} required />
            </fieldset>
            <fieldset class="controls">
                <Button variant="unelevated" on:click={login}>
                    <Label>Log In</Label>
                </Button>
            </fieldset>
        </form>
    {/if}
</main>

<style lang="scss">
@use "$styles/theme";

main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

form {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 20rem;

    fieldset {
        border-style: none;

        &.inputs {
            display: flex;
            flex-direction: column;
            row-gap: 1rem;
        }

        &.controls {
            display: flex;
            justify-content: center;
            margin-top: 2rem;
        }
    }
}

h1 {
    font-family: theme.$brand-font;
    font-size: 3rem;
    color: theme.$brand-color;

    small {
        font-size: 1rem;
        color: scale-color(theme.$brand-color, $saturation: -40%, $lightness: 40%);
    }
}

span.flash {
    font-family: theme.$body-font;
    font-size: 0.8rem;
    text-align: center;
    color: theme.$error-color;
    margin-block: 0.5rem;
}

@media screen and (min-width: theme.$medium-breakpoint) {
}

@media screen and (min-width: theme.$large-breakpoint) {
}
</style>
