const showModal = (id: string, unshow: boolean = false) => {
  if (unshow) {
    (document.getElementById(id) as any).close();
  } else {
    (document.getElementById(id) as any).showModal();
  }
};

export { showModal };