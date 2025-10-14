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
    searchParams: Promise<{ provider: string }>
}

export default async function Home({searchParams}: Props) {
    const {provider} = await searchParams

    const queryClient = getQueryClient()
    const http = await getAxios()

    const initialParams = {page: 1, limit: 25} as const
    await queryClient.prefetchQuery({
        queryKey: jobKeys.allWithParams({...initialParams, provider: provider as ProviderEnum}),
        queryFn: async () => {
            const res = await http.get<TApiResponse<JobPosting[]>>("/jobs", {params: {...initialParams, provider}})
            return res.data
        }
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
