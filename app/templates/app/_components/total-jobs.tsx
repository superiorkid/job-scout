'use client'

import React from 'react';
import {useQuery} from "@tanstack/react-query";
import {jobKeys} from "@/lib/query-keys";
import axiosInstance from "@/lib/http-client";
import {TApiResponse} from "@/types";

const TotalJobs = () => {
    const {data, isPending} = useQuery({
        queryKey: jobKeys.total(),
        queryFn: async () => {
            const res = await axiosInstance.get<TApiResponse<{ total: number }>>("/jobs/total")
            return res.data
        }
    })
    const isMoreThanOne = (data?.data.total || 0) > 1

    if (isPending) {
        return (
            <div className="bg-zinc-200/70 animate-pulse h-8 w-32"/>
        )
    }

    return (
        <span className="text-sm text-muted-foreground">{data?.data.total} job{isMoreThanOne && "s"}</span>
    );
};

export default TotalJobs;