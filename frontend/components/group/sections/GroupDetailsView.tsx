"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  IconUsers,
  IconPlus,
  IconSend,
  IconSettings,
  IconMicrophone,
} from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "@/components/ui/prompt-input";

interface GroupDetailsViewProps {
  id: string;
  activeTab: "transactions" | "members";
  setActiveTab: (tab: "transactions" | "members") => void;
}

export function GroupDetailsView({
  id,
  activeTab,
  setActiveTab,
}: GroupDetailsViewProps) {
  const [expenses, setExpenses] = React.useState<any[]>([]);
  const [members, setMembers] = React.useState<any[]>([]);
  const [promptValue, setPromptValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    // Fetch expenses
    fetch(`http://127.0.0.1:8000/api/groups/${id}/expenses`)
      .then((res) => res.json())
      .then((data) => setExpenses(data))
      .catch((err) => console.error(err));

    // Fetch members analysis
    fetch(`http://127.0.0.1:8000/api/groups/${id}/analysis`)
      .then((res) => res.json())
      .then((data) => {
        if (data.member_details) {
          setMembers(data.member_details);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleSend = async () => {
    if (!promptValue.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/groups/${id}/expenses/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text_input: promptValue, user_name: "John Doe" }),
      });
      if (res.ok) {
        const newExpense = await res.json();
        setExpenses((prev) => [newExpense, ...prev]);
        setPromptValue("");

        // Refresh analysis to update balances
        fetch(`http://127.0.0.1:8000/api/groups/${id}/analysis`)
          .then((res) => res.json())
          .then((data) => {
            if (data.member_details) {
              setMembers(data.member_details);
            }
          });

      } else {
        console.error("Failed to create expense");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex-1 flex gap-6 p-6 min-h-0">
        <div className="flex-7 flex flex-col min-h-0">
          <h4 className="text-lg font-semibold mb-4 text-card-foreground shrink-0">
            Member Expenses
          </h4>
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 min-h-0">
            {members.length === 0 ? (
              <p className="text-sm text-muted-foreground">No members found.</p>
            ) : (
              members.map((member) => (
                <div key={member.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">{member.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.transaction_count} transactions
                      </p>
                    </div>
                  </div>
                  <span className={`text-lg font-bold ${member.balance >= 0 ? "text-chart-2" : "text-destructive"}`}>
                    {member.balance >= 0 ? "+" : "-"}${Math.abs(member.balance).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
          <PromptInput
            className="flex items-center shrink-0"
            value={promptValue}
            onValueChange={setPromptValue}
            onSubmit={handleSend}
            isLoading={isLoading}
          >
            <PromptInputTextarea placeholder="Log a new transaction..." />
            <PromptInputActions>
              <PromptInputAction tooltip="Voice input">
                <Button size="sm" variant="ghost" className="rounded-full">
                  <IconMicrophone className="w-4 h-4" />
                </Button>
              </PromptInputAction>
              <PromptInputAction tooltip="Send">
                <Button size="sm" onClick={handleSend} className="rounded-full">
                  <IconSend className="w-4 h-4" />
                </Button>
              </PromptInputAction>
            </PromptInputActions>
          </PromptInput>
        </div>

        <Separator orientation="vertical" className="h-auto" />

        <div className="flex-3 flex flex-col min-h-0">
          <div className="grid grid-cols-2 gap-2 mb-4 shrink-0">
            <Button
              variant={activeTab === "transactions" ? "default" : "outline"}
              onClick={() => setActiveTab("transactions")}
              size="sm"
            >
              Transactions
            </Button>
            <Button
              variant={activeTab === "members" ? "default" : "outline"}
              onClick={() => setActiveTab("members")}
              size="sm"
            >
              Members
            </Button>
          </div>

          <Separator className="mb-4 shrink-0" />

          <div className="flex-1 overflow-y-auto space-y-2 mb-4 min-h-0">
            {activeTab === "transactions" ? (
              <div className="space-y-2">
                {expenses.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No transactions yet.</p>
                ) : (
                  expenses.map((expense) => (
                    <div key={expense.id} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-sm">
                          {expense.description}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          Paid by {expense.payer.name}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-chart-2">${expense.amount}</p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {members.map((member) => (
                  <div key={member.name}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary text-sm">
                          {member.name[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">Member</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button asChild className="w-full shrink-0" size="sm">
            <Link href={`/dashboard/group/${id}/settings`}>
              <IconSettings className="w-4 h-4 mr-2" />
              Settings
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
