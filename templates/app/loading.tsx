import {Spinner} from "@/components/ui/spinner";

export default function Loading() {
    return (
        <div className="h-[20dvh] flex items-center justify-center">
            <Spinner className="size-4"/>
        </div>
    );
}
