import React, {Suspense} from 'react';
import {BriefcaseIcon} from "lucide-react";
import ProviderTabs from "@/app/_components/provider-tabs";
import AppSearch from "@/app/_components/app-search";

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
            <AppSearch/>

            <div>
                <Suspense>
                    <ProviderTabs/>
                </Suspense>
            </div>
        </section>
    );
};

export default AppHero;