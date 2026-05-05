import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Card, CardContent, Chip, Grid,
  FormControl, InputLabel, Select, MenuItem, Box
} from '@mui/material';
import { fetchNotifications, getTopN } from '../api';
import { Log } from '../logger';

export default function PriorityInbox() {
  const [topNotifications, setTopNotifications] = useState([]);
  const [count, setCount] = useState(10);
  const [filter, setFilter] = useState('');
  const [viewed, setViewed] = useState({});

  useEffect(() => {
    Log("frontend", "info", "page", "PriorityInbox page loaded");
    loadPriority();
  }, [count, filter]);

  const loadPriority = async () => {
    const data = await fetchNotifications(50, 1, filter);
    const top = getTopN(data, count);
    setTopNotifications(top);
    Log("frontend", "info", "page", "top " + count + " priority notifications loaded");
  };

  const handleView = (id) => {
    setViewed({ ...viewed, [id]: true });
  };

  const typeColor = { Placement: '#4caf50', Result: '#2196f3', Event: '#ff9800' };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Priority Inbox</Typography>

      <Box display="flex" gap={2} mb={3}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Show Top</InputLabel>
          <Select value={count} label="Show Top" onChange={e => setCount(e.target.value)}>
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={15}>Top 15</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Filter Type</InputLabel>
          <Select value={filter} label="Filter Type" onChange={e => setFilter(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        {topNotifications.map((n, index) => (
          <Grid item xs={12} key={n.ID}>
            <Card
              sx={{ borderLeft: '5px solid ' + typeColor[n.Type], cursor: 'pointer', opacity: viewed[n.ID] ? 0.7 : 1 }}
              onClick={() => handleView(n.ID)}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Chip label={'#' + (index + 1)} size="small" sx={{ mr: 1 }} />
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
    </Container>
  );
}