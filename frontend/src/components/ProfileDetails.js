//hooks
import { useState } from "react";
//utils
import { updateUserDetails } from "../utils/usersAPI";
//material-ui components
import { Box, Typography, Button, Divider, IconButton, Dialog, DialogTitle,
  DialogContent, TextField} from "@mui/material";
//icons
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
//stylesheet
import "../stylesheets/ProfileDetails.scss";

const ProfileDetails = ({ userDetails }) => {
  const [detailsModal, setDetailsModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({
    firstName: userDetails.firstName,
    username: userDetails.username,
    surname: userDetails.surname,
  });
  //General details handlers
  const detailsClose = () => {
    setDetailsModal(false);
    setUpdatedDetails({
      firstName: userDetails.firstName,
      username: userDetails.username,
      surname: userDetails.surname,
    });
  };

  const detailsSubmit = async (e) => {
    e.preventDefault();
    for(let field in updatedDetails){
      if(!updatedDetails[field]){
        updatedDetails[field] = userDetails[field];
      }
    }
    let response = await updateUserDetails("general", updatedDetails);
    //if request was successfull reload page;
    if(response.request){
      setDetailsModal(false);
      window.location.reload();
    }
  };

  //Email handlers
  //Password handlers

  if (!userDetails) {
    return <h1>Loading</h1>;
  }
  return (
    <Box className="main-container">
      <Typography variant="h3" className="main-header">
        Personal Details
      </Typography>
      <Typography variant="p" className="sub-header">
        View and update your details right here. Manage your login options and
        passwords here.
      </Typography>
      <Divider className="divider" />
      <Box style={{ display: "flex" }}>
        <Box style={{ marginRight: "40px" }}>
          <Typography>Username</Typography>
          <Typography>{userDetails.username}</Typography>
        </Box>
        <Box>
          <Typography>Name</Typography>
          <Typography>
            {userDetails.firstName} {userDetails.surname}
          </Typography>
        </Box>
        <IconButton onClick={() => setDetailsModal(true)}>
          <EditOutlinedIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box>
        <Typography>Email</Typography>
        <Typography>{userDetails.email}</Typography>
        <IconButton onClick={() => setEmailModal(true)}>
          <EditOutlinedIcon />
        </IconButton>
      </Box>

      <Divider />
      <Box style={{ display: "flex" }}>
        <Typography>Password</Typography>
        <IconButton onClick={() => setPasswordModal(true)}>
          <EditOutlinedIcon />
        </IconButton>
      </Box>
      {/* modals */}
      {/* personal details modal */}
      <Dialog
        open={detailsModal}
        onClose={detailsClose}
        onSubmit={detailsSubmit}
        component="form"
      >
        <DialogTitle>Personal Details</DialogTitle>
        <DialogContent>Changing your details</DialogContent>
        <TextField
          defaultValue={userDetails.username}
          onChange={(e) => setUpdatedDetails({ ...updatedDetails, username: e.target.value })}
          label="Username"
        />
        <TextField 
          defaultValue={userDetails.firstName} 
          onChange={(e) => setUpdatedDetails({ ...updatedDetails, firstName: e.target.value })}
          label="First Name"
          />
        <TextField 
          defaultValue={userDetails.surname} 
          onChange={(e) => setUpdatedDetails({ ...updatedDetails, surname: e.target.value })}
          label="Surname"
          />
        <Box>
          <Button onClick={detailsClose}>Cancel</Button>
          <Button type="submit">Update</Button>
        </Box>
      </Dialog>
      {/* email modal */}
      <Dialog open={emailModal} onClose={() => setEmailModal(false)}>
        <DialogTitle>Change your email</DialogTitle>
        <DialogContent></DialogContent>
        <TextField
          defaultValue={userDetails.email}
          disabled
          label="Current Email"
        />
        <TextField placeholder="please type your new email" label="New Email" />
        <Box>
          <Button onClick={() => setEmailModal(false)}>Cancel</Button>
          <Button>Update</Button>
        </Box>
      </Dialog>
      {/* password modal */}
      <Dialog open={passwordModal} onClose={() => setPasswordModal(false)}>
        <DialogTitle>Changing your password</DialogTitle>
        <TextField label="Current " />
        <TextField label="New " />
        <TextField label="Re-type new " />
        <Box>
          <Button onClick={() => setPasswordModal(false)}>Cancel</Button>
          <Button>Update</Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default ProfileDetails;
