import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IconUsers } from "@tabler/icons-react";

export function CardSkeleton() {
  return (
    <div className="block w-full">
      <div className="w-full">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2 flex-1">
                <IconUsers className="w-5 h-5 text-primary" />
                <Skeleton className="h-5 w-24" />
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-8" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-6 w-8" />
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>

            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
