import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
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
  // onSave nhận thêm companyId (optional)
  onSave: (
    companyData: CreateCompanyPayload | Partial<CreateCompanyPayload>,
    companyId?: string
  ) => void;
  // Prop mới để truyền dữ liệu nhà xe cần sửa
  companyToEdit?: CompanyWithStats | null;
}

const initialCompanyState: CreateCompanyPayload = {
  name: "",
  code: "",
  email: "",
  phone: "",
  address: "",
  status: "active",
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string>("");

  const isEditMode = !!companyToEdit;

  useEffect(() => {
    if (open) {
      if (isEditMode && companyToEdit) {
        // Nếu là chế độ sửa, điền form với dữ liệu có sẵn
        setCompanyData({
          name: companyToEdit.name,
          code: companyToEdit.code,
          email: companyToEdit.email,
          phone: companyToEdit.phone,
          address: companyToEdit.address,
          status: companyToEdit.status,
        });
      } else {
        // Nếu là chế độ thêm mới, reset form
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
      !companyData.email ||
      !companyData.phone
    ) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }
    setError("");
    // Gọi onSave với id nếu là chế độ sửa
    onSave(companyData, companyToEdit?._id);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? "Chỉnh sửa nhà xe" : "Thêm nhà xe mới"}
      </DialogTitle>
      <DialogContent>
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
