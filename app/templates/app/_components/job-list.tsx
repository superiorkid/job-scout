import React from 'react';
import JobCard from "@/app/_components/job-card";

const JobList = () => {
    return (
        <section className="mt-5">
            <div className="grid grid-cols-4 gap-4">
                {Array.from({length: 20}).map((_, index) => {
                    const positions = [
                        {
                            text: "Senior Frontend Developer",
                            salary: "$120,000 - $150,000",
                            application_contact_email: "careers@techcorp.com",
                            application_contact_phone: "+1 (555) 123-4567"
                        },
                        {
                            text: "Backend Engineer",
                            salary: "$110,000 - $140,000",
                            application_contact_email: "engineering@techcorp.com",
                            application_contact_phone: "+1 (555) 123-4568"
                        },
                        {
                            text: "Full Stack Developer",
                            salary: "$115,000 - $145,000",
                            application_contact_email: "tech@techcorp.com",
                            application_contact_phone: "+1 (555) 123-4569"
                        }
                    ];

                    const jobProvider = {
                        name: "TechCorp Inc.",
                        description: "TechCorp is a leading technology company focused on innovative solutions that transform industries.",
                        base_url: "https://techcorp.com"
                    };

                    const specification = {
                        location: "San Francisco, CA",
                        education_level: "Bachelor's Degree",
                        experience_level: "Senior Level",
                        job_type: "Full-time",
                        work_arrangement: "Hybrid",
                        application_deadline: "Oct 12, 2025",
                        date_published: "Sep 15, 2025"
                    };

                    const jobPosting = {
                        number_of_vacancies: positions.length,
                        description: "We are seeking talented Software Engineers to join our growing team...",
                        last_modified: "Oct 1, 2025"
                    };

                    return (
                        <JobCard key={index} positions={positions} jobProvider={jobProvider}
                                 specification={specification} jobPosting={jobPosting}/>
                    )
                })}
            </div>
        </section>
    );
};

export default JobList;