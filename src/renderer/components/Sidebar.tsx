import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const tableData = [
  { id: 1, name: 'John Doe', age: 28, job: 'Developer' },
  { id: 2, name: 'Jane Smith', age: 34, job: 'Designer' },
  { id: 3, name: 'Emily Johnson', age: 24, job: 'Product Manager' },
  { id: 4, name: 'Michael Brown', age: 30, job: 'Developer' }
];

const listData = [
  { id: 1, name: 'John Doe', age: 28, job: 'Developer' },
  { id: 2, name: 'Jane Smith', age: 34, job: 'Designer' },
  { id: 3, name: 'Emily Johnson', age: 24, job: 'Product Manager' },
  { id: 4, name: 'Michael Brown', age: 30, job: 'Developer' }
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
        <Typography variant="h6" component="div" gutterBottom>
          Sidebar
        </Typography>
        <List>
          {/* <ListItem button>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Profile" />
          </ListItem> */}
        </List>

        <Typography variant="h6" component="div" sx={{ marginTop: 4 }}>
          Data Table
        </Typography>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Job</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>{row.job}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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
