import React from 'react';
import JobCard from "@/app/_components/job-card";
import {JobPosting} from "@/types";

interface JobListProps {
    jobs: JobPosting[]
}

const JobList = ({jobs}: JobListProps) => {
    return (
        <section className="mt-5">
            <div className="grid grid-cols-3 gap-6">
                {jobs.map((job, index) => {
                    return (
                        <JobCard key={index} job={job}/>
                    )
                })}
            </div>
        </section>
    );
};

export default JobList;