"use client"

import GroupModal from "@/components/group/GroupModal"

export default function GroupModalDemo() {
  return (
    <div className="min-h-screen bg-slate-900">
      <GroupModal
        groupName="Mumbai Hacks"
        users={[
          { name: "Aman Singh", amount: "₹2,500" },
          { name: "Priya Patel", amount: "₹1,800" },
          { name: "Rahul Verma", amount: "₹3,200" },
        ]}
      />
    </div>
  )
}
