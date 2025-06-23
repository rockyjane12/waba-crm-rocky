import React from "react";

const EmptyState = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
      <div className="text-center">
        <h3 className="text-xl font-medium mb-2">
          Welcome to Messages
        </h3>
        <p className="text-muted-foreground">
          Select a conversation to start messaging
        </p>
      </div>
    </div>
  );
};

export default EmptyState;