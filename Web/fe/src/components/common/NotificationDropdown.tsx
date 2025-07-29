import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Avatar,
  Divider,
  Button,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Notifications,
  NotificationsNone,
  Circle,
  Warning,
  Info,
  CheckCircle,
  Error,
  DirectionsBus,
  Person,
  MonetizationOn,
  Settings,
  MarkEmailRead,
  DeleteOutline,
} from '@mui/icons-material';

import type { NotificationItem } from '../../types/notification';

export type { NotificationItem };

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showAll, setShowAll] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const displayNotifications = showAll ? notifications : notifications.slice(0, 5);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowAll(false);
  };

  const getNotificationIcon = (type: string, category: string) => {
    if (type === 'error') return <Error color="error" />;
    if (type === 'warning') return <Warning color="warning" />;
    if (type === 'success') return <CheckCircle color="success" />;
    
    switch (category) {
      case 'company':
        return <DirectionsBus color="primary" />;
      case 'user':
        return <Person color="info" />;
      case 'finance':
        return <MonetizationOn color="warning" />;
      case 'system':
        return <Settings color="action" />;
      default:
        return <Info color="info" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'error':
        return '#ffebee';
      case 'warning':
        return '#fff3e0';
      case 'success':
        return '#e8f5e8';
      default:
        return '#e3f2fd';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <>
      <IconButton onClick={handleOpen} color="inherit">
        <Badge badgeContent={unreadCount} color="error">
          {unreadCount > 0 ? <Notifications /> : <NotificationsNone />}
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 600,
            borderRadius: 3,
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            '& .MuiMenuItem-root': {
              whiteSpace: 'normal',
              height: 'auto',
              padding: 0,
            },
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Thông báo
            </Typography>
            <Chip
              label={`${unreadCount} chưa đọc`}
              size="small"
              color={unreadCount > 0 ? 'error' : 'default'}
              sx={{ fontWeight: 600 }}
            />
          </Box>
          
          {unreadCount > 0 && (
            <Button
              size="small"
              startIcon={<MarkEmailRead />}
              onClick={onMarkAllAsRead}
              sx={{ textTransform: 'none' }}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </Box>

        {/* Notification List */}
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {displayNotifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <NotificationsNone sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Không có thông báo mới
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {displayNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      bgcolor: notification.isRead ? 'transparent' : getNotificationColor(notification.type),
                      '&:hover': {
                        bgcolor: notification.isRead ? 'grey.50' : getNotificationColor(notification.type),
                      },
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'transparent', color: 'inherit' }}>
                        {getNotificationIcon(notification.type, notification.category)}
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {notification.title}
                          </Typography>
                          {!notification.isRead && (
                            <Circle sx={{ fontSize: 8, color: 'primary.main' }} />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(notification.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                    
                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNotification(notification.id);
                        }}
                        sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  {index < displayNotifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        {notifications.length > 5 && (
          <Box sx={{ p: 1, borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
            <Button
              size="small"
              onClick={() => setShowAll(!showAll)}
              sx={{ textTransform: 'none' }}
            >
              {showAll ? 'Thu gọn' : `Xem thêm ${notifications.length - 5} thông báo`}
            </Button>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationDropdown; 