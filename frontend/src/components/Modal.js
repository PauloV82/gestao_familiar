import React from 'react'
import '../App.css';
import { Link } from 'react-router-dom';

export default function Modal({isOpen, setModalOpen, children, title}) {
  
  if (isOpen) {
    return (
     <div className='ModalBackgrond'>
        <div className='Modal'>
            <div>
              <div className='ExitBnt'><Link onClick={setModalOpen}><i class="fa-solid fa-xmark"></i></Link></div>

              <h1>{title}</h1>
                {children}
            </div>
        </div>
     </div>
    )
  } return null;
}