import React from 'react';
import {Position} from "@/types";
import {ExternalLinkIcon, MailIcon, MessageCircleIcon, PhoneIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {getEmailLink, getWhatsAppLink} from "@/lib/utils";

interface PositionCardProps {
    position: Position
}

const PositionCard = ({position}: PositionCardProps) => {
    return (
        <div
            className="border rounded-lg p-4 space-y-3 hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start gap-4">
                <h3 className="font-medium text-base flex-1">{position.text}</h3>
                {position.salary && (
                    <div className="group relative">
                <span
                    className="text-sm font-medium text-green-700 bg-green-50 px-2 py-1 rounded whitespace-nowrap cursor-help border border-green-200">
                    💰 {position.salary}
                </span>
                        <div
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            Salary Information
                            <div
                                className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                    </div>
                )}
            </div>

            {(position.application_contact_email || position.application_contact_phone) && (
                <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
                    {position.application_contact_email && (
                        <a
                            href={`mailto:${position.application_contact_email}`}
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                        >
                            <MailIcon size={14}/>
                            {position.application_contact_email}
                        </a>
                    )}
                    {position.application_contact_phone && (
                        <a
                            href={`tel:${position.application_contact_phone}`}
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                        >
                            <PhoneIcon size={14}/>
                            {position.application_contact_phone}
                        </a>
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
                        <a
                            href={position.application_contact_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                        >
                            <ExternalLinkIcon size={14} className="mr-1"/>
                            Apply Online
                        </a>
                    </Button>
                ) : position.application_contact_email ? (
                    <Button
                        size="sm"
                        className="bg-blue-700 hover:bg-blue-800 text-white"
                        asChild
                    >
                        <a
                            href={getEmailLink(position)}
                            className="flex items-center"
                        >
                            <MailIcon size={14} className="mr-1"/>
                            Apply via Email
                        </a>
                    </Button>
                ) : position.application_contact_phone ? (
                    <Button
                        size="sm"
                        className="bg-green-700 hover:bg-green-800 text-white"
                        asChild
                    >
                        <a
                            href={getWhatsAppLink(position)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                        >
                            <MessageCircleIcon size={14} className="mr-1"/>
                            Apply via WhatsApp
                        </a>
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
                        <a
                            href={getEmailLink(position)}
                            className="flex items-center"
                        >
                            <MailIcon size={14} className="mr-1"/>
                            Email
                        </a>
                    </Button>
                )}

                {position.application_contact_phone && position.application_contact_url && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                        asChild
                    >
                        <a
                            href={getWhatsAppLink(position)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                        >
                            <MessageCircleIcon size={14} className="mr-1"/>
                            WhatsApp
                        </a>
                    </Button>
                )}

                {position.application_contact_phone && !position.application_contact_url && (
                    <Button
                        size="sm"
                        variant="outline"
                        asChild
                    >
                        <a
                            href={`tel:${position.application_contact_phone}`}
                            className="flex items-center"
                        >
                            <PhoneIcon size={14} className="mr-1"/>
                            Call
                        </a>
                    </Button>
                )}
            </div>
        </div>
    );
};

export default PositionCard;