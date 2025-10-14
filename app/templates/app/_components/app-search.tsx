"use client"

import React from 'react';
import {Input} from "@/components/ui/input";
import {useQueryState} from "nuqs";
import {SearchIcon} from "lucide-react";

const AppSearch = () => {
    const [keyword, setQuery] = useQueryState('keyword', {clearOnDefault: true, defaultValue: ""})

    return (
        <div className="relative">
            <Input
                className="peer ps-9 bg-zinc-100 focus-visible:ring-blue-700 focus-visible:ring-1"
                placeholder="Search jobs by title, company, or location..."
                type="text"
                onChange={(event) => setQuery(event.target.value)}
                value={keyword || ""}
            />
            <div
                className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <SearchIcon size={16}/>
            </div>
        </div>
    );
};

export default AppSearch;