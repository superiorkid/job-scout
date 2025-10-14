import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogOverlay,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    BriefcaseIcon,
    CalendarIcon,
    ClockIcon,
    ExternalLinkIcon,
    HomeIcon,
    MapPinIcon,
    TrendingUpIcon,
    UsersIcon,
} from "lucide-react";
import React from "react";
import {JobPosting, Specification} from "@/types";
import {format} from "date-fns";
import JobDetails from "@/app/_components/job-details";
import Image from "next/image";
import {getSalaryDisplay} from "@/lib/utils";
import JobSpecification from "@/app/_components/job-specification";
import PositionCard from "@/app/_components/position-card";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Route} from "next";

interface JobCardProps {
    job: JobPosting;
}

const JobCard = ({job}: JobCardProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div
                    className="bg-card border rounded-lg p-4 space-y-3 hover:border-blue-600 hover:shadow-sm hover:bg-accent/40 cursor-pointer transition-all duration-200 group overflow-hidden">
                    <div className="flex items-start gap-3">
                        {job.image && (
                            <div
                                className="relative size-11 flex-shrink-0 border rounded-md overflow-hidden group-hover:border-blue-400 transition-colors">
                                <Image
                                    fill
                                    src={job.image}
                                    alt={`${job.company_name} logo`}
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <h1 className="font-semibold text-base truncate text-foreground group-hover:text-blue-700 transition-colors">
                                        {job.company_name}
                                    </h1>
                                    <p className="text-sm text-muted-foreground mt-0.5 truncate">
                                        {job.number_of_vacancies === 1
                                            ? job.positions?.[0]?.text ??
                                            "Position details not available"
                                            : `Hiring for ${job.number_of_vacancies} positions`}
                                    </p>
                                </div>

                                {job.positions?.some((p) => p.salary) && (
                                    <div className="flex-shrink-0">
                                        <div
                                            className="border rounded-md px-2 py-1 bg-emerald-50/60 border-emerald-200">
                                            <div className="text-xs text-emerald-700 font-semibold whitespace-nowrap">
                                                {getSalaryDisplay(job.positions)}
                                            </div>
                                            <div className="text-[10px] text-emerald-500">Salary</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <div
                            className="flex items-center gap-1 px-2 py-1 border rounded-md text-xs text-muted-foreground">
                            <MapPinIcon size={12} className="text-blue-500"/>
                            <span className="truncate max-w-[80px]">
                {job.specification?.location ?? "Remote"}
              </span>
                        </div>

                        <div
                            className="flex items-center gap-1 px-2 py-1 border rounded-md text-xs text-muted-foreground">
                            <BriefcaseIcon size={12} className="text-purple-500"/>
                            <span className="truncate max-w-[80px]">
                {job.specification?.job_type ?? "Full-time"}
              </span>
                        </div>

                        {job.specification?.experience_level && (
                            <div
                                className="flex items-center gap-1 px-2 py-1 border rounded-md text-xs text-muted-foreground">
                                <TrendingUpIcon size={12} className="text-orange-500"/>
                                <span className="truncate max-w-[80px]">
                  {job.specification.experience_level}
                </span>
                            </div>
                        )}

                        {job.specification?.work_arrangement && (
                            <div
                                className="flex items-center gap-1 px-2 py-1 border rounded-md text-xs text-muted-foreground">
                                <HomeIcon size={12} className="text-green-500"/>
                                <span className="truncate max-w-[80px]">
                  {job.specification.work_arrangement}
                </span>
                            </div>
                        )}

                        {(job.number_of_vacancies || 1) > 1 && (
                            <div
                                className="flex items-center gap-1 px-2 py-1 border rounded-md text-xs text-muted-foreground">
                                <UsersIcon size={12} className="text-blue-500"/>
                                <span>{job.number_of_vacancies} roles</span>
                            </div>
                        )}
                    </div>

                    <div
                        className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                        <div className="flex items-center gap-3">
                            {job.specification?.application_deadline && (
                                <div className="flex items-center gap-1">
                                    <ClockIcon size={12}/>
                                    <span>Apply by {job.specification.application_deadline}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-1">
                            <CalendarIcon size={12}/>
                            <span>
                {format(new Date(job.last_modified as string), "MMM dd, yyyy")}
              </span>
                        </div>
                    </div>
                </div>
            </DialogTrigger>

            <DialogOverlay className="bg-black/35 backdrop-blur-sm"/>
            <DialogContent className="min-w-[48rem] max-h-[80dvh] overflow-y-auto">
                <DialogHeader className="contents">
                    <DialogDescription className="flex items-center gap-2 text-sm">
                        {job.image && (
                            <div className="relative size-6 rounded-sm overflow-hidden">
                                <Image
                                    fill
                                    src={job.image}
                                    alt={`${job.company_name} logo`}
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        )}
                        <span className="text-foreground font-semibold text-base">
              {job.company_name}
            </span>
                        {(job.number_of_vacancies || 1) > 1 && (
                            <>
                                <span>•</span>
                                <span className="text-blue-600 font-medium">
                  {job.number_of_vacancies} positions available
                </span>
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>

                {job.job_url && (
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                            <ExternalLinkIcon size={16} className="text-blue-600"/>
                            <span className="text-sm text-blue-700 font-medium">
                Original Job Post
              </span>
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-300 text-blue-700 hover:bg-blue-100"
                            asChild
                        >
                            <Link
                                href={job.job_url as Route<string>}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                            >
                                <ExternalLinkIcon size={14}/>
                                Visit Source
                            </Link>
                        </Button>
                    </div>
                )}

                <div className="space-y-6">
                    <div className="space-y-3">
                        <h2 className="text-sm font-semibold text-foreground">
                            Job Details
                        </h2>
                        <JobSpecification
                            specification={job.specification as Specification}
                        />
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-sm font-semibold text-foreground">
                            Available Positions ({job.number_of_vacancies})
                        </h2>
                        <div className="space-y-3">
                            {job.positions.map((position, index) => (
                                <PositionCard key={index} position={position}/>
                            ))}
                        </div>
                    </div>

                    <JobDetails description={job.description || ""}/>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default JobCard;
