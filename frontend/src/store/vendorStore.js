import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";



export const usevendorStore = create((set)=>({

    rfp:null,
    loading:"",
    vendorsdata:[],

    getAssignedVendor:async(id)=>{

        set({loading:true})

        console.log("Calling Assigned Vendors stroe")

        try {

            const res = await axios.get(`http://localhost:8000/api/vendor/assigned-vendors/${id}`)

            if(res.data){

                const {data} = res

                console.log("Data : ",data)

                const {rfpdata} = data

                const {vendors} = data

                if(rfpdata && vendors){
                    set({rfp:rfpdata})
                    set({vendorsdata:vendors})
                }

            }

        } catch (error) {
            console.log("Error inside useVendor get assigned Vendors : ",error.message)
        }finally{
            set({loading:false})
        }

    },

    sendEmail : async(rfpId,vendors)=>{

        let message = ""
        try {

            set({loading:true})

            console.log("rfpId : ",rfpId)
            console.log("vendors : ",vendors)

            const res = await axios.post('http://localhost:8000/api/vendor/send-email',{rfpId,vendors})

            if(res.data){
                console.log("Successfully Sent Email to the Vendor(s)")
                message = res.data.message
                return {success:true}
            }

        } catch (error) {
            console.log("Error inside sendEMail : ",error.message)
            toast.error("Internal Server Error")
            return false
        }finally{
            set({loading:false})
            toast.success(message)
        }

    }

}))