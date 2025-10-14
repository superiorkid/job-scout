"use client";

import React from "react";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {parseAsStringEnum, useQueryState} from "nuqs";
import {ProviderEnum} from "@/enums/provider-enum";


export default function ProviderTabs() {
    const [provider, setProvider] = useQueryState<ProviderEnum>(
        "provider",
        parseAsStringEnum<ProviderEnum>(Object.values(ProviderEnum)).withDefault(
            ProviderEnum.AllJobs
        )
    );

    return (
        <Tabs
            value={provider}
            onValueChange={(val) => setProvider(val as ProviderEnum)}
            className="w-full"
        >
            <TabsList className="bg-transparent flex gap-2.5 items-center">
                {Object.entries(ProviderEnum).map(([key, label]) => {
                    const splittedLabel = label.match(/[A-Z][a-z]+/g);
                    const cleanLabel = splittedLabel?.join(" ")

                    return (
                        <TabsTrigger
                            key={key}
                            value={key}
                            className="rounded-lg h-7 text-xs border border-zinc-200
              data-[state=active]:bg-blue-700
              data-[state=active]:text-primary-foreground
              data-[state=active]:shadow-none"
                        >
                            {cleanLabel}
                        </TabsTrigger>
                    )
                })}
            </TabsList>
        </Tabs>
    );
}
