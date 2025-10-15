'use client'

import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle,} from "@/components/ui/empty";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {BriefcaseIcon, Loader2Icon, TriangleAlertIcon} from "lucide-react";
import {parseAsStringEnum, useQueryState} from "nuqs";
import {ProviderEnum} from "@/enums/provider-enum";
import JobCard from "@/app/_components/job-card";
import {useInfiniteQuery} from "@tanstack/react-query";
import {jobKeys} from "@/lib/query-keys";
import {JobPosting, TApiResponse} from "@/types";
import axiosInstance from "@/lib/http-client";
import {useInView} from "react-intersection-observer";
import {useEffect} from 'react'
import useDebounce from "@/hooks/use-debounce";

const JobList = () => {
    const [provider] = useQueryState<ProviderEnum>(
        "provider",
        parseAsStringEnum<ProviderEnum>(Object.values(ProviderEnum)).withDefault(
            ProviderEnum.AllJobs
        )
    );

    const [keyword] = useQueryState('keyword', {clearOnDefault: true, defaultValue: ""})
    const debouncedKeyword = useDebounce(keyword, 500)

    const initialParams = {limit: 18} as const;
    const {data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error} = useInfiniteQuery({
        queryKey: jobKeys.allWithParams({...initialParams, provider, keyword: debouncedKeyword}),
        queryFn: async ({pageParam = 1}) => {
            const res = await axiosInstance.get<TApiResponse<JobPosting[]>>("/jobs", {
                params: {
                    ...initialParams,
                    provider,
                    keyword: debouncedKeyword,
                    page: pageParam,
                }
            })
            return res.data
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage?.data || lastPage.data.length < initialParams.limit) return undefined
            return allPages.length + 1
        },
        initialPageParam: 1
    })

    const jobs = data?.pages.flatMap((page) => page.data) ?? []

    const {ref, inView} = useInView({
        threshold: 0,
        rootMargin: "100px",
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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

    if (!jobs?.length) {
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
                {jobs.map((job, index) => {
                    const isLast = index === jobs.length - 1
                    return (
                        <div key={index} ref={isLast ? ref : undefined}>
                            <JobCard job={job}/>
                        </div>
                    )
                })}
            </div>

            {isFetchingNextPage && (
                <div className="flex justify-center py-6">
                    <Loader2Icon className="size-6 animate-spin text-muted-foreground"/>
                </div>
            )}
        </section>
    );
};


export default JobList