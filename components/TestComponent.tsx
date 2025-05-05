// TestComponent.tsx - Created as a test
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export default function TestComponent() {
    return (
        <Card className="bg-destructive text-destructive-foreground m-4">
            <CardContent className="p-4">
                This is a test component to verify that changes are being applied.
                If you can see this box with warning text, the system is working.
            </CardContent>
        </Card>
    );
} 