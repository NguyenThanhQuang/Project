import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface AdminActionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  contentText: string;
  confirmButtonText?: string;
  confirmButtonColor?:
    | "primary"
    | "secondary"
    | "error"
    | "success"
    | "info"
    | "warning";
}

const AdminActionDialog: React.FC<AdminActionDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  contentText,
  confirmButtonText = "Xác nhận",
  confirmButtonColor = "primary",
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{contentText}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          onClick={onConfirm}
          color={confirmButtonColor}
          variant="contained"
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminActionDialog;
