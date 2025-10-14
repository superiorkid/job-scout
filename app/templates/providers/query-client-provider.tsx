"use client";

import {QueryClientProvider as ReactQueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import type React from "react";

import {getQueryClient} from "@/lib/query-client";

interface QueryClientProviderProps {
    children: React.ReactNode;
}

const QueryClientProvider = ({children}: QueryClientProviderProps) => {
    const queryClient = getQueryClient();

    return (
        <ReactQueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false}/>
        </ReactQueryClientProvider>
    );
};

export default QueryClientProvider;