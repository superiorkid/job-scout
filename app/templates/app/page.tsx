import AppHero from "@/app/_components/app-hero";
import {JobPosting, TApiResponse} from "@/types";
import JobList from "./_components/job-list";

async function loadJobs() {
    try {
        const res = await fetch(`${process.env.API_URL}/jobs?limit=99&page=1`, {
            headers: {
                'Accept': 'application/json',
            },
            next: {revalidate: 60}
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: TApiResponse<JobPosting[]> = await res.json();
        return data.data;
    } catch (error) {
        console.error('Failed to load jobs:', error);
        return [];
    }
}

export default async function Home() {
    const jobs = await loadJobs()

    return (
        <>
            <AppHero/>
            <JobList jobs={jobs}/>
        </>
    );
}
