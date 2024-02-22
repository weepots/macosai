import React, { useState } from "react";

const useModal = () => {
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [displayAIModal, setDisplayAIModal] = useState<boolean>(false);

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

  return {
    displayModal,
    openModal,
    closeModal,
    displayAIModal,
    openAIModal,
    closeAIModal,
  };
};

export default useModal;
