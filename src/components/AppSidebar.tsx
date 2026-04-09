import {
  LayoutDashboard,
  PenSquare,
  FileText,
  BarChart3,
  Settings,
  Shield,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useTranslation } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const userNav = [
  { titleKey: "navDashboard", url: "/", icon: LayoutDashboard },
  { titleKey: "navSubmit", url: "/submit", icon: PenSquare },
  { titleKey: "navComplaints", url: "/complaints", icon: FileText },
  { titleKey: "navAnalytics", url: "/analytics", icon: BarChart3 },
  { titleKey: "navSettings", url: "/settings", icon: Settings },
];

const adminNav = [
  { titleKey: "navAdmin", url: "/admin", icon: ShieldCheck },
  { titleKey: "navDepartment", url: "/department", icon: Building2 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const t = useTranslation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-sidebar-border">
          <Shield className="h-7 w-7 text-sidebar-primary shrink-0" />
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-tight truncate">
                GrievanceAI
              </h1>
              <p className="text-[10px] text-sidebar-muted tracking-wide uppercase">
                {t("sidebarPortal")}
              </p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && t("sectionUser")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userNav.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/60"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{t(item.titleKey)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && t("sectionAdmin")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNav.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="hover:bg-sidebar-accent/60"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{t(item.titleKey)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
