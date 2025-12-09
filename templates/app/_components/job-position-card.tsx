import React from 'react';
import {Position} from "@/types";
import {ExternalLinkIcon, MailIcon, MessageCircleIcon, PhoneIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {getEmailLink, getWhatsAppLink} from "@/lib/utils";
import Link from "next/link";
import {Route} from "next";

interface JobPositionCardProps {
    position: Position
}

const JobPositionCard = ({position}: JobPositionCardProps) => {
    return (
        <div
            className="border rounded-lg p-4 space-y-3 hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start gap-4">
                <h3 className="font-medium text-base flex-1">{position.text}</h3>
                {position.salary && (
                    <span
                        className="text-sm font-medium text-green-700 bg-green-50 px-2 py-1 rounded whitespace-nowrap">
                {position.salary}
            </span>
                )}
            </div>

            {(position.application_contact_email || position.application_contact_phone) && (
                <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
                    {position.application_contact_email && (
                        <Link
                            href={`mailto:${position.application_contact_email}`}
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                        >
                            <MailIcon size={14}/>
                            {position.application_contact_email}
                        </Link>
                    )}
                    {position.application_contact_phone && (
                        <Link
                            href={`tel:${position.application_contact_phone}`}
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                        >
                            <PhoneIcon size={14}/>
                            {position.application_contact_phone}
                        </Link>
                    )}
                </div>
            )}
            <div className="flex gap-2 flex-wrap">
                {position.application_contact_url ? (
                    <Button
                        size="sm"
                        className="bg-blue-700 hover:bg-blue-800 text-white"
                        asChild
                    >
                        <Link
                            href={position.application_contact_url as Route<string>}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                        >
                            <ExternalLinkIcon size={14} className="mr-1"/>
                            Apply Online
                        </Link>
                    </Button>
                ) : position.application_contact_email ? (
                    <Button
                        size="sm"
                        className="bg-blue-700 hover:bg-blue-800 text-white"
                        asChild
                    >
                        <Link
                            href={getEmailLink(position) as Route<string>}
                            className="flex items-center"
                        >
                            <MailIcon size={14} className="mr-1"/>
                            Apply via Email
                        </Link>
                    </Button>
                ) : position.application_contact_phone ? (
                    <Button
                        size="sm"
                        className="bg-green-700 hover:bg-green-800 text-white"
                        asChild
                    >
                        <Link
                            href={getWhatsAppLink(position) as Route<string>}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                        >
                            <MessageCircleIcon size={14} className="mr-1"/>
                            Apply via WhatsApp
                        </Link>
                    </Button>
                ) : (
                    <Button
                        size="sm"
                        className="bg-blue-700 hover:bg-blue-800 text-white"
                        disabled
                    >
                        <MailIcon size={14} className="mr-1"/>
                        Contact to Apply
                    </Button>
                )}

                {position.application_contact_email && position.application_contact_url && (
                    <Button
                        size="sm"
                        variant="outline"
                        asChild
                    >
                        <Link
                            href={getEmailLink(position) as Route<string>}
                            className="flex items-center"
                        >
                            <MailIcon size={14} className="mr-1"/>
                            Email
                        </Link>
                    </Button>
                )}

                {position.application_contact_phone && position.application_contact_url && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                        asChild
                    >
                        <Link
                            href={getWhatsAppLink(position) as Route<string>}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                        >
                            <MessageCircleIcon size={14} className="mr-1"/>
                            WhatsApp
                        </Link>
                    </Button>
                )}

                {position.application_contact_phone && !position.application_contact_url && (
                    <Button
                        size="sm"
                        variant="outline"
                        asChild
                    >
                        <Link
                            href={`tel:${position.application_contact_phone}`}
                            className="flex items-center"
                        >
                            <PhoneIcon size={14} className="mr-1"/>
                            Call
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
};

export default JobPositionCard;