import React from 'react'
import { Button } from './components/ui/button'
import { Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import RfpCreationPage from './pages/RfpCreationPage'
import SelectVenders from './pages/SelectVenders'
import CompareVendors from './pages/CompareVendors'
import ProposalPage from './pages/ProposalDetail'

const App = () => {
  return (
    <div className='w-full h-screen'>
     
            <Routes>
              <Route path='/' element={<Layout/>}>

                <Route index element={<RfpCreationPage/>}/>
                <Route path='/select-vendors/:rfpid' element={<SelectVenders/>}/>
                <Route path='/compare-vendors/:rfpid' element={<CompareVendors/>}/>
                <Route path='/proposals/:rfpid' element={<ProposalPage/>}/>

              </Route>

            </Routes>

    </div>
  )
}

export default App