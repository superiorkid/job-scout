import React from 'react';
import {cn} from "@/lib/utils";


const Container = (props?: React.ComponentPropsWithoutRef<"div">) => {
    const {className, children, ...restProps} = props || {}

    return (
        <div className={cn("max-w-7xl mx-auto px-5 2xl:px-0", className)} {...restProps}>
            {children}
        </div>
    );
};

export default Container;