import {BriefcaseIcon, CalendarIcon, ChevronDown, FunnelIcon, MapPinIcon, SearchIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

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
                        className="peer ps-9 bg-zinc-100"
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
                        <DropdownMenuTrigger>
                            <Button variant="outline" size="sm" className="font-medium">
                                <FunnelIcon size={16} strokeWidth={2}/>
                                Filters
                                <ChevronDown size={16} strokeWidth={2} className="ml-auto"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuItem>Subscription</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </section>
            <section className="mt-5">
                <div className="grid grid-cols-4 gap-4">
                    {Array.from({length: 20}).map((_, index) => (
                        <div key={index}
                             className="bg-secondary border rounded-md p-3.5 space-y-2.5 hover:border-blue-700 hover:cursor-pointer">
                            <div>
                                <h1 className="font-semibold">Senior Software Engineer</h1>
                                <p className="text-xs font-medium text-muted-foreground">TechCorp Inc.</p>
                            </div>
                            <div
                                className="flex items-center text-xs text-muted-foreground font-medium gap-5">
                                <span className="flex items-center gap-1">
                                    <MapPinIcon size={16}/>
                                    <span>San Francisco, CA</span></span>
                                <span className="flex items-center gap-1">
                                    <CalendarIcon size={16}/>
                                    <span>Oct 12, 2025</span></span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
