import React from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
} from "@mui/material";
import { LocationOn, AccessTime, Close } from "@mui/icons-material";
import type { FrontendRouteStop } from "../../../../types";

interface RouteStepperModalProps {
  open: boolean;
  onClose: () => void;
  routeStops: FrontendRouteStop[];
}

export const RouteStepperModal: React.FC<RouteStepperModalProps> = ({
  open,
  onClose,
  routeStops,
}) => {
  // Xác định điểm dừng cuối cùng
  const terminalStop = routeStops[routeStops.length - 1];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Lộ trình chi tiết
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stepper orientation="vertical">
          {routeStops.map((stop, index) => (
            <Step key={stop.id} active>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor:
                        index === 0 || stop.id === terminalStop.id
                          ? "primary.main"
                          : "secondary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {index === 0 || stop.id === terminalStop.id ? (
                      <LocationOn sx={{ fontSize: 18, color: "white" }} />
                    ) : (
                      <AccessTime sx={{ fontSize: 18, color: "white" }} />
                    )}
                  </Box>
                )}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {stop.name}
                </Typography>
              </StepLabel>
              <StepContent>
                <Box
                  sx={{
                    pl: 2,
                    borderLeft: "1px solid",
                    borderColor: "divider",
                    ml: 1.9,
                    pb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Dự kiến đến: {stop.arrivalTime}
                  </Typography>
                  {stop.departureTime && (
                    <Typography variant="body2" color="text.secondary">
                      Dự kiến khởi hành: {stop.departureTime}
                    </Typography>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>
    </Dialog>
  );
};
