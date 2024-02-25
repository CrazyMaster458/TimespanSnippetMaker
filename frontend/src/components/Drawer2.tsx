// import './Drawer.css'; // Create a corresponding CSS file for styling

export const Drawer2 = ({ isOpen, onClose, children }) => {
  return (
    <div className={`drawer ${isOpen ? 'open' : ''}`}>
      <div className="drawer-content">
        {children}
      </div>
      <div className="drawer-overlay" onClick={onClose}></div>
    </div>
  );
};