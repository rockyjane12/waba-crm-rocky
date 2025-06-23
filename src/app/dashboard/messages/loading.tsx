import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MessagesLoading() {
  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
        {/* Conversations List Loading */}
        <Card className="lg:col-span-4 xl:col-span-3 flex flex-col overflow-hidden border-0 rounded-none lg:rounded-l-lg lg:border">
          <div className="p-2 border-b bg-background">
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-24" />
              <div className="flex items-center gap-1">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          </div>

          <div className="flex-1 p-2 space-y-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-2">
                <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                  <div className="flex justify-between items-end">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Chat Area Loading */}
        <Card className="lg:col-span-8 xl:col-span-9 flex flex-col overflow-hidden border-0 rounded-none lg:rounded-r-lg lg:border-y lg:border-r">
          <div className="p-2 border-b bg-background">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 bg-[#f0f2f5]">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
                >
                  <Skeleton
                    className={`h-16 ${
                      i % 2 === 0 ? "w-[55%]" : "w-[45%]"
                    } rounded-lg`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-2 border-t bg-background">
            <div className="flex items-center gap-1">
              <Skeleton className="h-9 w-9 rounded-md shrink-0" />
              <Skeleton className="h-9 w-9 rounded-md shrink-0" />
              <Skeleton className="h-10 flex-1 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md shrink-0" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
