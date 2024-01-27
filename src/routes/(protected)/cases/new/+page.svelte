<script>
import { goto } from "$app/navigation"

import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore"

import Case from "../case.svelte"

import { user } from "$stores/user"

const db = getFirestore()

// Used to reset the case component
let key = false

async function save(event) {
    try {
        let d = new Date(event.detail.date)
        event.detail.createdAt = serverTimestamp()
        event.detail.modifiedAt = serverTimestamp()
        const docRef = await addDoc(collection(db, "data", $user.firebase.uid, "cases"), event.detail)
        console.log("Document written with ID: ", docRef.id)
        goto(`/cases/${docRef.id}`)
    } catch (err) {
        console.error(err)
    }
}

async function clear(event) {
    console.log(key)
    key = !key
}
</script>

<section>
    <h1>New Case</h1>
    {#key key}
        <Case on:save={save} on:reset={clear} />
    {/key}
</section>

<style lang="scss">
@use "$styles/theme";

section {
    padding: 1rem;
    width: 100%;
}

h1 {
    font-family: theme.$heading-font;
    font-weight: 600;
    font-size: 2rem;
    color: theme.$brand-color;
    margin-bottom: 1rem;
}
</style>
