"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit2, TrendingUp, TrendingDown, Settings } from "lucide-react"

interface User {
  name: string
  amount?: string
  spent?: number
  received?: number
}

interface GroupModalProps {
  groupName?: string
  users?: User[]
  expenditure?: number
  income?: number
  onEdit?: () => void
  onSettings?: () => void
}

export default function GroupModal({
  groupName = "Mumbai Hacks",
  users = [
    { name: "Aman Singh", spent: 2000, received: 500 },
    { name: "Priya Patel", spent: 1000, received: 800 },
    { name: "Rahul Verma",spent:200, received:500 },
  ],
  expenditure = 15500,
  income = 22000,
  onEdit = () => console.log("Edit clicked"),
  onSettings = () => console.log("Settings clicked"),
}: GroupModalProps) {
  const [activeTab, setActiveTab] = useState("transactions")
  const [searchQuery, setSearchQuery] = useState("")

  // seed random values for any users missing spent/received (kept per render)
  const seededUsers = users.map((u) => {
    if (typeof u.spent === "number" || typeof u.received === "number") return u
    const spent = Math.floor(Math.random() * 2000) + 500
    const received = Math.floor(Math.random() * 2000) + 200
    return { ...u, spent, received }
  })

  const filteredUsers = seededUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalExpenditure = seededUsers.reduce((s, u) => s + (u.spent || 0), 0)
  const totalIncome = seededUsers.reduce((s, u) => s + (u.received || 0), 0)

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-6xl bg-slate-900 rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
        <div className="flex h-[600px]">
          {/* Left Section - 2/3 width */}
          <div className="w-2/3 p-7 border-r border-slate-700 flex flex-col gap-6">
            {/* Header with Edit Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{groupName}</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  {/* on clicking this edit button the group name span shall become the input text itself with the tick box then save it  by clicking the tick box and it will exit that state*/}
                </DropdownMenuTrigger>
                {/* <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                  <DropdownMenuItem onClick={onEdit} className="text-slate-200 focus:bg-slate-700">
                    Edit Group
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-slate-200 focus:bg-slate-700">
                    View Details
                  </DropdownMenuItem>
                </DropdownMenuContent> */}
              </DropdownMenu>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-hidden flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-slate-300">Members</h3>
              <ScrollArea className="flex-1">
                <div className="space-y-2 pr-4">
                  {filteredUsers.map((user, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{user.name}</span>
                        <span className="text-xs text-slate-400">Spent: <span className="text-red-400 font-semibold">₹{(user.spent||0).toLocaleString()}</span> • Received: <span className="text-emerald-400 font-semibold">₹{(user.received||0).toLocaleString()}</span></span>
                      </div>
                      <div className="text-sm font-semibold text-slate-200">Balance: <span className="ml-2 text-sm font-bold text-slate-200">₹{((user.received||0)-(user.spent||0)).toLocaleString()}</span></div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Search Input */}
            <div>
              <Input
                placeholder="Enter your situation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus-visible:ring-slate-600 focus-visible:border-slate-500"
              />
            </div>
          </div>

          {/* Right Section - 1/3 width */}
          <div className="w-1/3 p-7 flex flex-col gap-6 bg-slate-800/50">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col flex-1">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800 p-1 rounded-lg">
                <TabsTrigger
                  value="transactions"
                  className="rounded-md text-xs font-medium data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
                >
                  Transactions
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="rounded-md text-xs font-medium data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
                >
                  Users
                </TabsTrigger>
              </TabsList>

              <Separator className="my-4 bg-slate-700" />

              {/* Tab Content */}
              <TabsContent value="transactions" className="flex-1 mt-0">
                <ScrollArea className="h-full">
                  <div className="text-xs leading-relaxed text-slate-300 pr-4">
                    <p className="font-semibold text-slate-200 mb-2">Approval Requests</p>
                    <p>Pending transactions and approval requests will appear here.</p>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="users" className="flex-1 mt-0">
                <ScrollArea className="h-full">
                  <div className="text-xs space-y-1 pr-4">
                    {filteredUsers.map((user, idx) => (
                      <div key={idx} className="text-slate-300 py-1">
                        {user.name}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>

            <Separator className="bg-slate-700" />

            {/* Money Stats - Split into two */}
            <div className="space-y-3">
              {/* Expenditure */}
              <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="h-4 w-4 text-red-400" />
                  <span className="text-xs font-medium text-slate-400">Amount of Money Spent</span>
                </div>
                <p className="text-lg font-bold text-red-400">₹{totalExpenditure.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">Expenditure</p>
              </div>

              {/* Income */}
              <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-medium text-slate-400">Amount of Money Received</span>
                </div>
                <p className="text-lg font-bold text-emerald-400">₹{totalIncome.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">Income</p>
              </div>
            </div>

            {/* Settings Button */}
            <Button
              onClick={onSettings}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 rounded-lg py-2 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
