import * as React from "react";
import * as PopperPrimitive from "@radix-ui/react-popper";
import { cn } from "@/lib/utils";

const Popper = PopperPrimitive.Root;
const PopperTrigger = PopperPrimitive.Anchor;

const PopperContent = React.forwardRef<
  React.ElementRef<typeof PopperPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopperPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopperPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
PopperContent.displayName = PopperPrimitive.Content.displayName;

export { Popper, PopperTrigger, PopperContent };