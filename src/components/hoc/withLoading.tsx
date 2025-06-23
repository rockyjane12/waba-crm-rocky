import React, { ComponentType } from "react";
import { Loading } from "@/components/ui/loading";

interface WithLoadingProps {
  isLoading?: boolean;
  loadingFallback?: React.ReactNode;
}

export function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>,
  defaultLoadingFallback?: React.ReactNode,
) {
  return function WithLoadingComponent({
    isLoading = false,
    loadingFallback = defaultLoadingFallback || <Loading />,
    ...props
  }: P & WithLoadingProps) {
    if (isLoading) {
      return <>{loadingFallback}</>;
    }

    return <WrappedComponent {...(props as P)} />;
  };
}
