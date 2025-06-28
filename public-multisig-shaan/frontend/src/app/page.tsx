'use client';
import AddCitizen from "@/components/shared/add";
import Approve from "@/components/shared/approve";
import Deposit from "@/components/shared/deposit";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import NewTransaction from "@/components/shared/new-transaction";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BitcoinIcon, Check, Plus, Users } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [value, setValue] = useState<string>('approve');

  return (
    <div className="w-screen h-screen bg-blue-200 overflow-hidden flex flex-col items-center gap-4">
      <Header />
      <div className="w-full h-full flex items-center justify-center p-4 pb-12">
        <Card className="w-full h-full flex flex-col gap-4">
          <CardHeader className="flex flex-row p-4 items-center justify-between">
            <CardTitle className="text-3xl font-bold text-blue-950">{value === "add" ? 'Add Citizens' : value === "new" ? 'Create a new proposal' : value === "deposit" ? 'Deposit To Treasury' : 'Approve Proposals'}</CardTitle>
            <ToggleGroup type="single" className="bg-blue-200 rounded-md p-2" onValueChange={setValue} value={value}>
              <ToggleGroupItem className="flex items-center gap-2 justify-center" value="new">
                <Plus className="w-4 h-4" />
                New Public Proposal
              </ToggleGroupItem>
              <ToggleGroupItem className="flex items-center gap-2 justify-center" value="approve">
                <Check className="w-4 h-4" />
                Approve
              </ToggleGroupItem>
              <ToggleGroupItem className="flex items-center gap-2 justify-center" value="add">
                <Users className="w-4 h-4" />
                Add Citizens
              </ToggleGroupItem>
              <ToggleGroupItem className="flex items-center gap-2 justify-center" value="deposit">
                <BitcoinIcon className="w-4 h-4" />
                Deposit
              </ToggleGroupItem>
            </ToggleGroup>
          </CardHeader>
          <CardContent className="p-4 h-full w-full flex flex-col gap-4">
            {value === "new" && <NewTransaction />}
            {value === "approve" && <Approve />}
            {value === "add" && <AddCitizen />} 
            {value === "deposit" && <Deposit />}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
