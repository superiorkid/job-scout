import {
    BriefcaseIcon,
    CalendarIcon,
    ChevronDown,
    ClockIcon,
    ExternalLinkIcon,
    FunnelIcon,
    GlobeIcon,
    GraduationCapIcon,
    HomeIcon,
    MailIcon,
    MapPinIcon,
    PhoneIcon,
    SearchIcon,
    TrendingUpIcon,
    UsersIcon
} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Label} from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogOverlay,
    DialogTrigger
} from "@/components/ui/dialog";

export default function Home() {
    return (
        <>
            <section className="py-7 space-y-3.5">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <BriefcaseIcon size={28} strokeWidth={2} className="stroke-blue-700"/>
                        <span className="font-semibold text-xl tracking-tight">Job Board</span>
                    </div>
                    <span className="text-sm text-muted-foreground">20 jobs</span>
                </div>
                <div className="relative">
                    <Input
                        className="peer ps-9 bg-zinc-100 focus-visible:ring-blue-700 focus-visible:ring-1"
                        placeholder="Search jobs by title, company, or location..."
                        type="text"
                    />
                    <div
                        className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                        <SearchIcon size={16}/>
                    </div>
                </div>
                <div>
                    <Tabs defaultValue="all">
                        <TabsList className="bg-transparent flex gap-2.5 items-center">
                            <TabsTrigger
                                value="all"
                                className="rounded-lg data-[state=active]:bg-blue-700 data-[state=active]:text-primary-foreground data-[state=active]:shadow-none h-7 text-xs border border-zinc-200"
                            >
                                All Jobs
                            </TabsTrigger>
                            <TabsTrigger
                                value="openkerja"
                                className="rounded-lg data-[state=active]:bg-blue-700 data-[state=active]:text-primary-foreground data-[state=active]:shadow-none h-7 text-xs border border-zinc-200"
                            >
                                Open Kerja
                            </TabsTrigger>
                            <TabsTrigger
                                value="jakartakerja"
                                className="rounded-lg data-[state=active]:bg-blue-700 data-[state=active]:text-primary-foreground data-[state=active]:shadow-none h-7 text-xs border border-zinc-200"
                            >
                                Jakarta Kerja
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="font-medium">
                                <FunnelIcon size={16} strokeWidth={2}/>
                                Filters
                                <ChevronDown size={16} strokeWidth={2} className="ml-auto"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="p-4 space-y-5 bg-zinc-100 shadow-lg">
                            <Label>Filter Jobs</Label>
                            <div className='grid grid-cols-2 gap-4'>
                                {Array.from({length: 4}).map((_, index) => (
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-medium text-muted-foreground">Work
                                            Arrangement</h4>
                                        <div className="flex flex-wrap space-y-2 space-x-1">
                                            <Button variant="outline" size="sm"
                                                    className="rounded-sm h-7 text-xs font-medium tracking-wide hover:cursor-pointer">Hybrid</Button>
                                            <Button variant="outline" size="sm"
                                                    className="rounded-sm h-7 text-xs font-medium tracking-wide hover:cursor-pointer">On-site</Button>
                                            <Button variant="outline" size="sm"
                                                    className="rounded-sm h-7 text-xs font-medium tracking-wide hover:cursor-pointer">Remote</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </section>
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
                            <Dialog key={index}>
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
                        )
                    })}
                </div>
            </section>
        </>
    );
}
