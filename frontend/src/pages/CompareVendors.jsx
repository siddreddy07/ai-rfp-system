import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet"
import { Button } from "../components/ui/button";
import { usecompareStore } from "../store/comparison.store";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
    import { Badge } from "../components/ui/badge";
import { Trophy, Medal, CalendarDays, Clock } from "lucide-react";


export default function VendorComparison() {


  const getCompare = usecompareStore((state)=>state.getCompare)
  const comparison = usecompareStore((state)=>state.comparison)
  const proposalspop = usecompareStore((state)=>state.proposalspop)

  const {rfpid} = useParams()

  useEffect(()=>{
    getCompare(rfpid)
  },[getCompare])


const winnerVendor = proposalspop.find(p => p.vendorId._id === comparison.winnerVendorId)?.vendorId?.name || comparison.winnerVendorId;
const runnerupVendor = proposalspop.find(p => p.vendorId._id === comparison.runnerupVendorId)?.vendorId?.name || comparison.runnerupVendorId;


  

  return (

<div className="min-h-screen px-2 sm:px-2 lg:px-8 py-2">
  <div className="max-w-6xl mx-auto space-y-6">

    {/* ===== Comparison Summary ===== */}
    <Card className="bg-white/5 backdrop-blur-md border-2 border-white/15 rounded-xl shadow-sm">
      <CardHeader className="lg:px-6 lg:py-4 border-b border-gray-200">
        <CardTitle className="lg:text-2xl font-semibold">Comparison Summary</CardTitle>
      </CardHeader>
      <CardContent className="lg:px-6 lg:py-6 space-y-2 lg:space-y-6">

        <div className="grid md:grid-cols-2 gap-2">
          <div>
            <h3 className="lg:text-lg font-medium text-green-500">Best Deal</h3>
            <p className="lg:text-xl font-semibold">{winnerVendor}</p>
          </div>
          <div>
            <h3 className="lg:text-lg font-medium text-yellow-500">2nd Best Deal</h3>
            <p className="lg:text-xl font-semibold">{runnerupVendor}</p>
          </div>
        </div>

        <div>
          <h4 className="lg:text-lg font-medium mb-1">Decisive Factors</h4>
          <p className="text-gray-300 text-xs lg:text-sm">{comparison.decisiveFactors}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-200">
          <span>Created: {new Date(comparison.createdAt).toLocaleString()}</span>
        </div>

      </CardContent>
    </Card>

    {/* ===== Clean Proposals List (Instead of Ugly Table) ===== */}
    <Card className="bg-white/5 border-2 backdrop-blur-md border-white/15 rounded-xl shadow-sm overflow-x-auto">
  <CardHeader className="lg:px-6 lg:py-4 border-b border-gray-200">
    <CardTitle className="xl:text-2xl font-semibold">Vendor Proposals</CardTitle>
  </CardHeader>

  <CardContent className="p-0">
    <Table>
      <TableHeader>
        <TableRow className="bg-white/5">
          {[
            "Vendor",
            "Category",
            "Email",
            "Phone",
            "Score",
            "Price",
            "Delivery",
            "Warranty",
            "Items"
          ].map((h) => (
            <TableHead key={h} className="text-left px-6 py-3 text-sm font-medium text-white">
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {proposalspop.map((proposal) => {
          const vendor = proposal.vendorId;
          const isWinner = vendor._id === comparison.winnerVendorId;
          const isRunner = vendor._id === comparison.runnerupVendorId;

          return (
            <TableRow key={proposal._id} className="hover:bg-gray-800">
              <TableCell className={`lg:px-6 lg:py-4 text-gray-200 font-semibold lg:text-xl whitespace-nowrap`}>
                <span className="flex items-center gap-1">{vendor.name} {isWinner ? <p className="text-green-500 font-semibold">Winner</p> : <p className="text-yellow-500 font-semibold">Runner-up</p>}</span>
              </TableCell>
              <TableCell className="px-6 py-4 text-gray-200">{vendor.category}</TableCell>
              <TableCell className="px-6 py-4 text-gray-200">
                <div>{vendor.email}</div>
              </TableCell>
              <TableCell className="px-6 py-4 text-gray-200">{vendor.phone}</TableCell>
              <TableCell className="px-6 py-4 text-gray-200 font-semibold">{proposal.vendorScore}</TableCell>
              <TableCell className="px-6 py-4 text-gray-200 font-semibold">₹{proposal.price.toLocaleString("en-IN")}</TableCell>
              <TableCell className="px-6 py-4 text-gray-200">{proposal.delivery}</TableCell>
              <TableCell className="px-6 py-4 text-gray-200">{proposal.warranty}</TableCell>
              <TableCell className="px-6 py-4 text-gray-200">
                <ul className="list-disc ml-5 space-y-1">
                  {proposal.items.map((item) => (
                    <li key={item._id} className="text-sm">
                      {item.name} — {item.quantity} pcs ({item.specs})
                    </li>
                  ))}
                </ul>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </CardContent>
</Card>


  </div>
</div>


  );
}