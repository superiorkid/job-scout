import AppHero from "@/app/_components/app-hero";
import {getQueryClient} from "@/lib/query-client";
import {getAxios} from "@/lib/http";
import {JobPosting, TApiResponse} from "@/types";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import JobList from "@/app/_components/job-list";
import {jobKeys} from "@/lib/query-keys";
import {ProviderEnum} from "@/enums/provider-enum";
import {Suspense} from "react";

interface Props {
    searchParams: Promise<{ provider: string, keyword: string }>
}

export default async function Home({searchParams}: Props) {
    const {provider, keyword} = await searchParams

    const queryClient = getQueryClient()
    const http = await getAxios()

    const initialParams = {limit: 18} as const
    await queryClient.prefetchInfiniteQuery({
        queryKey: jobKeys.allWithParams({...initialParams, provider: provider as ProviderEnum, keyword}),
        queryFn: async ({pageParam = 1}) => {
            const res = await http.get<TApiResponse<JobPosting[]>>("/jobs", {
                params: {
                    ...initialParams,
                    keyword,
                    provider,
                    page: pageParam,
                }
            })
            return res.data
        },
        initialPageParam: 1
    })


    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AppHero/>
            <Suspense>
                <JobList/>
            </Suspense>
        </HydrationBoundary>
    );
}
