import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Divider,
  // FormControl,
  // InputLabel,
  // Select,
  // MenuItem,
  // Alert,
} from "@mui/material";
import type { CompanyWithStats, CreateCompanyPayload } from "../types/company";
import type { SelectChangeEvent } from "@mui/material";

interface AddCompanyDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (
    companyData: CreateCompanyPayload | Partial<CreateCompanyPayload>,
    companyId?: string
  ) => void;
  companyToEdit?: CompanyWithStats | null;
}

const initialCompanyState: CreateCompanyPayload = {
  name: "",
  code: "",
  email: "",
  phone: "",
  address: "",
  status: "active",
  adminName: "",
  adminEmail: "",
  adminPhone: "",
};

const AddCompanyDialog: React.FC<AddCompanyDialogProps> = ({
  open,
  onClose,
  onSave,
  companyToEdit,
}) => {
  const [companyData, setCompanyData] = useState<
    CreateCompanyPayload | Partial<CreateCompanyPayload>
  >(initialCompanyState);
  const [error, setError] = useState<string>("");

  const isEditMode = !!companyToEdit;

  useEffect(() => {
    if (open) {
      if (isEditMode && companyToEdit) {
        setCompanyData({
          name: companyToEdit.name,
          code: companyToEdit.code,
          email: companyToEdit.email,
          phone: companyToEdit.phone,
          address: companyToEdit.address,
          status: companyToEdit.status,
        });
      } else {
        setCompanyData(initialCompanyState);
      }
      setError("");
    }
  }, [open, isEditMode, companyToEdit]);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const { name, value } = event.target;
    if (name) {
      setCompanyData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    if (
      !companyData.name ||
      !companyData.code ||
      !companyData.adminName ||
      !companyData.adminEmail ||
      !companyData.adminPhone
    ) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }
    setError("");
    onSave(companyData, companyToEdit?._id);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? "Chỉnh sửa nhà xe" : "Thêm nhà xe mới"}
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" sx={{ mb: 2, mt: 1 }}>
          Thông tin nhà xe
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Tên nhà xe"
              name="name"
              value={companyData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Mã nhà xe"
              name="code"
              value={companyData.code}
              onChange={handleChange}
              required
              helperText="Mã không dấu, viết hoa, không khoảng trắng. VD: PHUONGTRANG"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={companyData.email}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Số điện thoại"
              name="phone"
              value={companyData.phone}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Địa chỉ"
              name="address"
              value={companyData.address}
              onChange={handleChange}
            />
          </Grid>
          {/* <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="status"
                value={companyData.status}
                label="Trạng thái"
                onChange={handleChange}
              >
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="pending">Chờ duyệt</MenuItem>
                <MenuItem value="suspended">Tạm ngưng</MenuItem>
              </Select>
            </FormControl>
          </Grid> */}
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Thông tin tài khoản Quản trị viên
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Tên Quản trị viên nhà xe"
              name="adminName"
              value={companyData.adminName || ""}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Email Quản trị viên nhà xe"
              name="adminEmail"
              type="email"
              value={companyData.adminEmail || ""}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="SĐT Quản trị viên nhà xe"
              name="adminPhone"
              value={companyData.adminPhone || ""}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSave} variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCompanyDialog;
