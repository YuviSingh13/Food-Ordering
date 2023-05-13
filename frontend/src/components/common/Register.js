import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import MenuItem from '@mui/material/MenuItem';
import swal from 'sweetalert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import view from "../images/view.jpg";
import  {FormHelperText}  from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';


const Register = (props) => {
	const [Name, setName] = useState('');
	const [Email, setEmail] = useState('');
	const [date, setDate] = useState(null);
	const [Password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
	const [ContactNo, setContactNo] = useState(null);

    const [Status, setStatus] = useState('');

	const [Age, setAge] = useState(null);
	const [BatchName, setBatchName] = useState('');

	const [ShopName, setShopName] = useState('');
	const [OpeningTime, setOpeningTime] = useState(new Date());
	const [ClosingTime, setClosingTime] = useState(new Date());

    const [showPassword, setShowPassword] = useState(false);
    const [showConfPass, setShowConfPass] = useState(false);

    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [ageError, setAgeError] = useState('');
    const [contactError, setContactError] = useState('');

    const handleClickShowConfPass = () => {
        setShowConfPass(!showConfPass);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

	const onChangeUsername = (event) => {
		setName(event.target.value);
	};

	const onChangeEmail = (event) => {

        setEmail(event.target.value);
        if(!String(event.target.value).toLowerCase()
            .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ))
            {
                setEmailError('Invalid Email Id');
            }
	}

    const onChangeDate = (event) => {
        setDate(event.target.value);
    };

    const onChangePassword = (event) => {

        let regularExpression = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/
        
        setPassword(event.target.value);        
        
        if(!String(event.target.value).match(regularExpression)){
            setPasswordError('Please hover to icon for password requirements');
            return;
        }else{
            setPasswordError("");
        }
    };

    const onChangeConfirmPass = (event) => {
        setConfirmPass(event.target.value);
    };

    const onChangeContactNo = (event) => {
        const value = event.target.value;
        setContactNo(value);

        if (value.length == 0) {
            setContactError('Oops! This field is empty!');
          } else if (!/^\d+$/.test(value) || value.length > 10 || value.length < 10) {
            setContactError('Contact number must be numeric and 10 digit long');
          } else {
            setContactError('');
          }
    };

    const [expand, setExpand] = useState(true);

    const onChangeStatus = (event) => {
        setStatus(event.target.value);
        if (expand === true) {
            setHeight(height+250);
            setExpand(false);
            setError('')
        }
    };

    const onChangeAge = (event) => {
        if (event.target.value === "") {
            setAgeError('Please Enter Age');
            setAge(event.target.value);
          }
        else {
            setAgeError('');
            setAge(event.target.value);
        }
    };

    const onChangeBatchName = (event) => {
        setBatchName(event.target.value);
    };

    const onChangeShopName = (event) => {
        setShopName(event.target.value);
    };

    const navigate = useNavigate();

    const [height, setHeight] = useState(650);

    const styles = {
        container: {
          height: '110.4vh',
          backgroundImage: `url(${view})`,
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
        tableContainer: {
          background: 'rgba(0,0,0,0.5)',
          height:"110.4vh",
          width:"100%",
          
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

        },
      };

	const resetInputs = () => {
		setName('');
		setEmail('');
		setDate(null);
        setPassword('');
        setConfirmPass('');
        setContactNo(null);
        setStatus('');
        setAge(null);
        setBatchName('');
        setShopName('');
        setOpeningTime(null);
        setClosingTime(null);
	};

	const onSubmit = (event) => {
		event.preventDefault();
        if (Password === confirmPass) {
            if (Name === '' || Email === '' || Password === '' ) {
                setError("Oops! This fields is empty!")
            }
            if (ContactNo === '' || ContactNo === null || ContactNo === 0 || isNaN(Number(ContactNo))) {
                setContactError("Oops! This field is empty!")
                return;
            }
                
            if (Status === 'Vendor') {
                if (ShopName === '' || OpeningTime === null || ClosingTime === null) {
                    setError("Oops! vendor details are missing")
                    return;
                }

                const newUser = {
                    Name: Name,
                    Email: Email,
                    date: new Date(),
                    Password: Password,
                    ContactNo: ContactNo,
                    userStatus: Status,
                    ShopName: ShopName,
                    OpeningTime: OpeningTime,
                    ClosingTime: ClosingTime
                };
                axios
                    .post('http://localhost:4000/user/register', newUser)
                    .then((response) => {
                        if (response.data === 1) {
                            swal({
                                title: `Could not Register!`, 
                                text: `Account already registered.`, 
                                icon: `error`}).then(() => {
                                    navigate('/login');
                                });

                        }
                        else{
                            swal({
                                title: `Account registered!`, 
                                text: `${response.data.Name} please enter your credentials to login `, 
                                icon: `success`}).then(() => {
                                    navigate('/login');
                                });
                        }
                        
                    })
                    .catch((err) => {
                        if (err){
                            console.log(err) 
                            navigate('/register');
                        }
                                                
                        console.log(err)
                    });
            
            } else {

                if (Age === '') {
                    setAgeError("Age field is empty!")
                    return;
                }
                const newUser = {
                    Name: Name,
                    Email: Email,
                    date: new Date(),
                    Password: Password,
                    ContactNo: ContactNo,
                    userStatus: Status,
                    Age: Age,
                    BatchName: BatchName,
                };
                axios
                    .post('http://localhost:4000/user/register', newUser)
                    .then((response) => {
                        swal('Account registered', response.data.Name + ', please enter your credentials to login.', 'success');
                        navigate('/login');
                    })
                    .catch((err) => console.log(err));

            }
            resetInputs();
        } else {
            setError("Invalid details, Please check confirm password")
        } 
	};

	return (
        <div align={'center'} style={styles.container}>
        <div align={'center'} style={styles.tableContainer}>
        <>

<Box sx={{ display: 'flex' }}>
            <Box
            component="main"
            >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 10, mb: 10 }}>
                <Grid container spacing={2} align={'center'}>
                <Grid item xs={12}>
                <Paper
                    sx={{
                        p: 6,
                        display: 'flex',
                        flexDirection: 'column',
                        height: height,
                        width:500,
                        borderRadius:"20px 20px 20px 20px",
                        boxShadow: '10px 10px 10px 10px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <Grid  align={'center'}>
                        <Grid item spacing={5}>
                        <Typography gutterbottom sx={{ fontSize: '40px', fontWeight: 'bold', mb:1 }}>
                                Register   
                            </Typography>
                        </Grid>
                    </Grid>


            <Grid container align={'center'} spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label='Name'
                        variant='outlined'
                        value={Name}
                        onChange={onChangeUsername}
                        sx={{ width: '80%', height: '60px' }}
                        helperText={<span style={{color: Name.trim().length === 0 ? 'red' : 'inherit'}}>{Name.trim().length === 0 ? error : ' '}</span>}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label='Email'
                        variant='outlined'
                        value={Email}
                        onChange={onChangeEmail}
                        sx={{ width: '80%', height: '60px' }}
                        helperText={[
                            <span key={1} style={{ color: Email.trim().length === 0 ? 'red' : error ? 'red' : 'inherit' }}>
                              {Email.trim().length === 0 ? error : ' '}
                            </span>,
                            <span key={2} style={{ color: !Email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) && emailError ? 'red' : 'inherit' }}>
                              {!Email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) && emailError ? emailError : ' '}
                            </span>
                          ]}
                    />
                </Grid>
                <Grid item xs={12}>
                <FormControl sx={{ m: 1, width: '48ch' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={Password}
                        onChange={onChangePassword}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            {passwordError && (
                                <Box ml={3}>
                        <Tooltip title="Password must contain atleast 1 uppercase, 1 lowercase, 1 number, 1 special character and length should be minimum 8" style={{color:"red"}}>
                        <Alert severity="error" sx={{ border: 0, padding:0, margin: -1 }}/>
                      </Tooltip>
                      </Box>
                        )}
                        </InputAdornment>
                        
                        }
                        label="Password"
                    />
                    
                    
                    {passwordError && (
                    <FormHelperText style={{color : "red"}}>
                        {passwordError}
                    </FormHelperText>
                    )}
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                <FormControl sx={{ m: 1, width: '48ch' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Confirm password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showConfPass ? 'text' : 'password'}
                        value={confirmPass}
                        onChange={onChangeConfirmPass}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfPass}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            >
                            {showConfPass ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        }
                        label="Password"
                    />
                    {!confirmPass && error && (
                    <FormHelperText style={{color : "red"}}>
                        {error}
                    </FormHelperText>
                    )}
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label='Contact Number'
                        variant='outlined'
                        value={ContactNo}
                        onChange={onChangeContactNo}
                        sx={{ width: '80%', height: '60px' }}
                        helperText={contactError ? (
                            <span style={{ color: 'red' }}>
                              {contactError}
                            </span>
                          ) : ''}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        select
                        label='Vendor or Buyer?'
                        value={Status}
                        onChange={onChangeStatus}
                        helperText='Please select your status'
                        sx={{ width: '80%', height: '60px' }}
                        >
                        <MenuItem value={'Vendor'}>Vendor</MenuItem>
                        <MenuItem value={'Buyer'}>Buyer</MenuItem>
                    </TextField>
                </Grid>
                </Grid>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete='off'
                    >
                    <div align={'center'}>
                {Status === 'Vendor' && 
                <>

                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField
                            label='Shop name'
                            variant='outlined'
                            value={ShopName}
                            onChange={onChangeShopName}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <TimePicker 
                                label='Opening time'
                                value={OpeningTime}
                                onChange={(newTime) => {
                                    setOpeningTime(newTime);
                                  }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <TimePicker 
                                label='Closing time'
                                value={ClosingTime}
                                onChange={(newTime) => {
                                    setClosingTime(newTime);
                                  }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                </>
                }
                {Status === 'Buyer' && 
                    <>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField
                            label='Age'
                            variant='outlined'
                            value={Age}
                            onChange={onChangeAge}
                            helperText={ageError ? (
                                <span style={{ color: 'red' }}>
                                  {ageError}
                                </span>
                              ) : (' '
                              )}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField
                            select
                            label='Batch'
                            value={BatchName}
                            onChange={onChangeBatchName}
                            helperText='Please select your batch'
                            >
                            <MenuItem value={'UG1'}>UG1</MenuItem>
                            <MenuItem value={'UG2'}>UG2</MenuItem>
                            <MenuItem value={'UG3'}>UG3</MenuItem>
                            <MenuItem value={'UG4'}>UG4</MenuItem>
                            <MenuItem value={'PG1'}>PG1</MenuItem>
                            <MenuItem value={'PG2'}>PG2</MenuItem>
                        </TextField>
                    </Grid>
                    </>
                }
                    </div>
                </Box>
                <Grid item xs={12} align={'center'} sx={{ mt: 3}}>
                    <Button variant='contained' onClick={onSubmit} sx={{ width: '150px', height: '50px', fontSize: '20px'}} style={{backgroundColor:"black"}}>
                        Register
                    </Button>
                </Grid>
                </Paper>
                </Grid>
                </Grid>
                </Container>
                </Box>
                </Box>
        </>
        </div>
        </div>
	);
};

export default Register;
