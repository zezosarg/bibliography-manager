import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  // Divider,
} from '@mui/material';
import Library from '../../main/model/Library';

interface SidebarProps {
  onRecordClick: (item: Library) => void;
  libraries: Library[];
}

function Sidebar({ onRecordClick, libraries }: SidebarProps) {
  const [selectedItem, setSelectedItem] = useState<Library | null>(null);

  const handleItemClick = (item: Library) => {
    setSelectedItem(item);
    onRecordClick(item);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 150,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 150,
          boxSizing: 'border-box',
          // position: 'relative',
          top: '64px', // Offset to place below the top bar (height of the AppBar)
        },
      }}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            // justifyContent: 'center', // 'space-between',
            alignItems: 'center',
            margin: 1,
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Libraries
          </Typography>
          {/* <Button variant="contained" size="small">
            Add Library
          </Button> */}
        </Box>
        {/* <Divider /> */}
        <List>
          {libraries.map((item) => (
            <ListItemButton
              key={item.name}
              divider
              onClick={() => handleItemClick(item)}
              selected={selectedItem === item}
            >
              <ListItemText
                primary={item.name}
                //  secondary={`Age: ${item.age}, Job: ${item.job}`}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
