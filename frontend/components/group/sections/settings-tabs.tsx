"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  IconCopy,
  IconRefresh,
  IconActivity,
  IconDownload,
} from "@tabler/icons-react";

interface GeneralSettingsProps {
  name?: string;
}

export function GeneralSettings({ name }: GeneralSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">General Settings</h2>
        <p className="text-muted-foreground">
          Update your group's basic information.
        </p>
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="groupName">Group Name</Label>
          <Input
            id="groupName"
            defaultValue={name}
            placeholder="Enter group name"
          />
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
  );
}

interface InviteSettingsProps {
  id?: string;
}

export function InviteSettings({ id }: InviteSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Invite Members</h2>
        <p className="text-muted-foreground">
          Share this link to add people to the group.
        </p>
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            readOnly
            value={`https://app.com/invite/${id}`}
            className="font-mono text-sm"
          />
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
  );
}

export function ActivitySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Activity Log</h2>
        <p className="text-muted-foreground">
          Recent actions performed in this group.
        </p>
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
              <p className="text-xs text-muted-foreground">
                John Doe • 2 hours ago
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExportSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Export Data</h2>
        <p className="text-muted-foreground">
          Download your transaction history.
        </p>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-6 border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer text-center space-y-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <IconDownload className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Export as CSV</h3>
            <p className="text-sm text-muted-foreground">
              Best for spreadsheets
            </p>
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
  );
}
