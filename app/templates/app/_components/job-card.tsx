import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogOverlay,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    BriefcaseIcon,
    CalendarIcon,
    ClockIcon,
    ExternalLinkIcon,
    GlobeIcon,
    GraduationCapIcon,
    HomeIcon,
    MailIcon,
    MapPinIcon,
    PhoneIcon,
    TrendingUpIcon,
    UsersIcon
} from "lucide-react";
import React from 'react';
import {Button} from "@/components/ui/button";

interface JobCardProps {
    positions: any
    jobProvider: any
    specification: any
    jobPosting: any
}

const JobCard = ({jobProvider, jobPosting, specification, positions}: JobCardProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div
                    className="bg-secondary border rounded-md p-3.5 space-y-3 hover:border-blue-700 hover:cursor-pointer transition-colors duration-200">
                    <div>
                        <h1 className="font-semibold text-base">{jobProvider.name}</h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            {positions.length === 1
                                ? positions[0].text
                                : `Hiring for ${positions.length} positions`
                            }
                        </p>
                    </div>

                    <div
                        className="flex items-center text-xs text-muted-foreground gap-3 flex-wrap">
            <span className="flex items-center gap-1">
                <MapPinIcon size={14}/>
                {specification.location}
            </span>
                        <span className="flex items-center gap-1">
                <BriefcaseIcon size={14}/>
                            {specification.job_type}
            </span>
                        {positions.length > 1 && (
                            <span className="flex items-center gap-1 text-blue-600 font-medium">
                    <UsersIcon size={14}/>
                                {positions.length} roles
                </span>
                        )}
                    </div>

                    <div className="text-xs text-muted-foreground">
                        Apply by {specification.application_deadline}
                    </div>
                </div>
            </DialogTrigger>
            <DialogOverlay className="bg-black/35 backdrop-blur-sm"/>
            <DialogContent className="min-w-[48rem] max-h-[80dvh] overflow-y-auto">
                <DialogHeader className="contents">
                    <DialogDescription className="flex items-center gap-2 text-sm">
                                            <span
                                                className="text-foreground font-semibold text-base">{jobProvider.name}</span>
                        {positions.length > 1 && (
                            <>
                                <span>•</span>
                                <span
                                    className="text-blue-600 font-medium">{positions.length} positions available</span>
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <h2 className="text-sm font-semibold text-foreground">Job Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex gap-3 text-sm">
                                <MapPinIcon className="mt-0.5 stroke-muted-foreground flex-shrink-0"
                                            size={18}/>
                                <div className="space-y-1">
                                    <h5 className="text-muted-foreground text-xs">Location</h5>
                                    <p className="font-medium">{specification.location}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 text-sm">
                                <BriefcaseIcon
                                    className="mt-0.5 stroke-muted-foreground flex-shrink-0"
                                    size={18}/>
                                <div className="space-y-1">
                                    <h5 className="text-muted-foreground text-xs">Job Type</h5>
                                    <p className="font-medium">{specification.job_type}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 text-sm">
                                <TrendingUpIcon
                                    className="mt-0.5 stroke-muted-foreground flex-shrink-0"
                                    size={18}/>
                                <div className="space-y-1">
                                    <h5 className="text-muted-foreground text-xs">Experience</h5>
                                    <p className="font-medium">{specification.experience_level}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 text-sm">
                                <GraduationCapIcon
                                    className="mt-0.5 stroke-muted-foreground flex-shrink-0"
                                    size={18}/>
                                <div className="space-y-1">
                                    <h5 className="text-muted-foreground text-xs">Education</h5>
                                    <p className="font-medium">{specification.education_level}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 text-sm">
                                <HomeIcon className="mt-0.5 stroke-muted-foreground flex-shrink-0"
                                          size={18}/>
                                <div className="space-y-1">
                                    <h5 className="text-muted-foreground text-xs">Work
                                        Arrangement</h5>
                                    <p className="font-medium">{specification.work_arrangement}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 text-sm">
                                <CalendarIcon
                                    className="mt-0.5 stroke-muted-foreground flex-shrink-0"
                                    size={18}/>
                                <div className="space-y-1">
                                    <h5 className="text-muted-foreground text-xs">Application
                                        Deadline</h5>
                                    <p className="font-medium">{specification.application_deadline}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-sm font-semibold text-foreground">
                            Available Positions ({positions.length})
                        </h2>
                        <div className="space-y-3">
                            {/*@ts-expect-error: any*/}
                            {positions.map((position, positionIndex) => (
                                <div key={positionIndex}
                                     className="border rounded-lg p-4 space-y-3 hover:border-blue-300 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-medium text-base">{position.text}</h3>
                                        {position.salary && (
                                            <span
                                                className="text-sm font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">
                                    {position.salary}
                                </span>
                                        )}
                                    </div>

                                    <div
                                        className="flex gap-4 text-xs text-muted-foreground flex-wrap">
                                        {position.application_contact_email && (
                                            <span className="flex items-center gap-1">
                                    <MailIcon size={14}/>
                                                {position.application_contact_email}
                                </span>
                                        )}
                                        {position.application_contact_phone && (
                                            <span className="flex items-center gap-1">
                                    <PhoneIcon size={14}/>
                                                {position.application_contact_phone}
                                </span>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button size="sm"
                                                className="bg-blue-700 hover:bg-blue-800 text-white">
                                            <ExternalLinkIcon size={14} className="mr-1"/>
                                            Apply for this role
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <h2 className="font-semibold text-foreground">Job Description</h2>
                        <div className="prose prose-sm max-w-none text-foreground">
                            <p className="leading-relaxed">
                                {jobPosting.description}
                            </p>

                            <div className="mt-4">
                                <h4 className="font-medium mb-2">Key Responsibilities:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li>Architect and implement robust backend systems</li>
                                    <li>Collaborate with cross-functional teams to deliver
                                        high-quality products
                                    </li>
                                    <li>Mentor junior developers and conduct code reviews</li>
                                    <li>Participate in technical decision-making and architecture
                                        planning
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-4">
                                <h4 className="font-medium mb-2">Requirements:</h4>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li>5+ years of experience in software development</li>
                                    <li>Strong proficiency in TypeScript, React, and Node.js</li>
                                    <li>Experience with cloud platforms (AWS/GCP)</li>
                                    <li>Excellent problem-solving and communication skills</li>
                                    <li>Bachelor's degree in Computer Science or related field</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4 space-y-3">
                        <h2 className="text-sm font-semibold text-foreground">About {jobProvider.name}</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {jobProvider.description}
                        </p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                    <GlobeIcon size={14}/>
                    {jobProvider.base_url}
                </span>
                            <span className="flex items-center gap-1">
                    <ClockIcon size={14}/>
                    Last updated: {jobPosting.last_modified}
                </span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default JobCard;