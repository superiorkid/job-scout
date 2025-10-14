import AppHero from "@/app/_components/app-hero";
import {getQueryClient} from "@/lib/query-client";
import {getAxios} from "@/lib/http";
import {JobPosting, TApiResponse} from "@/types";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import JobList from "@/app/_components/job-list";

export default async function Home() {
    const queryClient = getQueryClient()
    const http = await getAxios()
    
    const initialParams = {page: 1, limit: 25} as const
    await queryClient.prefetchQuery({
        queryKey: ["jobs", initialParams],
        queryFn: async () => {
            const res = await http.get<TApiResponse<JobPosting[]>>("/jobs", {params: initialParams})
            return res.data
        }
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AppHero/>
            <JobList/>
        </HydrationBoundary>
    );
}
