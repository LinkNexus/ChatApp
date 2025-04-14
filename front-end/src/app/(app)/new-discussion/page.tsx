'use client';

import {useIsMobile} from "@/hooks/use-mobile";
import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInput,
    SidebarTrigger
} from "@/components/ui/sidebar";
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
import React, {useEffect, useState} from "react";
import {messages} from "@/app/(app)/page";
import {apiFetch} from "@/lib/custom/fetch";
import {User} from "@/types";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export default function AddConversationPage() {
    const isMobile = useIsMobile();
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        apiFetch<{ member: User[] }>('/api/users?order[name]=ASC', { ld: true })
            .then(data => setUsers(data.member));
    }, []);

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
                                New Chat
                            </div>
                        </div>
                    </div>
                    <SidebarInput placeholder="Type to search..."/>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup className="px-0">
                        <SidebarGroupContent>
                            {users.map((user) => (
                                <Link
                                    href={`/discussions/${user.id}`}
                                    key={`user-${user.id}`}
                                    className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                >
                                    <div className="flex text-base font-semibold w-full items-center gap-2">
                                        <Avatar>
                                            <Avatar className="h-8 w-8 rounded-lg">
                                                <AvatarImage src={"https://github.com/shadcn.png"} alt={user.name} />
                                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                            </Avatar>
                                        </Avatar>
                                        <span>{user.name}</span>{" "}
                                    </div>
                                    {user.bio && (
                                        <span className="line-clamp-2 w-[350px] whitespace-break-spaces text-xs">
                                        {user.bio}
                                    </span>
                                    )}
                                </Link>
                            ))}
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </div>

            <div className={"w-full" + (isMobile ? " hidden" : "")}>
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