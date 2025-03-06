import React from 'react';
import './styles.css';

// interface Library {
//   id: number;
//   name: string;
// }

const libraries = [
  { id: 1, name: 'Library 1' },
  { id: 2, name: 'Library 2' },
];

function Sidebar() {
  return (
    <div className="sidebar">
      {libraries.map((library) => (
        <div key={library.id} className="sidebar-row">
          {library.name}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
