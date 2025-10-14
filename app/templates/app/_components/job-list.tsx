"use client"


import React from 'react';
import JobCard from "@/app/_components/job-card";
import {useQuery} from "@tanstack/react-query";
import axiosInstance from "@/lib/http-client";
import {JobPosting, TApiResponse} from "@/types";
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle,} from "@/components/ui/empty"
import {TriangleAlertIcon} from "lucide-react";
import {jobKeys} from "@/lib/query-keys";
import {Spinner} from "@/components/ui/spinner";
import {parseAsStringEnum, useQueryState} from "nuqs";
import {ProviderEnum} from "@/enums/provider-enum";


const JobList = () => {
    const [provider] = useQueryState<ProviderEnum>(
        "provider",
        parseAsStringEnum<ProviderEnum>(Object.values(ProviderEnum)).withDefault(
            ProviderEnum.AllJobs
        )
    );

    const initialParams = {page: 1, limit: 25} as const
    const {data: jobs, isPending, isError, error} = useQuery({
        queryKey: jobKeys.allWithParams({...initialParams, provider}),
        queryFn: async () => {
            const res = await axiosInstance.get<TApiResponse<JobPosting[]>>("/jobs/", {
                params: {
                    ...initialParams,
                    provider
                }
            })
            return res.data
        }
    })

    if (isPending) {
        return (
            <div className="h-[10dvh] flex justify-center items-center">
                <Spinner className="size-6" strokeWidth={2}/>
            </div>
        )
    }

    if (isError) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <TriangleAlertIcon size={35} className="stroke-rose-500"/>
                    </EmptyMedia>
                    <EmptyTitle>Error</EmptyTitle>
                    <EmptyDescription>{error?.message || "An unexpected error occurred."}</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    Please try refreshing the page or contact support if the problem persists.
                </EmptyContent>
            </Empty>
        )
    }


    return (
        <section className="mt-5">
            <div className="grid grid-cols-3 gap-6">
                {(jobs?.data || []).map((job, index) => {
                    return (
                        <JobCard key={index} job={job}/>
                    )
                })}
            </div>
        </section>
    );
};

export default JobList;