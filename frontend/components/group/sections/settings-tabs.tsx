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
} from "@tabler/icons-react";
import { updateGroup, fetchGroupExpenses, Expense } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

interface GeneralSettingsProps {
  id?: string;
  name?: string;
}

export function GeneralSettings({ id, name: initialName }: GeneralSettingsProps) {
  const [name, setName] = useState(initialName || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!id) return;
    setLoading(true);
    setSuccess(false);
    try {
      await updateGroup(parseInt(id), { name });
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
        {/* Description field removed as it's not supported by backend */}
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
  const inviteLink = id ? `https://app.com/invite/${id}` : "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
  };

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
            value={inviteLink}
            className="font-mono text-sm"
          />
          <Button variant="outline" size="icon" onClick={copyToClipboard}>
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

interface ActivitySettingsProps {
  id?: string;
}

export function ActivitySettings({ id }: ActivitySettingsProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchGroupExpenses(parseInt(id))
      .then(setExpenses)
      .catch(console.error)
      .finally(() => setLoading(false));
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
        ) : expenses.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            No activity yet.
          </div>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-start gap-4 p-4 border rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <IconActivity className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {expense.payer.name} added "{expense.description}"
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(expense.created_at), {
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
  const handleExportCSV = async () => {
    if (!id) return;
    try {
      const expenses = await fetchGroupExpenses(parseInt(id));
      const csvContent =
        "Date,Description,Amount,Payer,Category\n" +
        expenses
          .map(
            (e) =>
              `${new Date(e.created_at).toLocaleDateString()},"${e.description
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
