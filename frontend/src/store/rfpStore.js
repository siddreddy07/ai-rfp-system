
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {create} from 'zustand'


export const userfpStore = create((set)=>({

    rfp:null,
    loading:"",
    saving:"",

    getRfp:async(rfpData)=>{

        try {

            set(()=>({loading:true}))

            console.log("rfpData : ",typeof rfpData)

            const res = await axios.post("http://localhost:8000/api/rfp/get-ai-rfp",{data:rfpData})

            console.log("Rfp Data added Successfully !",res)
            const {data} = res

            const resultdata = data.rpfData

            set({ rfp: resultdata });


        } catch (error) {
             console.error("Erorr inside userfpStore : ",error.message);
        }finally {
        set(() => ({ loading: false }))
    }

    },

    addRfp:async(rfpData)=>{

        
        try {
            let id

            set(()=>({saving:true}))

            console.log("rfpData : ", rfpData)

            const res = await axios.post("http://localhost:8000/api/rfp/add-rfp",{data:rfpData})

            if(res.data){
                const {data} = res
                id = data.rfpId 
                console.log("Rfp Data added Successfully !",res)
            }

            return {success:true,id}


        } catch (error) {
            console.error("Erorr inside userfpStore : ",error.message);
            toast.error(error.message)
            return { success: false };
        }finally {
        set(() => ({ saving: false }))
        toast.success('Rfp Saved Successfully')
        
    }
    }

}))