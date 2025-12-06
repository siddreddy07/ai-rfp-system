
import { Star, DollarSign, Calendar, Shield, Download, Sparkles, Loader, RefreshCcw, BarChart, ChartAreaIcon, ChartBarIcon, ChartBar, ArchiveRestore, CompassIcon } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Button } from "../components/ui/button";
import { useproposalStore } from "../store/proposalStore";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { usecompareStore } from "../store/comparison.store";
import { toast } from "sonner";



export default function ProposalPage() {

    const {rfpid} = useParams()

    const proposals = useproposalStore((state)=>state.proposals)
    const proposalloading = useproposalStore((state)=>state.proposalloading)
    const getemailproposals = useproposalStore((state)=>state.getemailproposals)
    const getproposals = useproposalStore((state)=>state.getproposals)
    const initalLoading = useproposalStore((state)=>state.initalLoading)

    const generateCompare = usecompareStore((state)=>state.generateCompare)
    const comploading = usecompareStore((state)=>state.comploading)

    const [activeTab,setactiveTab] = useState([])

    const navigate = useNavigate()

    console.log("Active Tab : ",activeTab)
 
     const [disabled, setDisabled] = useState(false);

     useEffect(()=>{

       const {success} = getproposals(rfpid)
     },[getproposals])

     useEffect(()=>{
        if(proposals && proposals.length > 0){
            setactiveTab(proposals[0])
        }
     },[proposals])


    
  const handleClick = async() => {
    
    console.log("Refresh clicked");

    await getemailproposals(rfpid)

    setDisabled(true);
    setTimeout(() => setDisabled(false), 60 * 1000); // 1 minute
  };

  const handleCompare = async() => {
    
    console.log("Comparison clicked");
    if(proposals.length > 1){
        setDisabled(true);
        const {success} = await generateCompare(rfpid)
    
        if(success){
            setDisabled(false)
            navigate(`/compare-vendors/${rfpid}`)
        }
    }
    toast.error('Comparison not possible if less than 2 proposals')
    return
    
  };

  console.log("Proposals : ",proposals)

  return (
    
<div className="min-h-screen p-4 md:p-8">
  {/* Page Title */}
  <h1 className="text-3xl font-bold text-white text-center mb-8">Proposals</h1>
    <div className="flex items-center justify-center gap-8 mb-4">
  <Button
        onClick={handleClick}
        disabled={disabled || proposalloading || comploading}
        className={`flex items-center gap-2 ${disabled || proposalloading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {proposalloading ? <Loader className="animate-spin" /> : <RefreshCcw />}
        <span>{proposalloading ? "Getting proposals..." : "Refresh"}</span>
      </Button>
  <Button
        onClick={handleCompare}
        disabled={disabled || proposalloading || comploading}
        className={`flex items-center gap-2 ${disabled || proposalloading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {comploading ? <Loader className="animate-spin" /> : <CompassIcon />}
        <span>{comploading ? "Started Comparison..." : "Compare"}</span>
      </Button>
    </div>

  {/* Loading Skeleton */}
  {initalLoading ? 
  (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <div className="w-full max-w-2xl space-y-4">
        <div className="h-24 bg-white/10 animate-pulse rounded-xl"></div>
        <div className="h-24 bg-white/10 animate-pulse rounded-xl"></div>
      </div>
      <p className="text-white/70 text-sm">Fetching vendor proposals...</p>
    </div>
  ) : proposals.length === 0 ? (
    /* No Proposals */
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <h2 className="text-white text-xl">No proposals yet. Come back later.</h2>
    </div>
  ) : (
    /* Proposals Available */
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Refresh & Vendor Count */}
      <div className="flex items-center justify-center gap-6">
        
        <p className="text-white font-semibold text-sm">
          {proposals.length} vendor(s) replied
        </p>
      </div>

      {/* Proposal Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {proposals.map((proposal, index) => (
          <Button
            key={proposal._id}
            variant={activeTab?._id === proposal._id ? "default" : "ghost"}
            onClick={() => setactiveTab(proposal)}
            className="px-1.5 font-semibold text-xs md:text-sm xl:text-lg py-0.5 "
          >
            Vendor {index + 1}
          </Button>
        ))}
      </div>

      {/* Active Proposal Details */}
      {proposals.length > 0  && (
        <div className="bg-white/5 border border-white/20 rounded-2xl p-6 md:p-8 space-y-6">

          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">{activeTab?.rfpId?.title}</h2>
              <p className="text-white/70 text-sm mt-1">{activeTab?.vendorId?.name}</p>
            </div>
            <div className="flex items-center gap-1 text-yellow-400 font-bold text-2xl">
              {activeTab?.vendorScore} <Star className="w-6 h-6 fill-yellow-400" />
            </div>
          </div>

          {/* Stats Table */}
          <Table className="mb-4">
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Price</TableHead>
                <TableHead className="text-white">Delivery</TableHead>
                <TableHead className="text-white">Warranty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-white">
                  ₹{(activeTab?.price / 100000).toFixed(1)}L
                  {activeTab?.rfpId?.budget - activeTab?.price > 0 && (
                    <span className="text-green-400 ml-2">
                      Saved ₹{((activeTab?.rfpId?.budget - activeTab?.price) / 100000).toFixed(1)}L
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-white">{activeTab?.delivery}</TableCell>
                <TableCell className="text-white">{activeTab?.warranty}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Items Table */}
          {activeTab?.items?.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-2">Items</h3>
              <Table className="mb-4 rounded-md">
                <TableHeader className="bg-zinc-700 ">
                  <TableRow>
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Quantity</TableHead>
                    <TableHead className="text-white">Specs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeTab?.items.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="text-white">{item.name}</TableCell>
                      <TableCell className="text-white">{item.quantity}</TableCell>
                      <TableCell className="text-white">{item.specs}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* AI Summary */}
          {activeTab?.aiSummary && (
            <div className="p-4 bg-purple-500/10 rounded-lg">
              <p className="text-white text-sm">{activeTab?.aiSummary?.replace("$", "₹")}</p>
            </div>
          )}

          {/* Attachment */}
          {activeTab?.attachment?.fileUrl && (
            <a
              href={activeTab?.attachment.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="text-black font-bold w-full mt-2">
                <Download className="w-4 h-4 mr-2" />
                Download Proposal ({activeTab?.attachment?.fileType?.toUpperCase()})
              </Button>
            </a>
          )}

        </div>
      )}

    </div>
  )}
</div>


  );
}