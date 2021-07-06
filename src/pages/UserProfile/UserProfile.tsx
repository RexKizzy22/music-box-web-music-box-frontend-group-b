import React, { useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Button,
  Avatar,
  Typography,
  Divider,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  makeStyles,
  Theme,
  createStyles,
  Menu,
  MenuItem,
  ButtonGroup,
} from '@material-ui/core';
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Form from '../../components/Form/Form';

import './changePassword.css';
import './UserProfile.css';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(15),
      height: theme.spacing(15),
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: '#161a1a',
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

interface info {
  oldPassword: string;
  newPassword: string;
}

const UserProfile: React.FC = () => {

  const css = useStyles();

  // States
  const languages = ['English', 'Spanish', 'Russian', 'German'];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState(0);
  const [switchState, setSwitchState] = useState(false);
  const [error, setError] = React.useState('');
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [open, setOpen] = React.useState(false);

  

  // Event handlers
  const handleOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemSelect = (index: number) => {
    setSelectedMenuItem((item) => index);
  };

  const logOut = () => {
    localStorage.removeItem('musicApiUser');
    window.location.reload();
  };

  const changePassword = async (event: any) => {
    try {
      event.preventDefault();

      if (newPassword !== confirmPassword) {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setError('');
        }, 5000);
        return setError('Password Mismatch');
      }

      const data: info = {
        oldPassword,
        newPassword,
      };

      const userToken = localStorage.getItem('Token');
      const userId = localStorage.getItem('userId');
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };

      await axios.put(`https://music-box-b.herokuapp.com/api/v1/music-box-api/change-password/${userId}`, data, config);

      setTimeout(
        () => setOpen(false),
        2000
      );
    } catch (error) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  return (
    <>
      <div className='div-container'>
        <div className='profile-header'>
          <div className='profile-grid'>
            <Grid item>
              <Avatar className={css.large} />
            </Grid>
            <button className='premium-btn'>go to premium</button>
          </div>
        </div>
        <Typography className='sub-head' style={{ fontWeight: 'bold' }} gutterBottom>
          Contact
        </Typography>

        {/* Form Section*/}
        <Form />

        {/* Social Login Section*/}
        <div className='social-login'>
          <Grid className='social' container justify='space-between' alignItems='center'>
            <Typography>Facebook</Typography>
            <Typography className='social-text' color='textSecondary'>
              Not connected
            </Typography>
          </Grid>

          <Grid className='social' container justify='space-between' alignItems='center'>
            <Typography>Google</Typography>
            <Typography className='social-text' color='textSecondary'>
              Not connected
            </Typography>
          </Grid>
        </div>
        {/* Streaming Section Begins */}
        <section className='streaming-section section'>
          <Typography style={{ fontWeight: 'bold' }} className='streaming' variant='h6'>
            Streaming
          </Typography>
          <Typography variant='body1'>Audio Quality (Premium Features)</Typography>

          <hr className='divider' />

          <FormControl component='fieldset'>
            <RadioGroup aria-label='gender' name='gender1'>
              <FormControlLabel className='radio' value='female' control={<Radio />} label='Normal(128 kb/s)' />
              <FormControlLabel className='radio' value='male' control={<Radio />} label='High ()' />
              <FormControlLabel className='radio' value='other' control={<Radio />} label='Medium()' />
            </RadioGroup>
          </FormControl>

          <hr className='divider' />
        </section>
        {/* Streaming Section ends */}
        <Divider />
        {/* Account Section begins */}
        <section className='account-section section'>
          <Typography style={{ fontWeight: 'bold' }} className='sub-head' gutterBottom variant='h6'>
            Account
          </Typography>

          <div className='list-items'>
            <List className='list'>
              <ListItem className='account-list-item'>
                <ListItemText id='switch-list-label-wifi' primary='Enable Browser Notification' />
                <ListItemSecondaryAction className='switch'>
                  <Switch
                    edge='end'
                    checked={switchState}
                    className='color'
                    onChange={({ target }) => setSwitchState((state) => target.checked as boolean)}
                    color='default'
                    inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem className='account-list-item'>
                <ListItemText id='switch-list-label-wifi' primary='Language' />
                <ListItemSecondaryAction>
                  <ButtonGroup variant='text' size='small'>
                    <Button
                      aria-controls='simple-menu'
                      aria-haspopup='true'
                      onClick={handleClick}
                      endIcon={<KeyboardArrowDownOutlinedIcon style={{ color: 'white' }} />}
                      size='small'
                    >
                      <Typography variant='body2' style={{ color: 'white' }}>
                        {languages[selectedMenuItem]}
                      </Typography>
                    </Button>

                    <Menu
                      id='simple-menu'
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      {languages.map((language, index) => (
                        <MenuItem
                          onClick={() => {
                            handleClose();
                            handleMenuItemSelect(index);
                          }}
                        >
                          {language}
                        </MenuItem>
                      ))}
                    </Menu>
                  </ButtonGroup>
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem className='account-list-item'>
                <ListItemText
                  onClick={handleOpen}
                  className='change-password'
                  id='switch-list-label-wifi'
                  primary='Change Password'
                />
              </ListItem>

              <ListItem className='account-list-item'>
                <ListItemText id='switch-list-label-wifi' primary='Add New Account' />
              </ListItem>

              <ListItem className='account-list-item privacy'>
                <ListItemText id='switch-list-label-wifi' primary='Terms & Conditions' />
              </ListItem>

              <ListItem className='account-list-item privacy'>
                <ListItemText id='switch-list-label-wifi' primary='Privacy' />
              </ListItem>

              <ListItem className='account-list-item privacy'>
                <ListItemText id='switch-list-label-wifi' primary='Support' />
              </ListItem>
            </List>
          </div>
        </section>
        {/* Account Section ends */}

        {/* Modal */}
        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={css.modal}
        open={open}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={css.paper}>
              <form className='form1' onSubmit={changePassword}>
              {error && <span className='error-message'>{error}​ </span>}​
              <div>Change Password</div>
              <div className='contentWrap'>
                <span>
                  <label>Old Password</label>
                  <br />
                  <input
                    type='password'
                    placeholder=''
                    className='title'
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </span>

                <br />
                <div className='genreCat'>
                  <span>
                    <label>New Password</label>
                    <br />
                    <input
                      type='password'
                      className='title'
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </span>
                </div>
                <br />
                <div className='genreCat'>
                  <span>
                    <label>Confirm New Password</label>
                    <br />
                    <input
                      type='password'
                      className='title'
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </span>
                </div>
                <br />
                <span className='btnContainer'>
                  <button
                    className='cancelBtn'
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button type='submit' className='createBtn'>
                    Submit
                  </button>
                </span>
              </div>
            </form>
          </div>
        </Fade>
      </Modal>

        <div className='container'>
          <Button onClick={logOut} className='button log-out' variant='outlined' disableElevation>
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
