import { validataQues } from "@/utilities/addQuesValidata";

const showModal = (id: string, unshow: boolean = false) => {
  if ((!validataQues())) {
    return;
  }
  if (unshow) {
    (document.getElementById(id) as any).close();
  } else {
    (document.getElementById(id) as any).showModal();
  }
};

export { showModal };