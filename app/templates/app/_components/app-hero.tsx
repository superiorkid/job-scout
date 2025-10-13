import React from 'react';
import {BriefcaseIcon, SearchIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import FilterDropdown from "@/app/_components/filter-dropdown";

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
                <Tabs defaultValue="all">
                    <TabsList className="bg-transparent flex gap-2.5 items-center">
                        <TabsTrigger
                            value="all"
                            className="rounded-lg data-[state=active]:bg-blue-700 data-[state=active]:text-primary-foreground data-[state=active]:shadow-none h-7 text-xs border border-zinc-200"
                        >
                            All Jobs
                        </TabsTrigger>
                        <TabsTrigger
                            value="openkerja"
                            className="rounded-lg data-[state=active]:bg-blue-700 data-[state=active]:text-primary-foreground data-[state=active]:shadow-none h-7 text-xs border border-zinc-200"
                        >
                            Open Kerja
                        </TabsTrigger>
                        <TabsTrigger
                            value="jakartakerja"
                            className="rounded-lg data-[state=active]:bg-blue-700 data-[state=active]:text-primary-foreground data-[state=active]:shadow-none h-7 text-xs border border-zinc-200"
                        >
                            Jakarta Kerja
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div>
                <FilterDropdown/>
            </div>
        </section>
    );
};

export default AppHero;