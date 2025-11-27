import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { formatIndianRupee } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, UserIcon, WalletIcon } from "lucide-react"; // Assuming lucide-react is available

interface PerUserDataProps {
    isOpen: boolean;
    onClose: () => void;
    userName: string;
    expenses: any[];
}

export function PerUserData({
    isOpen,
    onClose,
    userName,
    expenses,
}: PerUserDataProps) {
    // Filter expenses where the user is involved
    const userExpenses = expenses.filter((expense) => {
        const isPayer = expense.payer?.name === userName;
        // Check if user is in splits if available
        const isInvolved =
            expense.splits?.some((split: any) => split.user?.name === userName) ??
            false;
        // If no splits array, we might miss some, but we'll show what we can
        // If the API returns all expenses, we filter.
        return isPayer || isInvolved;
    });

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px] p-0">
                <DialogHeader className="p-6 pb-4">
                    <DialogTitle className="text-2xl font-bold">Expenses involving {userName}</DialogTitle>
                    <CardDescription>A detailed breakdown of all expenses related to {userName}.</CardDescription>
                </DialogHeader>
                <ScrollArea className="h-[400px] px-6 pb-6">
                    {userExpenses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10">
                            <WalletIcon className="h-12 w-12 mb-4 text-gray-400" />
                            <p className="text-lg font-semibold">No expenses found for this user.</p>
                            <p className="text-sm text-center">It looks like {userName} hasn't been involved in any expenses yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {userExpenses.map((expense) => (
                                <Card key={expense.id} className="hover:shadow-md transition-shadow duration-200">
                                    <CardContent className="flex justify-between items-center p-4">
                                        <div className="space-y-1">
                                            <CardTitle className="text-base font-semibold leading-tight">
                                                {expense.description}
                                            </CardTitle>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <UserIcon className="h-4 w-4 mr-2 opacity-70" />
                                                <CardDescription className="inline">
                                                    {expense.payer?.name === userName
                                                        ? "Paid by you"
                                                        : `Paid by ${expense.payer?.name}`}
                                                </CardDescription>
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <CalendarIcon className="h-4 w-4 mr-2 opacity-70" />
                                                <CardDescription className="inline">
                                                    {new Date(expense.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-primary">
                                                {formatIndianRupee(expense.amount)}
                                            </p>
                                            {/* If we had split details, we could show how much they owe/are owed here */}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
