"use client"


import React from 'react';
import JobCard from "@/app/_components/job-card";
import {useQuery} from "@tanstack/react-query";
import axiosInstance from "@/lib/http-client";
import {JobPosting, TApiResponse} from "@/types";
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle,} from "@/components/ui/empty"
import {TriangleAlertIcon} from "lucide-react";


const JobList = () => {
    const initialParams = {page: 1, limit: 25} as const
    const {data: jobs, isPending, isError, error} = useQuery({
        queryKey: ["jobs", initialParams],
        queryFn: async () => {
            const res = await axiosInstance.get<TApiResponse<JobPosting[]>>("/jobs/", {params: initialParams})
            return res.data
        }
    })

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