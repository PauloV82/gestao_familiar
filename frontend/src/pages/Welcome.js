import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import Login from './Login';
import Register from './Register';

const Welcome = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalR, setOpenModalR] = useState(false);

  return (
    <div className="Welcome">
      <div className="Navbar container-fluid d-flex">
        <div className="Icon">
            <Link to="/"><img src="icon.png" alt="Logo" /></Link>
            <h1>CONTROL COINS</h1>
        </div>
        <div className='Opt'>
            <div>
                <button id='LinkLogin' onClick={() => setOpenModal(true)}>Login</button>
            </div>
            <Modal title={'Login'} isOpen={openModal} setModalOpen={() => setOpenModal(!openModal)}>
            <Login/>
            </Modal>
            <div>
                <button className='bnt' onClick={() => setOpenModalR(true)}>Começe Já!</button>
                <Modal title={'Cadastre-se'} isOpen={openModalR} setModalOpen={() => setOpenModalR(!openModalR)}>
                    <Register/>
                </Modal>
            </div>
        </div>
    </div>

      <img src="/carrosel.png" alt="Carrossel" className="Carousel" />
      <div className="Section">
        <img src="phoneBanner.png" alt="App no celular" />
        <div className="CardBox">
          <h1>A solução para um controle financeiro de sucesso</h1>
          <div className="Card">
            <div className="number"><h2>1</h2></div>
            <h3>Cadastre todos os seus gastos</h3>
            <p>Mantenha tudo sob controle cadastrando suas contas e despesas organizadas por categorias.</p>
          </div>
          <div className="Card">
            <div className="number"><h2>2</h2></div>
            <h3>Saiba o destino de cada centavo</h3>
            <p>Informe sua renda e ganhos extras para ter previsibilidade financeira e tomar decisões inteligentes.</p>
          </div>
          <div className="Card">
            <div className="number"><h2>3</h2></div>
            <h3>Transforme controle financeiro em hábito</h3>
            <p>Lance os gastos do dia a dia, acompanhe os relatórios e assuma o total controle das finanças.</p>
          </div>
          <div className="Card">
            <div className="number"><h2>4</h2></div>
            <h3>Impressão e Compartilhamento</h3>
            <p>Gere PDFs para Impressão ou compartilhe com amigos e familiares.</p>
          </div>
        </div>
        </div>
      <footer>
        <div className="Barr progress mx-5 px-5 my-4">
          <div className="barr mx-5"></div>
        </div>
        <h1>CONTATOS</h1>
        <div className="Infos">
          <div><i className="fa-brands fa-instagram"></i> @control_coins</div>
          <div><i className="fa-regular fa-envelope"></i> controlcoins@contact.com</div>
          <div><i className="fa-solid fa-phone"></i> 8024-8425</div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
