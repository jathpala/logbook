<script>
import { page } from "$app/stores"
import { goto, invalidateAll } from "$app/navigation"

import { getFirestore, collection, updateDoc, serverTimestamp, doc, getDoc } from "firebase/firestore"

import { ArrowLeftIcon } from "svelte-feather-icons"

import Case from "../case.svelte"

import { user } from "$stores/user"

const db = getFirestore()
const cid = $page.params.case
let caseData = null

async function read(id) {
    try {
        const docRef = doc(db, "data", $user.firebase.uid, "cases", id)
        let data = await getDoc(docRef)
        if (data.exists()) {
            return data.data()
        } else {
            return null
        }
    } catch (err) {
        console.log(err)
    }
}

async function save(event) {
    try {
        let d = new Date(event.detail.date)
        event.detail.modifiedAt = serverTimestamp()
        await updateDoc(doc(db, "data", $user.firebase.uid, "cases", cid), event.detail)
    } catch (err) {
        console.error(err)
    }
}

async function load(event) {
    caseData = read(cid)
}

load()
</script>

<section>
    <header>
        <a href="/cases"><ArrowLeftIcon /></a>
        <h1>Case</h1>
    </header>
    {#await caseData}
        <p>Fetching case</p>
    {:then data}
        <Case {cid} {data} on:save={save} on:reset={load}/>
    {:catch error}
        <p>{error.message}</p>
    {/await}
</section>

<style lang="scss">
@use "$styles/theme";

section {
    padding: 1rem;
    width: 100%;

    header {
        display: flex;
        align-items: baseline;
        gap: 0.4rem;
        margin-bottom: 1rem;

        h1 {
            font-family: theme.$heading-font;
            font-weight: 600;
            font-size: 2rem;
            color: theme.$brand-color;
        }

        a {
            color: theme.$brand-color;
        }

    }
}
</style>
