import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Card, CardContent, Chip, Grid,
  FormControl, InputLabel, Select, MenuItem, Pagination, Box
} from '@mui/material';
import { fetchNotifications } from '../api';
import { Log } from '../logger';

export default function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [viewed, setViewed] = useState({});

  useEffect(() => {
    Log("frontend", "info", "page", "AllNotifications page loaded");
    loadNotifications();
  }, [filter, page]);

  const loadNotifications = async () => {
    const data = await fetchNotifications(20, page, filter);
    setNotifications(data);
  };

  const handleView = (id) => {
    setViewed({ ...viewed, [id]: true });
    Log("frontend", "debug", "component", "notification " + id + " viewed");
  };

  const typeColor = { Placement: '#4caf50', Result: '#2196f3', Event: '#ff9800' };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>All Notifications</Typography>
      
      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Filter by Type</InputLabel>
        <Select value={filter} label="Filter by Type" onChange={e => { setFilter(e.target.value); setPage(1); }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </FormControl>

      <Grid container spacing={2}>
        {notifications.map(n => (
          <Grid item xs={12} key={n.ID}>
            <Card
              sx={{ borderLeft: '5px solid ' + typeColor[n.Type], cursor: 'pointer', opacity: viewed[n.ID] ? 0.7 : 1 }}
              onClick={() => handleView(n.ID)}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Chip label={n.Type} size="small" sx={{ bgcolor: typeColor[n.Type], color: 'white', mr: 1 }} />
                    {!viewed[n.ID] && <Chip label="NEW" size="small" color="error" />}
                  </Box>
                  <Typography variant="caption" color="text.secondary">{n.Timestamp}</Typography>
                </Box>
                <Typography variant="body1" sx={{ mt: 1 }}>{n.Message}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Pagination count={5} page={page} onChange={(e, v) => setPage(v)} sx={{ mt: 3, display: 'flex', justifyContent: 'center' }} />
    </Container>
  );
}