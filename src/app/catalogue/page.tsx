"use client";
import CatalogueContent from "@/components/CatalogueContent";
import { Suspense } from "react";

import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
const Catalogue = () => {
  return (
    <>

      <Suspense fallback={<Loader />}>
        <CatalogueContent />
      </Suspense>
    </>
  );
};

export default Catalogue;
