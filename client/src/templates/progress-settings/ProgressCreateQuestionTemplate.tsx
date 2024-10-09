import { Button, message, Steps, theme } from "antd"
import { useState } from "react";
import GeneralSettingTemplate from "./GeneralSettingTemplate";
import QuestionSettingTemplate from "./QuestionSettingTemplate";
import QuestionCreateTemplate from "./question/QuestionCreateTemplate";

const steps = [
  {
    title: 'Setting General',
    content: 'Setting-general'
  },
  {
    title: 'Setting Question',
    content: 'Setting-question'
  },
  {
    title: 'Create Question',
    content: 'Create-question'
  }
]

export const ProgressCreateQuestionTemplate = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    color: token.colorTextTertiary,
    borderRadius: token.borderRadiusLG,
    marginTop: 26,
  };

  return (
    <>
      <Steps current={current} items={items} />
      <div style={contentStyle}>
        {
          steps[current].content === 'Create-question' &&
            <QuestionCreateTemplate typeOfQuestion={1} />
        }
        {
          steps[current].content === 'Setting-general' &&
            <GeneralSettingTemplate />
        }
        {
          steps[current].content === 'Setting-question' &&
            <QuestionSettingTemplate />
        }
      </div>
      <div className="flex justify-end items-center" style={{ marginTop: 24 }}>
        {current < steps.length - 1 && (
          <Button className="md:text-[14px] text-[10px]" type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button className="md:text-[14px] text-[10px]" type="primary" onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button className="md:text-[14px] text-[10px]" style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </>
  )
}

export default ProgressCreateQuestionTemplate