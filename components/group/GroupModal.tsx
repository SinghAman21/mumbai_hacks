"use client"

import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Check } from "lucide-react"

interface User {
  name: string
  amount: string
}

interface GroupModalProps {
  groupName?: string
  users?: User[]
  onClose?: () => void
}

export default function GroupModal({
  groupName = "group name",
  users = [
    { name: "user 1", amount: "amount" },
    { name: "user 1", amount: "amount" },
    { name: "user 1", amount: "amount" },
  ],
  onClose,
}: GroupModalProps) {
  const [activeTab, setActiveTab] = useState("transactions")
  const [inviteLink, setInviteLink] = useState("https://invite.link/abc123")
  const [copied, setCopied] = useState(false)

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl bg-slate-800 rounded-lg border border-muted/40 shadow-lg overflow-hidden">
        <div className="flex h-96">
          {/* Left Section - 2/3 width */}
          <div className="w-2/3 p-6 border-r border-muted/40 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">{groupName}</h2>
              <span className="text-sm text-muted-foreground">settings btn</span>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto mb-6 space-y-3">
              {users.map((user, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 px-2">
                  <span className="text-white text-sm">{user.name}</span>
                  <span className="text-muted-foreground text-sm">{user.amount}</span>
                </div>
              ))}
            </div>

            {/* Input Query */}
            <div>
              <Input
                placeholder="input query of users"
                className="w-full bg-slate-700 border-muted/30 text-white placeholder:text-muted-foreground rounded-full py-2 px-4 text-sm focus:ring-1 focus:ring-muted/50"
              />
            </div>
          </div>

          {/* Right Section - 1/3 width */}
          <div className="w-1/3 p-6 flex flex-col bg-slate-700/50">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col h-full">
              <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 mb-4 border-b border-muted/20">
                <TabsTrigger
                  value="transactions"
                  className={`rounded-none border-b-2 font-medium transition-colors ${
                    activeTab === "transactions"
                      ? "border-white text-white bg-transparent"
                      : "border-transparent text-muted-foreground bg-transparent hover:text-white"
                  }`}
                >
                  transactions
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className={`rounded-none border-b-2 font-medium transition-colors ${
                    activeTab === "users"
                      ? "border-white text-white bg-transparent"
                      : "border-transparent text-muted-foreground bg-transparent hover:text-white"
                  }`}
                >
                  users list
                </TabsTrigger>
              </TabsList>

              {/* Tab Content */}
              <TabsContent value="transactions" className="flex-1 mt-0">
                <ScrollArea className="h-32 pr-4">
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {`in transaction the
approval request
will be shown
user list is self
explanatory`}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="users" className="flex-1 mt-0">
                <ScrollArea className="h-32 pr-4">
                  <div className="text-sm text-muted-foreground">
                    {users.map((user, idx) => (
                      <div key={idx} className="py-1">
                        {user.name}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>

            {/* Separator */}
            <Separator className="my-4 bg-muted/20" />

            {/* Lower Section */}
            <div className="space-y-4">
              {/* Invite Link */}
              <div>
                <label className="text-xs text-muted-foreground block mb-2">invite link</label>
                <div className="flex gap-2">
                  <Input
                    value={inviteLink}
                    readOnly
                    className="flex-1 bg-slate-600 border-muted/30 text-white text-sm py-1 px-3 rounded"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyInvite}
                    className="px-3 text-muted-foreground hover:text-white"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Password Optional */}
              <div>
                <label className="text-xs text-muted-foreground block mb-2">password (optional)</label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  className="w-full bg-slate-600 border-muted/30 text-white placeholder:text-muted-foreground text-sm py-1 px-3 rounded focus:ring-1 focus:ring-muted/50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
