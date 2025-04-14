'use client';

import React from "react";
import {useIsMobile} from "@/hooks/use-mobile";
import {
    SidebarContent, SidebarGroup, SidebarGroupContent,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/custom/siderbar/app-sidebar";
import {Separator} from "@/components/ui/separator";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {EllipsisVertical, MessageSquarePlus} from "lucide-react";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export const messages = [
    {
        name: "William Smith",
        email: "williamsmith@example.com",
        subject: "Meeting Tomorrow",
        date: "09:34 AM",
        teaser:
            "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
    },
    {
        name: "Alice Smith",
        email: "alicesmith@example.com",
        subject: "Re: Project Update",
        date: "Yesterday",
        teaser:
            "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
    },
    {
        name: "Bob Johnson",
        email: "bobjohnson@example.com",
        subject: "Weekend Plans",
        date: "2 days ago",
        teaser:
            "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
    },
    {
        name: "Emily Davis",
        email: "emilydavis@example.com",
        subject: "Re: Question about Budget",
        date: "2 days ago",
        teaser:
            "I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?",
    },
    {
        name: "Michael Wilson",
        email: "michaelwilson@example.com",
        subject: "Important Announcement",
        date: "1 week ago",
        teaser:
            "Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future.",
    },
    {
        name: "Sarah Brown",
        email: "sarahbrown@example.com",
        subject: "Re: Feedback on Proposal",
        date: "1 week ago",
        teaser:
            "Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?",
    },
    {
        name: "David Lee",
        email: "davidlee@example.com",
        subject: "New Project Idea",
        date: "1 week ago",
        teaser:
            "I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?",
    },
    {
        name: "Olivia Wilson",
        email: "oliviawilson@example.com",
        subject: "Vacation Plans",
        date: "1 week ago",
        teaser:
            "Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave.",
    },
    {
        name: "James Martin",
        email: "jamesmartin@example.com",
        subject: "Re: Conference Registration",
        date: "1 week ago",
        teaser:
            "I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end.",
    },
    {
        name: "Sophia White",
        email: "sophiawhite@example.com",
        subject: "Team Dinner",
        date: "1 week ago",
        teaser:
            "To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences.",
    },
];

export default function Page() {
    const isMobile = useIsMobile();

    return (
        <>
            <div className={"border-r" + (isMobile ? " w-full" : "")}>
                <SidebarHeader className="gap-3.5 border-b p-4">
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                            {isMobile && (
                                <>
                                    <SidebarTrigger className="-ml-1"/>
                                    <Separator orientation="vertical" className="mr-2 !h-4"/>
                                </>
                            )}
                            <div className="text-base font-medium text-foreground">
                                Inbox
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <Label className="flex items-center gap-2 text-sm">
                                <span>Unreads</span>
                                <Switch className="shadow-none"/>
                            </Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <EllipsisVertical size={18}/>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                    side={isMobile ? "bottom" : "right"}
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuGroup>
                                        <Link href={"/new-conversation"}>
                                            <DropdownMenuItem>
                                                <MessageSquarePlus/>
                                                New Discussion
                                            </DropdownMenuItem>
                                        </Link>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <SidebarInput placeholder="Type to search..."/>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup className="px-0">
                        <SidebarGroupContent>
                            {messages.map((mail) => (
                                <a
                                    href="#"
                                    key={mail.email}
                                    className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                >
                                    <div className="flex w-full items-center gap-2">
                                        <span>{mail.name}</span>{" "}
                                        <span className="ml-auto text-xs">{mail.date}</span>
                                    </div>
                                    <span className="font-medium">{mail.subject}</span>
                                    <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
                                                {mail.teaser}
                                            </span>
                                </a>
                            ))}
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </div>

            <div className={"w-full" + (isMobile ? " hidden" : "")}>
                <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block"/>
                            <BreadcrumbItem>
                                <BreadcrumbPage>Inbox</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {Array.from({length: 24}).map((_, index) => (
                        <div
                            key={index}
                            className="aspect-video h-12 w-full rounded-lg bg-muted/50"
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
