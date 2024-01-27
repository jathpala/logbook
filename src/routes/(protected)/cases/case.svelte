<script>
import { createEventDispatcher, tick } from "svelte"

import Procedure from "./procedure.svelte"

import TextField from "@smui/textfield"
import Select, { Option } from "@smui/select"
import Switch from "@smui/switch"
import FormField from "@smui/form-field"
import Button, { Label } from "@smui/button"
import Autocomplete from "@smui-extra/autocomplete"

import locations from "$lib/data/locations.yaml"
import procedures from "$lib/data/procedures"

const today = new Date()
const year = today.toLocaleString("default", { year: "numeric" })
const month = today.toLocaleString("default", { month: "2-digit" })
const day = today.toLocaleString("default", { day: "2-digit" })

export let cid = null
export let data = {}


// Set sane defaults for case fields if undefined (e.g. a new case is being created)
data.date ??= `${year}-${month}-${day}`
data.location ??= Object.keys(locations)[0]
data.patient ??= ""
data.complications ??= ""
data.comments ??= ""
data.isInteresting ??= false
data.procedures ??= {}

let additionalProcedure = null
let procedureList = Object.keys(data.procedures)

const dispatch = createEventDispatcher()

async function addProcedure() {
    if (additionalProcedure && !data.procedures[additionalProcedure.id]) {
        data.procedures[additionalProcedure.id] = {}
        procedureList.push(additionalProcedure.id)
        additionalProcedure = null
    }
}

async function removeProcedure(event) {
    procedureList = procedureList.filter((procedure) => procedure != event.detail)

    // Allow the DOM to update otherwise bind:data in Procedure would immediately recreate the procedure key
    await tick()

    delete data.procedures[event.detail]
}

async function reset() {
    dispatch("reset")
}

async function save() {
    dispatch("save", data)
}
</script>

<form>
    <fieldset class="demographics">
        <TextField label="Date" type="date" bind:value={data.date} />
        <Select label="Location" bind:value={data.location}>
            {#each Object.entries(locations) as [id, name]}
                <Option value={id}>{name}</Option>
            {/each}
        </Select>
        <TextField label="MRN" type="text" bind:value={data.patient} />
    </fieldset>
    <fieldset class="procedure-selector">
        <Autocomplete
            label="Additional Procedures"
            options={procedures}
            getOptionLabel={(option) => option ? option.name : ''}
            bind:value={additionalProcedure} />
        <div class="controls">
            <Button variant="unelevated" on:click={addProcedure}>
                <Label>Add</Label>
            </Button>
        </div>
    </fieldset>
    {#each procedureList as procedure}
        <Procedure procedure={procedure} bind:data={data.procedures[procedure]} on:remove={removeProcedure} />
    {/each}
    <fieldset class="extra">
        <TextField textarea label="Complications" bind:value={data.complications} />
        <TextField textarea label="Comments" bind:value={data.comments} />
        <FormField>
            <span slot="label">Interesting Case</span>
            <Switch bind:checked={data.isInteresting} />
        </FormField>
    </fieldset>
    <fieldset class="controls">
        <Button variant="unelevated" color="secondary" on:click={reset}>
            <Label>Reset</Label>
        </Button>
        <Button variant="unelevated" on:click={save}>
            <Label>Save</Label>
        </Button>
    </fieldset>
</form>

<style lang="scss">
@use "$styles/theme";

form {
    display: flex;
    flex-direction: column;
    row-gap: 2rem;
    align-items: center;

    fieldset {
        border-style: none;
        display: flex;
        flex-direction: column;
        row-gap: 1rem;
        width: 100%;
        max-width: 30rem;

        &.controls {
            flex-direction: row;
            justify-content: flex-end;
            gap: 1rem;

            :global(button) {
                width: 5rem;
            }
        }

        &.procedure-selector {

            :global(.smui-autocomplete *) {
                width: 100%;
            }

            div.controls {
                display: flex;
                justify-content: flex-end;

                :global(button) {
                    width: 5rem;
                }
            }
        }
    }
}

@media screen and (min-width: theme.$medium-breakpoint) {
    form {
        align-items: flex-start;

        fieldset {
            &.demographics {
                max-width: 20rem;
            }

            &.procedure-selector {
                :global(.smui-autocomplete *) {
                    width: 100%;
                }
            }
        }
    }
}

@media screen and (min-width: theme.$large-breakpoint) {
}
</style>
