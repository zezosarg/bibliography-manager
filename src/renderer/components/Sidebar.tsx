import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import Library from '../../main/model/Library';

interface SidebarProps {
  onRecordClick: (item: Library) => void;
  libraries: Library[];
}

function Sidebar({ onRecordClick, libraries }: SidebarProps) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          // position: 'relative',
          top: '64px', // Offset to place below the top bar (height of the AppBar)
        },
      }}
    >
      <Box sx={{ padding: 1 }}>
        <Typography variant="h6" component="div" sx={{ marginTop: 1 }}>
          Libraries
        </Typography>
        <List>
          {libraries.map((item) => (
            <ListItem
              key={item.name}
              divider
              onClick={() => onRecordClick(item)}
            >
              <ListItemText
                primary={item.name}
                // secondary={`Age: ${item.age}, Job: ${item.job}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
