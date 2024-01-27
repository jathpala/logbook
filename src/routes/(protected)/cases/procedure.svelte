<script>
import { createEventDispatcher } from "svelte"

import procedures from "$lib/data/procedures"

import Switch from "@smui/switch"
import Checkbox from "@smui/checkbox"
import FormField from "@smui/form-field"
import Button, { Label } from "@smui/button"

export let procedure
const name = procedures.find(p => p.id === procedure).name
const details = procedures.find(p => p.id === procedure).details

export let data = null

let template = []

if (data._template) {
    // Loading an existing procedure
    template = data._template
} else {
    // Creating a new procedure
    details.forEach((detail) => {
        let value = null
        switch(detail.type) {
        case "boolean":
            value = false
            break
        case "enum":
        case "enum-multi":
            value = []
            break
        }
        data[detail.id] = value
    })
    template = data._template = details
}

const dispatch = createEventDispatcher()

async function remove() {
    dispatch("remove", procedure)
}
</script>

<fieldset>
    <legend>{name}</legend>
    {#each template as detail}
        {#if detail.type === "boolean"}
            <FormField>
                <span slot="label">{detail.name}</span>
                <Switch bind:checked={data[detail.id]} />
            </FormField>
        {:else if detail.type === "enum-multi"}
            {#if detail.options.length <= 5}
                <fieldset class="enum-multi-short">
                    <legend>{detail.name}</legend>
                    {#each detail.options as option}
                        <FormField>
                            <span slot="label">{option}</span>
                            <Checkbox bind:group={data[detail.id]} value={option} style="padding-inline: 0.5rem"/>
                        </FormField>
                    {/each}
                </fieldset>
            {:else}
                {detail.name} is a long enumeration <br />
            {/if}
        {:else}
            {detail.name} is an unknown type <br />
        {/if}
    {/each}
    <Button variant="unelevated" color="secondary" on:click={remove}>
        <Label>Remove</Label>
    </Button>
</fieldset>

<style lang="scss">
@use "$styles/theme";

fieldset {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: calc(30rem - 1.2rem);
    border-style: solid;
    border-width: 2px;
    border-color: scale-color(theme.$accent-color, $saturation: -70%, $lightness: 70%);
    border-radius: 0.3rem;
    margin-inline: 0.6rem;

    legend {
        font-size: 1.2rem;
        padding-inline: 0.5rem;
    }

    &.enum-multi-short {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.5rem;
        border-style: none;
        padding: 0;

        legend {
            font-size: 1rem;
        }
    }

    :global(button:last-child) {
        align-self: flex-end;
        width: 5rem;
    }
}

@media screen and (min-width: theme.$medium-breakpoint) {
}

@media screen and (min-width: theme.$large-breakpoint) {
}
</style>
