import React from 'react';
import '../StyleDashboard.css';

export default function ModalHome({ isOpen, setModalOpen, children, title }) {
  if (isOpen) {
    return (
      <div className='ModalBackgrond2'>
        <div className='Modal2'>
          <div>
                <button className='ExitBnt'onClick={setModalOpen}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
            <h1>{title}</h1>
            {children}
          </div>
        </div>
      </div>
    );
  }
  return null;
}