import React, { useState } from 'react'
import Header from './header';
import WrapperCard from './wrapperCard';
import Styles from './css/Styles.module.css'
import { Box, Button, Grid } from '@mui/material'

const MainPage = () => {
  const [open,setOpen] = useState(false)
  const handleWrapper = ()=>{
    setOpen(!open)
  }
 
  return ( 
  
    <Box component="section" className={Styles.main}>
      <Box component="section"          
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
      >
          <Header title={'View Audience'}/>
          <Button sx={{mt:10,color:'rgb(57, 174, 188)',border:'1px solid rgb(57, 174, 188)'}} onClick={handleWrapper}>Save Segment</Button>
      <div className={`${Styles.overlay} +' '+ ${!open?Styles.dNone:''}`}></div>
      </Box>
      
        <WrapperCard show={!open} sx={{zIndex:99}}/>
       
    </Box>
  )}
export default MainPage