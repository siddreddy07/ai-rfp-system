import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";




export const useproposalStore = create((set)=>({

    proposals:[],
    proposalloading:"",
    initalLoading:"",

    getemailproposals:async(id)=>{
        set({proposalloading:true})

        let proposalMessage=""

        try {

                const res = await axios.get(`http://localhost:8000/api/proposal/get-mails/${id}`)

                if(res.data){
                    const {data} = res
                    set({proposals:data.proposals})
                    proposalMessage = data?.message
                }

                console.log("Res from useProposalStore : ",res.data)

        } catch (error) {
            
                console.log("Res from useProposalStore : ",error.message)
                toast.error('Internal Server Error')
            
        }finally{
            set({proposalloading:false})
            toast.success(proposalMessage.trim() !== "" ? proposalMessage : 'No Replies from the Vendor(s)')
        }

    },

    getproposals:async(id)=>{

                set({initalLoading:true})

        let proposalMessage=""

        try {

                const res = await axios.get(`http://localhost:8000/api/proposal/get-proposals/${id}`)

                if(res.data){
                    const {data} = res
                    set({proposals:data.proposals})
                    proposalMessage = data?.message
                }

                console.log("Res from useProposalStore : ",res.data)
                return {success:true}

        } catch (error) {
            
                console.log("Res from useProposalStore : ",error.message)
                toast.error('Internal Server Error')
                return false
            
        }finally{
            set({initalLoading:false})
            toast.success(proposalMessage.trim() !== "" ? proposalMessage : 'No Replies from the Vendor(s)')
        }


    }
    

}))