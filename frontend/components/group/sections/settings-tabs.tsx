"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  IconCopy,
  IconRefresh,
  IconActivity,
  IconDownload,
  IconLoader2,
  IconLink,
  IconCheck,
} from "@tabler/icons-react";
import {
  updateGroup,
  fetchGroupExpenses,
  fetchGroupLogs,
  Expense,
  GroupLog,
  generateInviteLink,
} from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@clerk/nextjs";

interface GeneralSettingsProps {
  id?: string;
  name?: string;
  minFloor?: number;
}

export function GeneralSettings({
  id,
  name: initialName,
  minFloor: initialMinFloor,
}: GeneralSettingsProps) {
  const { getToken } = useAuth();
  const [name, setName] = useState(initialName || "");
  const [minFloor, setMinFloor] = useState(initialMinFloor || 2000);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!id) return;
    setLoading(true);
    setSuccess(false);
    try {
      const token = await getToken();
      await updateGroup(parseInt(id), { name, min_floor: minFloor }, token);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error("Failed to update group", error);
    } finally {
      setLoading(false);
    }
  };

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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter group name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="minFloor">
            Minimum limit to ignore fairness calculations
          </Label>
          <Input
            id="minFloor"
            type="number"
            value={minFloor}
            onChange={(e) => setMinFloor(parseInt(e.target.value) || 2000)}
            placeholder="2000"
            min="0"
          />
          <p className="text-sm text-muted-foreground">
            Expenses below this amount will be ignored in fairness calculations.
          </p>
        </div>
      </div>
      <div className="flex justify-end items-center gap-2">
        {success && <span className="text-green-600 text-sm">Saved!</span>}
        <Button onClick={handleSave} disabled={loading}>
          {loading && <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}

interface InviteSettingsProps {
  id?: string;
}

export function InviteSettings({ id }: InviteSettingsProps) {
  const { getToken } = useAuth();
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const token = await getToken();
      const link = await generateInviteLink(parseInt(id), token);
      setInviteLink(link);
    } catch (error) {
      console.error("Failed to generate link", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Invite Members</h3>
        <p className="text-sm text-muted-foreground">
          Share a temporary link to invite people to this group.
        </p>
      </div>

      <div className="p-4 border rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Temporary Invite Link</h4>
            <p className="text-xs text-muted-foreground">
              Expires in 10 minutes. Anyone with the link can join.
            </p>
          </div>
          <Button onClick={handleGenerateLink} disabled={loading}>
            {loading ? (
              <IconLoader2 className="w-4 h-4 animate-spin" />
            ) : (
              <IconLink className="w-4 h-4" />
            )}
            Generate Link
          </Button>
        </div>

        {inviteLink && (
          <div className="flex items-center gap-2 mt-4">
            <div className="flex-1 p-2 bg-muted rounded text-sm font-mono truncate">
              {inviteLink}
            </div>
            <Button size="icon" variant="outline" onClick={copyToClipboard}>
              {copied ? (
                <IconCheck className="w-4 h-4 text-green-500" />
              ) : (
                <IconCopy className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface ActivitySettingsProps {
  id?: string;
}

export function ActivitySettings({ id }: ActivitySettingsProps) {
  const { getToken } = useAuth();
  const [logs, setLogs] = useState<GroupLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getToken().then((token) => {
      fetchGroupLogs(parseInt(id), token)
        .then(setLogs)
        .catch(console.error)
        .finally(() => setLoading(false));
    });
  }, [id]);

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
        {loading ? (
          <div className="flex justify-center p-4">
            <IconLoader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            No activity yet.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-4 p-4 border rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <IconActivity className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{log.details}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(log.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

interface ExportSettingsProps {
  id?: string;
}

export function ExportSettings({ id }: ExportSettingsProps) {
  const { getToken } = useAuth();
  const handleExportCSV = async () => {
    if (!id) return;
    try {
      const token = await getToken();
      const expenses = await fetchGroupExpenses(parseInt(id), token);
      const csvContent =
        "Date,Description,Amount,Payer,Category\n" +
        expenses
          .map(
            (e) =>
              `${new Date(e.created_at).toLocaleDateString()},"${
                e.description
              }",${e.amount},"${e.payer.name}","${e.category}"`
          )
          .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `group_${id}_expenses.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Failed to export CSV", error);
    }
  };

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
        <div
          onClick={handleExportCSV}
          className="p-6 border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer text-center space-y-4"
        >
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
        <div className="p-6 border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer text-center space-y-4 opacity-50 cursor-not-allowed">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <IconDownload className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Export as PDF</h3>
            <p className="text-sm text-muted-foreground">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
