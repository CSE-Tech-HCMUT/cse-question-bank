import { toast } from "react-toastify";
import BlockQuestionCreateTemplate from "./BlockQuestionCreateTemplate";
import SingleQuestionCreateTemplate from "./SingleQuestionCreateTemplate";

interface QuestionCreateProps {
  typeOfQuestion: number;
}

const QuestionCreateTemplate: React.FC<QuestionCreateProps> = ({ typeOfQuestion }) => {
  const renderQuestion = () => { 
    switch(typeOfQuestion){
      case 1:
        return <SingleQuestionCreateTemplate />
      case 2: 
        return <BlockQuestionCreateTemplate />
      default:
        toast.warning("Type of Question doesn't exist!!!!!! ")
        return;
    }
  }

  return (
    <>
      {
        renderQuestion()
      }
    </>
  )
}

export default QuestionCreateTemplate