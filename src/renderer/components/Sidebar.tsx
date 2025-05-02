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
  selectedItem: Library | null;
  setSelectedItem: (item: Library | null) => void;
}

function Sidebar({
  onRecordClick,
  libraries,
  selectedItem,
  setSelectedItem,
}: SidebarProps) {
  const [sidebarWidth, setSidebarWidth] = useState(150); // Initial width of the sidebar
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      const newWidth = Math.max(100, e.clientX); // Minimum width of 100px
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleItemClick = (item: Library) => {
    setSelectedItem(item);
    onRecordClick(item);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarWidth,
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
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 'bold' }}
            >
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
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)', // Light gray hover effect
                  },
                }}
              >
                <ListItemText
                  primary={item.name}
                  // secondary={`Path: ${item.filePath}`}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        sx={{
          width: '2px',
          cursor: 'col-resize',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          zIndex: 1,
        }}
        onMouseDown={handleMouseDown}
      />
    </Box>
  );
}

export default Sidebar;
