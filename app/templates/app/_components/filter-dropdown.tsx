import React from 'react';
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {BriefcaseIcon, ChevronDown, ClockIcon, FunnelIcon, MapPinIcon, TrendingUpIcon} from "lucide-react";

const FilterDropdown = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="font-medium">
                    <FunnelIcon size={16} strokeWidth={2}/>
                    Filters
                    <ChevronDown size={16} strokeWidth={2} className="ml-auto"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 p-6 bg-white shadow-xl border rounded-lg">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-foreground">Filter Jobs</h3>
                        <p className="text-sm text-muted-foreground">Refine your job search</p>
                    </div>

                    <div className="grid gap-6">
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                                <BriefcaseIcon size={16} className="text-muted-foreground"/>
                                Work Arrangement
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {['Remote', 'Hybrid', 'On-site'].map((arrangement) => (
                                    <Button
                                        key={arrangement}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full h-8 px-3 text-xs font-medium border-2 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 data-[state=on]:bg-blue-500 data-[state=on]:text-white data-[state=on]:border-blue-500"
                                    >
                                        {arrangement}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                                <ClockIcon size={16} className="text-muted-foreground"/>
                                Job Type
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                                    <Button
                                        key={type}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full h-8 px-3 text-xs font-medium border-2 hover:border-green-500 hover:bg-green-50 hover:text-green-700 transition-all duration-200 data-[state=on]:bg-green-500 data-[state=on]:text-white data-[state=on]:border-green-500"
                                    >
                                        {type}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                                <TrendingUpIcon size={16} className="text-muted-foreground"/>
                                Experience Level
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {['Entry', 'Mid', 'Senior', 'Executive'].map((level) => (
                                    <Button
                                        key={level}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full h-8 px-3 text-xs font-medium border-2 hover:border-purple-500 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 data-[state=on]:bg-purple-500 data-[state=on]:text-white data-[state=on]:border-purple-500"
                                    >
                                        {level}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                                <MapPinIcon size={16} className="text-muted-foreground"/>
                                Location
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {['Remote', 'US Only', 'Europe', 'Asia'].map((location) => (
                                    <Button
                                        key={location}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full h-8 px-3 text-xs font-medium border-2 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 data-[state=on]:bg-orange-500 data-[state=on]:text-white data-[state=on]:border-orange-500"
                                    >
                                        {location}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <Button variant="outline" className="flex-1 h-9 text-sm">
                            Reset
                        </Button>
                        <Button className="flex-1 h-9 text-sm bg-blue-600 hover:bg-blue-700">
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default FilterDropdown;