import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

const listData = [
  { id: 1, name: 'John Doe', age: 28, job: 'Developer' },
  { id: 2, name: 'Jane Smith', age: 34, job: 'Designer' },
  { id: 3, name: 'Emily Johnson', age: 24, job: 'Product Manager' },
  { id: 4, name: 'Michael Brown', age: 30, job: 'Developer' },
];

interface SidebarProps {
  onRecordClick: (item: {
    id: number;
    name: string;
    age: number;
    job: string;
  }) => void;
}

function Sidebar({ onRecordClick }: SidebarProps) {
  return (
    <Drawer
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" component="div" sx={{ marginTop: 4 }}>
          User List
        </Typography>
        <List>
          {listData.map((item) => (
            <ListItem key={item.id} divider onClick={() => onRecordClick(item)}>
              <ListItemText
                primary={item.name}
                secondary={`Age: ${item.age}, Job: ${item.job}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
