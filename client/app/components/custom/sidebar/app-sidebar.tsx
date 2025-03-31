import { Command, GalleryVerticalEnd, Heart, MessageSquareText, Users as UsersIcon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "~/components/ui/sidebar";
import { useAccount } from "~/lib/custom/auth";
import NavUser from "./nav-user";
import { useNavigate } from "react-router";

const navItems = [
    {
        title: 'Ibox',
        icon: MessageSquareText,
        url: "/inbox",
    },
    {
        title: 'Stories',
        icon: GalleryVerticalEnd,
        url: "/stories",
    },
    {
        title: 'Favorites',
        icon: Heart,
        url: "/favorites",
    },
    {
        title: 'Groups',
        icon: UsersIcon,
        url: "/groups",
    }
]

export default function () {
    const { user } = useAccount();
    const { setOpen } = useSidebar();
    const navigate = useNavigate();

    return (
        <Sidebar
            collapsible="icon"
            className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Acme Inc</span>
                                    <span className="truncate text-xs">Enterprise</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent className="px-1.5 md:px-0">
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        tooltip={{
                                            children: item.title,
                                            hidden: false,
                                        }}
                                        onClick={() => {
                                            setOpen(true)
                                            navigate(item.url)
                                        }}
                                        isActive={item.title === location.pathname}
                                        className="px-2.5 md:px-2"
                                    >
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    )
}