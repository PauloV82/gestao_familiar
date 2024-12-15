import React from 'react'
import '../StyleDashboard.css'

export default function ModalDashboard({isOpen, setModalOpen, children, title}) {
  
  if (isOpen) {
    return (
     <div className='ModalBackgrond1'>
        <div className='Modal1'>
            <div>
              <h1>{title}</h1>
                {children}
            </div>
        </div>
     </div>
    )
  } return null;
}