import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Button } from "../components/ui/button";
import { Loader, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { usevendorStore } from "../store/vendorStore";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SelectVendors = () => {


  const {rfpid} = useParams()

  const navigate = useNavigate()

  const getAssignedVendor = usevendorStore((state)=>state.getAssignedVendor)
  const rfp  = usevendorStore((state)=>state.rfp)
  const loading  = usevendorStore((state)=>state.loading)
  const vendorsdata = usevendorStore((state)=>state.vendorsdata)
  const sendEmail = usevendorStore((state)=>state.sendEmail)


  useEffect(()=>{
    
     getAssignedVendor(rfpid)
    
  },[getAssignedVendor])

  const [selected, setSelected] = useState([]);
const [isOpen, setIsOpen] = useState(false);

console.log("Vendros Data: ",vendorsdata)
console.log("Selected Vendors ",selected)

const toggleVendor = (id) => {
  if (selected.includes(id)) {
    setSelected(selected.filter((v) => v !== id));
  } else {
    if (selected.length >= 3) return; // max 3 vendors
    setSelected([...selected, id]);
  }
};

return (
  <div className="w-full flex flex-col items-center justify-center px-2 lg:px-0">
      {rfp && (
    <div className="flex items-center lg:items-start lg:flex-row flex-col justify-center gap-4 mt-8">
      <Card className="w-full max-w-md bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl 
        rounded-2xl shadow-xl border-zinc-200/30 bg-transparent border p-5 hover:shadow-2xl transition-all duration-300">

        <div className="flex justify-between items-start">
          <h2 className="lg:text-xl text-sm truncate line-clamp-1 font-bold text-gray-100 leading-tight">
            {rfp?.title}
          </h2>

          <span className="text-xs text-gray-300 bg-white/10 px-2 py-1 rounded-md border border-white/20">
            {new Date(rfp?.createdAt).toDateString()}
          </span>
        </div>

        <Badge className="bg-blue-600/40 border -mt-4 border-blue-400/40 text-blue-100">
          {rfp.category}
        </Badge>

        <div className="space-y-2 -mt-4">
          <p className="text-gray-300 text-sm tracking-wide font-medium">Items Included:</p>

          <ul className="space-y-1 text-gray-100 text-sm">
            {rfp.items.map((item, idx) => (
              <li key={idx} className="bg-blue-400/30 border border-blue-400/30 px-3 py-2 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all">
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card className="w-full max-w-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl border border-white/20 shadow-xl rounded-3xl">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-100 font-bold tracking-tight flex items-center gap-3">
            Select Vendors
            <Badge className="bg-blue-600/40 border border-blue-400/40 text-blue-100">
              {rfp.category}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 -mt-4 lg:space-y-6">
          <p className="text-gray-300 text-sm">
            Choose vendors for this RFP. You can select up to{" "}
            <span className="font-semibold text-white">3 vendors</span>.
          </p>

          <div className="grid h-[200px] lg:h-[300px] overflow-y-auto grid-cols-1 gap-4">
  {vendorsdata && vendorsdata.length > 0 ? (
    vendorsdata.map((vendor) => {
      const isSelected = selected.includes(vendor._id);
      const isSent = rfp.vendorsSent.includes(vendor._id)

      return (
        <div
          key={vendor._id}
          onClick={() => {
            if(!isSent){
              toggleVendor(vendor._id)}}
            }
          className={cn(
            "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
            "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20",
            (isSent || isSelected) && "border-blue-500/40 bg-blue-600/20"
          )}
        >
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isSent || isSelected}
              disabled={isSent}
              onCheckedChange={() => toggleVendor(vendor._id)}
              className="border-white/40 data-[state=checked]:bg-blue-500"
            />

            <span className="text-gray-100 text-sm line-clamp-1 truncate lg:text-base font-medium">
              {vendor?.name}
            </span>
          </div>

          {(isSent || isSelected) && (
            <Badge className="bg-blue-600/40 border-blue-400/40 text-blue-100">
              {isSent ? "Send" : "Selected"}
            </Badge>
          )}
        </div>
      );
    })
  ) : (
    <p className="text-gray-400 text-center mt-4">No vendors available</p>
  )}
</div>


          {selected.length > 0 && (
            <div className="mt-4 text-gray-300 text-sm">
              Selected Vendors:{" "}
              <span className="font-medium text-white">
                {selected.map((id) => vendorsdata.find((v) => v._id === id)?.name).join(", ")}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
      )}

    {/* ----- SEND DIALOG ----- */}
    <div className="flex items-center w-full justify-evenly">
    <Button
      onClick={() => setIsOpen(true)}
      className="mt-3 mb-3 font-semibold"
      disabled={selected.length < 1}
      variant="secondary"
    >
      <Mail /> <span className="lg:text-lg font-semibold">Send via mail</span>
    </Button>
    <Button
      onClick={() => navigate(`/proposals/${rfpid}`)}
      disabled={rfp?.vendorsSent?.length === 0}
      className="mt-3 mb-3 font-semibold"
      variant="secondary"
    >
      <Mail /> <span className="lg:text-lg font-semibold">Go to Proposal</span>
    </Button>

    </div>

    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Sending RFP</DialogTitle>
          <DialogDescription>
            <p className="text-start">You are about to send this RFP to the selected vendors.</p>
            <p className="mt-1 text-start text-sm text-gray-400">Vendors will receive full RFP details via email.</p>

            <div className="mt-4 flex gap-3 justify-end">
              <Button
                disabled={selected.length < 1 || loading}
                variant="secondary"
                className="font-semibold"
                onClick={async() => {
                  const {success} = await sendEmail(rfpid,selected);
                  console.log("Success:",success)
                  if(success){
                    setIsOpen(false);
                    navigate(`/select-vendors/${rfpid}`)
                  }
                }}
              >
                {loading ? 
              <span className="flex items-center justify-center gap-1">
                <Loader className="animate-spin"/> <p>Sending..</p>
              </span>
              :
              <span className="flex items-center justify-center gap-1">
                <Mail /> <p>Send Now</p>
              </span>  

              }
              </Button>

              <Button
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="font-semibold"
                variant="destructive"
              >
                Cancel
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  </div>
);

};

export default SelectVendors;
