import { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import Chip from '@mui/material/Chip';
import InputAdornment from "@mui/material/InputAdornment";
import swal from 'sweetalert';
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MuiInput from '@mui/material/Input';
import { styled } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';

const TAGS = ["Beverage", "Hot", "Cold", "Meal", "Snacks", "Spicy", "Very spicy", "Sweet", "Dessert", "Vegan"]
const ADD_ONS = ["Cheese", "Butter", "Ketchup", "Schezwan", "Mayonnaise", "Mustard", "Peri peri", "Chocolate", "Milkmaid", "Garlic dip"]
const indices = new Array(10).fill().map((_, idx) => idx);


const FoodMenu = (props) => {
    const navigate = useNavigate();

    const Input = styled(MuiInput)`
    width: 60px;
    `;
    const [open, setOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'))
    const userID = user._id;

    const [addOnBool, setAddOnBool] = useState(new Array(10).fill(false));
    const [addOnPrice, setAddOnPrice] = useState(new Array(10).fill(0));

    const [tagBool, setTagBool] = useState(new Array(10).fill(false));

    const [foodMenu, setFoodMenu] = useState([]);
    const [sortByPrice, setSortByPrice] = useState(true);
    const [sortByRating, setSortByRating] = useState(true);

    const [editItem, setEditItem] = useState({
        _id: 0, Name: '', Tags: 0, AddOns: [], Price: 0, Veg: true
    });

    const handleChangeTagBool = (idx) => event => {
        const tmp = [...tagBool]; tmp[idx] = event.target.checked;
        setTagBool(tmp);
    }

    const handleChangeBool = (idx) => event => {
        const tmp = [...addOnBool]; tmp[idx] = event.target.checked; 
        setAddOnBool(tmp);
    }

    const handleChangeEdit = (prop) => (event) => {
        setEditItem({...editItem, [prop]: event.target.value});
    }

    const handleChangePrice = (idx) => event => {
        if (event.target.value >= 0) {
            const tmp = [...addOnPrice]; tmp[idx] = event.target.value;
            setAddOnPrice(tmp);
        }        
    }

    useEffect(() => {
        axios
            .get(`http://localhost:4000/food?vendorid=${userID}`)
            .then((response) => {
                setFoodMenu(response.data);
                setEditItem({
                    _id: 0, Name: '', Tags: 0, AddOns: [], Price: 0, Veg: true
                });
            })
            .catch(err => {
                console.log('Error!!!  ', err); 
            })
    }, []);

    const sortChange = () => {
        let tempFoodMenu = foodMenu;
        const flag = sortByPrice;
        tempFoodMenu.sort((a, b) => {
            return (1 - 2 * flag) * ( a.Price - b.Price);
        });
        setFoodMenu(tempFoodMenu);
        setSortByPrice(!flag);
    };
    const styles = {
        container: {
          height: '200vh',
          backgroundColor:"lightblue",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'Top',
          padding: '0px',
          margin: '0px'
        },
        
      };

    const sortRating = () => {
        let tempFoodMenu = foodMenu;
        const flag = sortByRating;
        tempFoodMenu.sort((a, b) => {
            return (1 - 2 * flag) * ( a.Rating - b.Rating);
        });
        setFoodMenu(tempFoodMenu);
        setSortByRating(!flag);
    };

    const addFoodItem = (event) => {
        event.preventDefault();
        navigate('/vendor/add-item')
    }

    const handleClose = () => {
        setOpen(false);
        setEditItem({
            _id: 0, Name: '', Tags: 0, AddOns: [], Price: 0, Veg: true
        }); 
        setAddOnBool(new Array(10).fill(false));
        setAddOnPrice(new Array(10).fill(0));
    };

    const getTags = (tagSet) => {
        let tagList = [];
        TAGS.forEach((tag, idx) => {if ((tagSet >> idx) & 1) tagList.push(tag);})
        return tagList;
    }

    const onEditItem = () => {
        const addOnlist = [];
        addOnBool.forEach((b, idx) => { if (b) addOnlist.push({Name: idx, Price: Number(addOnPrice[idx])}) });
        axios
            .post('http://localhost:4000/food/edit-item', {
                Name: editItem.Name, 
                VendorID: userID, 
                Price: editItem.Price, 
                Veg: editItem.Veg,
                AddOns: addOnlist, 
                Tags: tagBool.reduce((prev, b, i) => prev | ((1 << i) * b), 0),
            }).then((response) => {
                swal('Edited successfully', `${editItem.Name} has been edited successfully.` ,'success')
                .then((resp) => {if (resp) window.location='/vendor/shop-menu';});
            }).catch((err) => console.log(err));
        setEditItem({
            _id: 0, Name: '', Tags: 0, AddOns: [], Price: 0, Veg: true
        }); 
        setOpen(false);
    }

  return (
    
    <div align={'center'} style={styles.container}>
    <div align={'center'} style={{width:"80%"}}>
     
        <Grid item xs={12} align={'center'}  padding={5}>
            <Button variant='contained' onClick={addFoodItem} sx={{ fontSize: '1.2rem',padding: '10px',boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.3)' }}>
                Add Food Item
            </Button>
        </Grid>

        <Grid item xs={20} md={20}  mb={3} lg={20}>
            
                <Table size="medium" style={{borderRadius: '20px 20px 20px 20px', overflow: 'hidden',boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.2)',backgroundColor:"#3D72A4"}}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontSize: '25px',color:"white" }}  align="center"> Sr No.</TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }}align="center">Name</TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }}align="center">
                                {" "}
                                <Button onClick={sortChange} style={{color:"white"}}>
                                {sortByPrice ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                                </Button>
                                Price
                            </TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }} align="center">Veg/Non-veg</TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }} align="center">Add ons</TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }} align="center">Tags</TableCell>
                            <TableCell style={{ fontSize: '25px',color:"white" }} align="center">
                                {" "}
                                <Button onClick={sortRating} style={{color:"white"}}>
                                {sortByRating ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                                </Button>
                                Rating
                            </TableCell>
                            <TableCell  style={{ fontSize: '25px',color:"white" }}  align="center"> Actions </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {foodMenu.map((user, ind) => (
                        <TableRow key={ind} style={{backgroundColor:'#fff5ee' , fontSize:'20px'}}>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{ind + 1}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{user.Name}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{user.Price}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{user.Veg ? 'Veg' : 'Non-veg'}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{ user.AddOns.map((addOn) => (
                                <Chip label={ADD_ONS[addOn.Name] + ': ₹' + addOn.Price} variant='outlined'/>
                                )) }</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{getTags(user.Tags).map((tag) => (<Chip label={tag} variant='outlined' />))}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">{user.Rating}</TableCell>
                            <TableCell style={{ fontSize: '20px' }}  align="center">
                                <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => {
                                    const itemName = user.Name;
                                    swal({
                                        title: "Are you sure?",
                                        text: "Once deleted, you will not be able to recover this food item!",
                                        icon: "warning",
                                        buttons: true,
                                        dangerMode: true,
                                    }).then((willDelete) => {
                                        if (willDelete) {
                                            axios.post('http://localhost:4000/food/delete', {_id: user._id})
                                            .then((resp) => {
                                                swal({
                                                    title: `Deleted ${itemName}`,
                                                    text: "Poof! Your food item has been deleted!", 
                                                    icon: "success",
                                                }).then(() => window.location='/vendor/shop-menu');
                                            }).catch(error => console.log(error.Message));
                                            
                                            
                                        } else {
                                            swal("Your food item is safe!");
                                        }
                                    });
                                    
                                }} >
                                    Delete Item
                                </Button>
                            </TableCell>
                            <TableCell style={{ fontSize: '15px' }}>
                                <Button variant="contained"  onClick={() => {
                                    setEditItem({
                                        _id: user._id,
                                        Name: user.Name, 
                                        Price: user.Price,
                                        Veg: user.Veg,
                                        Tags: user.Tags,
                                        AddOns: user.AddOns
                                    });
                                    user.AddOns.forEach((addOn) => {
                                        addOnPrice[addOn.Name] = addOn.Price;
                                        addOnBool[addOn.Name] = true;
                                    });
                                    indices.forEach((idx) =>   tagBool[idx] = Boolean((user.Tags >> idx) & 1) );
                                    setOpen(true);
                                }}>
                                    Edit Item
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Edit {editItem.Name}</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        <br />
                    </DialogContentText>
                    <Grid item xs={12}>
                            <TextField
                                size='medium'
                                label='Food item name'
                                InputProps={{readOnly: true}}
                                defaultValue={editItem.Name}
                            />
                        </Grid>
                        <br />
                        <DialogContentText>
                                Edit details of {editItem.Name}:
                        </DialogContentText>
                        <DialogContentText>
                                <br />
                        </DialogContentText>
                    <Grid container align={'center'} spacing={2}
                        >
                        <Grid item xs={12}>
                            <TextField
                                size='medium'
                                label='Price'
                                value={editItem.Price}
                                onChange={handleChangeEdit('Price')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl>
                                <FormLabel id="demo-radio-buttons-group-label">Veg or Non-veg?</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={editItem.Veg}
                                    onChange={handleChangeEdit('Veg')}
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value={true} control={<Radio />} label="Veg" />
                                    <FormControlLabel value={false} control={<Radio />} label="Non-veg" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} >
                        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                            <FormLabel component="legend" align={'center'}>Add ons: </FormLabel>
                            <FormGroup>
                            <Grid container spacing={1}>
                            {indices.map((i) => (
                            <Grid item xs={12}>
                                <Grid item xs={10} >
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={addOnBool[i]} onChange={handleChangeBool(i)} />
                                        }
                                        label={ADD_ONS[i]}
                                    />
                                </Grid>
                                <Grid item  xs={2}  >
                                    <TextField
                                        size='small'
                                        label={ADD_ONS[i] + ' price'}
                                        variant='outlined'
                                        value={addOnPrice[i]}
                                        onChange={handleChangePrice(i)}
                                    />
                                </Grid>
                            </Grid>
                            ))}
                            </Grid>
                            </FormGroup>
                        </FormControl>
                        </Grid>

                        <Grid item xs={12} >
                        <Box sx={{ display: 'flex' }}>
                        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                            <FormLabel component="legend" align={'center'}>Tags: </FormLabel>
                            <FormGroup>
                            <Grid container spacing={1} >
                            {indices.map((i) => (
                            <Grid item xs={12}>
                                <FormControlLabel align={'center'}
                                    control={
                                        <Checkbox checked={tagBool[i]} onChange={handleChangeTagBool(i)} />
                                    }
                                    label={TAGS[i]}
                                />
                            </Grid>
                            ))}
                            </Grid>
                            </FormGroup>
                        </FormControl>
                        </Box>
                        </Grid>
                    </Grid>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={onEditItem}>Save Edited Changes</Button>
                    </DialogActions>
                </Dialog>
                </div>
          
        </Grid>
    </div>
    </div>
    
  );
};

export default FoodMenu;
