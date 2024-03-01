import React, { useState } from "react";

const useModal = () => {
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [displayAIModal, setDisplayAIModal] = useState<boolean>(false);
  const [displaySearchModal, setDisplaySearchModal] = useState<boolean>(false);

  const openModal = () => {
    setDisplayModal(true);
  };

  const closeModal = () => {
    setDisplayModal(false);
  };

  const openAIModal = () =>{
    setDisplayAIModal(true);
  };
  const closeAIModal = () =>{
    setDisplayAIModal(false);
  };

  const openSearchModal = () =>{
    setDisplaySearchModal(true);
  }
  const closeSearchModal = () =>{
    setDisplaySearchModal(false);
  }

  return {
    displayModal,
    openModal,
    closeModal,
    displayAIModal,
    openAIModal,
    closeAIModal,
    displaySearchModal,
    openSearchModal,
    closeSearchModal
  };
};

export default useModal;
