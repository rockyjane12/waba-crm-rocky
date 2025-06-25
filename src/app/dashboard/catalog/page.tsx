"use client";

import React from "react";
import { PageContainer } from "@/components/PageContainer";
import CatalogGrid from "@/components/catalog/CatalogGrid";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

export default function CatalogPage() {
  return (
    <PageContainer
      title="Product Catalog"
      subtitle="Manage your Facebook product catalog"
      // actions={
      //   <div className="flex gap-2">
      //     <Button variant="outline" size="sm">
      //       <Download className="h-4 w-4 mr-2" />
      //       Export
      //     </Button>
      //     <Button size="sm">
      //       <Plus className="h-4 w-4 mr-2" />
      //       Add Product
      //     </Button>
      //   </div>
      // }
    >
      <CatalogGrid />
    </PageContainer>
  );
}