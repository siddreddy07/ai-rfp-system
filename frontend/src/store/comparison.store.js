import axios from "axios"
import { toast } from "sonner"
import { create } from "zustand"



export const usecompareStore = create((set)=>({

    comparison:null,
    proposalspop:[],
    comploading:'',

    generateCompare:async(id)=>{

        let compMessage = ''
        set({comploading:true})

        try {

            const res = await axios.get(`http://localhost:8000/api/compare/comparison-result/${id}`)

            if(res.data){

                const {data} = res

                set({comparison:data.comparison})
                set({proposalspop:data.proposals})

                console.log("Comparison : ",res.data)
                compMessage = data.message

                return {success:true}

            }

        } catch (error) {
            console.log("Error inside Compare Store : ",error.message)
            toast.error('Error Generating Comparison')
        }
            finally{
                toast.success(compMessage)
                set({comploading:false})
            }

    },

    getCompare:async(id)=>{

        let compMessage = ''
        set({comploading:true})

        try {

            const res = await axios.get(`http://localhost:8000/api/compare/getcomparison-result/${id}`)

            if(res.data){

                const {data} = res

                set({comparison:data.comparison})
                set({proposalspop:data.proposals})
                
                console.log("Comparison : ",res.data)
                compMessage = data.message

            }

        } catch (error) {
            console.log("Error inside Compare Store : ",error.message)
            toast.error('Error Getting Comparison')
        }
            finally{
                toast.success(compMessage)
                set({comploading:false})
            }

    }

}))