import React, {Suspense} from 'react';
import {BriefcaseIcon, SearchIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import ProviderTabs from "@/app/_components/provider-tabs";

const AppHero = () => {
    return (
        <section className="py-7 space-y-3.5">
            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <BriefcaseIcon size={28} strokeWidth={2} className="stroke-blue-700"/>
                    <span className="font-semibold text-xl tracking-tight">Job Board</span>
                </div>
                <span className="text-sm text-muted-foreground">20 jobs</span>
            </div>
            <div className="relative">
                <Input
                    className="peer ps-9 bg-zinc-100 focus-visible:ring-blue-700 focus-visible:ring-1"
                    placeholder="Search jobs by title, company, or location..."
                    type="text"
                />
                <div
                    className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                    <SearchIcon size={16}/>
                </div>
            </div>
            <div>
                <Suspense>
                    <ProviderTabs/>
                </Suspense>
            </div>
        </section>
    );
};

export default AppHero;