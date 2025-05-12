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
            top: '64px', // Offset to place below the top bar (height of the AppBar)
          },
        }}
      >
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              margin: 1.75,
            }}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{ fontWeight: 'bold' }}
            >
              Libraries
            </Typography>
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
                    backgroundColor: 'var(--hover-color)',
                  },
                }}
              >
                <ListItemText primary={item.name} />
              </ListItemButton>
            ))}
          </List>
          {!(libraries && libraries.length) && (
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                marginTop: 2,
                color: 'var(--highlight-color)',
              }}
            >
              Open or Create a Library
            </Typography>
          )}
        </Box>
      </Drawer>
      <Box
        sx={{
          width: '2px',
          cursor: 'col-resize',
          backgroundColor: 'var(--hover-color)',
          zIndex: 1,
        }}
        onMouseDown={handleMouseDown}
      />
    </Box>
  );
}

export default Sidebar;
