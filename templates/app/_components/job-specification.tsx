import React from 'react';
import {Specification} from "@/types";
import {
    BookOpenIcon,
    BriefcaseIcon,
    Building2Icon,
    CalendarDaysIcon,
    CalendarIcon,
    GraduationCapIcon,
    HomeIcon,
    MapPinIcon,
    NewspaperIcon,
    TrendingUpIcon,
    UserIcon
} from "lucide-react";

interface JobSpecificationProps {
    specification: Specification
}

const JobSpecification = ({specification}: JobSpecificationProps) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="flex gap-3 text-sm">
                <MapPinIcon className="mt-0.5 stroke-muted-foreground flex-shrink-0" size={18}/>
                <div className="space-y-1">
                    <h5 className="text-muted-foreground text-xs">Location</h5>
                    <p className="font-medium">{specification?.location || "-"}</p>
                </div>
            </div>

            <div className="flex gap-3 text-sm">
                <BriefcaseIcon className="mt-0.5 stroke-muted-foreground flex-shrink-0" size={18}/>
                <div className="space-y-1">
                    <h5 className="text-muted-foreground text-xs">Job Type</h5>
                    <p className="font-medium">{specification?.job_type || "-"}</p>
                </div>
            </div>

            <div className="flex gap-3 text-sm">
                <TrendingUpIcon className="mt-0.5 stroke-muted-foreground flex-shrink-0" size={18}/>
                <div className="space-y-1">
                    <h5 className="text-muted-foreground text-xs">Experience</h5>
                    <p className="font-medium">{specification?.experience_level || "-"}</p>
                </div>
            </div>

            <div className="flex gap-3 text-sm">
                <GraduationCapIcon className="mt-0.5 stroke-muted-foreground flex-shrink-0" size={18}/>
                <div className="space-y-1">
                    <h5 className="text-muted-foreground text-xs">Education</h5>
                    <p className="font-medium">{specification?.education_level || "-"}</p>
                </div>
            </div>

            <div className="flex gap-3 text-sm">
                <BookOpenIcon className="mt-0.5 stroke-muted-foreground flex-shrink-0" size={18}/>
                <div className="space-y-1">
                    <h5 className="text-muted-foreground text-xs">Major/Field</h5>
                    <p className="font-medium">{specification?.major || "-"}</p>
                </div>
            </div>

            <div className="flex gap-3 text-sm">
                <HomeIcon className="mt-0.5 stroke-muted-foreground flex-shrink-0" size={18}/>
                <div className="space-y-1">
                    <h5 className="text-muted-foreground text-xs">Work Arrangement</h5>
                    <p className="font-medium">{specification?.work_arrangement || "-"}</p>
                </div>
            </div>

            <div className="flex gap-3 text-sm">
                <Building2Icon className="mt-0.5 stroke-muted-foreground flex-shrink-0" size={18}/>
                <div className="space-y-1">
                    <h5 className="text-muted-foreground text-xs">Industry</h5>
                    <p className="font-medium">{specification?.industry || "-"}</p>
                </div>
            </div>

            <div className="flex gap-3 text-sm">
                <CalendarIcon className="mt-0.5 stroke-muted-foreground flex-shrink-0" size={18}/>
                <div className="space-y-1">
                    <h5 className="text-muted-foreground text-xs">Application Deadline</h5>
                    <p className="font-medium">{specification?.application_deadline || "-"}</p>
                </div>
            </div>

            <div className="flex gap-3 text-sm">
                <NewspaperIcon className="mt-0.5 stroke-muted-foreground flex-shrink-0" size={18}/>
                <div className="space-y-1">
                    <h5 className="text-muted-foreground text-xs">Date Published</h5>
                    <p className="font-medium">{specification?.date_published || "-"}</p>
                </div>
            </div>

            <div className="flex gap-3 text-sm">
                <UserIcon className="mt-0.5 stroke-muted-foreground flex-shrink-0" size={18}/>
                <div className="space-y-1">
                    <h5 className="text-muted-foreground text-xs">Gender</h5>
                    <p className="font-medium">{specification?.gender || "Any"}</p>
                </div>
            </div>

            <div className="flex gap-3 text-sm">
                <CalendarDaysIcon className="mt-0.5 stroke-muted-foreground flex-shrink-0" size={18}/>
                <div className="space-y-1">
                    <h5 className="text-muted-foreground text-xs">Age Requirement</h5>
                    <p className="font-medium">{specification?.age || "-"}</p>
                </div>
            </div>
        </div>
    );
};

export default JobSpecification;