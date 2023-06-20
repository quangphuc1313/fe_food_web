import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Modal,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import userApi from "../../../../api/userApi";
import Toast from "../../../common/Toast";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { setAdminUpdateModal } from "../../../../redux/reducers/modalReducer";
import { setAllUser } from "../../../../redux/reducers/userReducer";

const UpdateModal = () => {
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [emailErrText, setEmailErrText] = useState("");
  const [passwordErrText, setPasswordErrText] = useState("");
  const [confirmPasswordErrText, setConfirmPasswordErrText] = useState("");
  const [phoneErrText, setPhoneErrText] = useState("");
  const [role, setRole] = useState(undefined);

  const [selected, setSelected] = useState({});
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal.adminUpdateModal);

  const data = {
    _id: modal.data._id,
    fullname: fullname || modal.data.fullname,
    password: password || modal.data.password,
    confirmPassword: confirmPassword || modal.data.password,
    email: email.toLowerCase() || modal.data.email,
    phone: phone || modal.data.phone,
    permission: role,
  };

  const handleChange = (e) => {
    if (e.target.value) {
      setRole(1);
    } else {
      setRole(0);
    }
  };

  const handleEdit = () => {
    setDisable(!disable);
    setLoading(false);
  };
  const handleClose = () => {
    dispatch(setAdminUpdateModal({ type: false, data: {} }));
    setDisable(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const [, users] = await Promise.all([
        userApi.update(data),
        userApi.getAll(),
      ]);
      dispatch(setAllUser(users));
      setEmailErrText("");
      setPhoneErrText("");
      setPasswordErrText("");
      setLoading(false);
      setDisable(true);
      setSelected([]);
      Toast("success", "Edit successfully 👌");
    } catch (error) {
      const errors = error.data.errors;
      errors.forEach((e) => {
        switch (e.param) {
          case "phone":
            setPhoneErrText(e.msg);
            break;
          case "email":
            setEmailErrText(e.msg);
            break;
          case "password":
            setPasswordErrText(e.msg);
            break;
          case "confirmPassword":
            setConfirmPasswordErrText(e.msg);
            break;
          default:
            break;
        }
      });
    } finally {
      setLoading(false);
      setDisable(true);
    }
  };

  return (
    <div>
      <Modal open={modal.type} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            margin: "1rem auto",
            width: "500px",
            padding: "1.5rem 3rem",
            border: "2px solid #11568C",
            borderRadius: "10px",
            textAlign: "center",
          }}
          onSubmit={handleSubmit}
          component="form"
          mt={1}
          noValidate
        >
          <Avatar
            src={modal.data.image}
            sx={{ width: 80, height: 80, margin: "1rem auto" }}
          />
          <h1 style={{ margin: "0 auto" }}>
            {modal.data.permission === 0 ? "Admin" : "User"}{" "}
            {modal.data.fullname}
          </h1>
          <TextField
            variant="outlined"
            label="Fullname"
            name="fullname"
            id="fullname"
            defaultValue={modal.data.fullname}
            onChange={(e) => setFullname(e.target.value)}
            fullWidth
            margin="normal"
            disabled={disable}
          />
          <TextField
            variant="outlined"
            label="Email"
            name="email"
            id="email"
            type={"email"}
            defaultValue={modal.data.email || ""}
            fullWidth
            margin="normal"
            disabled={disable}
            error={emailErrText !== ""}
            helperText={emailErrText}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            label="PhoneNumber"
            name="phone"
            id="phone"
            defaultValue={modal.data.phone}
            fullWidth
            margin="normal"
            disabled={true}
            error={phoneErrText !== ""}
            helperText={phoneErrText}
            onChange={(e) => setPhone(e.target.value)}
          />
          {/* <TextField
            variant="outlined"
            label="password"
            name="password"
            id="password"
            defaultValue={modal.data.password}
            fullWidth
            margin="normal"
            disabled={disable}
            error={passwordErrText !== ""}
            helperText={passwordErrText}
            onChange={(e) => setPassword(e.target.value)}
          /> */}
          {/* <TextField
            sx={disable ? { display: "none" } : {}}
            variant="outlined"
            label="ConfirmPassword"
            name="confirmPassword"
            id="confirmPassword"
            defaultValue={modal.data.password}
            fullWidth
            margin="normal"
            error={confirmPasswordErrText !== ""}
            helperText={confirmPasswordErrText}
            onChange={(e) => setConfirmPassword(e.target.value)}
          /> */}

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue={modal.data.permission}
              disabled={disable}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value={1}>User</MenuItem>
              <MenuItem value={0}>Admin</MenuItem>
            </Select>
          </FormControl>

          <Button
            fullWidth
            color={disable ? "secondary" : "warning"}
            variant="outlined"
            onClick={handleEdit}
            sx={{ mt: 1 }}
          >
            {disable ? "Edit" : "Cancel"}
          </Button>
          <LoadingButton
            sx={disable ? { display: "none" } : { mt: 2 }}
            fullWidth
            variant="outlined"
            type="submit"
            disabled={disable}
            loading={loading}
          >
            Save
          </LoadingButton>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateModal;
