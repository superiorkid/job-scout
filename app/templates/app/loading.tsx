import {Loader2Icon} from "lucide-react";

export default function Loading() {
    return <div className="h-[20dvh] flex items-center justify-center">
        <div className="flex justify-center flex-col space-y-2">
            <Loader2Icon size={35} strokeWidth={2} className="animate-spin"/>
            <p className="text-sm text-muted-foreground font-medium">Please Wait...</p>
        </div>
    </div>
}