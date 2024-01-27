<script>
import { onMount } from "svelte"
import { goto } from "$app/navigation"

import { getFirestore, collection, query, getDocs, orderBy } from "firebase/firestore"

import DataTable, { Head, Body, Row, Cell } from "@smui/data-table"
import Select, { Option } from "@smui/select"
import IconButton from "@smui/icon-button"
import Fab, { Label, Icon } from "@smui/fab"

import locations from "$lib/data/locations.yaml"
import procedures from "$lib/data/procedures"

import { user } from "$stores/user"

const db = getFirestore()

let cases = []
let selectedLocation = Object.keys(locations)[0]

const procedureLookup = procedures.reduce((lookup, procedure) => (lookup[procedure.id] = procedure.name, lookup), {})

async function readAll() {
    try {
        const q = query(
            collection(db, "data", $user.firebase.uid, "cases"),
            orderBy("date", "desc"),
        )
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((d) => {
            cases.push([d.id, d.data()])
        })
        cases = cases
    } catch (err) {
        console.log(err)
    }
}

function newCase() {
    goto("/cases/new")
}

function showCase(caseId) {
    goto(`/cases/${caseId}`)
}

function deleteCase(caseId) {
    console.log(`Deleting ${caseId}`)
}

onMount(() => {
    readAll()
})
</script>

<section>
    <div class="header">
        <h1>Cases</h1>
        <span class="spacer"></span>
        <Select label="Location" bind:value={selectedLocation}>
            {#each Object.entries(locations) as [id, name]}
                <Option value={id}>{name}</Option>
            {/each}
        </Select>
        <Fab color="primary" extended on:click={newCase}>
            <Icon class="material-icons">add</Icon>
            <Label>New</Label>
        </Fab>
    </div>
    <DataTable style="width: 100%">
        <Head>
            <Row>
                <Cell>Date</Cell>
                <Cell>Patient</Cell>
                <Cell>Procedures</Cell>
                <Cell></Cell>
            </Row>
        </Head>
        <Body>
            {#each cases as [caseId, caseData]}
                {#if caseData.location == selectedLocation}
                    <Row on:click={() => showCase(caseId)} style="cursor: pointer">
                        <Cell>{caseData.date}</Cell>
                        <Cell>{caseData.patient}</Cell>
                        <Cell>
                            <!-- Gets all procedures attached to case, convert from id to name, and combine to string -->
                            {Object.keys(caseData.procedures).map((p) => procedureLookup[p]).join(", ")}
                        </Cell>
                        <Cell>
                            <div class="controls">
                                <IconButton class="material-icons" size="button" on:click={(e) => {e.stopPropagation(); showCase(caseId)}}>arrow_forward</IconButton>
                                <IconButton class="material-icons" size="button" on:click={(e) => {e.stopPropagation(); deleteCase(caseId)}}>delete_forever</IconButton>
                            </div>
                        </Cell>
                    </Row>
                {/if}
            {/each}
        </Body>
    </DataTable>
</section>

<style lang="scss">
@use "$styles/theme";

section {
    padding: 1rem;
    width: 100%;
}

div.header {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    gap: 2rem;

    h1 {
        font-family: theme.$heading-font;
        font-weight: 600;
        font-size: 2rem;
        color: theme.$brand-color;
    }

    .spacer {
        flex-grow: 1;
    }
}

@media screen and (min-width: theme.$medium-breakpoint) {
}

@media screen and (min-width: theme.$large-breakpoint) {
}
</style>
