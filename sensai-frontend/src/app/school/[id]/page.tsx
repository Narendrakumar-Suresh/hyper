"use client";

import { useParams } from "next/navigation";
import ClientSchoolLearnerView from "./ClientSchoolLearnerView";
import { Button } from "@/components/ui/button";

export default function SchoolPage() {
    const params = useParams();
    const id = params?.id as string;

    return <>
    <ClientSchoolLearnerView slug={id} />
    </>;
} 