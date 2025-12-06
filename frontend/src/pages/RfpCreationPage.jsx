
import { useState } from "react";
import { FileText, Loader, Play, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { userfpStore } from "../store/rfpStore";
import { useNavigate } from "react-router-dom";

export default function RfpCreationPage() {
  const [userText, setUserText] = useState("");
  const [aiOutput, setAiOutput] = useState(null);

  const rfp = userfpStore((state) => state.rfp);
const getRfp = userfpStore((state) => state.getRfp);
const addRfp = userfpStore((state) => state.addRfp);
const loading = userfpStore((state) => state.loading);
const saving = userfpStore((state) => state.saving);

const navigate = useNavigate()

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-6">
      {/* Header */}
      <h1 className="text-4xl font-extrabold mb-8 flex items-center gap-3 tracking-wide">
        <FileText size={30} /> Create New RFP
      </h1>

      {/* User Input */}
      <Card className="w-full max-w-3xl mb-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 transition-all duration-300 hover:shadow-3xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-200">
            Describe your needs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Type your request here..."
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            className="h-44 text-white placeholder-gray-400 bg-white/5 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
          />
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Button
        className="mb-8 flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={()=> getRfp(userText)}
        disabled={!userText.trim() || loading}
      >
        {loading ? <span className="flex gap-1">
          <Loader className="animate-spin"/>  
          <p>Generating RFP</p>
          </span>
          :
        <span className="flex gap-1">
          <Play size={20} /> Generate RFP
          </span>
        }
      </Button>

      {rfp && (
  
<Card className="w-full max-w-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-5 hover:shadow-xl transition-transform duration-300">
  
  {/* Header: Title and Date */}
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-gray-100 truncate">{rfp?.title || "Untitled RFP"}</h2>
  </div>

  {/* Category Badge */}
  <Badge className="bg-blue-600/40 border border-blue-400/40 text-blue-100 mb-4 text-sm px-3 py-1">
    {rfp?.category || "General"}
  </Badge>

  {/* Key Details Grid */}
  <div className="grid grid-cols-2 gap-4 mb-4 text-gray-300 text-sm">
    <div><span className="font-semibold text-white">Budget:</span> ₹{rfp?.budget || 0}</div>
    <div><span className="font-semibold text-white">Delivery:</span> {rfp?.deliveryTime || "-"}</div>
    <div><span className="font-semibold text-white">Payment:</span> {rfp?.paymentTerms || "N/A"}</div>
    <div><span className="font-semibold text-white">Warranty:</span> {rfp?.warranty || "N/A"}</div>
  </div>

  {/* Items Section: more organized */}
  {rfp.items?.length > 0 && (
    <div className="mb-4">
      <h3 className="text-white font-semibold text-sm mb-2">Items</h3>
      <div className="grid grid-cols-1 gap-3">
        {rfp.items.map((item, idx) => (
          <div key={idx} className="bg-white/5 border border-white/20 rounded-xl p-3 flex flex-col space-y-1">
            <span className="font-semibold text-gray-100 text-lg line-clamp-1 truncate">{item.name}</span>
            <span className="text-gray-300 md:text-md"><p className="font-semibold">Specs :</p>{item.specs}</span>
            <span className="text-gray-300 md:text-md">Quantity: <span className="font-semibold text-white">{item.quantity}</span></span>
          </div>
        ))}
      </div>
    </div>
  )}

  <button onClick={async()=>{
    const {success,id} = await addRfp(rfp)
    if(success && id){
        navigate(`/select-vendors/${id}`)
    }
    }} disabled={!rfp || saving} className="w-full bg-blue-500/60 cursor-pointer text-white font-semibold py-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md text-sm">
    {saving ? <span className="flex items-center justify-center gap-1">
          <Loader className="animate-spin"/>  
          <p>Saving RFP</p>
          </span>
          :
        <span className="flex items-center justify-center gap-1">
          <Save size={20} /> Save RFP
          </span>
        }
  </button>
</Card>




)}


  


    </div>
  );
}
