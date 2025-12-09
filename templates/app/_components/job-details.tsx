"use client"

import React from 'react';
import DOMPurify from "dompurify";

interface JobDetailsProps {
    description: string
}

const JobDetails = ({description}: JobDetailsProps) => {
    const sanitizedData = () => ({
        __html: DOMPurify.sanitize(description)
    })

    return (
        <div className="prose prose-sm" dangerouslySetInnerHTML={sanitizedData()}/>
    );
};

export default JobDetails;