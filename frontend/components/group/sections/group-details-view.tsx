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
  IconCamera,
  IconX,
  IconTrash,
  IconLoader2,
} from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "@/components/ui/prompt-input";
import { formatIndianRupee } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PerUserData } from "../per-user-data";
import { Badge } from "@/components/ui/badge";
import { useSpeechToText } from "@/hooks/speechtotext";
import { uploadReceipt, deleteExpense } from "@/lib/api";

interface GroupDetailsViewProps {
  id: string;
  activeTab: "transactions" | "members";
  setActiveTab: (tab: "transactions" | "members") => void;
  token: string | null;
  onExpenseUpdate?: () => void;
  ownerId?: number | null;
}

export function GroupDetailsView({
  id,
  activeTab,
  setActiveTab,
  token,
  onExpenseUpdate,
  ownerId,
}: GroupDetailsViewProps) {
  const [expenses, setExpenses] = React.useState<any[]>([]);
  const [members, setMembers] = React.useState<any[]>([]);
  const [promptValue, setPromptValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [membersLoading, setMembersLoading] = React.useState(true);
  const [expensesLoading, setExpensesLoading] = React.useState(true);
  const { isListening, startListening } = useSpeechToText();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!token) return;

    // Fetch expenses
    setExpensesLoading(true);
    fetch(`http://127.0.0.1:8000/api/groups/${id}/expenses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setExpenses(data);
        } else {
          console.error("Expected array for expenses, got:", data);
          setExpenses([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setExpenses([]);
      })
      .finally(() => setExpensesLoading(false));

    // Fetch members analysis
    setMembersLoading(true);
    fetch(`http://127.0.0.1:8000/api/groups/${id}/analysis`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.member_details) {
          console.log("Member details:", data.member_details);
          console.log("Owner ID:", ownerId);
          setMembers(data.member_details);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setMembersLoading(false));
  }, [id, token]);

  const handleSend = async () => {
    if ((!promptValue.trim() && !selectedFile) || !token) return;
    setIsLoading(true);
    try {
      let newExpense;
      if (selectedFile) {
        newExpense = await uploadReceipt(
          parseInt(id),
          selectedFile,
          promptValue,
          token
        );
      } else {
        const res = await fetch(
          `http://127.0.0.1:8000/api/groups/${id}/expenses/ai`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              text_input: promptValue,
              user_name: "John Doe",
            }),
          }
        );
        if (res.ok) {
          newExpense = await res.json();
        } else {
          throw new Error("Failed to create expense");
        }
      }

      if (newExpense) {
        setExpenses((prev) => [newExpense, ...prev]);
        setPromptValue("");
        setSelectedFile(null);

        // Refresh analysis to update balances
        fetch(`http://127.0.0.1:8000/api/groups/${id}/analysis`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
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
      setIsLoading(false);
    }
  };

  const handleRespond = async (
    expenseId: number,
    action: "ACCEPT" | "REJECT"
  ) => {
    if (!token) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/expenses/${expenseId}/respond`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        // Update local state
        setExpenses((prev) =>
          prev.map((ex) => {
            if (ex.id === expenseId) {
              return {
                ...ex,
                user_approval_status:
                  action === "ACCEPT" ? "ACCEPTED" : "REJECTED",
                status: data.expense_status,
              };
            }
            return ex;
          })
        );
        if (onExpenseUpdate) {
          onExpenseUpdate();
        }
      } else {
        console.error("Failed to respond");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (expenseId: number) => {
    if (!token) return;
    try {
      await deleteExpense(expenseId, token);
      setExpenses((prev) => prev.filter((ex) => ex.id !== expenseId));

      // Refresh analysis
      fetch(`http://127.0.0.1:8000/api/groups/${id}/analysis`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.member_details) {
            setMembers(data.member_details);
          }
        });

      if (onExpenseUpdate) {
        onExpenseUpdate();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex-1 flex gap-6 p-6 min-h-0">
        <div className="flex-7 flex flex-col min-h-0">
          <h4 className="text-lg font-semibold mb-4 text-card-foreground shrink-0">
            Member Expenses
          </h4>
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 min-h-0">
            {membersLoading ? (
              // Skeleton for members
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))
            ) : members.length === 0 ? (
              <p className="text-sm text-muted-foreground">No members found.</p>
            ) : (
              members.map((member) => (
                <div
                  key={member.name} // displays user_name
                  className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                  onClick={() => setSelectedUser(member.name)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {member.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.transaction_count} transactions
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-lg font-bold ${
                      member.balance >= 0 ? "text-chart-2" : "text-destructive"
                    }`}
                  >
                    {member.balance >= 0 ? "+" : "-"}
                    {formatIndianRupee(Math.abs(member.balance))}
                  </span>
                </div>
              ))
            )}
          </div>

          {selectedFile && (
            <div className="mb-2 p-2 bg-muted/50 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                  <IconCamera className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm truncate">{selectedFile.name}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setSelectedFile(null)}
              >
                <IconX className="w-3 h-3" />
              </Button>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
          />

          <PromptInput
            className="flex items-center shrink-0"
            value={promptValue}
            onValueChange={setPromptValue}
            onSubmit={handleSend}
            isLoading={isLoading}
          >
            <PromptInputTextarea placeholder="Log a new transaction..." />
            <PromptInputActions>
            {/*  <PromptInputAction tooltip="Voice input">
                <Button
                  size="sm"
                  variant={isListening ? "default" : "ghost"}
                  className="rounded-full"
                  onClick={() =>
                    startListening((spokenText: any) => {
                      setPromptValue((prev: any) =>
                        prev ? prev + " " + spokenText : spokenText
                      );
                    })
                  }
                >
                  <IconMicrophone
                    className={`w-4 h-4 ${
                      isListening ? "animate-pulse text-red-500" : ""
                    }`}
                  />
                </Button>
              </PromptInputAction> */}
              <PromptInputAction tooltip="Scan Receipt">
                <Button
                  size="sm"
                  variant="ghost"
                  className={`rounded-full ${
                    selectedFile ? "text-primary bg-primary/10" : ""
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <IconCamera className="w-4 h-4" />
                </Button>
              </PromptInputAction>
              <PromptInputAction tooltip="Send">
                <Button size="sm" onClick={handleSend} className="rounded-full">
                  {isLoading ? (
                    <IconLoader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <IconSend className="w-4 h-4" />
                  )}
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
                {expensesLoading ? (
                  // Skeleton for transactions
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))
                ) : expenses.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No transactions yet.
                  </p>
                ) : (
                  expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {expense.description}
                          </span>
                          {expense.status === "APPROVED" && (
                            <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded-full font-medium">
                              Approved
                            </span>
                          )}
                          {expense.status === "REJECTED" && (
                            <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-full font-medium">
                              Rejected
                            </span>
                          )}
                          {expense.status === "PENDING" && (
                            <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded-full font-medium">
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Paid by {expense.payer.name}
                        </p>
                        {expense.user_approval_status === "PENDING" &&
                          expense.status !== "REJECTED" && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-xs border-green-500/20 hover:bg-green-500/10 hover:text-green-600 text-green-600"
                                onClick={() =>
                                  handleRespond(expense.id, "ACCEPT")
                                }
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-xs border-red-500/20 hover:bg-red-500/10 hover:text-red-600 text-red-600"
                                onClick={() =>
                                  handleRespond(expense.id, "REJECT")
                                }
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        {expense.user_approval_status === "ACCEPTED" &&
                          expense.status === "PENDING" && (
                            <p className="text-[10px] text-green-600 mt-1">
                              You accepted
                            </p>
                          )}
                        {expense.user_approval_status === "REJECTED" && (
                          <p className="text-[10px] text-red-600 mt-1">
                            You rejected
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-chart-2">
                          {formatIndianRupee(expense.amount)}
                        </p>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(expense.id);
                          }}
                        >
                          <IconTrash className="w-4 h-4" />
                        </Button>
                      </div>
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
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{member.name}</p>
                          {ownerId &&
                            member.id &&
                            Number(member.id) === Number(ownerId) && (
                              <Badge variant="secondary" className="text-xs">
                                Owner
                              </Badge>
                            )}
                        </div>
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
      {selectedUser && (
        <PerUserData
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          userName={selectedUser}
          expenses={expenses}
        />
      )}
    </div>
  );
}
