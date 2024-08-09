import React, { useState } from 'react'
import Styles from './css/Styles.module.css'
import Header from './header'
import { Box, Grid,Paper, Typography,TextField, Select,MenuItem,Button,Badge,Radio,FormControl,FormControlLabel,RadioGroup,InputLabel} from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

let webHook_Url = 'https://webhook.site/341b90bd-2464-4909-af00-09bab50ae523'
const WrapperCard = ({show}) => {
    
    const [value, setValue] = useState('1');//for radio buttons
    const [formData,setFormData] = useState({ //server data state
        "segment_name":"",
        "schema":[]        
    })
    const schemaData =[//initial schema data
        {label:'First Name',value:'first_name',id:1},
        {label:'Last Name',value:'last_name',id:2},
        {label:'Gender',value:'gender',id:3},
        {label:'Age',value:'age',id:4},
        {label:'Account Name',value:'account_name',id:5},
        {label:'City',value:'city',id:6},
        {label:'State',value:'state',id:7},
    ]
    const [schemas,setSchemas] = useState(schemaData) //having default data
    const [selectedSchema,setSelectedSchema] = useState("") // geting the user input
    const [newSchema,setNewSchema] = useState() // for new array of schemas
    const [count,setCount] = useState(0) // to add dropdowns
    const [newDropDown,setNewDropDown] = useState([])

    const notify = (message,success) => {//toastify notification
            if(success=='info'){
                toast.info(message, {
                    position: "bottom-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    }
                )
            }else if(success==true){
                toast.success(message, {
                    position: "bottom-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    })
            }else{
                toast.error(message, {
                    position: "bottom-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    })
            }
    }
    const handleTrakChange = (event) => {//event for radio button values
      setValue(event.target.value);
    };
    

    const handleSchemaChange = (e)=>{//event for handling schma change
        if(e.target.value !== selectedSchema){
            let newData = schemaData.slice()
            let selectedData  = newData.findIndex(each=>each.value === e.target.value)
            let updatedData = newData.splice(selectedData,1)[0];
            newData.unshift(updatedData)
            setSelectedSchema(e.target.value)
            setNewSchema(newData)
        }
    }
    const handleDataCollection = (e)=>{//onchange event for all input to collect data
        const {name,value} = e.target
        setFormData({
            ...formData,
            [name]:value
        })
    }
    const DropDown = ({data,id_num})=>( //dropdown element
        <>
            <Badge badgeContent=" " variant="dot" color={value == 1 ? 'success' : 'warning'}/>
            <FormControl sx={{width: 300 }}>
                <Select value={selectedSchema} sx={{maxHeight:'40px'}}>
                    {data.map((each)=>(
                        <MenuItem key={each.id} value={each.value}>{each.label}</MenuItem>
                    ))}                    
                </Select>
            </FormControl>
        </>
    )
    const addDropdown = ()=>{//adding dropdown
        if(selectedSchema !== "" | undefined){
            setCount(count => {
                if (count<8) {
                    return count+1
                }
                return count
            }); //increasing the count
            let sliceIndex = schemas.findIndex(each=>each.value === selectedSchema)//value to find the latest option selected
            setNewDropDown((prev)=>[...prev,<DropDown key={count} data={newSchema} id_num={count}/>]); //pushing the elements into the array
            const {value,label} = schemas[sliceIndex]
            schemas.splice(sliceIndex,1)//restructuring the schema array
            setSchemas(schemas);
            setFormData(prevFormData => ({
                ...prevFormData,
                schema: [
                  ...prevFormData.schema,
                  { [value]: label } // Add new property to the schema array
                ]
              }));
              setSelectedSchema("")
        }
    }
    const handleFormSubmit = async ()=>{
        try{    
            console.log(formData)
            if(formData.segment_name == "") {
                notify('Enter Segment Name',false)
            }else if(formData.schema.length==0){
                notify("Add atleast one schema",false)
            } else{
                const response = await axios.post(webHook_Url, formData, {
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
                console.log(response.data)
                notify('Data sent to server Successfully',true)
            }      
        }catch(err){
            console.log('Error in sending data',err)
            notify('Error in sending data',false)
        }

    }
    const removeDropDown = (id_num)=>{
        let rmItems = newDropDown.filter((_,i)=>i!==id_num) // after removind a dropdown
        setNewDropDown(rmItems) // updated dropwon list
        schemas.splice(id_num,0,newDropDown[id_num].props.data[0])
        setSchemas(schemas) // updated schema selection dropdown
        setSelectedSchema(newDropDown[id_num].props.data[0].label) // schema selection label
        setFormData(prevFormData => ({
            ...prevFormData,
            schema: prevFormData.schema.filter((each,index)=>Object.keys(each)[0] !== newDropDown[id_num].props.data[0].value)
        }));
    }
    const cancelSegmentChanges = ()=>{
        setNewDropDown([])
        setSchemas(schemaData)
        setSelectedSchema("")
        setFormData({ //server data state
            "segment_name":"",
            "schema":[]        
        })
        notify('Event cancelled','info')
    }
  return (
    <Box component="section" className={`${Styles.wrapCard} ${show ? Styles.hide : ''}`}>
          <Header title={'Saving Segment'}/>
          <Box component="form" className={Styles.wrapSegment}          >
                <Typography className={Styles.text} variant='body1'>Enter the Name of the Segment</Typography>
                <TextField className={Styles.inputsField} id="outlined-basic" label="Name of the Segment" name="segment_name" variant="outlined" onChange={handleDataCollection} value={formData.segment_name}/>
                <Typography className={Styles.text} variant='body1'>To save your segment, you need to add the schemas to build the query</Typography>
                <FormControl>
                    <RadioGroup
                        name="controlled-radio-buttons-group"
                        value={value}
                        onChange={handleTrakChange}
                    >
                        <div style={{display:'flex',flexDirection:'row !important',justifyContent:'flex-end'}}>
                            <FormControlLabel value="1" control={<Radio />} label="User" />
                            <FormControlLabel value="2" control={<Radio />} label="Group" />
                        </div>
                    </RadioGroup>
                </FormControl>
                {newDropDown.map((each, index) => (
                    <Box display="flex" alignItems="center" gap={1} key={index}>
                    
                    {each}
                    <Button
                        id={index}
                        onClick={() => removeDropDown(index)}
                        sx={{ minWidth: '20px !important', width: '20px !important', height: '30px' }}
                        variant="contained"
                    >
                        <RemoveIcon sx={{ height: '10px' }} />
                    </Button>
                    </Box>

                ))}{/*dropdown array*/}
                <FormControl sx={{ m: 3, width: 300 }}>
                    <InputLabel sx={{bgcolor:'white'}}>Add schema to segment</InputLabel>
                    <Select value={selectedSchema} onChange={(e)=>handleSchemaChange(e)}>
                        {schemas.sort((a,b)=>{return a.id-b.id}).map((each)=>(
                                <MenuItem key={each.id} value={each.value}>{each.label}</MenuItem>
                        ))}                    
                    </Select>
                </FormControl>
                
                <Button size="small" onClick={addDropdown} sx={{maxWidth:'150px',color:'rgb(57, 174, 188)'}}>+ Add new schema</Button>
          </Box>
          <Box className={Styles.footer}>
            <Button onClick={handleFormSubmit} size="small" sx={{ml:2,bgcolor:'rgb(57, 174, 188)',color:'white',border:'1px solid rgb(57, 174, 188)',p:1}}>Save the segment</Button>
            <Button onClick={cancelSegmentChanges} size="small" sx={{bgcolor:'white',color:'red'}}>Cancel</Button>
          </Box>
          <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                />
    </Box>
  )
}

export default WrapperCard