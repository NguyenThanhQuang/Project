import React, { useState } from 'react';
import { 
  Button, 
  Box, 
  TextField, 
  Typography, 
  Alert,
  CircularProgress,
  Paper 
} from '@mui/material';
import { tripApi, authApi } from '../services/api';

const TestApiConnection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const testConnection = async () => {
    setLoading(true);
    setError('');
    setResult('');
    
    try {
      // Test basic API connection
      const trips = await tripApi.getTrips();
      setResult(`Kết nối thành công! Tìm thấy ${trips.length} chuyến đi.`);
    } catch (err: any) {
      setError(`Lỗi kết nối: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setError('');
    setResult('');
    
    try {
      // Test auth endpoint (this will likely fail without proper setup)
      const response = await authApi.login({
        email: 'test@example.com',
        password: 'password123'
      });
      setResult('Đăng nhập thành công!');
    } catch (err: any) {
      // This is expected to fail, but shows API is responding
      if (err.message.includes('401') || err.message.includes('400')) {
        setResult('API Auth hoạt động (nhưng thông tin đăng nhập không đúng - điều này bình thường)');
      } else {
        setError(`Lỗi kết nối Auth: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2, maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Test API Connection
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={testConnection} 
          disabled={loading}
        >
          Test Trips API
        </Button>
        <Button 
          variant="outlined" 
          onClick={testLogin} 
          disabled={loading}
        >
          Test Auth API
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <CircularProgress size={20} />
          <Typography>Đang kiểm tra kết nối...</Typography>
        </Box>
      )}

      {result && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {result}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary">
        Backend URL: http://localhost:3000/api
      </Typography>
    </Paper>
  );
};

export default TestApiConnection;
