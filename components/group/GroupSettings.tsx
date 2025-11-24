"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    IconSettings,
    IconUserPlus,
    IconActivity,
    IconDownload,
    IconAlertTriangle,
    IconCopy,
    IconRefresh,
    IconTrash,
    IconLogout,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface GroupSettingsProps {
    id?: string;
    name?: string;
    memberCount?: number;
}

type SettingsTab = "general" | "invite" | "activity" | "export" | "danger";

export function GroupSettings({ id, name, memberCount }: GroupSettingsProps) {
    const [activeTab, setActiveTab] = useState<SettingsTab>("general");

    const navItems = [
        { id: "general", label: "General", icon: IconSettings },
        { id: "invite", label: "Invite Members", icon: IconUserPlus },
        { id: "activity", label: "Activity Log", icon: IconActivity },
        { id: "export", label: "Export Data", icon: IconDownload },
        { id: "danger", label: "Danger Zone", icon: IconAlertTriangle, variant: "destructive" },
    ];

    return (
        <div className="flex h-full overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-muted/30 border-r flex flex-col p-4 shrink-0">
                <div className="mb-6 px-2">
                    <h3 className="font-semibold text-lg">Settings</h3>
                    <p className="text-xs text-muted-foreground">Manage group preferences</p>
                </div>
                <nav className="space-y-1 flex-1">
                    {navItems.map((item) => (
                        <Button
                            key={item.id}
                            variant={activeTab === item.id ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start",
                                activeTab === item.id && "bg-secondary",
                                item.variant === "destructive" && "text-destructive hover:text-destructive hover:bg-destructive/10"
                            )}
                            onClick={() => setActiveTab(item.id as SettingsTab)}
                        >
                            <item.icon className="w-4 h-4 mr-2" />
                            {item.label}
                        </Button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="max-w-2xl mx-auto space-y-8"
                    >
                        {activeTab === "general" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold">General Settings</h2>
                                    <p className="text-muted-foreground">Update your group's basic information.</p>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="groupName">Group Name</Label>
                                        <Input id="groupName" defaultValue={name} placeholder="Enter group name" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Input id="description" placeholder="What's this group about?" />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button>Save Changes</Button>
                                </div>
                            </div>
                        )}

                        {activeTab === "invite" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold">Invite Members</h2>
                                    <p className="text-muted-foreground">Share this link to add people to the group.</p>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input readOnly value={`https://app.com/invite/${id}`} className="font-mono text-sm" />
                                        <Button variant="outline" size="icon">
                                            <IconCopy className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="icon">
                                            <IconRefresh className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                                        <p className="text-sm text-muted-foreground mb-2">Or scan QR code</p>
                                        <div className="w-32 h-32 bg-white mx-auto rounded-lg border flex items-center justify-center">
                                            <span className="text-xs text-muted-foreground">QR Code</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "activity" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold">Activity Log</h2>
                                    <p className="text-muted-foreground">Recent actions performed in this group.</p>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <IconActivity className="w-4 h-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Group settings updated</p>
                                                <p className="text-xs text-muted-foreground">John Doe • 2 hours ago</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "export" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold">Export Data</h2>
                                    <p className="text-muted-foreground">Download your transaction history.</p>
                                </div>
                                <Separator />
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="p-6 border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer text-center space-y-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                            <IconDownload className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Export as CSV</h3>
                                            <p className="text-sm text-muted-foreground">Best for spreadsheets</p>
                                        </div>
                                    </div>
                                    <div className="p-6 border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer text-center space-y-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                            <IconDownload className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Export as PDF</h3>
                                            <p className="text-sm text-muted-foreground">Best for printing</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "danger" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-destructive">Danger Zone</h2>
                                    <p className="text-muted-foreground">Irreversible actions for this group.</p>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                                        <div>
                                            <h3 className="font-medium text-destructive">Leave Group</h3>
                                            <p className="text-sm text-muted-foreground">You will lose access to this group.</p>
                                        </div>
                                        <Button variant="destructive" size="sm">
                                            <IconLogout className="w-4 h-4 mr-2" />
                                            Leave
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                                        <div>
                                            <h3 className="font-medium text-destructive">Delete Group</h3>
                                            <p className="text-sm text-muted-foreground">Permanently delete this group and all data.</p>
                                        </div>
                                        <Button variant="destructive" size="sm">
                                            <IconTrash className="w-4 h-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
