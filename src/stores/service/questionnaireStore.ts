import { defineStore } from "pinia";
import { ref } from "vue";

const useQuestionnaireStore = defineStore("questionnaires", () => {
    const userAnswer = ref([])
    const searchAnswer = (id: any, serial_num: number) => {
        return userAnswer.value.find(question => question.id === id && question.serial_num === serial_num)
    }
    const updateAnswer = (id: any, serial_num: number, answer: any,) => {
        const question = userAnswer.value.find(question => question.id === id && question.serial_num === serial_num)
        if (question) {
            question.answer = answer
        } else {
            userAnswer.value.push({
                id: id,
                serial_num: serial_num,
                answer: answer
            })
        }
    }
    console.log(userAnswer.value)
    const deleteAnswer = (id: any) => {
        userAnswer.value = userAnswer.value.filter(a => a.id !== id)
    }
    return {
        userAnswer,
        searchAnswer,
        updateAnswer,
        deleteAnswer
    }
}, { persist: true });

export default useQuestionnaireStore;