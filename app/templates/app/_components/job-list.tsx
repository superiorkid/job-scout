'use client'

import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle,} from "@/components/ui/empty";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {BriefcaseIcon, TriangleAlertIcon} from "lucide-react";
import {parseAsStringEnum, useQueryState} from "nuqs";
import {ProviderEnum} from "@/enums/provider-enum";
import {useQuery} from "@tanstack/react-query";
import {jobKeys} from "@/lib/query-keys";
import axiosInstance from "@/lib/http-client";
import {JobPosting, TApiResponse} from "@/types";
import JobCard from "@/app/_components/job-card";

const JobList = () => {
    const [provider] = useQueryState<ProviderEnum>(
        "provider",
        parseAsStringEnum<ProviderEnum>(Object.values(ProviderEnum)).withDefault(
            ProviderEnum.AllJobs
        )
    );

    const initialParams = {page: 1, limit: 25} as const;

    const {data: jobs, isPending, isError, error, refetch} = useQuery({
        queryKey: jobKeys.allWithParams({...initialParams, provider}),
        queryFn: async () => {
            const res = await axiosInstance.get<TApiResponse<JobPosting[]>>("/jobs/", {
                params: {...initialParams, provider},
            });
            return res.data;
        },
    });

    if (isPending) {
        return (
            <div className="h-[10dvh] flex justify-center items-center">
                <Spinner className="size-6" strokeWidth={2}/>
            </div>
        );
    }

    if (isError) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <TriangleAlertIcon size={35} className="stroke-rose-500"/>
                    </EmptyMedia>
                    <EmptyTitle>Something went wrong</EmptyTitle>
                    <EmptyDescription>
                        {error?.message || "An unexpected error occurred."}
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                    <Button variant="outline" asChild>
                        <a href="/support">Contact Support</a>
                    </Button>
                </EmptyContent>
            </Empty>
        );
    }

    if (!jobs?.data?.length) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <BriefcaseIcon size={35} className="text-muted-foreground"/>
                    </EmptyMedia>
                    <EmptyTitle>No jobs found</EmptyTitle>
                    <EmptyDescription>
                        {provider === ProviderEnum.AllJobs
                            ? "There are no job postings available right now."
                            : `No jobs found from ${provider}. Try selecting another provider.`}
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    return (
        <section className="mt-5">
            <div className="grid grid-cols-3 gap-6">
                {jobs.data.map((job, index) => (
                    <JobCard key={index} job={job}/>
                ))}
            </div>
        </section>
    );
};


export default JobList