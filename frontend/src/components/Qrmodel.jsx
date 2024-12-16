import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog({ qrHandler, handleClose, open, qr }) {
  return (
    <div>
      <Button variant="outlined" onClick={qrHandler}>
        Open alert dialog
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"QR CODE"}</DialogTitle>
        <DialogContent>
          <img src={qr} alt="Red dot" style={{ width: "250px" }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="text">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
